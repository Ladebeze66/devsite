---
title: "GrasBot — assistant IA du portfolio"
slug: grasbot
type: projet
source: manual
domains: [ia, devops, web, ecole-42]
tags: [ollama, fastapi, langfuse, nextjs, rag]
aliases:
  - GrasBot
  - grasbot
  - assistant grasbot
  - chatbot fernandgrascalvet
  - grasbot v3
  - retrieval bm25
  - assistant ia locale
  - qwen3
answers:
  - "Qu'est-ce que GrasBot ?"
  - Comment fonctionne le chatbot sur le site ?
  - Parle-moi de GrasBot
  - Avec quoi l'assistant du site est-il branché ?
priority: 6
linked:
  - "[[MOC-Projets]]"
  - "[[MOC-Ia]]"
  - "[[MOC-Technique]]"
related:
  - "[[ia]]"
  - "[[grasbot-retrieval]]"
  - "[[architecture-site]]"
  - "[[fernandgrascalvet-com]]"
link: "https://fernandgrascalvet.com"
updated: 2026-04-23
visibility: public
---

**Slug site / fiche compétence IA :** `grasbot` (réalisation liée à la compétence [[ia]], comme l’entité Strapi `realisation-ia`).

## Résumé

**GrasBot** est l’assistant conversationnel intégré à tout le site (bouton flottant, proxy Next → API FastAPI). Depuis la **v3** (2026), la réponse s’appuie sur le vault Obsidian `vault-grasbot/` (structure + wikilinks) avec un **retrieval déterministe** (scores multi-signaux + BM25 + expansion de graphe), **sans** base vectorielle ni embeddings. Le modèle de chat est un **Qwen3 8B** servi par **Ollama** (machine locale côté API).

## Chaîne technique (aperçu)

- **Next.js** : `GrasBotFab` + `ChatBot.js` → `askAI` → `/api/proxy` → `https://llmapi.fernandgrascalvet.com/ask`
- **FastAPI** : `llm-api/search.py` (retrieval, construction du prompt, appel génération)
- **Observabilité** : **Langfuse** (3.x) sur les spans retrieval / construction de prompt / génération, avec scores utiles en traçage (`grounded`, etc.)
- **Règles de réponse** : system prompt anti-hallucination, troncature contrôlée des sources secondaires, note canonique `bio-fernand` pour les questions biographiques

## Liens internes

- Détail algorithme et scoring : [[grasbot-retrieval]]
- Où cela s’inscrit dans l’architecture globale : [[architecture-site]]
- Compétence [[ia]] (contexte personnel et pédagogique 42)
- Même site, volet *stack web* : [[fernandgrascalvet-com]]
