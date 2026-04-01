# Environnement et scripts

**Dernière mise à jour :** 2026-04-01

## Variables d’environnement (Next)

| Variable | Usage |
|----------|--------|
| `NEXT_PUBLIC_API_URL` | Base URL Strapi pour le build et le rendu serveur ; chargée dans `next.config.ts` (dotenv) pour rewrites et images. |

Défauts dans le code si absent :

- `next.config.ts` : `https://api.fernandgrascalvet.com`
- `app/utils/getApiUrl.ts` (navigateur local) : `http://localhost:1337`
- `app/utils/config.ts` : `http://localhost:1337` (usage ponctuel selon imports)

## Script `start-my-site.ps1`

- Définit `NEXT_PUBLIC_API_URL` et `PUBLIC_URL` vers `https://api.fernandgrascalvet.com`.
- Lance trois fenêtres PowerShell : Strapi (`cmsbackend`), Next (racine), FastAPI (`llm-api` sur port 8000).
- Chemins en dur : `J:\my-next-site\...` — à adapter si le dépôt est déplacé.

## Démarrage manuel

Voir `CONFIGURATION_SITE.md` (ports 3000, 1337, 8000, 11434).

## CORS / proxy

- La route `app/api/proxy/route.js` renvoie `Access-Control-Allow-Origin: *` sur la réponse proxy.
