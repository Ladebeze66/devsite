# philosopher

**Slug :** `philosopher`
**Lien GitHub :** [https://github.com/Ladebeze66/philosophers](https://github.com/Ladebeze66/philosophers)

---

## Description

Le projet Philosopher de l'école 42 consiste à résoudre le problème des philosophes mangeurs, un exercice classique de programmation concurrente. Il met en œuvre des threads ou processus pour simuler des philosophes partageant des fourchettes et alternant entre les états manger, penser et dormir, tout en évitant les problèmes de deadlock et starvation. Ce projet permet d’apprendre la gestion des threads (pthread), l’utilisation des mutex et sémaphores, ainsi que la synchronisation des ressources partagées.

## Détails du projet

Le projet Philosopher de l'École 42 est une implémentation du célèbre problème des philosophes mangeurs (ou Dining Philosophers Problem), conçu pour introduire les étudiants aux concepts fondamentaux de la programmation concurrente. Ce problème illustre les défis liés à la synchronisation et à la gestion des ressources partagées entre processus ou threads.

🎯 Objectifs du Projet

Compréhension de la Programmation Concurrente : Apprendre à gérer l'exécution simultanée de plusieurs threads ou processus au sein d'un programme.

Gestion des Ressources Partagées : Mettre en place des mécanismes pour synchroniser l'accès à des ressources communes, évitant ainsi les conditions de course et les blocages.

Utilisation des Mutex et Sémaphores : Implémenter des solutions utilisant des mutex et des sémaphores pour contrôler l'accès aux ressources partagées et assurer la synchronisation entre threads ou processus.

🛠️ Spécifications Techniques (Suite)

Contraintes (Suite) :
Le programme doit éviter les situations de deadlock (blocage mutuel) où aucun philosophe ne peut progresser.

Il doit également prévenir les situations de starvation où un philosophe ne peut jamais accéder aux fourchettes nécessaires pour manger.

Les actions des philosophes (prendre une fourchette, manger, dormir, penser) doivent être affichées avec un horodatage pour suivre l'évolution de la simulation.

🔧 Approche d'Implémentation

1️⃣ Gestion des Threads et Synchronisation

Chaque philosophe est représenté par un thread.

Les fourchettes sont partagées et représentées par des mutex (pour la version multi-threads) ou sémaphores (pour la version multi-processus).

Chaque philosophe tente d’acquérir les deux fourchettes adjacentes avant de commencer à manger.

2️⃣ Éviter les Problèmes de Concurrence

Pour éviter un deadlock, une approche classique consiste à :
Faire en sorte que le dernier philosophe prenne d’abord la fourchette droite, puis la gauche (contrairement aux autres).

Utiliser un sémaphore global pour limiter le nombre de philosophes mangeant simultanément.

Pour éviter la starvation, on s’assure qu’aucun philosophe ne reste bloqué indéfiniment sans accès aux fourchettes.

3️⃣ Gestion des États et Horodatage

Chaque action est enregistrée avec un timestamp.

Un thread de surveillance peut être utilisé pour vérifier si un philosophe n’a pas mangé depuis trop longtemps et signaler sa mort si nécessaire.

🧪 Tests et Validation

Tests Fonctionnels :

Vérifier que les philosophes prennent correctement les fourchettes et alternent entre les états.
Observer si la simulation empêche les deadlocks et starvation.

Tests de Performance :

Exécuter avec un nombre élevé de philosophes pour tester la stabilité et l’efficacité du programme.

Cas Limites :

Philosophe unique (peut-il manger ?).

Temps à mourir très court.

Vérification des performances avec un grand nombre de philosophes.

🚀 Pourquoi ce projet est important ?

Le projet Philosopher est une introduction essentielle aux problèmes de concurrence en informatique. Il enseigne la gestion des threads et processus, la synchronisation avec mutex et sémaphores, et l’optimisation des ressources partagées. Ces concepts sont fondamentaux pour le développement système, les bases de données et le multithreading en programmation avancée.

## Informations techniques

- **Langage principal :** C
- **École :** 42 Perpignan
- **Type :** Projet pédagogique
- **Illustrations :** 7 images disponibles
