---
title: "Développement Web & Hébergement sur serveur Windows"
slug: developpement-web-and-hebergement-sur-serveur-windows
type: competence
source: strapi/competences
domains: [reseau, securite, web]
tags: []
aliases:
  - developpement web and hebergement sur serveur windows
  - developpement-web-and-hebergement-sur-serveur-windows
  - developpement_web_and_hebergement_sur_serveur_windows
  - "développement web & hébergement sur serveur windows"
  - réseau
  - tcp
  - ip
  - sockets
  - routage
  - sécurité
  - hardening
  - cybersécurité
answers:
  - Quelles sont ses compétences en réseaux ?
  - "A-t-il de l'expérience en réseaux ?"
  - Parle-moi de son expérience en réseaux
priority: 7
linked:
  - "[[MOC-Competences]]"
related:
  - "[[born2beroot]]"
  - "[[ft-transcendence]]"
  - "[[cpp-partie1]]"
updated: 2026-04-22
visibility: public
---
**Slug :** `developpement-web-and-hebergement-sur-serveur-windows`
**Ordre d'affichage :** 2

---

J'ai réalisé ce projet afin d'étendre mes compétences en développement Web. 

Ce projet est un site web basé sur Next.js pour le frontend et Strapi pour le backend, hébergé sur un serveur Windows Server 2025 avec IIS comme serveur web. Il repose sur une architecture Headless CMS, où le contenu est géré via une API REST et affiché dynamiquement sur le frontend.

🔹 Technologies utilisées

Frontend (Client) :

Framework : Next.js (React, TypeScript, Server-Side Rendering & Static Generation)

Styling : Tailwind CSS

Gestion des requêtes API : Fetch API (avec qs pour structurer les requêtes)

SEO & Performance : Optimisation des images, pré-rendu des pages

Backend (Serveur) :

CMS : Strapi (Node.js, API REST)

Base de données : PostgreSQL ou MySQL

Hébergement : IIS sur Windows Server 2025

Sécurité : HTTPS activé via Win-ACME (Let’s Encrypt)

Déploiement & Infrastructure :

Système d’exploitation : Windows Server 2025

Serveur Web : IIS 10 (gestion des proxys et reverse proxy pour Next.js & Strapi)

Gestion des certificats SSL : Win-ACME pour le renouvellement automatique des certificats HTTPS

Monitoring : Logs IIS + Console Next.js & Strapi

🔹 Fonctionnalités du site

✅ Affichage dynamique des compétences (compétences récupérées via API Strapi)

✅ Glossaire interactif avec mots-clés détectés dynamiquement

✅ Carousel d'images pour présenter les compétences

✅ Navigation rapide et fluide grâce à Next.js

✅ SEO optimisé via les pages statiques et le rendu dynamique

Ce projet est toujours en développement, je l'agrémenterai de contenu au fil du temps.

Il m'a permis brièvement de me familiariser a plusieurs domaines.

1️⃣ Développement Web 🌐

Ce projet est principalement un site web dynamique reposant sur Next.js et Strapi, ce qui le place dans la catégorie du développement web moderne.

Frontend (Next.js, React, TypeScript) → Développement web côté client

Backend (Strapi, Node.js, API REST) → Développement web côté serveur

API et Headless CMS → Gestion de contenu via une API

2️⃣ Hébergement et Administration Systèmes 🖥️

Étant donné que le site est auto-hébergé sur un serveur Windows Server 2025 avec IIS, il appartient aussi à la catégorie administration système et hébergement web.

Configuration d’un serveur web (IIS, Windows Server 2025)

Gestion des certificats SSL avec Win-ACME (HTTPS, sécurité)

Base de données (PostgreSQL ou MySQL)

Surveillance et gestion des performances (logs IIS, monitoring)

3️⃣ Cloud & DevOps (partiellement) ☁️

Même si ce projet n’utilise pas un service cloud public (Azure, AWS, GCP), il comporte des éléments liés à l’automatisation et à la gestion des déploiements.

Déploiement d’une application Next.js & Strapi sur un serveur dédié

Gestion des certificats SSL automatisée (Win-ACME, Let's Encrypt)

Possibilité d’extensions avec CI/CD pour automatiser les mises à jour

4️⃣ Sécurité Informatique 🔒

Avec l’implémentation du HTTPS, de l’authentification API et de la gestion des accès via Strapi et IIS, ce projet a aussi un aspect cybersécurité.

Chiffrement des connexions avec SSL/TLS (HTTPS activé)

Protection des API (Cors, Access-Control-Allow-Origin, JWT si activé dans Strapi)

Gestion des permissions et authentification des utilisateurs (Strapi)

5️⃣ Expérience Utilisateur & SEO 📈

Le projet est conçu pour être rapide, interactif et optimisé pour le référencement.

SEO optimisé avec Next.js (Static Generation, Server-Side Rendering)

Performance améliorée grâce au préchargement et à la mise en cache

Expérience utilisateur fluide avec des animations et une navigation rapide

---

*Cette compétence est illustrée par 3 images sur le site.*

---

## Liens

- [[MOC-Competences]] — vue d'ensemble des compétences
- [[MOC-Reseau]] — domaine *reseau*
- [[MOC-Securite]] — domaine *securite*
- [[MOC-Web]] — domaine *web*
