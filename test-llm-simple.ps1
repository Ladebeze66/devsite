# Test simple de l'API LLM
param(
    [string]$Question = "Bonjour"
)

function Test-LLM {
    param([string]$Q)
    
    Write-Host "Question: $Q" -ForegroundColor Yellow
    Write-Host "Envoi..." -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = "https://llmapi.fernandgrascalvet.com/ask"
            Method = "GET"
            Body = @{ q = $Q }
        }
        $response = Invoke-RestMethod @params
        
        Write-Host "Reponse:" -ForegroundColor Green
        Write-Host $response -ForegroundColor White
        
    } catch {
        Write-Host "Erreur: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Menu simple
if ($Question -eq "Bonjour") {
    Write-Host "=== Testeur API LLM ===" -ForegroundColor Cyan
    Write-Host "1. Test rapide"
    Write-Host "2. Question personnalisee"
    
    $choice = Read-Host "Choix (1-2)"
    
    if ($choice -eq "1") {
        Test-LLM "Bonjour, comment allez-vous ?"
    } elseif ($choice -eq "2") {
        $customQ = Read-Host "Votre question"
        Test-LLM $customQ
    }
} else {
    Test-LLM $Question
}
