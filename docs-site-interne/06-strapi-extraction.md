# Outils `strapi_extraction/`

**Dernière mise à jour :** 2026-04-01

Dossier de **scripts Node** pour extraire, nettoyer et documenter les données issues de l’API Strapi (hors runtime du site).

## Scripts repérés

| Fichier | Rôle probable |
|---------|----------------|
| `extract-api-data.js` | Extraction brute vers JSON (`extract/raw/`). |
| `clean-api-data.js` | Nettoyage / normalisation (`extract/clean-data/`). |
| `generate-docs.js` | Génération de documentation à partir des données. |
| `update-documentation.js` | Mise à jour de la doc générée. |
| `analyse-site-architecture.js` | Analyse d’architecture du site. |

## Données générées (exemples)

- `extract/raw/*.json`, `extract/clean-data/*.json`
- `logs/last-update-summary.json`, `docs/generation-summary.json`

Ces fichiers peuvent être **régénérés** ; ne pas les considérer comme source de vérité sans comparer au CMS.

## Usage

Lancer depuis la racine ou le dossier selon les chemins dans chaque script (à vérifier avant exécution). Détails : lire l’en-tête de chaque fichier `.js`.
