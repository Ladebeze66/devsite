---
title: fract-ol
slug: fract-ol
type: projet
source: strapi/projects
domains: [algorithmique, domotique, ecole-42, graphique, reseau, systeme]
tags: [concurrence, tri]
aliases:
  - fract ol
  - fract-ol
  - fract_ol
  - algo
  - algorithme
  - algorithmes
  - complexité
  - domotique
  - home assistant
  - iot
  - smart home
  - zigbee
answers:
  - Parle-moi de fract-ol
  - "Qu'est-ce que fract-ol ?"
  - Comment fonctionne fract-ol ?
priority: 5
linked:
  - "[[MOC-Projets]]"
  - "[[MOC-Ecole-42]]"
related:
  - "[[minishell]]"
  - "[[cpp-partie2]]"
  - "[[cub3d]]"
link: "https://github.com/Ladebeze66/fractol"
updated: 2026-04-22
visibility: public
---
**Slug :** `fract-ol`
**Lien GitHub :** [https://github.com/Ladebeze66/fractol](https://github.com/Ladebeze66/fractol)

---

## Description

Le projet fract-ol de l'école 42 consiste à générer et afficher des fractales (Mandelbrot, Julia, etc.) en utilisant la bibliothèque graphique MiniLibX. Il permet d’explorer la programmation graphique en C, la manipulation des nombres complexes, et l’optimisation des calculs pour le rendu d’images. Les utilisateurs peuvent interagir avec les fractales via le clavier et la souris pour zoomer, naviguer et modifier les paramètres en temps réel.

## Détails du projet

Le projet fract-ol de l'École 42 est l'un des premiers projets graphiques du cursus, conçu pour initier les étudiants à la programmation 2D en générant des fractales. Une fractale est une figure géométrique fragmentée qui se répète infiniment à différentes échelles. Ce projet utilise la bibliothèque graphique MiniLibX fournie par l'école. 

🎯 Objectifs du Projet

Manipulation d'une Bibliothèque Graphique Bas-Niveau : Apprendre à utiliser MiniLibX pour créer des fenêtres, gérer les événements clavier et souris, et dessiner des images.

Compréhension des Nombres Complexes : Utiliser les nombres complexes pour calculer et représenter des ensembles fractals tels que Mandelbrot et Julia.

Optimisation des Performances : Améliorer l'efficacité du rendu graphique, notamment en explorant l'utilisation de threads pour le calcul parallèle.

🛠️ Spécifications Techniques

Fractales à Générer :

Ensemble de Mandelbrot : Défini par l'itération de la fonction 
𝑧𝑛+1=𝑧𝑛2+𝑐z n+1​=z n2​+c, où 𝑧z et 𝑐c sont des nombres complexes.

Ensemble de Julia : Similaire à Mandelbrot, mais avec une constante 𝑐c fixe et des valeurs initiales 𝑧z variant selon les pixels.

Ensemble Burning Ship : Variante de Mandelbrot utilisant la valeur absolue des parties réelle et imaginaire de 𝑧z à chaque itération.

Fonctionnalités du Programme :

Zoom et Déplacement : Permettre à l'utilisateur de zoomer et de se déplacer dans la fractale pour explorer différents niveaux de détail.

Modification des Paramètres : Changer dynamiquement les paramètres de la fractale, comme les constantes complexes pour l'ensemble de Julia.

Changement de Palette de Couleurs : Offrir différentes palettes pour améliorer la visualisation des fractales.

Contrôles Utilisateur :

Souris : Zoom avant/arrière avec la molette, déplacement en cliquant et en faisant glisser.

Clavier : Touches pour déplacer la vue, ajuster le niveau de zoom, modifier les paramètres de la fractale et changer les couleurs.

🔧 Approche d'Implémentation

Initialisation de MiniLibX :

Créer une fenêtre et initialiser une image pour le rendu des fractales.

Calcul des Fractales :

Pour chaque pixel de l'image, convertir les coordonnées en un nombre complexe.

Appliquer l'itération de la fonction fractale correspondante.

Déterminer la couleur du pixel en fonction du nombre d'itérations avant que la valeur ne diverge au-delà d'un seuil fixé.

Gestion des Entrées Utilisateur :

Implémenter des gestionnaires d'événements pour les entrées clavier et souris afin de permettre l'interaction en temps réel avec la fractale.

Optimisation :

Utiliser des techniques telles que le calcul en parallèle avec des threads pour améliorer la performance du rendu, surtout lors de zooms profonds nécessitant plus d'itérations.

Bibliothèques :

MiniLibX : Bibliothèque graphique utilisée pour le rendu et la gestion des entrées.
pthread : Bibliothèque pour la gestion des threads, si l'optimisation parallèle est implémentée.

🧪 Tests et Validation

Tests Fonctionnels :

Vérifier que chaque type de fractale est correctement généré et affiché.

Tester les fonctionnalités d'interaction utilisateur, comme le zoom, le déplacement et la modification des paramètres.

Tests de Performance :

Évaluer le temps de rendu pour différentes tailles de fenêtre et profondeurs de zoom.

Tester l'efficacité des optimisations, notamment l'utilisation de threads pour le calcul parallèle.

Tests de Robustesse :

Assurer la stabilité du programme lors d'entrées utilisateur rapides ou inattendues.

Vérifier la gestion appropriée des erreurs, comme des valeurs de paramètres invalides.

---

## Liens

- [[MOC-Projets]] — vue d'ensemble des projets
- [[MOC-Ecole-42]] — contexte pédagogique
- [[MOC-Algorithmique]] — domaine *algorithmique*
- [[MOC-Domotique]] — domaine *domotique*
- [[MOC-Graphique]] — domaine *graphique*
- [[MOC-Reseau]] — domaine *reseau*
- [[MOC-Systeme]] — domaine *systeme*
