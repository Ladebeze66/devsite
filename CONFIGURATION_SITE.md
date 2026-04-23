# Configuration du Site Web - Documentation Complète

## 📋 Vue d'ensemble

Ce site utilise une architecture full-stack moderne avec :
- **Frontend** : Next.js avec TypeScript et Tailwind CSS
- **Backend CMS** : Strapi 
- **API IA** : FastAPI avec intégration Ollama
- **Démarrage automatique** : Planificateur de tâches Windows

## 🏗️ Architecture

```
my-next-site/
├── app/                    # Application Next.js
├── cmsbackend/            # Backend Strapi
├── llm-api/               # API FastAPI pour IA
├── start-my-site.ps1      # Script de démarrage
├── stop-my-site.ps1       # Script d'arrêt propre
└── package.json           # Dépendances frontend
```

## 🚀 Démarrage Rapide

### Script Automatique (Recommandé)
```powershell
cd J:\my-next-site
.\start-my-site.ps1
```

Ce script lance automatiquement les 3 services dans des fenêtres PowerShell séparées.

**Améliorations :**
- Configuration centralisée via un tableau `$services` (plus de duplication entre les 3 blocs).
- **Détection du port déjà occupé** : si un service tourne déjà, il n'est pas relancé (évite `EADDRINUSE`).
- **Portabilité** : chemins résolus via `$PSScriptRoot`, pas de `J:\my-next-site` codé en dur.
- **`-NoExit`** sur chaque fenêtre : le message d'erreur reste visible si un service crashe au démarrage.
- **Bilan final** : nombre de services lancés / déjà actifs / échecs.

### Arrêt des services
```powershell
cd J:\my-next-site
.\stop-my-site.ps1
```

Termine les processus qui écoutent les ports **1337** (Strapi), **3000** (Next.js) et **8000** (FastAPI). Ne touche pas aux autres processus Node de ta machine. Les fenêtres PowerShell lancées par `start-my-site.ps1` restent ouvertes (à fermer manuellement). En cas d'échec sur certains PIDs → relancer dans un PowerShell admin.

> Note encodage : les deux scripts PowerShell sont encodés en **UTF-8 avec BOM**. C'est nécessaire pour que Windows PowerShell 5.1 (version par défaut) les lise correctement avec les emojis et accents. PowerShell 7 n'a pas ce souci mais reste compatible avec le BOM.

## 🔧 Commandes Manuelles

### 1. Frontend Next.js
```powershell
cd J:\my-next-site
npm run dev
```
- **URL** : http://localhost:3000
- **Mode** : Développement avec Turbopack
- **Rechargement** : Automatique

### 2. Backend Strapi (CMS)
```powershell
cd J:\my-next-site\cmsbackend
npm run develop
```
- **Interface Admin** : http://localhost:1337/admin
- **API** : http://localhost:1337/api
- **Mode** : Développement

### 3. API FastAPI (IA)
```powershell
cd J:\my-next-site\llm-api
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```
- **API** : http://localhost:8000
- **Endpoint IA** : http://localhost:8000/ask?q=votre_question
- **Documentation** : http://localhost:8000/docs

## 📊 Ports Utilisés

| Service | Port | URL |
|---------|------|-----|
| Next.js | 3000 | http://localhost:3000 |
| Strapi | 1337 | http://localhost:1337 |
| FastAPI | 8000 | http://localhost:8000 |
| Ollama | 11434 | http://localhost:11434 |

## 🔄 Démarrage Automatique

### Configuration Actuelle
- **Méthode** : Planificateur de tâches Windows
- **Nom de la tâche** : "Lancement site web dino"
- **État** : Ready (Prêt)

### Gestion de la Tâche Planifiée

#### Voir les détails
```powershell
Get-ScheduledTask -TaskName "Lancement site web dino" | Get-ScheduledTaskInfo
```

#### Démarrer manuellement
```powershell
Start-ScheduledTask -TaskName "Lancement site web dino"
```

#### Arrêter la tâche
```powershell
Stop-ScheduledTask -TaskName "Lancement site web dino"
```

#### Désactiver/Réactiver
```powershell
# Désactiver
Disable-ScheduledTask -TaskName "Lancement site web dino"

# Réactiver
Enable-ScheduledTask -TaskName "Lancement site web dino"
```

#### Interface Graphique
```
Win + R → taskschd.msc
```
Cherchez "Lancement site web dino" dans la liste.

## 🛠️ Dépannage

### Arrêter Tous les Processus
```powershell
# Arrêter Node.js
taskkill /f /im node.exe

# Arrêter Python/FastAPI
taskkill /f /im python.exe
```

### Nettoyer les Caches
```powershell
# Cache Next.js
cd J:\my-next-site
Remove-Item .next -Recurse -Force -ErrorAction SilentlyContinue

# Cache Strapi
cd J:\my-next-site\cmsbackend
Remove-Item .cache -Recurse -Force -ErrorAction SilentlyContinue
```

### Réinstaller les Dépendances
```powershell
# Frontend
cd J:\my-next-site
npm install

# Backend Strapi
cd J:\my-next-site\cmsbackend
npm install

# API Python (si environnement virtuel)
cd J:\my-next-site\llm-api
pip install fastapi uvicorn[standard] requests
```

## 🐍 Configuration Python/FastAPI

### Dépendances Requises
```txt
fastapi==0.115.8
uvicorn[standard]==0.38.0
requests==2.32.3
```

### Problèmes Courants
- **Erreur uvicorn** : Vérifiez l'installation avec `pip show uvicorn`
- **Port occupé** : Changez le port dans le script ou tuez le processus
- **Ollama non disponible** : Vérifiez que Ollama fonctionne sur le port 11434

### Installation Propre (Recommandée)
```powershell
cd J:\my-next-site\llm-api
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn[standard] requests
```

## 📝 Scripts Disponibles

### Frontend (package.json)
```json
{
  "dev": "next dev --turbopack",
  "build": "next build", 
  "start": "next start",
  "lint": "next lint"
}
```

### Backend Strapi (cmsbackend/package.json)
```json
{
  "develop": "strapi develop",
  "build": "strapi build",
  "start": "strapi start"
}
```

## 🔍 Vérifications de Santé

### Vérifier que tous les services fonctionnent
```powershell
# Next.js
curl http://localhost:3000

# Strapi
curl http://localhost:1337/admin

# FastAPI
curl http://localhost:8000/docs

# Ollama
curl http://localhost:11434/api/generate
```

### Vérifier les processus actifs
```powershell
# Processus Node.js
Get-Process node -ErrorAction SilentlyContinue

# Processus Python
Get-Process python -ErrorAction SilentlyContinue
```

## 🌐 Configuration Réseau

### Accès Externe
Si vous voulez accéder au site depuis d'autres machines :
- **Next.js** : Modifier `next.config.ts` pour accepter les connexions externes
- **Strapi** : Configurer `config/server.ts`
- **FastAPI** : Déjà configuré avec `--host 0.0.0.0`

### Pare-feu Windows
Assurez-vous que les ports sont ouverts :
```powershell
# Ouvrir les ports dans le pare-feu
New-NetFirewallRule -DisplayName "Next.js" -Direction Inbound -Port 3000 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Strapi" -Direction Inbound -Port 1337 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "FastAPI" -Direction Inbound -Port 8000 -Protocol TCP -Action Allow
```

## 📚 Ressources Utiles

- **Next.js Documentation** : https://nextjs.org/docs
- **Strapi Documentation** : https://docs.strapi.io
- **FastAPI Documentation** : https://fastapi.tiangolo.com
- **Ollama Documentation** : https://ollama.ai/docs

## 🔧 Maintenance

### Mise à jour des dépendances
```powershell
# Frontend
cd J:\my-next-site
npm update

# Backend
cd J:\my-next-site\cmsbackend
npm update

# Python packages
pip list --outdated
pip install --upgrade package_name
```

### Sauvegarde
Pensez à sauvegarder régulièrement :
- Base de données Strapi (`cmsbackend/database/`)
- Configuration (`cmsbackend/config/`)
- Assets (`app/assets/`)

---

**Dernière mise à jour** : $(Get-Date -Format "dd/MM/yyyy HH:mm")
**Version Cursor** : 2.0.77
**OS** : Windows Server 2025
