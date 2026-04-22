---
title: inception
slug: inception
type: projet
source: strapi/projects
domains: [algorithmique, devops, ecole-42, reseau, systeme]
tags: [42-tronc, docker, tri]
aliases:
  - inception
  - algo
  - algorithme
  - algorithmes
  - complexité
  - devops
  - conteneurs
  - ci/cd
  - infrastructure
  - 42
  - école 42
  - 42 perpignan
answers:
  - Parle-moi de inception
  - "Qu'est-ce que inception ?"
  - Comment fonctionne inception ?
priority: 5
linked:
  - "[[MOC-Projets]]"
  - "[[MOC-Ecole-42]]"
related:
  - "[[cpp-partie2]]"
  - "[[fract-ol]]"
  - "[[ft-transcendence]]"
link: "https://github.com/Ladebeze66/Inception"
updated: 2026-04-22
visibility: public
---
**Slug :** `inception`
**Lien GitHub :** [https://github.com/Ladebeze66/Inception](https://github.com/Ladebeze66/Inception)

---

## Description

Le projet Inception de l'école 42 consiste à déployer une infrastructure basée sur Docker et Docker Compose, en isolant plusieurs services dans des conteneurs distincts. Il inclut la configuration d'un serveur web (Nginx), d'une base de données (MariaDB/MySQL) et d'une application web (WordPress), tout en assurant la sécurisation, la persistance des données et l’automatisation du déploiement. Ce projet permet d’acquérir des compétences en virtualisation, gestion de conteneurs et administration système.

## Détails du projet

Le projet Inception de l'école 42 vise à approfondir les compétences en administration système et en virtualisation en utilisant Docker et Docker Compose. L'objectif est de configurer une infrastructure de conteneurs pour héberger plusieurs services, en respectant les bonnes pratiques de sécurité et d'architecture.

🎯 Objectifs du Projet

Maîtrise de Docker : Apprendre à créer et gérer des conteneurs pour isoler des applications et leurs dépendances.

Utilisation de Docker Compose : Définir et orchestrer des applications multi-conteneurs pour faciliter le déploiement et la gestion des services.

Sécurisation des Services : Mettre en place des mesures de sécurité pour protéger les services hébergés, notamment en configurant correctement les pare-feux, les utilisateurs et les permissions.

Automatisation du Déploiement : Automatiser le déploiement des services pour assurer une infrastructure reproductible et évolutive.

🛠️ Spécifications Techniques

Services à Héberger :

Un serveur web (par exemple, Nginx) pour servir du contenu statique et dynamique.

Une base de données relationnelle (par exemple, MySQL ou PostgreSQL) pour stocker les données des applications.

Une application web (par exemple, WordPress) connectée à la base de données.

Configuration des Conteneurs :

Chaque service doit être isolé dans son propre conteneur Docker.

Les conteneurs doivent pouvoir communiquer entre eux via un réseau Docker dédié.

Les données persistantes doivent être stockées dans des volumes Docker pour assurer la persistance des données entre les redémarrages.

Fichier Docker Compose :

Définir un fichier docker-compose.yml pour décrire les services, les réseaux et les volumes nécessaires à l'application.

Configurer les dépendances entre les services pour assurer un démarrage correct de l'application.
Sécurité :

Mettre en place des règles de pare-feu pour limiter l'accès aux services sensibles.

Utiliser des variables d'environnement pour gérer les informations sensibles, telles que les mots de passe de la base de données.

Assurer la mise à jour régulière des images Docker pour inclure les derniers correctifs de sécurité.

🔧 Approche d'Implémentation

Installation de Docker et Docker Compose :

Installer Docker et Docker Compose sur le système hôte.

Vérifier que les installations fonctionnent correctement en exécutant des conteneurs de test.

Création des Dockerfiles :

Pour chaque service, créer un Dockerfile définissant l'environnement nécessaire et les étapes d'installation de l'application.

Optimiser les Dockerfile pour réduire la taille des images et améliorer les performances.

Définition du Fichier Docker Compose :

Écrire le fichier docker-compose.yml en spécifiant les services, les images à utiliser, les ports exposés, les volumes et les réseaux.

Configurer les dépendances entre les services pour assurer un ordre de démarrage correct.
Configuration des Réseaux et Volumes :

Définir des réseaux Docker pour permettre la communication sécurisée entre les conteneurs.

Configurer des volumes pour la persistance des données, notamment pour la base de données et les fichiers de l'application web.

Mise en Place des Mesures de Sécurité :

Restreindre les ports exposés aux seuls nécessaires et configurer des règles de pare-feu appropriées.

Mettre en place des utilisateurs non-root dans les conteneurs lorsque cela est possible.

Gérer les secrets et les variables d'environnement de manière sécurisée.

Tests et Validation :

Démarrer l'ensemble des services à l'aide de Docker Compose et vérifier leur bon fonctionnement.

Tester la communication entre les services, par exemple, vérifier que l'application web peut interagir avec la base de données.

Assurer la persistance des données en redémarrant les conteneurs et en vérifiant l'intégrité des données.

Documentation :

Documenter le processus d'installation, de configuration et de déploiement des services.

Fournir des instructions pour la maintenance et la mise à jour de l'infrastructure.

---

## Liens

- [[MOC-Projets]] — vue d'ensemble des projets
- [[MOC-Ecole-42]] — contexte pédagogique
- [[MOC-Algorithmique]] — domaine *algorithmique*
- [[MOC-Devops]] — domaine *devops*
- [[MOC-Reseau]] — domaine *reseau*
- [[MOC-Systeme]] — domaine *systeme*
