# Architecture et Navigation - Site Fernand Gras-Calvet

*Documentation générée automatiquement le 15/03/2026 15:26:57*

---

## 🏠 Vue d'ensemble du site

**Site personnel et portfolio** de Fernand Gras-Calvet, étudiant à l'École 42 Perpignan.

### Technologies principales
- **Frontend :** Next.js, React, TypeScript, Tailwind CSS
- **Backend :** Strapi (Headless CMS)
- **Hébergement :** Windows Server 2025 + IIS
- **Base de données :** PostgreSQL/MySQL

## 📄 Structure des pages (7 pages)

| Route | Fichier | Fonctionnalités |
|-------|---------|----------------|
| `/` | app\page.tsx | 📊 Données Strapi, 📝 Formulaire, 📝 Markdown |
| `/admin/messages` | app\admin\messages\page.tsx | Page statique |
| `/competences` | app\competences\page.jsx | 📝 Formulaire, 🎠 Carousel |
| `/competences/[slug]` | app\competences\[slug]\page.tsx | Page statique |
| `/contact` | app\contact\page.js | 📝 Formulaire |
| `/portfolio` | app\portfolio\page.jsx | 📝 Formulaire, 🎠 Carousel |
| `/portfolio/[slug]` | app\portfolio\[slug]\page.tsx | Page statique |

## 🧭 Navigation et expérience utilisateur

### Sections principales
1. **Accueil** (`/`) - Présentation personnelle et CV
2. **Projets** - Portfolio des projets École 42
3. **Compétences** - Domaines d'expertise (IA, Web, 3D, Domotique)
4. **Contact** - Formulaire de contact

### Fonctionnalités interactives
- 🎠 **Carousel d'images** pour présenter les projets
- 📝 **Formulaire de contact** interactif
- 🔍 **Glossaire interactif** avec détection automatique de mots-clés
- 📱 **Design responsive** adaptatif
- ⚡ **Chargement rapide** grâce à Next.js

## 🧩 Composants React (10 composants)

### 📊 Composants connectés à Strapi
- **ContentSection** - Récupère et affiche des données du CMS
- **ContentSectionCompetences** - Récupère et affiche des données du CMS
- **ModalGlossaire** - Récupère et affiche des données du CMS

### 📝 Composants de formulaire
- **Carousel** - Gestion des saisies utilisateur
- **CarouselCompetences** - Gestion des saisies utilisateur
- **ChatBot** - Gestion des saisies utilisateur
- **ContactForm** - Gestion des saisies utilisateur
- **ContentSection** - Gestion des saisies utilisateur
- **ContentSectionCompetences** - Gestion des saisies utilisateur
- **ModalGlossaire** - Gestion des saisies utilisateur

### 🎠 Composants de carousel
- **Carousel** - Affichage rotatif d'images
- **CarouselCompetences** - Affichage rotatif d'images

## 🔧 Utilitaires et helpers (6 fichiers)

### 🌐 Utilitaires API
- **askAI** - Gestion des appels API
- **fetchData** - Gestion des appels API
- **fetchDataCompetences** - Gestion des appels API
- **getApiUrl** - Gestion des appels API
- **sendMessage** - Gestion des appels API

### 📊 Utilitaires de données
- **fetchData** - Traitement des données Strapi
- **fetchDataCompetences** - Traitement des données Strapi

## 🔄 Flux de données

### Architecture Headless CMS
1. **Strapi** (Backend) stocke le contenu
2. **API REST** expose les données (`/api/projects`, `/api/competences`, etc.)
3. **Next.js** (Frontend) récupère et affiche les données
4. **Génération statique** pour les performances

### Endpoints Strapi utilisés
- `/api/homepages?populate=*` - Contenu de la page d'accueil
- `/api/projects?populate=*` - Liste des projets (17 projets)
- `/api/competences?populate=*` - Compétences (4 domaines)
- `/api/messages` - Messages du formulaire de contact

## ⚙️ Configuration et déploiement

- **package.json** - Dependencies: 15, DevDependencies: 7
- **tailwind.config.ts** - Configuration Tailwind CSS
- **tsconfig.json** - Configuration TypeScript
- **web.config** - Configuration IIS pour Windows Server

## 🤖 Guide pour l'assistant IA

### Comment guider les visiteurs
- **Page d'accueil** : Présentation générale, CV, parcours
- **Section Projets** : Portfolio technique, projets École 42
- **Section Compétences** : Expertise IA, développement web, impression 3D, domotique
- **Formulaire de contact** : Pour prendre contact directement

### Phrases d'orientation suggérées
- *"Vous pouvez consulter mes projets dans la section dédiée"*
- *"Ma présentation complète se trouve sur la page d'accueil"*
- *"Pour en savoir plus sur mes compétences en [domaine], consultez la section Compétences"*
- *"N'hésitez pas à me contacter via le formulaire de contact"*

---

*Analyse générée automatiquement - 7 pages, 10 composants, 6 utilitaires analysés*