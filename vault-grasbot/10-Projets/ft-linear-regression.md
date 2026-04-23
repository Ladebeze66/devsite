---
title: "ft_linear_regression"
slug: ft-linear-regression
type: projet
source: manual
domains: [ia, ecole-42, algorithmique]
tags: [data-ia]
aliases:
  - ft linear regression
  - ft_linear_regression
  - ft-linear-regression
  - régression linéaire
  - linear regression
  - descente de gradient
  - régression 42
  - premier projet ia 42
  - régression linéaire from scratch
answers:
  - "Qu'est-ce que ft_linear_regression ?"
  - "Parle-moi de ft_linear_regression."
  - "Comment a-t-il implémenté une régression linéaire ?"
  - "Quel est le premier projet Data / IA à l'École 42 ?"
  - "A-t-il codé une descente de gradient ?"
priority: 6
linked:
  - "[[MOC-Projets]]"
  - "[[MOC-Ecole-42]]"
  - "[[MOC-Ia]]"
related:
  - "[[piscine-python-data-science]]"
  - "[[ia]]"
  - "[[grasbot]]"
updated: 2026-04-23
visibility: public
---

# ft_linear_regression

> [!info] Contexte
> **Premier projet de la branche Data Science / IA de l'École 42**, enchaîné
> après la [[piscine-python-data-science|Piscine Python — Data Science]].
> Socle mathématique pour les travaux IA côté [[ia]] et [[grasbot]].

## Résumé

Implémenter **from scratch** un algorithme de **régression linéaire simple**
entraînée par **descente de gradient**, sans utiliser de fonction toute
faite (`numpy.polyfit`, `sklearn.LinearRegression`, etc.). L'exercice
force à comprendre les **fondations mathématiques du machine learning**
avant de manipuler les bibliothèques de haut niveau.

## Objectifs pédagogiques

- Découvrir les concepts fondamentaux du ML : **hypothèse**, **fonction de
  coût**, **paramètres**, **convergence**.
- Implémenter la **descente de gradient** à la main, avec mise à jour
  simultanée de θ₀ (biais) et θ₁ (pente) via des variables temporaires
  pour éviter un couplage entre les deux mises à jour.
- Comprendre le rôle du **learning rate** : un pas trop grand fait osciller
  l'algorithme, un pas trop petit le ralentit artificiellement.
- Travailler la **préparation des données** : détection des valeurs
  aberrantes via l'**IQR** (*Interquartile Range*), gestion des valeurs
  manquantes, **normalisation min-max** pour que la descente converge
  malgré des échelles différentes (kilométrages en milliers, prix en
  dizaines de milliers).

## Stack technique

| Outil | Rôle |
|-------|------|
| **Python 3** | Langage principal |
| **pandas** | Chargement et exploration du CSV (`describe()`, quartiles, détection d'aberrants) |
| **NumPy** | Calculs vectoriels pour la descente de gradient |
| **Matplotlib + Seaborn** | Visualisation du nuage de points et de la droite de régression |
| **scikit-learn** | **Uniquement** pour les métriques d'évaluation (`mean_squared_error`, `r2_score`), pas pour l'entraînement |
| **Tkinter** | Interface graphique native : saisie d'un kilométrage, affichage du prix estimé en temps réel |

## Architecture du code

Modules thématiques dans `src/` :

- `data_process.py` — chargement, nettoyage, normalisation du dataset.
- `cost_function.py` — fonction de coût *Mean Squared Error* :
  `J(θ₀, θ₁) = (1 / 2m) · Σ(hθ(x) − y)²`.
- `gradient_descent.py` — boucle d'entraînement (mise à jour simultanée
  des paramètres).
- `training_model.py` — orchestration de l'entraînement + sauvegarde des
  paramètres optimaux.
- `prediction.py` — rechargement des paramètres pour prédire sur une
  nouvelle entrée.
- `evaluate_model.py` — calcul MSE + R² pour mesurer la qualité du modèle.
- `visualization.py` — tracé du nuage de points + droite de régression.
- `gui.py` — interface Tkinter (bonus).

## Parties bonus réalisées

- **Graphe** du nuage de points avec droite de régression superposée.
- **Mesure de précision** via MSE et **coefficient de détermination R²**
  (proche de 1 → modèle pertinent, proche de 0 → modèle inutile, négatif
  → pire qu'une moyenne).
- **Interface graphique utilisateur** (Tkinter).

## Compétences mobilisées

- **Mathématiques appliquées** : dérivées partielles, minimisation d'une
  fonction de coût, interprétation géométrique d'une régression.
- **Programmation scientifique Python** : vectorisation NumPy, DataFrames
  pandas, patterns de préparation de données.
- **Visualisation de données** : IQR, distribution, scatter plot —
  comprendre ses données avant de modéliser.
- **Évaluation de modèle** : différence entre *loss* d'entraînement et
  métriques de qualité, interprétation du R².

## Valeur pour la suite

Ce projet constitue la **base intellectuelle** de tout ce qui suit en IA.
Comprendre ce qui se passe sous `model.fit(X, y)` change radicalement la
manière d'aborder les bibliothèques de haut niveau (scikit-learn,
PyTorch, TensorFlow) et d'interpréter les comportements inattendus d'un
modèle (non-convergence, explosion du learning rate, overfitting).

---

## Liens

- [[MOC-Projets]] — hub projets
- [[MOC-Ecole-42]] — contexte pédagogique
- [[MOC-Ia]] — domaine *ia*
- [[piscine-python-data-science]] — pré-requis pratique
- [[ia]] — compétence IA (fiche)
- [[grasbot]] — projet IA appliqué au portfolio
