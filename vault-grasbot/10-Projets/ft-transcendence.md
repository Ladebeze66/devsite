---
title: ft_transcendence
slug: ft-transcendence
type: projet
source: strapi/projects
domains: [algorithmique, devops, ecole-42, reseau, web]
tags: [docker, tri]
aliases:
  - ft transcendence
  - ft-transcendence
  - ft_transcendence
  - algo
  - algorithme
  - algorithmes
  - complexité
  - devops
  - conteneurs
  - ci/cd
  - infrastructure
  - 42
answers:
  - Parle-moi de ft_transcendence
  - "Qu'est-ce que ft_transcendence ?"
  - Comment fonctionne ft_transcendence ?
priority: 5
linked:
  - "[[MOC-Projets]]"
  - "[[MOC-Ecole-42]]"
related:
  - "[[cpp-partie2]]"
  - "[[inception]]"
  - "[[born2beroot]]"
link: "https://github.com/Ladebeze66/ft_transcendence"
updated: 2026-04-22
visibility: public
---
**Slug :** `ft-transcendence`
**Lien GitHub :** [https://github.com/Ladebeze66/ft_transcendence](https://github.com/Ladebeze66/ft_transcendence)

---

## Description

Le projet ft_transcendence de l'école 42 est une application web full-stack développée en équipe, combinant un jeu de Pong multijoueur et un chat en temps réel. Le frontend est conçu avec HTML, CSS et JavaScript, tandis que le backend repose sur Django et WebSockets pour gérer la logique du jeu et des interactions en temps réel. L'application est conteneurisée avec Docker, et utilise PostgreSQL pour la gestion des données. Vous avez principalement travaillé sur l'implémentation du chat en jeu, permettant aux joueurs de communiquer en direct, et l'infrastructure est surveillée via Elasticsearch et Kibana pour le monitoring.

## Détails du projet

Le projet ft_transcendence est un projet full-stack web développé en groupe, combinant un jeu multijoueur de Pong et un chat en temps réel. L'objectif est d’implémenter une application web interactive, en utilisant HTML, CSS et JavaScript pour le frontend, et Django avec WebSockets pour le backend. Le projet est conteneurisé avec Docker, permettant une gestion efficace des services et une infrastructure modulaire.

🎯 Objectifs du Projet

Développement Collaboratif : Travailler en groupe pour concevoir une application web robuste et modulaire.

Architecture Full-Stack : Séparer le backend (Django) et le frontend (HTML/CSS/JS) pour une meilleure organisation du code.

Chat en Temps Réel (votre contribution) : Implémenter un chat intégré au jeu, permettant aux joueurs de communiquer en direct via WebSockets.

Déploiement Conteneurisé : Utiliser Docker et Docker Compose pour faciliter l’exécution et le déploiement du projet.

Sécurisation des Connexions : Intégrer une authentification OAuth et gérer l’accès des utilisateurs.

🛠️ Technologies Utilisées

Frontend (Interface Utilisateur - HTML/CSS/JS) :

HTML5 : Structure des pages et affichage du jeu.

CSS3 : Design et mise en page pour une interface utilisateur fluide.

JavaScript : Interactions dynamiques, gestion des WebSockets pour le chat.

Backend (Serveur & APIs - Django) :

Django : Framework backend pour gérer les utilisateurs et la logique métier.

Django Channels & WebSockets : Gestion de la communication en temps réel pour le chat et le jeu.

PostgreSQL : Base de données pour stocker les informations des joueurs et du chat.

Infrastructure & Déploiement :

Docker & Docker Compose : Isolation des services et déploiement facilité.

Elasticsearch, Logstash, Kibana (ELK Stack) : Monitoring des logs du serveur et des connexions.

OAuth : Authentification sécurisée des utilisateurs via un service externe (Google, GitHub…).

🏓 Fonctionnalités Principales

✅ Jeu de Pong Multijoueur :

Match en temps réel entre joueurs.

Gestion des scores et classement des joueurs.

✅ Chat en Jeu (ma contribution) :

Communication instantanée entre joueurs via WebSockets.

Interface dynamique mise à jour sans rechargement de la page.

Gestion des utilisateurs connectés et des messages persistants.

✅ Authentification OAuth :

Connexion des utilisateurs via Google, GitHub ou une autre plateforme OAuth.

Gestion des profils et des permissions d'accès.

✅ Dashboard Joueurs & Matchs :

Interface affichant les statistiques des joueurs.

Historique des matchs et leaderboard.

✅ Déploiement & Monitoring :

Gestion des logs système via ELK Stack.

Conteneurisation avec Docker pour un environnement de développement homogène.

🔧 Approche d’Implémentation

1️⃣ Déploiement de l’Infrastructure

Configuration des conteneurs Docker pour PostgreSQL, Django et les services de monitoring.

Création de la base de données avec PostgreSQL.

2️⃣ Développement du Backend (Django)

Implémentation des modèles d’utilisateurs et des scores.

Création des routes API pour gérer les connexions des joueurs et les parties de Pong.

Mise en place du système de chat en temps réel via Django Channels et WebSockets.

3️⃣ Développement du Frontend (HTML/CSS/JS)

Création des fichiers HTML pour structurer l’interface du jeu et du chat.

Intégration du CSS pour améliorer le design et rendre l'interface utilisateur attrayante.

Ajout de JavaScript pour :

Gérer le chat en direct via WebSockets.

Mettre à jour dynamiquement l'interface du jeu.

Afficher les scores et l’état des joueurs connectés.

4️⃣ Mise en Place du Système de Logs et Monitoring

Intégration de Logstash pour la collecte des logs.

Visualisation des événements système avec Kibana.

Surveillance des connexions utilisateurs via Elasticsearch.

🚀 Pourquoi ce projet est important ?

Le projet ft_transcendence est une expérience complète de développement web full-stack. Il permet d’acquérir des compétences en travail collaboratif, en gestion des conteneurs avec Docker, en développement backend avec Django, et en interaction utilisateur en temps réel via WebSockets.

---

## Liens

- [[MOC-Projets]] — vue d'ensemble des projets
- [[MOC-Ecole-42]] — contexte pédagogique
- [[MOC-Algorithmique]] — domaine *algorithmique*
- [[MOC-Devops]] — domaine *devops*
- [[MOC-Reseau]] — domaine *reseau*
- [[MOC-Web]] — domaine *web*
