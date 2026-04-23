# Script inverse de start-my-site.ps1 — arrête proprement les 3 services du portfolio.
#
# Stratégie : on identifie le processus qui écoute chaque port attendu, puis on
# le termine. C'est plus sûr que `Stop-Process -Name node` qui tuerait TOUS les
# node.exe de la machine (y compris d'autres projets que tu aurais ouverts).
#
# Ports surveillés :
#   - 1337  → Strapi (CMS)
#   - 3000  → Next.js (site)
#   - 8000  → FastAPI / uvicorn (GrasBot LLM)
#
# Ce script ne ferme PAS les fenêtres PowerShell elles-mêmes : elles restent
# ouvertes avec un prompt une fois le processus enfant terminé. Tu peux les
# fermer manuellement ou ajouter un alias "exit" dans ton profil PowerShell.
#
# Usage :
#   PS > .\stop-my-site.ps1

$services = @(
    @{ Nom = "Strapi (CMS)";      Port = 1337 },
    @{ Nom = "Next.js (site)";    Port = 3000 },
    @{ Nom = "FastAPI (GrasBot)"; Port = 8000 }
)

Write-Host "🛑 Arrêt des services du portfolio..." -ForegroundColor Yellow
Write-Host ""

$arretes = 0
$nonTrouves = 0
$echecs = 0

foreach ($s in $services) {
    # -ErrorAction SilentlyContinue : Get-NetTCPConnection lève une erreur
    # bruyante si aucun processus n'écoute le port. On préfère gérer nous-mêmes.
    $conn = Get-NetTCPConnection -LocalPort $s.Port -State Listen -ErrorAction SilentlyContinue

    if ($null -eq $conn) {
        Write-Host "  ⚪ $($s.Nom) — port $($s.Port) libre, rien à arrêter" -ForegroundColor Gray
        $nonTrouves++
        continue
    }

    # Un même processus peut exposer le port en IPv4 et IPv6 (2 lignes, même PID).
    $procIds = $conn | Select-Object -ExpandProperty OwningProcess -Unique

    foreach ($procId in $procIds) {
        try {
            $proc = Get-Process -Id $procId -ErrorAction Stop
            Write-Host "  🔴 $($s.Nom) — port $($s.Port) → PID $procId ($($proc.ProcessName))" -ForegroundColor Red
            Stop-Process -Id $procId -Force -ErrorAction Stop
            Write-Host "     ✅ arrêté" -ForegroundColor Green
            $arretes++
        } catch {
            Write-Host "     ⚠️  impossible d'arrêter le PID $procId : $($_.Exception.Message)" -ForegroundColor Yellow
            $echecs++
        }
    }
}

Write-Host ""
Write-Host "── Bilan ─────────────────────────────" -ForegroundColor Cyan
Write-Host "  Services arrêtés : $arretes" -ForegroundColor Green
Write-Host "  Déjà libres       : $nonTrouves" -ForegroundColor Gray
if ($echecs -gt 0) {
    Write-Host "  Échecs            : $echecs" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Échecs possibles : droits administrateur requis pour tuer certains processus." -ForegroundColor Yellow
    Write-Host "   Relance le script dans un PowerShell admin si besoin." -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "✅ Tous les services ciblés ont été traités." -ForegroundColor Green
}
