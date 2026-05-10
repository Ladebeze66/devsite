---
title: Mon Exploration et Maîtrise de l’Intelligence Artificielle
slug: ia
type: competence
source: manual
domains: [ia, ecole-42, algorithmique]
tags: [chatbot, ollama, langfuse, data-ia]
aliases:
  - mon exploration et maîtrise de l’intelligence artificielle
  - ia
  - intelligence artificielle
  - ia locale
  - ia self-hosted
  - ia auto-hébergée
  - llm
  - llms
  - modèles de langage
  - chatbot
  - chatbots
  - machine learning
  - deep learning
  - data science
  - ollama
  - langfuse
answers:
  - "Quelles sont ses compétences en IA ?"
  - "A-t-il de l'expérience en IA ?"
  - "Parle-moi de son expérience en IA."
  - "Utilise-t-il des LLMs locaux ?"
  - "Qu'est-ce qui l'intéresse dans l'IA ?"
priority: 7
linked:
  - "[[MOC-Competences]]"
  - "[[MOC-Ia]]"
related:
  - "[[grasbot]]"
  - "[[newsletter-ia]]"
  - "[[transcription-audio-fgc-transcription]]"
  - "[[transcription-video]]"
  - "[[ft-linear-regression]]"
  - "[[piscine-python-data-science]]"
  - "[[fernandgrascalvet-com]]"
updated: 2026-04-23
visibility: public
---
**Slug :** `ia`
**Ordre d'affichage :** 1

---

## Mon exploration des LLM et de l'IA : un intérêt devenu spécialisation

Comme beaucoup, j'ai découvert l'intelligence artificielle grand public avec l'arrivée de ChatGPT, qui a marqué un tournant décisif dans l'accessibilité et la démocratisation de cette technologie. Fasciné par la vitesse d'évolution du domaine, j'ai rapidement développé un intérêt pour plusieurs applications : **génération d'images**, **chatbots**, et plus largement les **modèles de langage (LLMs)**.

## De l'expérimentation à l'auto-hébergement

Rapidement, j'ai voulu sortir de la dépendance aux API propriétaires et comprendre ce qui se passe sous le capot. J'ai expérimenté des solutions d'**IA locale** avec **Ollama**, **LM Studio**, **Open WebUI**, en explorant le fine-tuning léger, l'ingénierie de prompts, et l'intégration de modèles dans des workflows métier.

Aujourd'hui, toute ma pile IA tourne sur **mon serveur personnel** :

- **LLM locaux** (Qwen3, Llama, Mistral, modèles d'embedding),
- **observabilité** via **Langfuse** self-hosted,
- **recherche web privée** via **SearxNG** et **Firecrawl** pour alimenter des agents.

Cette infrastructure me permet d'expérimenter **sans plafond de tokens**, **sans fuite de données**, et avec une compréhension fine du **coût** et de la **performance** de chaque modèle.

## Une spécialisation formalisée à l'École 42

Parallèlement, je me spécialise en **Data Science et Intelligence Artificielle à l'École 42**, ce qui me permet d'approfondir les **fondations mathématiques** (régression, descente de gradient, fonctions de coût, métriques d'évaluation) plutôt que de rester au niveau de l'utilisation des bibliothèques de haut niveau. Les projets [[ft-linear-regression]] (premier modèle **from scratch**) et la [[piscine-python-data-science|Piscine Python for Data Science]] (5 modules) posent les briques essentielles avant les modèles plus complexes.

## Mon angle

Je privilégie trois axes :

1. **Autonomie** — héberger moi-même pour comprendre réellement les contraintes, les coûts et les limites.
2. **Observabilité** — chaque appel LLM que je produis est tracé (Langfuse). On ne peut pas améliorer ce qu'on ne mesure pas.
3. **Utilité concrète** — pas d'IA pour l'IA : chaque projet résout un problème réel (newsletter automatisée, chatbot de portfolio, transcription vidéo…).

## Réalisations IA exposées sur le site

La rubrique `/competences/ia` présente ces travaux en **vignettes navigables** (entité Strapi `realisation-ia`) :

- [[grasbot|GrasBot — chatbot IA du portfolio]] — RAG maison (graph + BM25) + Qwen3 local + Langfuse.
- [[newsletter-ia|Newsletter IA — Ollama + Listmonk + Directus]] — chaîne de publication auto-hébergée avec génération LLM ciblée.
- [[transcription-video|Transcription vidéo automatique]] — pipeline multimédia (décodage → segmentation → STT → post-processing).
- *Parcours / formation* : voir [[ft-linear-regression]] et [[piscine-python-data-science]].

---

*Cette compétence est illustrée par 9 images sur le site.*

---

## Liens

- [[MOC-Competences]] — vue d'ensemble des compétences
- [[MOC-Ia]] — domaine *ia*
- [[MOC-Algorithmique]] — domaine *algorithmique*
- [[MOC-Ecole-42]] — domaine *ecole-42*
