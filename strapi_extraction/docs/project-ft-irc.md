# ft-irc

**Slug :** `ft-irc`
**Lien GitHub :** [https://github.com/Ladebeze66/ft_irc](https://github.com/Ladebeze66/ft_irc)

---

## Description

Le projet ft_irc de l'école 42 consiste à coder un serveur IRC (Internet Relay Chat) en C++, conforme à la RFC 2812. Il permet de gérer plusieurs connexions clients, d'implémenter des commandes IRC (JOIN, PART, PRIVMSG, NICK, etc.), de gérer des canaux de discussion, et d’assurer l’authentification des utilisateurs. Ce projet développe des compétences en programmation réseau, gestion des sockets et protocoles de communication.

## Détails du projet

Le projet ft_irc de l'école 42 consiste à développer un serveur IRC (Internet Relay Chat) en C++, conforme à la spécification RFC 2812. L'objectif est de comprendre les mécanismes des sockets et de la communication réseau en temps réel.

🎯 Objectifs du Projet

Gestion des Connexions Client : Permettre à plusieurs clients de se connecter simultanément au serveur via des sockets.

Implémentation des Commandes IRC : Supporter les commandes essentielles telles que JOIN, PART, PRIVMSG, NICK, et USER.

Gestion des Canaux : Permettre la création, la gestion et la suppression de canaux de discussion, avec des fonctionnalités comme les modes de canal et la liste des utilisateurs.

Authentification des Utilisateurs : Gérer l'enregistrement et l'authentification des utilisateurs, y compris la gestion des pseudonymes (nicks) et des mots de passe.

Gestion des Messages Privés et de Groupe : Assurer la transmission de messages privés entre utilisateurs et de messages de groupe au sein des canaux.

🛠️ Spécifications Techniques

Langage de Programmation : C++.

Protocoles : Utilisation du protocole TCP pour les communications réseau, conformément à la spécification IRC.

Conformité RFC : Le serveur doit être conforme à la RFC 2812, qui définit le protocole IRC.

Gestion des Sockets : Utilisation des sockets pour gérer les connexions réseau entrantes et sortantes.

Multi-threading : Gestion des connexions multiples, soit par multi-threading, soit par une approche asynchrone, pour permettre à plusieurs clients de se connecter simultanément.

🔧 Approche d'Implémentation

Initialisation du Serveur :

Création d'un socket serveur et liaison à un port spécifié.

Mise en place de l'écoute des connexions entrantes.

Gestion des Connexions Client :

Acceptation des nouvelles connexions et création de structures pour gérer chaque client connecté.

Gestion des entrées/sorties pour chaque client, en assurant la réception et l'envoi de messages.

Parsage et Traitement des Commandes :

Analyse des messages reçus des clients pour identifier les commandes IRC.

Exécution des commandes appropriées, telles que la connexion à un canal (JOIN), l'envoi de messages (PRIVMSG), ou le changement de pseudonyme (NICK).

Gestion des Canaux :

Création et suppression de canaux en fonction des besoins.

Gestion des listes d'utilisateurs pour chaque canal et des modes de canal (par exemple, canaux privés, protégés par mot de passe).

Authentification et Gestion des Utilisateurs :

Vérification des informations d'identification des utilisateurs lors de la connexion.

Gestion des conflits de pseudonymes et assurance de l'unicité des noms d'utilisateur sur le serveur.

Envoi de Messages :

Routage des messages privés directement aux destinataires concernés.

Diffusion des messages de canal à tous les membres du canal concerné.

## Informations techniques

- **Langage principal :** C
- **École :** 42 Perpignan
- **Type :** Projet pédagogique
- **Illustrations :** 7 images disponibles
