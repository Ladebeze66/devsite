---
title: "GrasBot — pipeline de retrieval (graph + BM25)"
slug: grasbot-retrieval
type: technique
source: manual
domains: [ia, web]
tags: [graph, bm25, ollama, qwen3, retrieval]
aliases:
  - pipeline grasbot
  - moteur grasbot
  - chatbot du site
  - moteur de recherche
  - retrieval
  - graph + bm25
  - comment fonctionne grasbot
answers:
  - "Comment fonctionne GrasBot ?"
  - "Comment le chatbot trouve-t-il ses réponses ?"
  - "Quel modèle utilise GrasBot ?"
priority: 6
linked:
  - "[[grasbot]]"
  - "[[MOC-Ia]]"
  - "[[architecture-site]]"
  - "[[vault-structure]]"
  - "[[ia]]"
updated: 2026-04-23
visibility: public
---

# GrasBot — pipeline de retrieval (graph + BM25)

GrasBot est l'assistant conversationnel du site fernandgrascalvet.com. Il
répond aux visiteurs en s'appuyant sur le vault Obsidian personnel
[[vault-structure]] et sur un LLM local qui tourne sur la machine de
Fernand.

**Version actuelle : 3.0** (avril 2026). Remplace l'ancien pipeline RAG
vectoriel (ChromaDB + embeddings Ollama) par une recherche **déterministe**
sur graphe de notes + BM25. Plus simple, plus précis pour un vault de cette
taille, zéro dépendance lourde.

## Matériel

- **GPU** : NVIDIA RTX 2080 Ti (11 Go VRAM).
- **Modèle chat** : Qwen3 8B en quantification Q4_K_M via Ollama
  (≈ 5 Go VRAM), laissant une marge confortable pour le contexte.
- **Pas d'embeddings** : plus besoin de `nomic-embed-text` en VRAM. Le
  retrieval tourne sur CPU en pur Python, ~50 ms par requête.

## Pipeline d'une question

```
   question utilisateur
           │
           ▼
   [ tokenize_fr ]        ◄── stop-words FR, c++→cpp, split sur -/_
           │
           ▼
   [ score_note pour chaque note ]
      - alias match            (+10)
      - title / slug match     (+8)
      - answers overlap        (+5 à +12)
      - domains / tags match   (+3 à +5 par hit)
      - BM25 sur body          (+0 à +5)
      - priorité + MOC-hub     (+0.3 à +1.3 si déjà scoré)
           │
           ▼
   [ expand_by_graph ]    ◄── voisins via linked / related / wikilinks
           │
           ▼
   [ build_prompt ]       ◄── notes entières en contexte (top-5)
           │
           ▼
   [ Ollama /api/chat ]   ◄── Qwen3 8B, temperature 0.4, keep_alive 30m
           │
           ▼
    { response: "...",
      sources: [{slug, title, type, score, reasons, url}],
      grounded: true|false,
      model: "qwen3:8b",
      vault_size: 41 }
```

## Implémentation

Deux modules Python dans `llm-api/` :

- **`api.py`** — FastAPI. Endpoints `GET /ask?q=...`, `GET /health`,
  `POST /reload-vault`.
- **`search.py`** — primitives `load_vault`, `tokenize_fr`, `score_note`,
  `expand_by_graph`, `search`, `build_prompt`, `generate`, `answer`.
  Configuration via variables d'environnement (`LLM_MODEL`, `VAULT_DIR`,
  `SEARCH_TOP_K`, `SEARCH_MIN_SCORE`…).

Le vault est chargé **une seule fois** par process FastAPI via
`@lru_cache` sur `load_vault()`. Après édition d'une note, l'endpoint
`POST /reload-vault` force la relecture sans redémarrer l'API.

## Prompt système

Qwen3 reçoit un prompt qui le force à :

1. Répondre en français, ton sobre, sans emojis.
2. Citer ses sources entre crochets (par slug : `[push-swap]`, `[ia]`).
3. Avouer quand l'info n'est pas dans les notes, orienter vers le site
   (/portfolio, /competences, /contact).
4. Rester concis (3 à 6 phrases).
5. Réorienter poliment si la question est totalement hors-sujet.

Quand `grounded=false` (score max < `SEARCH_MIN_SCORE`), le prompt user
bascule en mode **sans contexte** : le LLM sait qu'il ne doit pas inventer
de faits sur Fernand.

## Compatibilité front

Le champ `response` de la réponse JSON est conservé. `ChatBot.js` et
`askAI.js` peuvent exploiter en plus :

- `sources[]` → vignettes cliquables (url `/portfolio/<slug>` ou
  `/competences/<slug>` selon `type`).
- `grounded` → afficher un badge « basé sur X notes » ou « réponse
  généraliste » selon la valeur.

## Limites connues

- **Pas de mémoire conversationnelle** : chaque question est indépendante.
  Ajouter un historique court (3-4 derniers tours) passerait par
  `ChatBot.js` (envoi du contexte) et `search.answer()` (intégration).
- **Pas de streaming** : la réponse arrive en un bloc après 2-10 s selon
  la question. Passage à `stream: true` possible (modifier `generate()`
  et exposer un endpoint SSE).
- **Taxonomie à entretenir à la main** : voir [[vault-structure]] et
  `vault-grasbot/TAXONOMIE.md`. Les aliases/answers/priority générés
  par `build-vault.py` sont une base, mais les notes stratégiques méritent
  un enrichissement manuel (voir le CV [[cv-grascalvet-fernand]]).
- **Pas encore de hybrid scoring** : on pourrait composer avec un embedding
  optionnel si le vault grossit > ~500 notes. Sur le périmètre actuel,
  superflu.
