# Documentation interne du site

**Dernière mise à jour :** 2026-05-10

Ce dossier décrit l'architecture, le fonctionnement et les décisions du projet (Next.js + Strapi + FastAPI/Ollama). Il est destiné à l'équipe et à l'assistant IA pour retrouver vite le contexte.

## Relation avec les autres fichiers

| Fichier / zone | Rôle |
|----------------|------|
| `README.md` (racine du dépôt) | Panorama GitHub, liens vers cette doc, démarrage rapide, `reload-vault`. |
| `CONFIGURATION_SITE.md` (racine) | Guide opérationnel : ports, commandes, dépannage, planificateur de tâches Windows. |
| Coffre Obsidian (optionnel, hors dépôt) | Copie locale de la doc pour lecture hors ligne ; pas de dossier `obsidian-site-docs/` versionné à la racine. |
| Ce dossier | Conception : flux de données, schémas CMS, incohérences connues, feuille de route. |

**Règle de maintenance :** après une modification notable, mettre à jour le fichier concerné ici ; si le démarrage ou les ports changent, compléter aussi `CONFIGURATION_SITE.md`.

## Index des documents

| Fichier | Contenu |
|---------|---------|
| [01-architecture.md](./01-architecture.md) | Services, ports, flux. |
| [02-frontend-next.md](./02-frontend-next.md) | App Router, routes, fetch Strapi. |
| [03-cms-strapi.md](./03-cms-strapi.md) | Content-types Strapi. |
| [04-api-llm-et-chatbot.md](./04-api-llm-et-chatbot.md) | FastAPI, Ollama, GrasBot. |
| [05-environnement-scripts.md](./05-environnement-scripts.md) | Env, scripts PowerShell. |
| [06-strapi-extraction.md](./06-strapi-extraction.md) | Outils `strapi_extraction/`. |
| [07-reference-visuelle-captures.md](./07-reference-visuelle-captures.md) | Référence visuelle ; dossier `captures/`. |
| [08-vault-obsidian-retrieval.md](./08-vault-obsidian-retrieval.md) | Vault GrasBot + pipeline de retrieval graph + BM25 (v3, sans embeddings). |
| [captures/INDEX.md](./captures/INDEX.md) | Inventaire des captures WebP (noms réels, slugs, priorités). |
| [etat-actuel.md](./etat-actuel.md) | État et dette technique. |
| [feuille-de-route.md](./feuille-de-route.md) | Backlog priorisé. |
| [REFONTE-VISUELLE.md](./REFONTE-VISUELLE.md) | Journal de bord de la refonte UI Stitch. |
| [contact-flow.md](./contact-flow.md) | Contact : e-mail Brevo (remplacement du stockage Strapi). |
| [langfuse-observability.md](./langfuse-observability.md) | Langfuse : traces GrasBot, tuning pipeline. |

## Arborescence utile

```
my-next-site/
├── app/
├── cmsbackend/
├── llm-api/
├── strapi_extraction/
├── start-my-site.ps1
├── stop-my-site.ps1
├── next.config.ts
├── CONFIGURATION_SITE.md
└── docs-site-interne/
    ├── captures/          # screenshots de référence (voir INDEX.md)
    └── ...
```

**Workflow d’évolution (doc + captures + Git) :** skill Cursor `.cursor/skills/site-portfolio-evolution/SKILL.md`.

## Reprise d’une session de travail

Pour enchaîner après une pause : lire `feuille-de-route.md` (priorités), `etat-actuel.md`, puis `captures/INDEX.md` si le travail touche l’UI. Le skill `site-portfolio-evolution` rappelle la boucle modification → validation → mise à jour doc.
