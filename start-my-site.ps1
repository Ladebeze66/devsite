# Script de démarrage du portfolio — lance les 3 services dans des fenêtres PowerShell séparées.
#
# Pendant inverse : stop-my-site.ps1 (arrête proprement les services par port).
#
# Services lancés :
#   - Strapi (CMS)        → port 1337 → cmsbackend/ (npm run develop)
#   - Next.js (site)      → port 3000 → racine      (npm run dev)
#   - FastAPI (GrasBot)   → port 8000 → llm-api/    (uvicorn api:app)
#
# Variables d'environnement propagées aux sous-shells :
#   - NEXT_PUBLIC_API_URL / PUBLIC_URL = https://api.fernandgrascalvet.com
#
# Vérifications automatiques :
#   - Si un port est déjà occupé, on ne relance pas le service concerné
#     (évite l'erreur "address already in use" et le doublon de fenêtre).
#   - Si Start-Process échoue, on continue avec les autres services et on
#     consigne l'échec dans le bilan final.
#
# Portabilité :
#   - $PSScriptRoot résout la racine du repo à partir du script → pas de chemin
#     codé en dur. Le script marche donc même si le repo est cloné ailleurs.
#
# Usage :
#   PS > .\start-my-site.ps1

$root = $PSScriptRoot
$apiUrl = "https://api.fernandgrascalvet.com"

$services = @(
    @{
        Nom      = "Strapi (CMS)"
        Port     = 1337
        Cwd      = Join-Path $root "cmsbackend"
        Commande = "`$env:PUBLIC_URL='$apiUrl'; npm run develop"
    },
    @{
        Nom      = "Next.js (site)"
        Port     = 3000
        Cwd      = $root
        Commande = "`$env:NEXT_PUBLIC_API_URL='$apiUrl'; npm run dev"
    },
    @{
        Nom      = "FastAPI (GrasBot)"
        Port     = 8000
        Cwd      = Join-Path $root "llm-api"
        Commande = "uvicorn api:app --host 0.0.0.0 --port 8000"
    }
)

Write-Host "🚀 Démarrage des services du portfolio..." -ForegroundColor Green
Write-Host "   API URL : $apiUrl" -ForegroundColor Cyan
Write-Host ""

$lances = 0
$dejaActifs = 0
$echecs = 0

foreach ($s in $services) {
    # Si le port est déjà écouté, le service tourne sans doute déjà — on saute.
    $existing = Get-NetTCPConnection -LocalPort $s.Port -State Listen -ErrorAction SilentlyContinue
    if ($existing) {
        Write-Host "  ⚪ $($s.Nom) — port $($s.Port) déjà occupé, pas de relance" -ForegroundColor Gray
        $dejaActifs++
        continue
    }

    try {
        Write-Host "  🔵 $($s.Nom) — port $($s.Port) → $($s.Cwd)" -ForegroundColor Cyan

        # Construction de la commande passée au sous-shell : on se place dans
        # le bon répertoire, puis on lance la commande du service. -NoExit
        # laisse la fenêtre ouverte même si la commande se termine (utile pour
        # voir le message d'erreur si un service crashe au démarrage).
        $fullCommand = "Set-Location -LiteralPath '$($s.Cwd)'; $($s.Commande)"
        Start-Process powershell `
            -ArgumentList @('-NoExit', '-Command', $fullCommand) `
            -WindowStyle Normal `
            -ErrorAction Stop

        Write-Host "     ✅ lancé" -ForegroundColor Green
        $lances++

        # Petite respiration entre les services pour étaler la charge CPU au
        # boot (Strapi et Next sont tous deux gourmands au premier démarrage).
        Start-Sleep -Milliseconds 800
    } catch {
        Write-Host "     ⚠️  impossible de lancer : $($_.Exception.Message)" -ForegroundColor Red
        $echecs++
    }
}

Write-Host ""
Write-Host "── Bilan ─────────────────────────────" -ForegroundColor Cyan
Write-Host "  Services lancés : $lances" -ForegroundColor Green
Write-Host "  Déjà actifs     : $dejaActifs" -ForegroundColor Gray
if ($echecs -gt 0) {
    Write-Host "  Échecs          : $echecs" -ForegroundColor Red
}

if ($lances -gt 0 -or $dejaActifs -ge $services.Count) {
    Write-Host ""
    Write-Host "🌐 Site accessible sur : http://localhost:3000" -ForegroundColor Cyan
    Write-Host "   (attendre ~15 s que Strapi et Next soient prêts au premier lancement)" -ForegroundColor Gray
}
