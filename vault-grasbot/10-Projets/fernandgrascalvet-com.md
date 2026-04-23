---
title: "fernandgrascalvet.com — site portfolio (Next.js / Strapi)"
slug: fernandgrascalvet-com
type: projet
source: manual
domains: [web, devops, securite, reseau, ia]
tags: [nextjs, strapi, iis, tailwind, grasbot]
aliases:
  - fernandgrascalvet
  - fernandgrascalvet.com
  - site fernand grascalvet
  - portfolio next strapi
  - mon site
  - digital atelier
answers:
  - "Comment est fait le site fernandgrascalvet.com ?"
  - Quelle est la stack de ton site ?
  - Parle de ton site portfolio
  - Next.js et Strapi sur ton serveur
priority: 6
linked:
  - "[[MOC-Projets]]"
  - "[[MOC-Web]]"
  - "[[MOC-Technique]]"
related:
  - "[[developpement-web-and-hebergement-sur-serveur-windows]]"
  - "[[grasbot]]"
  - "[[architecture-site]]"
link: "https://fernandgrascalvet.com"
updated: 2026-04-23
visibility: public
---

**Produit courant** : le portfolio public **fernandgrascalvet.com** — contenu géré par **Strapi 5**, rendu par **Next.js 15** (App Router, Tailwind, refonte visuelle *Digital Atelier* : Manrope + Newsreader, cartes *vellum*, etc.), servi derrière **IIS** sur **Windows Server 2025** avec certificats **Let’s Encrypt** (Win-ACME).

## Fonctionnalités notables (2025–2026)

- **Portfolio** : projets, fiches détail avec Markdown riche, carrousels, glossaire.
- **Compétences** : fiches richtext *ou* vues **vignettes** lorsque des entrées **Strapi** `realisation-ia` sont liées (ex. réalisations IA) ; fiche fille **`/competences/[slug]/[realisation]`** identique en gabarit à une fiche projet.
- **GrasBot** : assistant IA global, voir [[grasbot]].
- **Contact** : envoi d’e-mail via l’**API Brevo** (route Next `POST /api/contact`) — **plus** de stockage des messages dans Strapi.

## Périmètre

Ce dépôt documente l’**implémentation** ; l’hébergement, IIS et la sécurité de base sont alignés sur la fiche de compétence [[developpement-web-and-hebergement-sur-serveur-windows]] et sur [[architecture-site]].
