---
title: "fernandgrascalvet.com — site portfolio"
slug: fernandgrascalvet-com
type: projet
source: manual
domains: [web, devops, ia]
tags: [nextjs, strapi, portfolio]
aliases:
  - fernandgrascalvet.com
  - site portfolio
  - portfolio en ligne
  - son site
  - ton site
  - site perso
  - site web de fernand
answers:
  - "Quel est le site de Fernand ?"
  - "Parle-moi de son site portfolio."
  - "Où peut-on voir ses projets en ligne ?"
  - "Sur quel site est hébergé GrasBot ?"
priority: 6
linked:
  - "[[MOC-Projets]]"
  - "[[MOC-Web]]"
related:
  - "[[developpement-web-and-hebergement-sur-serveur-windows]]"
  - "[[grasbot]]"
  - "[[architecture-site]]"
link: "https://fernandgrascalvet.com"
updated: 2026-04-23
visibility: public
---

# fernandgrascalvet.com — site portfolio

> [!info] Rôle de cette note
> Fiche **projet** dédiée au site public lui-même. Pour le *comment* technique
> (stack détaillée, pipeline de build, ports) voir [[architecture-site]] ;
> pour la *posture métier* (hébergement IIS, sécurité, SSL) voir la fiche
> compétence [[developpement-web-and-hebergement-sur-serveur-windows]].

## En une phrase

Portfolio public de Fernand Gras-Calvet, **auto-hébergé** sur un serveur
personnel (Windows Server + IIS), construit en **Next.js 15** et alimenté
par **Strapi 5**, avec un assistant IA intégré ([[grasbot|GrasBot]]).

## Ce que le visiteur y trouve

- **Portfolio** : fiches projets (école 42 et perso) avec Markdown riche
  et galeries.
- **Compétences** : fiches richtext ou **vignettes** de *réalisations IA*
  quand le Strapi contient des entrées `realisation-ia` liées — route fille
  `/competences/[slug]/[realisation]` pour le détail.
- **Contact** : e-mail transactionnel via **Brevo** (plus de stockage
  Strapi des messages).
- **GrasBot** : bouton flottant disponible sur toutes les pages.

## Différentiation avec les notes voisines

| Note | Angle |
|------|-------|
| `fernandgrascalvet-com` (cette note) | **Projet public** (ce qu'on *voit*) |
| [[architecture-site]] | Schéma technique interne (stack, flux, ports) |
| [[developpement-web-and-hebergement-sur-serveur-windows]] | Compétence / savoir-faire web + hébergement |
| [[grasbot]] | Fonctionnalité IA du site |

## Liens

- [[MOC-Projets]] — hub projets
- [[MOC-Web]] — hub domaine *web*
