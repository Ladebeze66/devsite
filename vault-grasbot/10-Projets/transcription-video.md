---
title: "Transcription vidéo automatique"
slug: transcription-video
type: projet
source: manual
domains: [ia, devops]
tags: [ollama, openwebui, ovh, transcription, multimedia]
aliases:
  - transcription vidéo
  - transcription automatique
  - transcription auto
  - speech to text
  - sous-titres automatiques
  - résumé de vidéo
  - pipeline transcription
answers:
  - "Comment transcrit-il des vidéos automatiquement ?"
  - "Parle-moi du projet de transcription vidéo."
  - "Quel pipeline utilise-t-il pour la transcription ?"
  - "A-t-il testé OVHcloud AI Endpoints ?"
priority: 6
linked:
  - "[[MOC-Projets]]"
  - "[[MOC-Ia]]"
related:
  - "[[ia]]"
  - "[[newsletter-ia]]"
  - "[[grasbot]]"
  - "[[transcription-audio-fgc-transcription]]"
updated: 2026-05-10
visibility: public
---

# Transcription vidéo automatique

> [!info] Rôle de cette note
> Fiche **projet** *Transcription vidéo*, exposée sur le site en
> `realisation-ia` rattachée à la compétence [[ia]]. Montre la maîtrise
> d'un pipeline **multimédia** (décodage → segmentation → transcription →
> post-processing) et la capacité à **comparer** des fournisseurs de
> modèles (OVHcloud AI Endpoints vs modèles locaux Ollama).

## Contexte

Pouvoir **transcrire automatiquement** une vidéo longue (conférence,
tutoriel, cours), **segmenter les moments clés**, et **post-traiter** le
résultat pour obtenir un document éditable directement utilisable.

Exploration en **sept parties**, de l'intégration d'OVHcloud dans
Open WebUI jusqu'au calcul fin des **intervalles d'images** selon le mode
retenu.

## Pipeline

### 1. Préparation

- Intégration d'**OVHcloud AI Endpoints** dans **Open WebUI** comme
  fournisseur complémentaire aux modèles locaux Ollama.
- Mise en place d'une pipeline vidéo sur la **VM dédiée** (calculs,
  décodage, extraction audio).

### 2. Traitement vidéo

- Extraction de l'**audio** de la vidéo source.
- **Segmentation temporelle** avec calcul d'intervalles d'images adaptés
  au mode choisi (transcription pure, analyse d'images-clés, ou les deux).
- **Transcription** par modèle *speech-to-text*.

### 3. Post-processing

- Nettoyage des hésitations, **reformulation légère** par LLM local.
- **Structuration en chapitres** avec timestamps.
- Export au format exploitable.

### 4. Analyse et corrections

Phase d'analyse des résultats sur des vidéos tests, qui a permis
d'identifier une liste de correctifs (**segmentation**, **gestion des
silences**, **précision des timestamps**) **avant** d'industrialiser le
workflow — démarche itérative et mesurée.

## Ce que ce projet démontre

- Maîtrise d'un **pipeline multimédia complet** (décodage, segmentation,
  transcription, post-processing).
- Capacité à **comparer** des fournisseurs de modèles (**OVHcloud** vs
  **Ollama local**) et à choisir selon le contexte.
- Intégration de plusieurs briques (**Open WebUI**, scripts Python,
  modèles distants + locaux) dans un workflow cohérent.
- **Démarche itérative** : identification des régressions **avant** la mise
  en production.

---

## Liens

- [[MOC-Projets]] — hub projets
- [[MOC-Ia]] — hub domaine *ia*
- [[ia]] — compétence IA (fiche)
- [[newsletter-ia]] — autre réalisation IA orchestrée (Listmonk + Directus + Ollama)
- [[grasbot]] — réalisation IA : assistant du portfolio
