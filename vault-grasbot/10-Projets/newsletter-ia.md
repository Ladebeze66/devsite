---
title: "Newsletter IA — Ollama + Listmonk + Directus"
slug: newsletter-ia
type: projet
source: manual
domains: [ia, web, devops]
tags: [ollama, langfuse, listmonk, directus, newsletter, docker, chatbot]
aliases:
  - newsletter ia
  - newsletter automatisée
  - newsletter ollama listmonk
  - listmonk directus ollama
  - génération de newsletter
  - newsletter homelab
  - diffusion newsletter auto-hébergée
answers:
  - "Qu'est-ce que la newsletter IA de Fernand ?"
  - "Parle-moi du projet newsletter automatisée."
  - "Comment génère-t-il une newsletter avec un LLM local ?"
  - "Utilise-t-il Listmonk pour ses envois ?"
  - "Sur quelles briques repose sa newsletter auto-hébergée ?"
priority: 6
linked:
  - "[[MOC-Projets]]"
  - "[[MOC-Ia]]"
related:
  - "[[ia]]"
  - "[[grasbot]]"
  - "[[architecture-site]]"
updated: 2026-04-23
visibility: public
---

# Newsletter IA — Ollama + Listmonk + Directus

> [!info] Rôle de cette note
> Fiche **projet** *Newsletter IA*, exposée sur le site en `realisation-ia`
> rattachée à la compétence [[ia]]. Démontre la capacité à orchestrer une
> chaîne de publication **auto-hébergée** avec de la génération LLM locale.

## L'objectif

Construire un système de newsletter **complètement auto-hébergé**, capable
de **générer automatiquement** le contenu éditorial (intro, sélection des
articles) à partir d'un corpus d'information, puis de le **diffuser** à une
liste d'abonnés — sans dépendre d'un service SaaS propriétaire (Substack,
Mailchimp, Beehiiv…).

## Les briques

| Brique | Rôle |
|--------|------|
| **Listmonk** | Diffusion — open-source (Go), API REST complète, segmentation, stats, templates HTML. Dans un conteneur Docker derrière IIS reverse proxy pour HTTPS. |
| **Directus** | Édition — CMS headless : chaque édition est un document avec ses articles, sa thématique, sa date. Permet de **réviser** le contenu généré par l'IA avant envoi. |
| **Ollama** | Génération LLM locale (Qwen3, Mistral). Deux usages : **(1) sélection bornée** des 3-5 articles les plus pertinents par thématique, **(2) rédaction d'introduction** éditoriale à partir des résumés. |
| **Langfuse** | Observabilité — chaque génération est tracée (prompt, sortie, tokens, latence) pour suivre la qualité dans le temps et itérer sur les prompts **sans régression**. |

## Ce que ce projet démontre

- **Self-hosting complet** d'une chaîne de publication (serveur, DNS, HTTPS,
  VM, Docker, reverse proxy, SMTP).
- **Orchestration** de plusieurs services (Listmonk + Directus + Ollama)
  plutôt que coller des briques opaques.
- **Usage ciblé de l'IA** là où elle apporte de la valeur (sélection +
  rédaction d'intro), **sans basculer** dans un 100 % automatique qui
  perdrait en qualité.
- **Observabilité dès le départ** : Langfuse connecté **avant** le moindre
  envoi en production.

## Roadmap

- Enrichissement LLM multi-passes (extraction de citations, tags
  automatiques).
- Interface d'arbitrage humain dans Directus pour valider l'intro avant
  envoi.
- Dashboard Langfuse dédié à la newsletter (taux d'ouverture ↔ ton de
  l'intro).

---

## Liens

- [[MOC-Projets]] — hub projets
- [[MOC-Ia]] — hub domaine *ia*
- [[ia]] — compétence IA (fiche)
- [[grasbot]] — autre réalisation IA, même esprit *self-hosted + observable*
