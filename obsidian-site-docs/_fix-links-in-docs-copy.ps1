# One-shot: adapte les chemins docs-site-interne/ dans la copie Obsidian
$ErrorActionPreference = "Stop"
$base = Join-Path $PSScriptRoot "docs-site-interne"
if (-not (Test-Path $base)) { throw "Dossier introuvable: $base" }

Get-ChildItem -Path $base -Recurse -Filter *.md | ForEach-Object {
  # README.md (racine de docs-site-interne) : contient une arborescence en bloc de code
  # avec le nom du dossier — ne pas y appliquer le remplacement global.
  if ($_.Name -eq "README.md" -and $_.DirectoryName -eq (Resolve-Path $base).Path) {
    return
  }
  $isUnderCaptures = $_.FullName -like "*\captures\*" -or $_.DirectoryName -like "*\captures"
  $c = [System.IO.File]::ReadAllText($_.FullName)
  if ($isUnderCaptures) {
    $c = $c -replace "docs-site-interne/REFONTE-VISUELLE", "../REFONTE-VISUELLE"
    $c = $c -replace "docs-site-interne/contact-flow", "../contact-flow"
    $c = $c -replace "docs-site-interne/08-vault-obsidian-retrieval", "../08-vault-obsidian-retrieval"
    $c = $c -replace "docs-site-interne/captures/", ""
    $c = $c -replace "docs-site-interne/", "../"
  } else {
    $c = $c -replace "docs-site-interne/", ""
  }
  $utf8 = New-Object System.Text.UTF8Encoding $false
  [System.IO.File]::WriteAllText($_.FullName, $c, $utf8)
}
Write-Host "OK: liens ajustes dans $base"
