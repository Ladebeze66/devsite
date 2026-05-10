---
title: Transcription audio (FGC transcription)
slug: transcription-audio-fgc-transcription
type: competence
source: manual
domains: [ia, web, devops]
tags:
  - transcription
  - whisper
  - stt
  - pyannote
  - diarisation
  - fastapi
  - nextjs
  - ollama
  - mistral-small
  - structured-summary
aliases:
  - transcription audio fgc
  - fgc transcription
  - transcription-audio-fgc-transcription
  - faster-whisper
  - pyannote
  - mistral-small3.2
  - mistralsmall3.2:24b
  - résumé structuré transcription
  - json transcription
  - transcription fernandgrascalvet
  - url application transcription
answers:
  - Parle-moi du projet de transcription audio FGC.
  - Qu'est-ce que le projet FGC transcription ?
  - Quelle est l'URL ou le lien de l'application web de transcription ?
  - Où accéder à la transcription en ligne fernandgrascalvet ?
  - Quel problème pour les réunions et enregistrements longs ?
  - La diarisation et pyannote sont-ils utilisés ?
  - Comment sont générés les résumés après transcription ?
  - Quel modèle LLM pour les résumés JSON et Markdown ?
  - Mistral small 24b sert à quoi dans le pipeline ?
  - Différence résumé avec ou sans diarisation ?
  - Quelle stack technique FastAPI Next transcription ?
priority: 7
linked:
  - "[[MOC-Competences]]"
  - "[[MOC-Ia]]"
related:
  - "[[ia]]"
  - "[[transcription-video]]"
  - "[[fernandgrascalvet-com]]"
  - "[[grasbot]]"
updated: 2026-05-10
visibility: public
# Segment URL publique : /competences/{route_parent}/{slug} (sinon /competences/{slug} par défaut).
route_parent: ia
---
**Slug :** `transcription-audio-fgc-transcription`  
**Ordre d'affichage :** _(Strapi `order` — typiquement après la domotique)_

---

## Présentation

Ce projet est une **application web** dédiée à la **transcription** de l'audio en texte structuré et exportable. L'interface est accessible publiquement sur **https://transcription.fernandgrascalvet.com** ; l'usage en **priorité** reste le **poste de travail ou le réseau local** (machine **Ubuntu** avec **RTX 4090** pour le calcul lourd), avec possibilité de service derrière **HTTPS** et **authentification** lorsqu'un périmètre fermé s'impose.

L'ambition produit dépasse un simple script : **interface Next.js**, API **FastAPI**, **file de jobs** avec suivi de progression, **plusieurs formats de sortie**. La **diarisation** (qui parle quand) est **en place** via **pyannote**. La **structuration métier** (compte-rendu, schémas **JSON**, rendu **Markdown**) s'appuie sur un LLM local **Ollama** (**mistral-small3.2:24b**), avec **prompts et templates** adaptés au cas **avec** ou **sans** diarisation ; sur textes longs, une stratégie **map-reduce** peut être employée selon le budget tokens.

---

## Problème adressé

Les réunions, cours et entretiens produisent des **enregistrements longs** ; les transformer en **texte éditable**, **horodatable** et **réutilisable** (sous-titres, notes, archives) demande à la fois un moteur de reconnaissance performant et une **chaîne logicielle** fiable : ingestion, traitement, erreurs, téléchargements.

---

## Fonctionnalités principales (périmètre documenté)

- **Entrées** : dépôt de **fichier audio** (et conteneurs vidéo lorsque le worker extrait la piste audio) ou **enregistrement depuis le navigateur** — le tout converge vers la même API de **création de job**.
- **Transcription** : **faster-whisper** sur GPU, avec réglages de modèle et de précision progressivement exposés dans l'UI.
- **Diarisation** : **pyannote**, fusion transcript / locuteurs dans le pipeline.
- **Suivi** : états de job visibles ; exports au minimum en **TXT**, **SRT**, **VTT**, **JSON** (segments).
- **Résumés structurés** : **templates métier** et appels **Ollama** (**mistral-small3.2:24b**) pour livrables **JSON** et **Markdown**.

---

## Architecture et contraintes

Le navigateur s'appuie sur **Next.js** ; les routes métier sont proxifiées vers **FastAPI**. L'**authentification JWT** et les comptes utilisateurs sont prévus pour les phases où l'API ne doit plus être ouverte publiquement. Le **micro** en production impose une origine **HTTPS** (ou localhost), ce qui s'aligne avec une terminaison TLS devant l'application.

---

## Positionnement

Le dépôt formalise une compétence **IA appliquée au signal audio** : concevoir un **produit** — pas seulement entraîner ou invoquer un modèle — avec documentation (**cahier des charges**, **architecture des flux**, **roadmap**) pensée pour **reprendre le développement** entre deux sessions ou avec un assistant.

---

## En bref

**Transcription audio**, c'est transformer la parole en **données utiles** : qualité de reconnaissance, **hygiène** des pipelines (jobs, erreurs, exports), **diarisation**, puis **comptes rendus** assistés par LLM — avec l'application sur **https://transcription.fernandgrascalvet.com** et la fiche portfolio **https://fernandgrascalvet.com/competences/transcription-audio-fgc-transcription**.

---

## Liens

- [[MOC-Competences]] — vue d’ensemble des compétences  
- [[MOC-Ia]] — domaine intelligence artificielle  
- [[ia]] — parcours IA et infra locale  
- [[transcription-video]] — autre chantier transcription / média  
- [[fernandgrascalvet-com]] — portfolio où la fiche est exposée  
