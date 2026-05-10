# Outils `strapi_extraction/`

**Dernière mise à jour :** 2026-05-10

Dossier de **scripts Node + Python** pour extraire, nettoyer et convertir les
données issues de l'API Strapi en base de connaissance chatbot (hors runtime
du site).

Synchroniser le champ Strapi avec **`strapi_extraction/docs/competence-transcription-audio-fgc-transcription.md`** (sections *Présentation → En bref*, même source que `competences-clean.json`).

## Pipeline complet

```
API Strapi
   │
   ▼
extract-api-data.js   →  extract/raw/*.json
   │
   ▼
clean-api-data.js     →  extract/clean-data/*.json
   │
   ▼
generate-docs.js      →  docs/*.md
   │
   ▼
build-vault.py        →  vault-grasbot/  (Obsidian structuré + aliases/answers/priority)
                         │
                         ▼
                      GrasBot le lit directement (plus d'étape d'indexation)
```

Depuis avril 2026 (v3 du pipeline GrasBot), **il n'y a plus d'étape
`index_vault.py`**. Le vault Obsidian est la seule source de vérité : il
est lu directement par `llm-api/search.py` au démarrage de l'API.

## Scripts

| Fichier | Rôle |
|---------|------|
| `extract-api-data.js` | **Node**. Fetch des endpoints Strapi → JSON brut (`extract/raw/`). |
| `clean-api-data.js` | **Node**. Nettoyage / normalisation (`extract/clean-data/`). |
| `generate-docs.js` | **Node**. Génération de `.md` par entrée Strapi (`docs/`). |
| `build-vault.py` | **Python**. Lit `docs/` + PDF CV → vault Obsidian (`vault-grasbot/`) avec frontmatter enrichi (aliases, answers, priority). |
| `update-documentation.js` | **Node**. MAJ incrémentale de la doc. |
| `analyse-site-architecture.js` | **Node**. Analyse d'architecture du site. |

## Commande type

```powershell
# Depuis la racine du repo
node strapi_extraction/extract-api-data.js
node strapi_extraction/clean-api-data.js
node strapi_extraction/generate-docs.js
python strapi_extraction/build-vault.py
# (plus d'étape d'indexation — GrasBot lit le vault directement)

# Si GrasBot tourne déjà, recharger le vault sans redémarrer uvicorn :
curl -X POST http://localhost:8000/reload-vault
```

## Données générées

- `strapi_extraction/extract/raw/*.json` — données Strapi brutes.
- `strapi_extraction/extract/clean-data/*.json` — données nettoyées.
- `strapi_extraction/docs/*.md` — documentation Markdown.
- `strapi_extraction/docs/generation-summary.json` — résumé de génération.
- `vault-grasbot/**/*.md` — vault Obsidian consommé par le retrieval GrasBot.

Ces fichiers peuvent être **régénérés** à tout moment ; ne pas les considérer
comme source de vérité sans comparer au CMS.

## Fragilités actuelles

1. **`clean-api-data.js` n'a pas de cleaner `homepages`** : du coup
   `generate-docs.js` ne produit jamais `00-homepage.md`. Conséquence :
   le CV de la page d'accueil n'arrive pas dans `vault-grasbot/30-Parcours/`
   via la chaîne automatique (il y est aujourd'hui via le PDF séparé
   `nouveauCV_grascalvet.pdf`).
2. **`glossaire` n'est extrait ni nettoyé** : endpoint absent de la liste
   `ENDPOINTS` dans `extract-api-data.js`, cleaner absent aussi. Le dossier
   `vault-grasbot/40-Glossaire/` reste vide tant que ce n'est pas réparé.
3. **Accès Strapi v5 flat** : les scripts accèdent en direct à `project.name`,
   `project.Resum`, etc. Si on repasse à une configuration v4 ou "populated
   with wrapper", il faudra rebrancher en `project.attributes.name`.

Ces points seront corrigés en même temps que l'enrichissement du vault
(glossaire + homepage Strapi → notes `40-Glossaire/` et `30-Parcours/`).

## Sync médias WebP (hors pipeline GrasBot)

Dossier **`strapi_extraction/media-sync/`** — inventaire des fichiers image liés aux
content-types (`projects`, `competences`, `homepages`, `realisation-ias`, `glossaires`),
téléchargement classé par rubrique, conversion WebP (sharp), puis ré-upload optionnel.

Documentation : voir `strapi_extraction/media-sync/README.md`.  
Sortie lourde (ignorée Git) : `strapi_extraction/extract/media-sync-work/`.

## Liens complémentaires

- Vault + retrieval : [`08-vault-obsidian-retrieval.md`](./08-vault-obsidian-retrieval.md)
- API LLM : [`04-api-llm-et-chatbot.md`](./04-api-llm-et-chatbot.md)
- Schémas Strapi : [`03-cms-strapi.md`](./03-cms-strapi.md)
- Performances images (audit) : [`09-performances-images.md`](./09-performances-images.md)
