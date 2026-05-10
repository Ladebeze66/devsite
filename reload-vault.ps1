# Recharge le cache du vault GrasBot sans redémarrer uvicorn (POST /reload-vault).
#
# Usage :
#   PS > .\reload-vault.ps1
#   PS > .\reload-vault.ps1 -BaseUrl "http://localhost:8000"
#
# Override possible via variable d'environnement LLM_API_BASE (prioritaire si -BaseUrl absent).

param(
    [string]$BaseUrl = ""
)

$ErrorActionPreference = "Stop"

if (-not $BaseUrl) {
    $BaseUrl = if ($env:LLM_API_BASE) { $env:LLM_API_BASE } else { "http://localhost:8000" }
}

$uri = ($BaseUrl.TrimEnd("/") + "/reload-vault")

try {
    $response = Invoke-RestMethod -Method Post -Uri $uri -TimeoutSec 60
    Write-Host ("Vault reloaded: {0} note(s) -> {1}" -f $response.notes_total, $uri) -ForegroundColor Green
    $response | ConvertTo-Json -Compress
}
catch {
    Write-Host ("Failed: {0}" -f $_.Exception.Message) -ForegroundColor Red
    Write-Host ("POST {0}" -f $uri)
    exit 1
}
