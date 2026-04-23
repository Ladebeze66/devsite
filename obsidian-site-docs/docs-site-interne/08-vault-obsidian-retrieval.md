# Vault Obsidian + retrieval GrasBot (v3 — graph + BM25)

**Créé :** 2026-04-22 (v1 RAG vectoriel)
**Refondu :** 2026-04-22 (v3 — graph + BM25, sans embeddings)
**Statut :** opérationnel (17 projets + 4 compétences + CV + 3 notes techniques + 15 MOCs)

## Raison d'être

Avant ce pipeline, GrasBot interrogeait `mistral:7b` sans aucun contexte —
il répondait de manière générique sur n'importe quoi. Depuis :

- **Modèle chat** : `qwen3:8b` (meilleur en FR, reasoning solide).
- **Base de connaissance** structurée comme vault Obsidian.
- **Pipeline de retrieval** branché : chaque question récupère les notes
  pertinentes avant génération.

## Pourquoi `graph + BM25` plutôt que RAG vectoriel ?

La première version (avril 2026, v2) utilisait **ChromaDB** + embeddings
**nomic-embed-text**. Ça marchait, mais :

- **Vault de taille modeste** (~40 notes, ~100 Ko) : la sémantique vectorielle
  sur-dimensionne le problème.
- **Retrieval imprévisible** sur vocabulaire précis (une question *« compétences
  en IA »* pouvait ne pas remonter la note `ia.md` si son embedding était
  dominé par d'autres concepts).
- **Chaîne d'installation lourde** : `chromadb` dépend de `chroma-hnswlib`,
  qui nécessite un compilateur C++ sous Windows → blocage fréquent.
- **Coût en VRAM** : `nomic-embed-text` mobilisait ~500 Mo et ~1 s par
  requête, inutile à cette échelle.
- **Désynchronisation vault / index** : étape `index_vault.py` oubliable.

En v3, on exploite directement la **structure** du vault : frontmatter YAML
(aliases, answers, domains, tags, priority), wikilinks, MOCs. Le retrieval
est **déterministe**, **traçable** (on sait *pourquoi* une note est remontée),
**instantané** (~50 ms), et ne demande qu'une dépendance : `pyyaml`.

Résultat : GrasBot cite toujours ses sources, et le top-5 est beaucoup
plus prévisible pour une question précise.

## Vault — `vault-grasbot/`

Arborescence :

```
vault-grasbot/
├── 00-MOC/              # hubs thématiques (MOC-Projets, MOC-Ia, MOC-Technique, ...)
├── 10-Projets/          # 17 projets Strapi (push-swap, minishell, ft-transcendence, ...)
├── 20-Competences/      # 4 compétences Strapi (IA, domotique, web, 3D)
├── 30-Parcours/         # CV curaté manuellement (source: manual)
├── 40-Glossaire/        # (vide, prévu pour le content-type glossaire Strapi)
├── 50-Technique/        # auto-doc : architecture-site, grasbot-retrieval, vault-structure
├── README.md            # résumé utilisateur (généré)
└── TAXONOMIE.md         # vocabulaire contrôlé (domaines, tags, aliases, answers, priority)
```

### Frontmatter YAML

Chaque note porte une en-tête enrichie :

```yaml
---
title: "push_swap"
slug: push-swap
type: projet                    # projet | competence | parcours | moc | technique
source: strapi/projects         # strapi/... | pdf/... | manual | vault/generated
domains: [algorithmique, c, ecole-42]
tags: [42-commun, tri, makefile]
aliases:
  - push swap
  - push_swap
  - algo de tri 42
answers:
  - "Parle-moi de push-swap"
  - "Comment fonctionne push-swap ?"
priority: 5                     # 1..10, boost léger au scoring
linked: ["[[MOC-Projets]]"]
related: ["[[minishell]]"]
updated: 2026-04-22
visibility: public
---
```

Détail des champs et leur usage exact par le retrieval : voir
`vault-grasbot/TAXONOMIE.md` et la note interne
[[vault-structure]] du vault.

### Règle de régénération

`strapi_extraction/build-vault.py` **écrase** les notes dont `source:
strapi/*` ou `source: pdf/*`. Il **ne touche jamais** aux notes
`source: manual`.

Le drapeau `--clean` supprime tout le vault avant régénération : à utiliser
uniquement si on veut repartir de zéro (attention aux notes `manual`).

## Génération — `strapi_extraction/build-vault.py`

Pipeline :

1. Lit les `project-*.md` et `competence-*.md` de `strapi_extraction/docs/`
   (eux-mêmes produits par `generate-docs.js` à partir de l'API Strapi).
2. Parse titre, slug, description, détails.
3. Infère `domains` / `tags` via `DOMAIN_KEYWORDS` / `TAG_KEYWORDS`
   (ajustables dans le script).
4. **Génère automatiquement** :
   - `aliases` à partir du slug + titre + `DOMAIN_ALIASES` (synonymes
     courants par domaine).
   - `answers` selon le type (projet → *« Parle-moi de X »*, compétence →
     *« Quelles sont ses compétences en X ? »*, etc.).
   - `priority` heuristique (CV=10, MOCs=7, compétences=7, projets=5).
5. Calcule les `related` par intersection de domaines (top 3).
6. Écrit chaque note avec frontmatter + corps + section *« Liens »* en pied.
7. Génère les MOCs (un par type + un par domaine significatif).
8. Optionnel : convertit le CV PDF via `pypdf` si installé (mais la version
   manuelle `cv-grascalvet-fernand.md` avec `source: manual` est
   **toujours préservée**).

Commandes :

```powershell
python strapi_extraction/build-vault.py            # régénère tout
python strapi_extraction/build-vault.py --dry-run  # liste sans écrire
python strapi_extraction/build-vault.py --clean    # supprime puis regénère
```

## Retrieval — `llm-api/search.py`

Module lu par `api.py`. Fournit :

- `load_vault()` — lecture mémoïsée du vault (frontmatter YAML + body +
  wikilinks). Filtre `visibility: private`.
- `tokenize_fr(text)` — tokenisation FR + normalisations
  (`c++` → `cpp`, split sur `-`/`_`, stop-words).
- `score_note(note, query, tokens, stats)` — score déterministe
  multi-signaux. Retourne un `ScoredNote(score, reasons[])`.
- `expand_by_graph(seeds, vault)` — ajoute les voisins (`linked`,
  `related`, wikilinks du body) avec un score dérivé de 60 %.
- `search(query, top_k)` — orchestration : score + expansion + dedupe +
  top-K.
- `build_prompt(query, notes)` — couple `(system, user)` pour `/api/chat`.
- `generate(system, user)` — appel Ollama `/api/chat`, retourne le texte.
- `answer(query)` — pipeline complet, retourne un dict
  `{response, sources, grounded, model, vault_size}`.

### Barème de scoring (documentation opérationnelle)

| Signal | Points | Détails |
|---|---|---|
| Alias match | +10 | 1+ aliases de la note apparaissent dans la question |
| Title exact | +8 | Titre complet dans la query (len ≥ 4) |
| Title tokens | +4 | Au moins 2 tokens du titre dans la query |
| Slug | +8 | Tous les tokens du slug sont dans la query |
| Answers full | +12 | ≥ 3 tokens communs avec une question-type |
| Answers partial | +5 | 2 tokens communs |
| Domains | +5 × n | Par domaine strictement matché |
| Tags | +3 × n | Par tag strictement matché |
| BM25 body | 0..5 | Normalisé |
| Priority | (p-5) × 0.3 | Boost léger si déjà scoré |
| MOC-hub | +1.0 | Si note de type `moc` ET déjà scorée |
| Graph neighbor | 60 % du parent | Via `expand_by_graph` |

Seuil `SEARCH_MIN_SCORE` (défaut 1.0) : en-dessous, le mode *« sans
contexte pertinent »* se déclenche et Qwen3 est invité à ne pas inventer
de faits sur Fernand.

## Compatibilité rétro

L'API garde la signature `GET /ask?q=...`. Le JSON renvoyé a :

- `response` (conservé, consommé par `askAI.js`)
- `sources[]` (enrichi : `slug`, `title`, `type`, `score`, `reasons`, `url`)
- `grounded` (bool — nouveau)
- `model` (conservé)
- `vault_size` (nouveau)

Le champ `rag` de la v2 est remplacé par `grounded` (plus explicite).

## Commandes utiles

```powershell
# Régénérer le vault depuis strapi_extraction/docs/
python strapi_extraction\build-vault.py

# Démarrer l'API locale (pas d'indexation préalable à faire)
cd llm-api ; uvicorn api:app --host 0.0.0.0 --port 8000

# Vérifier la config active et la taille du vault
curl http://localhost:8000/health

# Forcer la relecture du vault sans redémarrer uvicorn
curl -X POST http://localhost:8000/reload-vault

# Tester une question en direct
curl "http://localhost:8000/ask?q=parle-moi+de+push-swap"
```

## Fusion avec un vault Obsidian perso

Deux voies :

- **Vault séparé** (recommandé au début) : on ouvre `vault-grasbot/` comme
  vault Obsidian indépendant.
- **Fusion** : on copie `vault-grasbot/` comme sous-dossier d'un vault
  existant. Les wikilinks restent valides tant que les noms sont uniques.
  Les notes persos doivent porter `source: manual` (évite l'écrasement par
  `build-vault.py`) et `visibility: private` (exclues automatiquement du
  retrieval par `load_vault()`).

## Limites actuelles

- **Pas de mémoire conversationnelle** : chaque question est indépendante.
- **Pas de streaming** : la réponse arrive en un bloc après 2-10 s.
- **Aliases / answers auto-générés** : c'est une base. Les notes
  stratégiques (CV, IA, MOCs) méritent un enrichissement manuel en
  passant `source: manual`.
- **`clean-api-data.js` n'extrait pas les `homepages` ni les `glossaires`** :
  bug préexistant, à corriger pour enrichir `40-Glossaire/` et la home.
- **Re-chargement manuel** via `POST /reload-vault` (pas encore automatisé
  via file watcher).

## Évolutions priorisables

1. Corriger `clean-api-data.js` (homepages + glossaires).
2. Afficher les `sources` citées sous la réponse dans `ChatBot.js`.
3. Ajouter un badge `grounded` pour informer le visiteur de la confiance.
4. Historique conversationnel court (3-4 tours).
5. Streaming Ollama `stream: true` (Server-Sent Events côté API).
6. File watcher sur `vault-grasbot/` qui appelle `POST /reload-vault`
   automatiquement.
