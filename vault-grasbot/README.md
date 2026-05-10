# Vault GrasBot — Base de connaissances

Vault Obsidian généré par `strapi_extraction/build-vault.py` à partir des
contenus Strapi du site (projets + compétences) et du CV PDF. Alimente
directement le pipeline de recherche de GrasBot (`llm-api/search.py`) :
graph + BM25, sans embeddings.

**Dernière génération :** 2026-04-23 (complété manuellement : +2 projets `source: manual`, maj compétences IA/Web ; **2026-05-10** : compétence `transcription-audio-fgc-transcription` — pyannote + Mistral Small 24b, corpus Strapi aligné dans `strapi_extraction/`)

## Structure

- `00-MOC/` — Maps of Content (hubs thématiques)
- `10-Projets/` — 17 projets Strapi + **6 notes manuelles** (`grasbot.md`, `newsletter-ia.md`, `transcription-video.md`, `fernandgrascalvet-com.md`, `ft-linear-regression.md`, `piscine-python-data-science.md`)
- `20-Competences/` — compétences Strapi extraites par `build-vault.py` **et** note manuelle **`transcription-audio-fgc-transcription.md`** (alignée Strapi / GrasBot, non écrasée tant que `source: manual`)
- `30-Parcours/` — Parcours personnel, CV, bio (version curatée `source: manual`)
- `40-Glossaire/` — Termes techniques (vide, à remplir manuellement ou depuis Strapi plus tard)
- `50-Technique/` — Auto-documentation (architecture, retrieval, vault)
- `TAXONOMIE.md` — Vocabulaire contrôlé (domaines, tags, aliases, answers, priority)

## Conventions

Chaque note porte un frontmatter YAML enrichi :

```yaml
---
title: ...
slug: ...
type: projet | competence | parcours | glossaire | moc | technique
source: strapi/... | pdf/... | manual | vault/generated
domains: [ia, web, systeme, ...]       # taxonomie contrôlée
tags: [tag-1, tag-2]
aliases:                                # synonymes pour le retrieval
  - "alias court"
  - "autre formulation"
answers:                                # questions-types auxquelles répond la note
  - "Question formulée naturellement ?"
priority: 5                             # 1..10, boost léger au scoring
linked: ["[[MOC-...]]"]                 # voisins du graphe (sortants)
related: ["[[autre-note]]"]
route_parent: ia                        # optionnel — voir § URLs des tags GrasBot
site_slug: autre-slug-strapi            # optionnel : dernier segment URL si différent du slug vault (realisation-ia)
updated: YYYY-MM-DD
visibility: public | private            # `private` exclu du retrieval
---
```

### URLs des tags GrasBot (`route_parent`)

L’API (`llm-api/search.py`) ajoute aux **`sources`** une URL relative pour les pilules sous la réponse. Défaut :

| `type` | URL si pas de `route_parent` |
|--------|------------------------------|
| `projet` | `/portfolio/{slug}` |
| `competence` | `/competences/{slug}` |

Le site peut aussi servir **`/competences/[parent]/[slug]`** (réalisations IA sous la compétence **IA**, fiches compétence imbriquées, etc.). Dans ce cas, ajouter dans le frontmatter :

```yaml
route_parent: ia   # segment parent dans l’URL Next (ex. ia → /competences/ia/{slug})
```

Règles : si `route_parent` est défini et **différent** de `slug` → lien **`/competences/{route_parent}/{slug}`** (pour `projet` et `competence`). Si `route_parent == slug`, on évite le doublon et on utilise `/competences/{slug}`.

**Slug Strapi ≠ slug vault** — Les entrées `realisation-ia` utilisent un UID dérivé du **titre** dans Strapi (`slug` admin), souvent différent du fichier vault (`grasbot.md`, slug court pour les wikilinks). Dans ce cas, renseigner **`site_slug`** avec la valeur exacte du champ *slug* Strapi (voir Admin ou `GET /api/realisation-ias`). L’API GrasBot expose alors **`path_slug`** et l’URL utilise ce segment pour le dernier morceau du chemin.

**Audit** — repérer les notes à corriger : corps ou bloc info qui mentionne `realisation-ia` et `[[ia]]`, ou une route documentée sous `/competences/ia/`. Dans `10-Projets/`, les réalisations IA typiques ont `route_parent: ia` (GrasBot, newsletter IA, transcription vidéo). Les projets 42 restent en `/portfolio/...` sans `route_parent`.

Après édition du vault : **`POST /reload-vault`** ou **`.\reload-vault.ps1`** (racine du dépôt).

**Front Next** : `app/utils/grasbotSourceUrl.js` — fallbacks `GRASBOT_ROUTE_PARENT_FALLBACK` et **`GRASBOT_SITE_SLUG_FALLBACK`** (à synchroniser avec Strapi si tu ajoutes des réalisations IA).

Voir `TAXONOMIE.md` pour le vocabulaire contrôlé des domaines/tags et les
règles de rédaction des aliases/answers.

**Règle de régénération** : le script `build-vault.py` **écrase** sans prévenir
les notes dont le frontmatter a `source: strapi/*` ou `source: pdf/*`. Il ne
touche **jamais** aux notes `source: manual` que tu ajoutes toi-même. Les
aliases, answers et priority des notes générées sont calculés automatiquement
à partir du titre, du slug et des domaines ; les notes stratégiques méritent
un enrichissement manuel en passant `source: manual`.

## Fusion avec un vault personnel

Pour agrémenter ce vault avec ton vault Obsidian perso :

1. Copier `vault-grasbot/` dans ton vault existant comme sous-dossier, ou
2. Ouvrir `vault-grasbot/` comme vault séparé dans Obsidian (plus simple pour démarrer).

Les wikilinks `[[nom]]` restent valides tant que les noms de notes sont uniques
dans le vault courant. Les notes `source: manual` que tu crées ne seront jamais
écrasées par une régénération. Pour une note privée qui ne doit pas apparaître
côté chatbot, ajouter `visibility: private` : elle sera exclue de `load_vault()`.
