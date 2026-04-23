# Vault GrasBot — Base de connaissances

Vault Obsidian généré par `strapi_extraction/build-vault.py` à partir des
contenus Strapi du site (projets + compétences) et du CV PDF. Alimente
directement le pipeline de recherche de GrasBot (`llm-api/search.py`) :
graph + BM25, sans embeddings.

**Dernière génération :** 2026-04-23 (complété manuellement : +2 projets `source: manual`, maj compétences IA/Web)

## Structure

- `00-MOC/` — Maps of Content (hubs thématiques)
- `10-Projets/` — 17 projets Strapi + **2 notes manuelles** (`10-Projets/grasbot.md`, `10-Projets/fernandgrascalvet-com.md`)
- `20-Competences/` — 4 compétences extraites de Strapi
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
updated: YYYY-MM-DD
visibility: public | private            # `private` exclu du retrieval
---
```

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
