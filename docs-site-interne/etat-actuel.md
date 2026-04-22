# État actuel du site

**Dernière mise à jour :** 2026-04-22 (post-refonte GrasBot v3)

## Ce qui est en place

- **Next.js 15** avec App Router, Tailwind, pages accueil / portfolio / compétences / contact, layout responsive avec menu burger. Design system "Digital Atelier" (Manrope + Newsreader, palette primary indigo-ardoise, vellum cards).
- **Strapi** avec content-types : homepage, projects, competences, messages, glossaire ; médias et texte riche.
- **Formulaire contact** : POST vers Strapi `messages`.
- **Chatbot GrasBot v3** : FAB global (`GrasBotFab.tsx`) → proxy Next → API LLM hébergée (`llmapi.fernandgrascalvet.com`).
- **FastAPI + Ollama** dans `llm-api/` : modèle `qwen3:8b`, pipeline `search.py` (graph + BM25 sur vault Obsidian `vault-grasbot/`, sans embeddings).
- **Vault de connaissance `vault-grasbot/`** : 41 notes enrichies (aliases, answers, priority) — source de vérité du chatbot, régénéré depuis Strapi par `strapi_extraction/build-vault.py`.
- **Scripts** d'extraction et de doc dans `strapi_extraction/`.
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
