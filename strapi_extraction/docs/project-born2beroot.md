# Born2beroot

**Slug :** `born2beroot`
**Lien GitHub :** [https://github.com/Ladebeze66/born2beroot](https://github.com/Ladebeze66/born2beroot)

---

## Description

Le projet Born2beroot de l'école 42 est une initiation à l’administration système sous Linux. L'objectif est de configurer un serveur sécurisé en installant une machine virtuelle sous Debian ou AlmaLinux, en mettant en place des politiques de sécurité strictes (gestion des utilisateurs, restrictions SSH, pare-feu UFW, Fail2ban) et en utilisant LVM pour la gestion des volumes de stockage. Les étudiants doivent également automatiser la surveillance du système avec un script monitoring.sh. Ce projet développe des compétences en sécurité informatique, gestion des serveurs et DevOps, essentielles pour les métiers d’administrateur système ou de cybersécurité. 

## Détails du projet

Le projet Born2beroot de l’école 42 est un projet d’initiation à l’administration système, conçu pour familiariser les étudiants avec la gestion des serveurs Linux, la sécurisation du système, et les bonnes pratiques DevOps. L’objectif est de comprendre comment un système fonctionne, d’adopter les bonnes pratiques de sécurité et d’automatiser certaines tâches essentielles.

🏆 Objectifs Principaux du Projet

Ce projet vise à initier les étudiants à plusieurs concepts fondamentaux du sysadmin à travers une configuration minimale mais sécurisée d'un serveur basé sur Debian ou AlmaLinux.

1️⃣ Création et Configuration d’une Machine Virtuelle

Installation d’un serveur sur une machine virtuelle (VirtualBox ou UTM selon l’OS utilisé).

Utilisation d’une image Debian (par défaut) ou AlmaLinux.

Apprentissage de la gestion d’un serveur sans interface graphique.

2️⃣ Gestion des Utilisateurs et Sécurisation du Système

Création et gestion des utilisateurs avec une structure bien définie.

Mise en place de règles de mot de passe strictes :

Expiration des mots de passe après un certain temps.

Interdiction de mots de passe trop faibles.

Rotation obligatoire des mots de passe.

Configuration de sudo et groupes restreints pour limiter les accès root.

Restriction des connexions SSH (pas de connexion en tant que root, utilisation de clés SSH).

3️⃣ Renforcement de la Sécurité

Mise en place de UFW (Uncomplicated Firewall) pour filtrer le trafic réseau.
Installation et configuration de Fail2ban pour bloquer les tentatives de connexion frauduleuses.
Activation et gestion de SELinux ou AppArmor pour renforcer la sécurité du noyau.
Restriction des permissions et droits d’accès pour éviter des failles potentielles.

4️⃣ Gestion du Stockage avec LVM (Logical Volume Manager)

Partitionnement intelligent du disque avec LVM pour une gestion flexible de l’espace disque.
Création et gestion de volumes logiques, permettant d’étendre le stockage facilement.

5️⃣ Automatisation et Surveillance du Système

Écriture d’un script de monitoring (monitoring.sh) affichant des informations essentielles :

Charge CPU

Utilisation mémoire et disque

Nombre d’utilisateurs connectés

Journal des connexions SSH

Configuration de cron pour exécuter automatiquement des tâches répétitives.

Gestion des logs et journalisation des événements pour surveiller l’activité du serveur.

🚀 Livrables et Validation du Projet

Une machine virtuelle prête à l’emploi avec tous les éléments configurés.
Un script monitoring.sh fonctionnel.
Une documentation claire expliquant les choix techniques et sécuritaires.
Une défense orale où l’étudiant devra expliquer et démontrer les configurations mises en place.

🎯 Compétences Développées

✔ Gestion des utilisateurs et permissions sur un système Linux.

✔ Configuration et administration d’un serveur Debian.

✔ Mise en place de protocoles de sécurité pour un serveur en production.

✔ Automatisation et surveillance des services via des scripts shell.

✔ Maîtrise de LVM pour gérer dynamiquement l’espace disque.

✔ Apprentissage des bases de DevOps et des bonnes pratiques d’administration système.

🔥 Pourquoi ce projet est important ?

Le projet Born2beroot prépare les étudiants à des postes en administration système et en cybersécurité. Il permet aussi de se familiariser avec les bases du DevOps, un domaine clé dans l’industrie informatique.

🎯 Conclusion

Born2beroot est un projet incontournable de l'école 42 qui permet aux étudiants de plonger dans l'administration système et la sécurisation d’un serveur Linux. C'est une première étape essentielle pour ceux qui souhaitent s'orienter vers les métiers du DevOps, de la cybersécurité ou de l'administration système.

## Informations techniques

- **Langage principal :** C
- **École :** 42 Perpignan
- **Type :** Projet pédagogique
- **Illustrations :** 3 images disponibles
