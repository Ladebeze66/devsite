---
title: "Architecture du site fernandgrascalvet.com"
slug: architecture-site
type: technique
source: manual
domains: [web, devops, ia]
tags: [architecture, nextjs, strapi, ollama]
aliases:
  - architecture du site
  - architecture technique
  - stack technique
  - comment est fait le site
  - next.js strapi fastapi
answers:
  - "Comment est fait ce site ?"
  - "Quelle est la stack technique ?"
  - "Avec quelles technologies le site est-il construit ?"
priority: 6
linked:
  - "[[MOC-Technique]]"
  - "[[developpement-web-and-hebergement-sur-serveur-windows]]"
  - "[[ia]]"
  - "[[grasbot]]"
  - "[[fernandgrascalvet-com]]"
  - "[[grasbot-retrieval]]"
  - "[[vault-structure]]"
updated: 2026-04-23
visibility: public
---

# Architecture du site fernandgrascalvet.com

Le site portfolio de Fernand Gras-Calvet est composé de trois briques
indépendantes, reliées par des API HTTP.

## Vue d'ensemble

```
┌─────────────────────┐     ┌────────────────────┐     ┌───────────────────────┐
│  Next.js 15 (front) │◄───▶│  Strapi 5 (CMS)    │     │  FastAPI + Ollama     │
│  App Router, TS     │     │  Projets, Compét., │     │  GrasBot (graph+BM25) │
│  Tailwind + Stitch  │     │  Homepage, Glossaire│    │  vault-grasbot/       │
└──────────┬──────────┘     └────────────────────┘     └──────────┬────────────┘
           │                                                      ▲
           │  /api/proxy?q=...                                    │
           └──────────────────────────────────────────────────────┘
```

## Frontend — `app/`

- **Next.js 15** en mode App Router, Turbopack en dev.
- **TypeScript + JSX** mélangés (migration progressive vers TS).
- **Tailwind CSS 3.4** avec tokens Stitch « Digital Atelier » (voir
  `tailwind.config.ts`) : palette `primary` indigo-ardoise, typographie
  Manrope + Newsreader, radius `sheet` / `tile`, ombres `ambient` / `jewel`.
- **Pages principales** : `/` (hero + takeaways + démarche), `/portfolio`
  (grille asymétrique 2/3 + 1/3), `/competences` (même pattern), fiches
  détail (`/portfolio/[slug]`, `/competences/[slug]`), réalisations liées
  `/competences/[slug]/[realisation]`, `/contact` (Brevo).
- **Composant chat** : `ChatBot.js` + FAB flottant `GrasBotFab.tsx` monté
  dans `layout.tsx` → accessible depuis toutes les pages.

## CMS — `cmsbackend/` (Strapi 5)

- Content-types : `homepage`, `project`, `competence`, `realisation-ia`, `glossaire` (le type `message` a été retiré — contact via Brevo, voir `docs-site-interne/contact-flow.md`).
- API REST : `https://api.fernandgrascalvet.com/api/<pluralName>`.
- Permissions `find` publique sur les types publics en `draftAndPublish: true`.

## Chatbot — `llm-api/` + `vault-grasbot/` + Ollama

- Modèle chat : **Qwen3 8B** (quantif Q4_K_M) via Ollama local.
- **Pas d'embeddings** depuis la v3 (avril 2026) : la recherche se fait
  sur le vault Obsidian directement, en **pur Python**.
- Pipeline : question → tokenisation → scoring multi-signaux (aliases,
  titre/slug, answers, domaines, tags, BM25) → expansion par graphe
  (wikilinks) → top-5 notes → prompt Qwen3 → réponse.

Voir [[grasbot-retrieval]] pour le détail complet.

## Extraction Strapi → vault — `strapi_extraction/`

Scripts Node + Python qui génèrent la base de connaissance du chatbot :

1. `extract-api-data.js` : fetch des endpoints Strapi → JSON brut (`extract/raw/`).
2. `clean-api-data.js` : nettoyage → JSON minimal (`extract/clean-data/`).
3. `generate-docs.js` : génération de Markdown (`docs/`).
4. `build-vault.py` : conversion `docs/` → vault Obsidian (`vault-grasbot/`)
   avec frontmatter YAML enrichi (aliases, answers, priority), MOCs et
   wikilinks.

Voir [[vault-structure]] pour la structure du vault.
