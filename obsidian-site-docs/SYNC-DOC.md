# Resynchroniser la documentation intégrée

Le dossier `docs-site-interne/` dans **ce coffre** est une **copie** de `my-next-site/docs-site-interne/` (dépôt Git). Les fichiers `CONFIGURATION_SITE.md` et `README-racine-depot.md` à la racine de ce pack sont des copies de la racine du dépôt.

## Quand lancer une resynchro

Après toute **édition** des fichiers dans le dépôt (`docs-site-interne/`, `CONFIGURATION_SITE.md`, `README.md` racine) que tu veux voir **dans l’export Obsidian**.

## Procédure (PowerShell, depuis le clone)

À adapter : lecteur `J:` et chemin du dépôt.

```powershell
$root   = "J:\my-next-site"           # racine du dépôt
$obs    = Join-Path $root "obsidian-site-docs"
$target = Join-Path $obs  "docs-site-interne"

Remove-Item -Path $target -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item -Path (Join-Path $root "docs-site-interne") -Destination $target -Recurse -Force
Copy-Item (Join-Path $root "CONFIGURATION_SITE.md") (Join-Path $obs "CONFIGURATION_SITE.md") -Force
Copy-Item (Join-Path $root "README.md") (Join-Path $obs "README-racine-depot.md") -Force

# Corriger les liens `docs-site-interne/...` pour ce coffre
& (Join-Path $obs "_fix-links-in-docs-copy.ps1")
```

Puis **réapplique** manuellement les ajustements spécifiques du pack (fichier `docs-site-interne/README.md` dans *ce* coffre, section *Relation* / arborescence, liens `SYNC-DOC` et `etat-actuel` si ton script a écrasé des retouches locales) — le plus sûr est de **commiter d’abord** ce dépôt et de refaire seulement les 2–3 liens listés en haut de `docs-site-interne/README.md` d’ici.

## Fichier utilitaire

- `_fix-links-in-docs-copy.ps1` : adapte les chemins après un `Copy-Item` (ne pas lancer sur le dépôt source `docs-site-interne` à la racine du repo, uniquement sur la copie sous `obsidian-site-docs`).
