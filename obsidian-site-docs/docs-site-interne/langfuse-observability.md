# Observabilité GrasBot via Langfuse

**Créé :** 2026-04-23  
**Statut :** en production  
**Pré-requis lecture :** `08-vault-obsidian-retrieval.md` (architecture du pipeline graph + BM25).

## Vue d'ensemble

Le chatbot GrasBot est instrumenté avec **Langfuse** (instance self-hosted : `langfuse.fernandgrascalvet.com`) pour tracer **chaque requête visiteur** bout en bout :

- **Retrieval** : quelles notes du vault ont été remontées, avec quels scores, pour quelles raisons.
- **Prompt** : le system + user effectivement envoyés à Qwen3.
- **Génération** : latence, tokens, paramètres du modèle.
- **Trace globale** : question, réponse, sources, scores dérivés (grounded, retrieval_relevance), tags.

But : **debug**, **monitoring** (qualité/latence dans le temps), et **itération** sur le pipeline retrieval en voyant directement l'effet d'un changement de règle de scoring.

## Architecture

```
┌─────────────────────────┐    ┌──────────────────────────┐
│ ChatBot.js (front)      │    │ Langfuse self-hosted     │
│  - grasbotIds.js        │    │  langfuse.fernandgrasc…  │
│  - user_id  localStorage│───▶│                          │
│  - session_id sessionSt │    │  (ingestion HTTPS)       │
└──────┬──────────────────┘    │                          │
       │                       │                          │
       ▼                       │         ▲                │
┌─────────────────────────┐    │         │ SDK Python     │
│ app/api/proxy/route.js  │    │         │ (observability │
│  whitelist + GET fwd    │    │         │  .py)          │
└──────┬──────────────────┘    └─────────┼────────────────┘
       │                                 │
       ▼                                 │
┌─────────────────────────┐              │
│ FastAPI /ask             │             │
│ (llm-api/api.py)         │             │
│   → @observe via Langfuse─────────────┘
│   → search.answer()      │
└──────┬──────────────────┘
       │
       ├── retrieval       (span)
       ├── prompt_build    (span)
       └── ollama-chat     (generation)
```

L'instrumentation **vit côté Python** (couche où on a accès aux détails du retrieval et du prompt). Le proxy Next ne fait que relayer le `session_id` / `user_id` depuis le front jusqu'à l'API Python.

## Fichiers concernés

| Fichier | Rôle |
|---------|------|
| `llm-api/observability.py` | Init client Langfuse (no-op safe si clés absentes) + `flush()` au shutdown |
| `llm-api/api.py` | FastAPI `/ask` — query params `session_id`/`user_id` + `lifespan` pour flush |
| `llm-api/search.py` | Spans `retrieval` + `prompt_build` + `generation`, trace racine `ask`, scores auto |
| `llm-api/.env` | Secrets Langfuse (non committé) |
| `llm-api/.env.example` | Template documentaire |
| `app/utils/grasbotIds.js` | Génération UUID v4 anonymes (localStorage + sessionStorage) |
| `app/utils/askAI.js` | Passe `session_id`/`user_id` en query params |
| `app/api/proxy/route.js` | Whitelist `q`, `session_id`, `user_id` → forward vers API Python |

## Variables d'environnement (côté Python uniquement)

Dans **`llm-api/.env`** (chargé automatiquement par `observability.py` via `python-dotenv`) :

| Variable | Obligatoire | Notes |
|----------|-------------|-------|
| `LANGFUSE_PUBLIC_KEY` | oui | Format `pk-lf-…` |
| `LANGFUSE_SECRET_KEY` | oui | Format `sk-lf-…` — **JAMAIS dans un log/commit/chat** |
| `LANGFUSE_BASE_URL` | oui | URL du self-hosted (ex. `https://langfuse.fernandgrascalvet.com`) |
| `LANGFUSE_HOST` | fallback | Alternative à `BASE_URL` si jamais on passe sur le cloud Langfuse |

Si **l'une des 3** est absente → `observability.py` instancie un **client no-op** : l'API fonctionne normalement, aucune trace n'est envoyée, aucune erreur. Pratique pour dev local / contributeurs externes.

Les variables Langfuse **ne sont pas** dans `.env.local` de Next.js — elles ne servent qu'au backend Python.

## Structure d'une trace

### Trace racine : `ask`
- **input** : `{ query: "..." }`
- **output** : `{ response, sources_count, grounded }`
- **metadata** : `{ top_k, min_score }`
- **session_id**, **user_id** (propagés depuis le front)
- **tags** : `grounded`|`ungrounded`, `model:qwen3:8b`, `vault-miss` (si aucune note scorée)
- **scores** auto :
  - `grounded` (BOOLEAN, 0/1) : au moins 1 note ≥ `MIN_SCORE`
  - `retrieval_relevance` (NUMERIC, 0-1) : `min(max_score / 15, 1)`

### Span `retrieval`
- **input** : `{ query, top_k }`
- **output** : `[{slug, title, type, score, reasons}, …]` — top-K final après expansion
- **metadata** :
  - `query_tokens` : tokens extraits par `tokenize_fr`
  - `vault_size` : nombre de notes publiques chargées
  - `candidates_with_signal` : combien de notes ont eu un score > 0
  - `seeds_before_graph` : top-3 avant expansion par graphe
  - `bm25_stats` : `{N, avgdl, idf_terms}` (pour debug de régressions BM25)
  - `elapsed_ms` : durée du retrieval seul

### Span `prompt_build`
- **input** : `{ query, scored_count }`
- **output** : `{ system, user }` — le **prompt complet** envoyé à Qwen
- **metadata** :
  - `grounded` : bool (= au moins 1 note ≥ MIN_SCORE)
  - `relevant_notes` : notes effectivement incluses dans le contexte
  - `system_chars`, `user_chars` : tailles utiles pour debug de fenêtre de contexte
  - `min_score_threshold` : valeur du `MIN_SCORE` au moment de l'appel
  - `truncation` : `{ secondary_max_chars, secondary_keep_ratio, truncated_notes: [...] }` —
    liste des sources rank 2+ résumées automatiquement (avec leur slug, score,
    taille d'origine et taille tronquée). Vide s'il n'y a eu aucune troncature.

### Span `ollama-chat` (type **generation**)
- **input** : `[{role: "system", content}, {role: "user", content}]`
- **output** : réponse brute du modèle
- **model** : `LLM_MODEL` (ex. `qwen3:8b`)
- **model_parameters** : `{temperature: 0.4, num_ctx: 8192, num_predict: 1024, think: false}`
  (voir section "Tuning 2026-04-23" ci-dessous pour le rationnel).
- **usage** : `{input, output, total}` — extraits de `prompt_eval_count` / `eval_count` si Ollama les renvoie
- Si réponse vide → span `level: ERROR` avec le payload Ollama brut en metadata.

## Session / User IDs (côté front)

**Pas de PII**, **pas d'authentification**. Deux UUID v4 anonymes générés automatiquement à la première interaction :

- **`grasbot_user_id`** → `localStorage` → stable par device, sert à mesurer les utilisateurs uniques et à regrouper l'historique d'un visiteur récurrent.
- **`grasbot_session_id`** → `sessionStorage` → expire à la fermeture de l'onglet, regroupe une conversation.

Générés par `app/utils/grasbotIds.js`, propagés par `askAI.js` → `/api/proxy` (whitelist) → `/ask` (query params) → `search.answer()` (`update_current_trace(session_id=…, user_id=…)`).

**Impact RGPD** : aucun identifiant déductible de l'utilisateur, aucune donnée persistante côté serveur autre que ce que Langfuse stocke de lui-même. L'utilisateur peut vider son storage pour "réinitialiser" son identité côté observabilité.

## Procédure de test

### Local

1. `cd llm-api && pip install -r requirements.txt` (ajoute `langfuse` + `python-dotenv`).
2. Remplir `llm-api/.env` avec les 3 clés (ou laisser vide pour tester le mode no-op).
3. `.\start-my-site.ps1` (ou démarrer uvicorn manuellement).
4. Aller sur `http://localhost:3000` → ouvrir le chatbot (FAB en bas à droite) → poser une question.
5. Dans Langfuse → **Traces** → voir apparaître une trace `ask` en temps réel (quelques secondes après la réponse, le temps du flush).

### Vérifier le no-op silencieux

1. Commenter les 3 variables `LANGFUSE_*` dans `llm-api/.env`.
2. Redémarrer uvicorn → les logs affichent `ℹ️  Langfuse désactivé — variables manquantes : …`.
3. Poser une question au chatbot → réponse normale, aucun crash.
4. `GET /health` renvoie `{"observability": {"langfuse_enabled": false}}`.

### Scénarios utiles à reproduire dans Langfuse

- **Question grounded classique** : "Parle-moi de push-swap" → tags `grounded`, retrieval_relevance ~0.7-0.9.
- **Question hors-sujet** : "Quel temps fait-il demain ?" → tags `ungrounded`, grounded=0, sources_count=0 ou voisins faibles.
- **Question sur mot-clé ambigu** : "C" (langage C vs lettre C) → voir dans le span `retrieval` comment `_keyword_matches` filtre ou non.

## Dashboards Langfuse utiles

### Qualité du retrieval dans le temps
Dashboard → filtrer `score: grounded` → voir le **taux de grounded** par jour. Une chute = problème de vault ou de scoring.

### Latence p95
Dashboard → `latency` sur trace `ask` ou span `ollama-chat`. La génération est **la source de latence majoritaire** (≥ 90%), le retrieval reste sous ~100ms.

### Questions sans contexte pertinent
Filtrer tags = `ungrounded` → voir les questions posées mais non couvertes par le vault → **source d'insights pour enrichir le vault** (nouveaux alias, nouvelles notes).

### Sessions longues
Filtrer par `session_id` → enchaînement des questions d'un visiteur → voir si GrasBot garde la cohérence (pas de mémoire entre requêtes, attendu).

## Conventions de nommage

- **Spans** : kebab-case en anglais (`retrieval`, `prompt-build`, `ollama-chat`). Ici `prompt_build` a été laissé en snake pour rappeler la fonction Python, à remplacer par `prompt-build` si on refait un coup de ménage.
- **Tags** : kebab-case, préfixés par concept (`model:qwen3:8b`, `vault-miss`).
- **Scores** : snake_case nom simple (`grounded`, `retrieval_relevance`), + ajoutera plus tard `user_feedback` si on branche un 👍/👎.

## Rollback

Si Langfuse tombe en panne ou si l'instrumentation pose un souci :

1. **Soft rollback** : vider / commenter les variables `LANGFUSE_*` dans `llm-api/.env` et redémarrer uvicorn. Le client passe en no-op, aucun autre changement nécessaire.
2. **Hard rollback** : `git revert` du commit d'intégration Langfuse. Les fichiers `observability.py` / `.env` / `grasbotIds.js` disparaîtront ; le pipeline revient exactement à la v3.0.

## Sécurité — rappels

- **`LANGFUSE_SECRET_KEY`** permet d'écrire dans toutes les traces du projet → équivaut à un droit d'admin partiel. Jamais en clair dans un chat, un log, un screenshot, un commit.
- **Rotation** : en cas de doute, **Project Settings → API Keys → Delete** puis recréer. Les traces déjà ingérées ne sont pas affectées.
- Le client Langfuse envoie les traces **en asynchrone** avec un buffer → bien appeler `flush()` au shutdown pour ne rien perdre (déjà fait via le `lifespan` FastAPI).
- **Contenu sensible** : les prompts complets passent dans Langfuse. Vérifier que **le vault ne contient pas d'infos privées** (`visibility: private` est filtré côté search, mais si tu ajoutais un jour un vault mixte public/privé, il faudrait un filtre supplémentaire avant l'envoi à Langfuse).

## Tuning du pipeline — 2026-04-23

Audit des premières traces après mise en production : les réponses sur les
questions biographiques ("qui est Fernand ?") étaient parfois **hallucinées**
(âge erroné, statut inventé) et les réponses longues **tronquées** en plein
milieu. Quatre ajustements ciblés ont stabilisé le comportement :

| # | Fichier | Changement | Effet attendu |
|---|---------|------------|---------------|
| 1 | `search.py` · `generate()` | `num_ctx` explicite à **8192** | Fin de la troncature silencieuse du prompt (le défaut Ollama à 2048/4096 coupait le début du contexte quand plusieurs notes entières étaient injectées). |
| 1 | `search.py` · `generate()` | `num_predict` **512 → 1024** | Réponses longues (descriptions de projet, explications) ne sont plus coupées en plein milieu. |
| 1 | `search.py` · `generate()` | `think: false` **top-level** | Désactive le mode *thinking* de qwen3. Le modèle n'utilise plus de budget de sortie pour du raisonnement interne. |
| 2 | `search.py` · `build_prompt()` | Troncature conditionnelle des sources **rank 2+** | Les notes secondaires (ex. `inception` sur une question bio) sont résumées à `SEARCH_SECONDARY_MAX_CHARS` chars quand leur score est < `SEARCH_SECONDARY_KEEP_RATIO` × score(#1). Réduit le bruit sans supprimer de source. |
| 3 | `vault-grasbot/30-Parcours/bio-fernand.md` | **Nouvelle note** dédiée à la présentation courte | Source canonique pour les questions du type *"qui est Fernand"*. Priorité 10, aliases biographiques courts. Renvoie vers le CV complet pour le détail. |
| 3 | CV (`cv-grascalvet-fernand.md`) | Incohérence d'âge corrigée (46 → 47 ans) | Supprime la contradiction interne qui alimentait les hallucinations sur l'âge. |
| 4 | `search.py` · `SYSTEM_PROMPT` | Section "Règles de fidélité aux sources" | Force le modèle à (a) s'appuyer en priorité sur `type=parcours` pour les questions bio, (b) ne jamais inventer un fait factuel, (c) écrire *« non précisé dans les notes »* si l'info manque, (d) gérer les contradictions, (e) signaler les notes tronquées. |

Observabilité : dans les spans Langfuse, `prompt_build.metadata.truncation`
liste chaque source tronquée automatiquement → sert de point de vigilance pour
vérifier que la troncature reste pertinente (et n'écrase pas une source qu'on
aurait dû garder entière).

Variables d'environnement associées (dans `llm-api/.env` ou shell) :

| Variable | Défaut | Effet |
|----------|--------|-------|
| `SEARCH_SECONDARY_MAX_CHARS` | `1500` | Taille max des sources secondaires dans le prompt |
| `SEARCH_SECONDARY_KEEP_RATIO` | `0.8` | Tant que score(rank≥2) ≥ ratio × score(#1) → source gardée entière |

Rappel : `load_vault()` est mémoïsé. Après création/modification d'une note du
vault, appeler `POST /reload-vault` pour recharger le cache sans redémarrer
uvicorn (voir `api.py`).

## Évolutions futures possibles

- **Feedback utilisateur** : ajouter un 👍/👎 sur chaque réponse bot dans `ChatBot.js`, relayé à `/api/feedback` qui appellerait `langfuse.score(trace_id, name="user_feedback", value=1|0)`. Le `trace_id` serait retourné par `/ask` (actuellement omis).
- **Prompt versioning** : stocker `SYSTEM_PROMPT` dans Langfuse Prompts pour versionner et A/B tester sans redéploiement.
- **Coût / token pricing** : si on branche un provider payant (OpenAI / Anthropic) à la place d'Ollama, Langfuse calcule automatiquement le coût à partir de l'`usage`.
- **Dataset d'évaluation** : capturer les meilleures traces comme dataset, puis relancer le pipeline sur ces mêmes questions après modif du scoring pour comparer les sorties.
