---
title: "Structure du vault GrasBot"
slug: vault-structure
type: technique
source: manual
domains: [ia]
tags: [obsidian, vault, moc, taxonomie]
aliases:
  - structure du vault
  - organisation du vault
  - vault obsidian
  - structure de la base de connaissance
answers:
  - "Comment est organisé le vault ?"
  - "Quelle est la structure de la base de connaissance ?"
  - "Où sont stockées les notes ?"
priority: 6
linked:
  - "[[MOC-Ia]]"
  - "[[architecture-site]]"
  - "[[grasbot-retrieval]]"
updated: 2026-04-22
visibility: public
---

# Structure du vault GrasBot

Le vault `vault-grasbot/` est la base de connaissance du chatbot. Il est
conçu pour être ouvert directement dans Obsidian (comme vault séparé, ou
fusionné avec un vault perso existant) et pour alimenter le pipeline de
retrieval décrit dans [[grasbot-retrieval]].

## Arborescence

- **`00-MOC/`** — *Maps of Content*, hubs thématiques qui recensent les
  notes d'un domaine. Générés automatiquement par `build-vault.py`.
- **`10-Projets/`** — une note par projet Strapi (École 42 +
  projets perso). Source : `source: strapi/projects`.
- **`20-Competences/`** — une note par compétence Strapi (IA, Web,
  Impression 3D, Domotique). Source : `source: strapi/competences`.
- **`30-Parcours/`** — CV, bio, étapes du parcours. La version curatée
  `cv-grascalvet-fernand.md` est protégée (`source: manual`).
- **`40-Glossaire/`** — termes techniques référencés par les fiches
  compétences (réservé pour quand le content-type `glossaire` sera
  ajouté au script d'extraction).
- **`50-Technique/`** — auto-documentation : [[architecture-site]],
  [[grasbot-retrieval]], [[vault-structure]] (cette note). Permet à
  GrasBot de répondre aux questions *« comment es-tu fait ? »*.
- **`README.md`** — résumé utilisateur (généré).
- **`TAXONOMIE.md`** — vocabulaire contrôlé pour domaines, tags, aliases,
  answers, priority. **À éditer manuellement** avant tout changement de
  vocabulaire structurant.

## Frontmatter YAML

Chaque note porte une en-tête structurée :

```yaml
---
title: "push_swap"
slug: push-swap
type: projet                   # projet | competence | parcours | moc | technique
source: strapi/projects        # strapi/... | pdf/... | manual | vault/generated
domains: [algorithmique, c, ecole-42]
tags: [42-commun, tri, makefile]
aliases:
  - push swap
  - push_swap
  - algo de tri 42
answers:
  - "Parle-moi de push-swap"
  - "Comment fonctionne push-swap ?"
priority: 5                    # 1..10, boost léger au scoring
linked:
  - "[[MOC-Projets]]"
related:
  - "[[minishell]]"
updated: 2026-04-22
visibility: public             # public | private
---
```

### Signification des champs pour le retrieval

Ces champs sont **exploités directement** par `llm-api/search.py` :

| Champ | Usage |
|---|---|
| `aliases` | Synonymes forts (matchés avant tout). **+10 au score** par hit. |
| `answers` | Questions-types ; si overlap ≥ 3 tokens, **+12 au score**. |
| `domains` | Domaines contrôlés. **+5 par match strict** de token. |
| `tags` | Tags libres. **+3 par match strict**. |
| `priority` | 1-10. Boost léger (0.3 × (priority − 5)) si déjà scoré. |
| `linked` / `related` | Voisins du graphe, activés par `expand_by_graph()`. |
| `visibility` | Si `private`, la note est **exclue** du retrieval. |

## Règles de régénération

`strapi_extraction/build-vault.py` **écrase** les notes dont le frontmatter
a `source: strapi/*` ou `source: pdf/*`. Il **ne touche jamais** aux notes
`source: manual`. Sécurité simple pour pouvoir enrichir le vault à la main
sans craindre qu'un rebuild efface le travail.

Le script génère automatiquement :

- `aliases` depuis le slug + le titre + les domaines (via `DOMAIN_ALIASES`).
- `answers` adaptés au type de note (projet, compétence, MOC, parcours).
- `priority` par défaut (5 pour projets, 7 pour MOCs/compétences, 10 pour CV).

Pour **enrichir davantage** une note stratégique (comme le CV ou la fiche IA),
passer son frontmatter en `source: manual` et ajouter à la main des aliases /
answers plus précis.

## Agrémentation avec un vault perso

Deux approches :

1. **Vault séparé (recommandé)** : on ouvre `vault-grasbot/` comme vault
   Obsidian indépendant. Le chatbot n'indexe que ce qui s'y trouve ;
   le vault perso reste privé.
2. **Fusion** : on copie `vault-grasbot/` comme sous-dossier d'un vault
   existant. Les wikilinks restent valides tant que les noms sont uniques.
   Attention à placer les notes perso avec `source: manual` (évite
   l'écrasement) et `visibility: private` (exclue du retrieval automatique).

## Évolutions prévues

- Extraction du content-type `glossaire` Strapi dans `40-Glossaire/`.
- Fix du cleaner `homepages` dans `clean-api-data.js`.
- Enrichissement manuel progressif des aliases/answers pour les compétences
  phares (IA, domotique, 3D) — la génération auto est une base, pas un
  optimum.
