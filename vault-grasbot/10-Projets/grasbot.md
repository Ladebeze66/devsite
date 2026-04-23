---
title: "GrasBot — chatbot IA du portfolio"
slug: grasbot
type: projet
source: manual
domains: [ia, web, devops]
tags: [ollama, fastapi, langfuse, chatbot, qwen3]
aliases:
  - grasbot
  - assistant grasbot
  - chatbot du site
  - chatbot fernandgrascalvet
  - chatbot ia du portfolio
  - assistant du site
  - assistant ia locale
  - ia locale test
  - bot du site
  - bouton flottant
answers:
  - "Qu'est-ce que GrasBot ?"
  - "Parle-moi de GrasBot."
  - "Quel est l'assistant IA sur le site ?"
  - "Comment fonctionne le chatbot du site ?"
  - "Sur quelles sources GrasBot s'appuie-t-il ?"
  - "GrasBot hallucine-t-il ?"
priority: 7
linked:
  - "[[MOC-Projets]]"
  - "[[MOC-Ia]]"
related:
  - "[[ia]]"
  - "[[grasbot-retrieval]]"
  - "[[architecture-site]]"
  - "[[fernandgrascalvet-com]]"
  - "[[newsletter-ia]]"
  - "[[transcription-video]]"
link: "https://fernandgrascalvet.com"
updated: 2026-04-23
visibility: public
---

# GrasBot — chatbot IA du portfolio

> [!info] Rôle de cette note
> Fiche **projet** (réalisation IA exposée sur `/competences/ia`). Pour
> l'algorithme de retrieval détaillé voir [[grasbot-retrieval]] ; pour
> l'architecture globale du site voir [[architecture-site]].

## Le défi

Permettre à un visiteur de **poser des questions libres** sur le parcours,
les projets et les compétences de Fernand, **sans qu'il doive naviguer**
dans dix pages, et **sans que le chatbot invente** des informations qui
ne sont pas dans les notes.

## Pipeline technique

GrasBot n'est pas un simple wrapper ChatGPT : c'est un vrai pipeline **RAG
(Retrieval-Augmented Generation)** construit de bout en bout.

### 1. Vault Obsidian comme source de vérité

Un coffre Obsidian structuré (`vault-grasbot/`) contient les notes de
parcours, projets École 42, compétences et glossaires. Chaque note porte
un **frontmatter YAML** avec `aliases`, `answers`, `priority`, `domains`
— autant de **signaux** pour le scoring.

### 2. Retrieval déterministe par graphe + BM25

Contrairement à un RAG classique à **embeddings vectoriels**, GrasBot
exploite directement la **structure du vault** : score multi-signaux
(aliases / titre / answers / domaines / BM25 sur le body), puis
**expansion par graphe** via les wikilinks `[[...]]`. Résultat : retrieval
en **~50 ms**, **100 % traçable**, sans dépendance à ChromaDB ni à des
embeddings. Détail : [[grasbot-retrieval]].

### 3. Génération locale avec Qwen3 + Ollama

Un modèle **Qwen3 8B** (quantization Q4_K_M) tourne **en local** sur le
serveur, servi par **Ollama**. Paramètres tunés après audit des premières
traces :

- `num_ctx = 8192` pour éviter la **troncature silencieuse** du contexte
  (défaut Ollama trop bas quand plusieurs notes entières sont injectées).
- `num_predict = 1024` pour les réponses longues complètes.
- `think = false` pour **désactiver** le mode raisonnement interne qui
  consommait du budget de sortie.

### 4. Observabilité Langfuse de bout en bout

Chaque conversation déclenche une trace Langfuse avec **3 spans** :

- `retrieval` (notes remontées, scores, *reasons*),
- `prompt_build` (system + user complets, sources tronquées, flag
  *grounded*),
- `ollama-chat` (tokens, latence, paramètres).

Scores automatiques `grounded` et `retrieval_relevance` pour suivre la
qualité dans le temps.

### 5. Règles anti-hallucination

System prompt strict : **interdiction** d'inventer un fait absent des
notes, **priorité** aux sources `type=parcours` pour les questions
biographiques, mention explicite *« non précisé dans les notes »* quand
l'info manque. La source canonique [[bio-fernand]] (priority 10) couvre
les *« qui est Fernand ? »*.

## Stack complète

| Couche | Outils |
|--------|--------|
| **Front** | Next.js 15 + composant React `ChatBot.js` ; session / user IDs anonymes (UUID v4 en `sessionStorage` / `localStorage`). |
| **Proxy** | Route API Next qui valide une whitelist de paramètres (`q`, `session_id`, `user_id`) et forward vers l'API Python. |
| **Backend** | FastAPI + Ollama ; pipeline `search.py` (graph + BM25) + `observability.py` (Langfuse). |
| **Infra** | Windows Server 2025 + IIS reverse proxy + HTTPS Let's Encrypt + VPN pour l'admin. |

## Ce que ce projet démontre

- **Chaîne RAG complète** maîtrisée (ingestion, retrieval, génération,
  observabilité).
- Choisir la **bonne brique** selon le contexte : un vault de quelques
  dizaines de notes ne justifie pas des embeddings vectoriels — **BM25 +
  graphe** suffit largement.
- **Tuning des modèles** plutôt que subir leurs défauts (audit via
  Langfuse → correctifs ciblés).
- Déploiement en **production** sur une infra maîtrisée **bout en bout**.

## Différentiation avec les notes voisines

| Note | Angle | Quand elle remonte en premier |
|------|-------|-------------------------------|
| `grasbot` (cette note) | Fiche **produit / vignette réalisation** IA | *« Qu'est-ce que GrasBot ? »*, *« Pipeline technique ? »* |
| [[grasbot-retrieval]] | Technique interne (scoring, BM25, graphe) | *« Comment le chatbot trouve-t-il ses réponses ? »* |
| [[architecture-site]] | Stack globale Next + Strapi + FastAPI | *« Comment est fait le site ? »* |
| [[ia]] | Compétence (parcours IA de Fernand) | *« Quelles sont ses compétences en IA ? »* |

## Liens

- [[MOC-Projets]] — hub projets
- [[MOC-Ia]] — hub domaine *ia*
- [[ia]] — compétence IA (fiche) ; GrasBot y apparaît en réalisation
- [[fernandgrascalvet-com]] — le site qui héberge GrasBot
- [[newsletter-ia]] · [[transcription-video]] — autres réalisations IA
