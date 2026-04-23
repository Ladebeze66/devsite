# Documentation interne du site

**Dernière mise à jour :** 2026-04-24

> **Dans le pack Obsidian** — Même contenu que le dépôt `my-next-site/docs-site-interne/`. Fichiers à la racine de ce coffre : [CONFIGURATION_SITE.md](../CONFIGURATION_SITE.md) · [00 Hub.md](../00%20Hub.md) · [SYNC-DOC.md](../SYNC-DOC.md) · [README-racine-depot.md](../README-racine-depot.md).

Ce dossier décrit l'architecture, le fonctionnement et les décisions du projet (Next.js + Strapi + FastAPI/Ollama). Il est destiné à l'équipe et à l'assistant IA pour retrouver vite le contexte.

## Relation avec les autres fichiers

| Fichier / zone | Rôle |
|----------------|------|
| [README-racine-depot.md](../README-racine-depot.md) | Panorama GitHub (copie du `README` racine du dépôt). |
| [CONFIGURATION_SITE.md](../CONFIGURATION_SITE.md) | Guide opérationnel : ports, commandes, dépannage, planificateur de tâches Windows. |
| Dossier parent [obsidian-site-docs/](../) | Pack Obsidian (commandes, hub, ce module doc). |
| Ce dossier (`docs-site-interne/`) | Conception : flux de données, schémas CMS, incohérences connues, feuille de route. |

**Règle de maintenance :** éditer d’abord le **dépôt** Git, puis [resynchroniser ce dossier](../SYNC-DOC.md) ; si les ports changent, mettre à jour [CONFIGURATION_SITE.md](../CONFIGURATION_SITE.md).

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
├── obsidian-site-docs/    # pack Obsidian (optionnel)
└── docs-site-interne/
    ├── captures/          # screenshots de référence (voir INDEX.md)
    └── ...
```

**Workflow d’évolution (doc + captures + Git) :** skill Cursor `.cursor/skills/site-portfolio-evolution/SKILL.md`.

## Reprise d’une session de travail

Pour enchaîner après une pause : lire `feuille-de-route.md` (priorités), `etat-actuel.md`, puis `captures/INDEX.md` si le travail touche l’UI. Le skill `site-portfolio-evolution` rappelle la boucle modification → validation → mise à jour doc.
