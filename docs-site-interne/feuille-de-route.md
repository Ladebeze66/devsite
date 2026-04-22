# Feuille de route

**Dernière mise à jour :** 2026-04-22

Document vivant : ajuster les statuts et dates au fil du travail.

## Court terme (prochaines itérations)

| ID | Sujet | Statut | Notes |
|----|--------|--------|--------|
| R1 | Moderniser l’UI (design system, cohérence typo/couleurs) | En cours | Direction "Digital Atelier" inspirée de `stitch_V1/` ; cadrage et plan dans [`REFONTE-VISUELLE.md`](./REFONTE-VISUELLE.md). Étapes 1-4 (tokens + garde-fou + migration typo globale + layout racine) faites le 2026-04-22. |
| R2 | Homogénéiser TS vs JS dans `app/` | À faire | Migrer progressivement les `.jsx`/`.js` |
| R3 | Centraliser config API (Strapi + LLM) via `.env` | À faire | Remplacer URLs en dur où pertinent |
| R4 | Revoir `layout.tsx` (server vs client, perf SEO) | À faire | Évaluer extraction header/footer |

## Moyen terme

| ID | Sujet | Statut | Notes |
|----|--------|--------|--------|
| M1 | Tests (e2e ou smoke sur routes critiques) | À faire | |
| M2 | Accessibilité (navigation, contrastes, focus) | À faire | |
| M3 | Performance (images Next/Image, bundle) | À faire | |

## Long terme / idées

| ID | Sujet | Statut | Notes |
|----|--------|--------|--------|
| L1 | CI/CD ou script de déploiement documenté | À faire | |
| L2 | Monitoring / logs centralisés | À faire | |

## Historique des jalons

| Date | Jalon |
|------|--------|
| 2026-04-01 | Création du dossier `docs-site-interne/` et première rédaction basée sur le code. |
| 2026-04-01 | Reprise après coupure : vérification complétude ; enrichissement de `04-api-llm-et-chatbot.md` ; suppression de `test.txt`. |
| 2026-04-01 | Index captures (`captures/INDEX.md`), `captures/README.md`, `07-reference-visuelle-captures.md`, skill `.cursor/skills/site-portfolio-evolution/SKILL.md`. |
| 2026-04-01 | Captures WebP intégrées au dépôt ; INDEX et README `captures/` alignés sur les noms réels (slug portfolio / compétence documentés). |
| 2026-04-22 | Audit visuel complet (`captures/AUDIT-VISUEL.md`), correctifs layout (option 1 + compensation header + drawer mobile). |
| 2026-04-22 | Refonte visuelle "Digital Atelier" — étape 1 (tokens Tailwind : palette Stitch, `font-headline` Manrope + `font-body` Newsreader, `rounded-sheet/tile`, `shadow-ambient/jewel`) et étape 2 (garde-fou + plan dans [`REFONTE-VISUELLE.md`](./REFONTE-VISUELLE.md)). |
| 2026-04-22 | Refonte visuelle — étape 3 : migration typographique globale. Toutes les classes `font-orbitron-*` (12 définitions CSS, 29 occurrences dans 11 fichiers) remplacées par `font-headline` Manrope + tailles/poids Tailwind explicites. Import Google Fonts Orbitron supprimé de `app/assets/main.css`. |
| 2026-04-22 | Refonte visuelle — correctif post-étape 3 : régression de couleurs texte entre desktop/mobile. Retrait du `@media (prefers-color-scheme: dark)` hérité du template Next (incohérent avec l'arbitrage "light-only"), `--foreground` fixé à `#191c1d` (on-surface Stitch), `body` avec couleur non-dépendante du thème système. 3 classes Tailwind invalides `text-black-500/700` remplacées par `text-gray-700` (`app/layout.tsx`, `app/page.tsx`, `app/components/ContentSectionCompetences.tsx`). |
| 2026-04-22 | Refonte visuelle — étape 4 : layout racine. Header "No-Line" (bordure pleine supprimée, `shadow-ambient-sm` + `backdrop-blur-vellum`, titre en `text-primary`). Burger refait en ghost button (Material Symbols `menu`/`close` au lieu des caractères `☰`/`✕`). Cercles animés repeints en `bg-primary/40` + `bg-primary-container/30`. Drawer mobile en `bg-primary/90 backdrop-blur-vellum` + liens éditoriaux (`bg-primary-container/60` → hover `bg-primary-fixed text-primary`). Bug préexistant **corrigé** : `NavLink` ignorait `className` et `onClick` fournis par le drawer mobile → refait avec support `className` / `onClick` / `activeClassName` / `inactiveClassName`, comportement desktop historique préservé. Compteur de visites migré de `layout.tsx` (bloc orphelin `absolute bottom-0 right-0`) vers `Footer.jsx` (ligne discrète `text-[10px] uppercase tracking-[0.3em]`). Nettoyage : state `visitCount` + useEffect déplacés, `div.max-w-5xl` vide retirée, state `count` inutilisé retiré de `Footer.jsx`. |
| 2026-04-22 | Refonte visuelle — correctif urgent `ModalGlossaire` (blocage mobile signalé sur Samsung S25 Ultra). `w-[114vw] max-w-6xl h-[72vh]` → `w-full max-w-4xl max-h-[90vh]` + `overflow-y-auto`. Fermeture ajoutée sur tap-voile et `Escape`. Bouton fermeture rond 40 px Material Symbol `close`. Alignement palette Stitch (`bg-on-surface/75`, `bg-surface-container-lowest/95`, `rounded-sheet`, `text-primary`, description `font-body` Newsreader). `"use client"` + `role="dialog" aria-modal` ajoutés. |
