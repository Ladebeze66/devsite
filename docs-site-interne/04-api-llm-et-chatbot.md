# API LLM et chatbot (GrasBot)

**Dernière mise à jour :** 2026-04-24 (v3 + alignement parcours site)

## Vue d'ensemble

GrasBot répond aux visiteurs en s'appuyant sur un **pipeline de retrieval
local**, sans embeddings ni base vectorielle :

- Vault Obsidian `vault-grasbot/` lu directement en mémoire par `search.py`.
- Scoring déterministe multi-signaux (aliases, titre/slug, answers,
  domains, tags, BM25 sur le body).
- Expansion par graphe via les wikilinks (`linked`, `related`, `[[...]]`
  dans le corps).
- Prompt construit avec top-5 notes entières, envoyé à Qwen3 8B via Ollama.

Détails architecturaux dans
[`08-vault-obsidian-retrieval.md`](./08-vault-obsidian-retrieval.md).

## Chaîne côté navigateur

1. FAB `GrasBotFab` (monté dans `app/layout.tsx`) affiche `ChatBot.js`.
2. `ChatBot.js` appelle `askAI(question)` (`app/utils/askAI.js`).
3. `askAI` envoie un **GET** vers `/api/proxy?q=...` (route Next.js App Router).
4. `app/api/proxy/route.js` appelle
   `https://llmapi.fernandgrascalvet.com/ask?q=...` (URL figée en dur
   pour l'instant) et renvoie le corps JSON tel quel.

Le champ consommé par le front reste **`data.response`**. Les champs ajoutés
par la refonte (`sources`, `grounded`, `model`, `vault_size`) passent dans
la réponse JSON ; les **`sources`** incluent **`url`**, **`route_parent`**, **`path_slug`**
(dernier segment d’URL), et **`site_slug`** lorsque le vault le définit (alias Strapi).
Le front résout l’hyperlien via `app/utils/grasbotSourceUrl.js`.

## Parcours public (hors moteur Python) — cohérence contenu

Le visiteur découvre les **projets** sur `/portfolio/[slug]` et, pour la
compétence **IA** (et toute compétence à laquelle on lie des
**`realisation-ia`** dans Strapi), un **parallèle** sur `/competences/[slug]`
(vignettes) puis `/competences/[slug]/[realisation]` (fiche identique en
gabarit à une fiche projet). Rien n'est servi ici par FastAPI : c'est
du **Strapi + Next** uniquement. Le chatbot, lui, interroge toujours
**`vault-grasbot/`** via `llm-api/search.py` — mettre à jour le vault
(ou l'extraction Strapi → vault) quand on veut que GrasBot **reflète** des
faits nouveaux présentés sur le site. Détail des routes : [`02-frontend-next.md`](./02-frontend-next.md).

## FastAPI — `llm-api/`

| Fichier | Rôle |
|---------|------|
| `api.py` | Endpoints `GET /ask?q=...`, `GET /health`, `POST /reload-vault`. |
| `search.py` | `load_vault`, `tokenize_fr`, `score_note`, `expand_by_graph`, `search`, `build_prompt`, `generate`, `answer`. |
| `requirements.txt` | `fastapi`, `uvicorn`, `requests`, `pyyaml` ; + `langfuse` (SDK 3.x, plafond strict inférieur à la v4) + `python-dotenv` pour l'observabilité optionnelle. Voir `llm-api/requirements.txt`. **Plus besoin** de `chromadb` / `chroma-hnswlib` (supprimés v3). |

Modules supprimés en v3 :

- `rag.py` → remplacé par `search.py`.
- `index_vault.py` → plus d'étape d'indexation (lecture directe du vault).

## Modèle Ollama

| Rôle | Modèle | VRAM | Commande |
|------|--------|------|----------|
| Chat | `qwen3:8b` | ~5 Go (Q4_K_M) | `ollama pull qwen3:8b` |

**Plus d'embeddings.** Le modèle `nomic-embed-text` n'est plus nécessaire.
Tu peux libérer de la place avec `ollama rm nomic-embed-text` si jamais
il reste installé.

## Variables d'environnement (facultatives)

Toutes définies dans `search.py`, surchargeables via env sans toucher au code :

- `OLLAMA_URL` (default `http://localhost:11434`)
- `LLM_MODEL` (default `qwen3:8b`)
- `VAULT_DIR` (default `<repo>/vault-grasbot`)
- `SEARCH_TOP_K` (default `5`)
- `SEARCH_MIN_SCORE` (default `1.0`) — seuil en-dessous duquel le chatbot
  bascule en mode *« pas de contexte pertinent »* (évite les réponses
  inventées sur des questions hors sujet).

## Mise en service

```powershell
# 1. Installer les dépendances Python (pure Python, pas de compilation C++)
cd llm-api
pip install -r requirements.txt

# 2. Pull le modèle Ollama (Ollama doit tourner)
ollama pull qwen3:8b

# 3. Lancer l'API
uvicorn api:app --host 0.0.0.0 --port 8000
```

Plus besoin d'étape d'indexation : l'API lit le vault au démarrage.

Health-check : `curl http://localhost:8000/health` retourne la config active,
la taille du vault et le nombre de notes par type.

Après édition du vault (ajout/modification d'une note) :

```powershell
# Force la relecture sans redémarrer uvicorn
curl -X POST http://localhost:8000/reload-vault
```

## Réponse du backend

```json
{
  "response": "Push Swap est un projet 42 qui explore les algorithmes de tri sur piles…",
  "sources": [
    {
      "slug": "push-swap",
      "title": "push_swap",
      "type": "projet",
      "score": 32.27,
      "reasons": ["alias:push-swap", "slug", "answers-partial", "bm25:2.12"],
      "url": "/portfolio/push-swap"
    },
    {
      "slug": "cpp-partie1",
      "title": "cpp_module_00 à 04",
      "type": "projet",
      "score": 20.62,
      "reasons": ["graph-from:push-swap", "graph-reinforce"],
      "url": "/portfolio/cpp-partie1"
    }
  ],
  "grounded": true,
  "model": "qwen3:8b",
  "vault_size": 41
}
```

`askAI.js` ne lit que `data.response` → rétrocompatibilité assurée.

Le champ `reasons` sert à **tracer** pourquoi une note a été remontée : très
utile pour ajuster aliases / answers quand une question renvoie de mauvais
résultats.

## Pistes d'évolution

- **Variable d'environnement côté proxy Next** pour pointer vers
  `http://localhost:8000` en dev et vers la prod en déploiement (au lieu
  de l'URL figée dans `app/api/proxy/route.js`).
- **Affichage des sources** côté front : vignettes cliquables sous la
  réponse, utilisant le champ `url` renvoyé par l'API.
- **Badge `grounded`** : afficher *« Réponse basée sur les notes »* vs
  *« Réponse générale »* pour informer le visiteur de la confiance.
- **Historique court** (3-4 derniers tours) pour la continuité conversationnelle.
- **Streaming** des réponses pour l'UX temps réel (Qwen3 supporte `stream: true`).
- **Reload automatique** via file watcher sur `vault-grasbot/` quand on
  édite dans Obsidian.
- **Filtre `visibility`** déjà en place dans `load_vault()` (les notes
  `private` sont exclues). Le vault perso pourra être fusionné sans
  exposer ses notes privées au chatbot public.
