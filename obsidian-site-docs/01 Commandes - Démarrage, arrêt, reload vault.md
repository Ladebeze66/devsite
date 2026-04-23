# Commandes — Démarrage, arrêt, reload vault

> Chemins d’exemple : adapte le lecteur (ex. `J:`) et le nom du dossier du clone. La racine du dépôt = celui qui contient `package.json` et `start-my-site.ps1`.

## Démarrage automatique (recommandé)

Dans un PowerShell, **depuis la racine du dépôt** :

```powershell
Set-Location "J:\my-next-site"   # à adapter
.\start-my-site.ps1
```

Lance en général **trois** fenêtres : Strapi (`cmsbackend`), Next (racine), FastAPI (`llm-api`).

**Arrêt ciblé** (ports 3000, 1337, 8000) :

```powershell
Set-Location "J:\my-next-site"   # à adapter
.\stop-my-site.ps1
```

> Les détails (ports déjà pris, UTF-8 BOM, etc.) : voir le fichier `CONFIGURATION_SITE.md` à la racine du dépôt.

## Démarrage manuel (un terminal par service)

**Next.js** (port 3000) :

```powershell
Set-Location "J:\my-next-site"
npm run dev
```

**Strapi** (port 1337) :

```powershell
Set-Location "J:\my-next-site\cmsbackend"
npm run develop
```

**FastAPI + GrasBot** (port 8000) :

```powershell
Set-Location "J:\my-next-site\llm-api"
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

- Santé : `GET http://localhost:8000/health`
- Question test : `GET http://localhost:8000/ask?q=bonjour`

## Recharger le vault GrasBot (cache API)

Après **édition** de fichiers dans `vault-grasbot/`, sans redémarrer uvicorn :

Sous **Windows PowerShell**, préfère toujours (idempotent, pas d’alias trompeur) :

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:8000/reload-vault"
```

**Piège :** dans PowerShell, `curl` est un **alias** de `Invoke-WebRequest`, pas le binaire GNU. La forme `curl -X POST …` **échoue** avec *« Impossible de trouver un paramètre correspondant au nom « X » »*.

Si tu veux le vrai curl (souvent présent sur Windows 10+) :

```powershell
curl.exe -X POST http://localhost:8000/reload-vault
```

Sous **bash** (Git Bash, WSL, Linux, macOS) :

```bash
curl -X POST http://localhost:8000/reload-vault
```

Si l’API tourne ailleurs, remplace l’hôte/port.

**Ollama** (modèle LLM) : service séparé, en pratique sur le **port 11434** en local. Voir [[02 Ports et URLs]].

## Voir aussi

- [[00 Hub]]
- [[03 Documentation intégrée (dépôt)]]
- [04-api-llm-et-chatbot.md](docs-site-interne/04-api-llm-et-chatbot.md) — API GrasBot (implémentation : dossier `llm-api/` du dépôt).
