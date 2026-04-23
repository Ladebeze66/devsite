---
title: "Piscine Python — Data Science"
slug: piscine-python-data-science
type: projet
source: manual
domains: [ia, ecole-42, algorithmique]
tags: [42-piscine, data-ia]
aliases:
  - piscine python
  - python piscine
  - piscine data science
  - piscine python 42
  - piscine data
  - python 42
  - data science 42
  - numpy pandas 42
answers:
  - "Qu'est-ce que la Piscine Python de 42 ?"
  - "Parle-moi de la Piscine Python Data Science."
  - "Comment s'est-il formé à Python et à la data ?"
  - "Qu'a-t-il appris en Python à l'École 42 ?"
  - "A-t-il travaillé avec NumPy et pandas ?"
priority: 6
linked:
  - "[[MOC-Projets]]"
  - "[[MOC-Ecole-42]]"
  - "[[MOC-Ia]]"
related:
  - "[[ft-linear-regression]]"
  - "[[ia]]"
updated: 2026-04-23
visibility: public
---

# Piscine Python — Data Science

> [!info] Contexte
> Sprint d'apprentissage intensif de la branche **Data Science / IA** à l'École 42,
> structuré en **5 modules (Python 0 à 4)**. Complément naturel du projet
> [[ft-linear-regression]] et socle pratique pour les travaux IA décrits dans
> [[ia]] et [[grasbot]].

## Objectif

Bâtir la **boîte à outils Python** d'un futur spécialiste Data / IA, en
privilégiant la compréhension des **paradigmes** plutôt que la simple
collection de syntaxes. Chaque module est une piscine courte : exercices
quotidiens, correction par les pairs, rythme soutenu.

## Les 5 modules

### Python 0 — Starting

Bases du langage : variables, structures de contrôle, fonctions, listes /
tuples / sets / dictionnaires, compréhensions, fichiers, exceptions,
`argparse`. Règles strictes de la Piscine : **Python 3.10 obligatoire**,
imports explicites, pas de variables globales, fonctions qui ne plantent
jamais, tests écrits par l'étudiant.

### Python 1 — Array

Programmation vectorisée avec **NumPy** : création et manipulation
d'arrays multidimensionnels, slicing avancé, **broadcasting**, fonctions
universelles (`ufunc`), opérations matricielles. Apprentissage du réflexe
*« remplacer une boucle Python par une opération vectorielle »* — fondamental
pour la performance en ML.

### Python 2 — DataTable

Manipulation de **DataFrames** avec **pandas** : chargement CSV / Excel,
sélection par index / label, `groupby`, `merge` / `join`, pivots,
nettoyage de données, détection de valeurs manquantes et aberrantes,
statistiques descriptives (`describe()`, quantiles). Le module charnière
pour les projets de régression et d'analyse.

### Python 3 — Object-Oriented Programming

Programmation orientée objet : classes, héritage, composition,
encapsulation, méthodes spéciales (`__init__`, `__repr__`, `__eq__`…),
polymorphisme. Introduction aux design patterns utiles en data science :
modélisation de datasets comme objets, classes de modèles avec méthodes
`fit` / `predict` (préparation à **scikit-learn**).

### Python 4 — Data Oriented Design

Changement de perspective : **DOD** (*Data Oriented Design*) — organiser
le code autour des **données** et de leur accès mémoire plutôt qu'autour
d'objets. *Cache-friendliness*, *structure of arrays* vs *array of
structures*, profilage basique. Un pont entre Python de haut niveau et les
contraintes de performance qu'on retrouvera en deep learning (PyTorch /
TensorFlow) ou en traitement de gros volumes.

## Compétences mobilisées

- **Python moderne** : idiomes 3.10+, typage, gestion d'erreurs robuste.
- **NumPy** : vectorisation, broadcasting, algèbre linéaire appliquée.
- **pandas** : nettoyage, agrégation, transformation de données tabulaires.
- **POO Python** : architecture de classes, héritage, méthodes spéciales.
- **Rigueur École 42** : tests écrits, code sans crash, peer-evaluation,
  respect strict des contraintes de rendu.

## Valeur pour la suite

Cette Piscine est le **socle pratique** de tous les projets Data / IA qui
suivent. [[ft-linear-regression]] (régression linéaire par descente de
gradient), les expérimentations LLM / agents locaux et la manipulation des
jeux de données côté chatbot ([[grasbot]]) reposent **directement** sur
les acquis de ces 5 modules.

---

## Liens

- [[MOC-Projets]] — hub projets
- [[MOC-Ecole-42]] — contexte pédagogique
- [[MOC-Ia]] — domaine *ia*
- [[ft-linear-regression]] — premier projet Data / IA 42 après cette piscine
- [[ia]] — compétence IA (fiche)
