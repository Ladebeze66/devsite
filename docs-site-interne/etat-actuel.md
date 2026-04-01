# État actuel du site

**Dernière mise à jour :** 2026-04-01

## Ce qui est en place

- **Next.js 15** avec App Router, Tailwind, pages accueil / portfolio / compétences / contact, layout responsive avec menu burger.
- **Strapi** avec content-types : homepage, projects, competences, messages, glossaire ; médias et texte riche.
- **Formulaire contact** : POST vers Strapi `messages`.
- **Chatbot GrasBot** : proxy Next vers API LLM hébergée (`llmapi.fernandgrascalvet.com`).
- **FastAPI + Ollama** dans le dépôt pour usage local ou serveur ; modèle `mistral` dans `llm-api/api.py`.
- **Scripts** d’extraction et de doc dans `strapi_extraction/`.
- Documentation opérationnelle : `CONFIGURATION_SITE.md`.
- **Captures d'écran** de référence (WebP) : `docs-site-interne/captures/` — voir `captures/INDEX.md`.

## Dette technique / incohérences connues

- Mélange **TypeScript** et **JavaScript** (`.jsx`, `.js`) dans `app/`.
- **`RootLayout` en client component** : tout le layout est côté client ; pas de Server Component racine pour le shell.
- **URLs Strapi** : logique répartie entre `getApiUrl`, `next.config.ts`, `config.ts` — risque de confusion ; à documenter dans les changements futurs.
- **Proxy LLM** : URL de production codée en dur dans `app/api/proxy/route.js` ; pas d’alignement automatique avec `llm-api` local.
- Champ Strapi **`Resum`** sur `project` : casse atypique ; attention dans le mapping front.
- **`start-my-site.ps1`** : chemins absolus `J:\my-next-site` — non portables.

## Non vérifié dans cette passe

- Permissions Strapi (public create sur `messages`, etc.).
- Comportement exact des rewrites Next vs route `app/api/proxy` (ordre de résolution).
- Tests automatisés : présence à confirmer.
