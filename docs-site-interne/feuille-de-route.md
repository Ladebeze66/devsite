# Feuille de route

**Dernière mise à jour :** 2026-04-01

Document vivant : ajuster les statuts et dates au fil du travail.

## Court terme (prochaines itérations)

| ID | Sujet | Statut | Notes |
|----|--------|--------|--------|
| R1 | Moderniser l’UI (design system, cohérence typo/couleurs) | À faire | S’appuyer sur Tailwind existant |
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
