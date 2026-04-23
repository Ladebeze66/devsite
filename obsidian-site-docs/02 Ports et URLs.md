# Ports et URLs

| Service | Port usuel | URL locale typique | Rôle |
|---------|------------|--------------------|------|
| Next.js | 3000 | http://localhost:3000 | Site public, App Router |
| Strapi | 1337 | http://localhost:1337/admin | CMS, API `/api` |
| FastAPI (GrasBot) | 8000 | http://localhost:8000 | `/ask`, `/health`, `/reload-vault` |
| Ollama | 11434 | http://localhost:11434 | Inférence LLM |

## Production (rappel)

- API Strapi publique (ex.) : `https://api.fernandgrascalvet.com`
- API LLM hébergée (proxy Next) : `llmapi.fernandgrascalvet.com` — le front en prod appelle souvent celle-là via `app/api/proxy`, pas `localhost:8000`.

Le navigateur en **dev** pointe le CMS selon `getApiUrl` (souvent `localhost:1337` en local).

## Voir aussi

- [[00 Hub]]
- [[01 Commandes - Démarrage, arrêt, reload vault]]
