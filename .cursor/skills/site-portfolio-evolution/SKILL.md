---
name: site-portfolio-evolution
description: Workflow pour evoluer le site portfolio (Next/Strapi) avec doc interne, captures et Git. Utiliser pour changements front, UI ou architecture du depot.
---

# Evolution du site portfolio

## Sources

- Doc interne : `docs-site-interne/`
- Operationnel : `CONFIGURATION_SITE.md`
- Visuel : `docs-site-interne/captures/` et `captures/INDEX.md`

## Sequence

1. **Reflexion** — Objectif, routes, fichiers. Si impact visuel : noter les IDs dans `captures/INDEX.md`.
2. **Choix** — Changement minimal, coherent avec l'existant.
3. **Modification** — Pas d'elargissement de scope implicite.
4. **Validation** — Test local des pages touchees.
5. **Si probleme** — `git restore` / retour branche propre.
6. **Si OK** — Mettre a jour `docs-site-interne` (fichiers concernes), `feuille-de-route.md` ou `etat-actuel.md` si besoin, puis **captures** pour les sections modifiees.

## Regles

- Petites mises a jour doc apres chaque lot utile.
- Pas de donnees sensibles sur captures admin (flouter).
- Preferer WebP dans `captures/`.