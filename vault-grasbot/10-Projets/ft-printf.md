---
title: Ft-printf
slug: ft-printf
type: projet
source: strapi/projects
domains: [c, ecole-42, reseau]
tags: [makefile]
aliases:
  - ft printf
  - ft-printf
  - ft_printf
  - langage c
  - ansi c
  - c 42
  - 42
  - école 42
  - 42 perpignan
  - 42 paris
  - piscine 42
  - tronc commun
answers:
  - Parle-moi de Ft-printf
  - "Qu'est-ce que Ft-printf ?"
  - Comment fonctionne Ft-printf ?
priority: 5
linked:
  - "[[MOC-Projets]]"
  - "[[MOC-Ecole-42]]"
related:
  - "[[cpp-partie1]]"
  - "[[cpp-partie2]]"
  - "[[get-next-line]]"
link: "https://github.com/Ladebeze66/printf"
updated: 2026-04-22
visibility: public
---
**Slug :** `ft-printf`
**Lien GitHub :** [https://github.com/Ladebeze66/printf](https://github.com/Ladebeze66/printf)

---

## Description

Le projet ft_printf de l'école 42 consiste à reproduire la fonction printf du langage C. Il permet aux étudiants de comprendre la manipulation des chaînes de formatage, et l'affichage de différents types de données (%d, %s, %p, %x…). L’objectif est d’implémenter une fonction efficace, sans utiliser printf, en travaillant directement avec write. Ce projet développe des compétences essentielles en programmation bas niveau, gestion mémoire et optimisation du code C.

## Détails du projet

Le projet ft_printf de l'École 42 consiste à recréer la fonction printf du langage C. Cette fonction permet d'afficher des chaînes de caractères formatées et est essentielle en programmation système et développement logiciel. Ce projet développe des compétences avancées en C, notamment la gestion des arguments variables, la manipulation des chaînes de formatage et l’utilisation de fonctions bas niveau comme write.

🏆 Objectifs du Projet

Comprendre le fonctionnement de printf et ses spécificateurs.

Travailler avec les bases numériques (décimal, hexadécimal, etc.).

Optimiser la gestion de la mémoire et l’affichage de caractères en C.

🛠️ Spécifications Techniques

Fonctionnalités Requises : ft_printf doit gérer les conversions suivantes :

%c → Caractère unique

%s → Chaîne de caractères

%p → Pointeur (adresse mémoire)

%d / %i → Entier signé

%u → Entier non signé

%x / %X → Hexadécimal (minuscule/majuscule)

%% → Affichage du symbole %

Gestion des Paramètres Variables :

Retour de la Fonction :

ft_printf doit retourner le nombre total de caractères affichés, comme la version standard.

🔧 Approche d’Implémentation

Lecture de la Chaîne de Formatage → Identifier les spécificateurs (%).

Affichage des Caractères avec write → Pas de printf autorisé.

Retour du Nombre de Caractères Affichés → Compteur à incrémenter.

📂 Structure du Projet

ft_printf.c → Fonction principale et parsing des arguments.

ft_printf.h → Prototypes et #include nécessaires.

Fichiers auxiliaires :

ft_putchar_pf.c → Affiche un caractère.

ft_putstr_pf.c → Affiche une chaîne.

ft_putnbr_pf.c → Affiche un entier.

ft_puthex_pf.c → Affiche un nombre en hexadécimal.

ft_putptr_pf.c → Affiche une adresse mémoire.

Makefile → Automatisation de la compilation.

🧪 Tests et Validation

Comparaison avec printf standard.

Tests unitaires pour chaque spécificateur.

Gestion des cas limites : valeurs nulles, chaînes vides, grands nombres, etc.

🚀 Pourquoi ce projet est important ?

ft_printf permet de développer des compétences clés en C, en apprenant à manipuler des arguments 
variadiques et en travaillant sur un projet bas niveau essentiel en programmation système et logicielle.

---

## Liens

- [[MOC-Projets]] — vue d'ensemble des projets
- [[MOC-Ecole-42]] — contexte pédagogique
- [[MOC-C]] — domaine *c*
- [[MOC-Reseau]] — domaine *reseau*
