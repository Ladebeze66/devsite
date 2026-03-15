# Configuration des variables d'environnement
$env:NEXT_PUBLIC_API_URL = "https://api.fernandgrascalvet.com"
$env:PUBLIC_URL = "https://api.fernandgrascalvet.com"

Write-Host "🚀 Démarrage du site avec configuration HTTPS..." -ForegroundColor Green
Write-Host "📡 API URL: $env:NEXT_PUBLIC_API_URL" -ForegroundColor Cyan

# Lancer Strapi avec configuration HTTPS
Write-Host "🔧 Démarrage de Strapi..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "cd 'J:\my-next-site\cmsbackend'; `$env:PUBLIC_URL='https://api.fernandgrascalvet.com'; npm run develop" -WindowStyle Normal

# Attendre un peu pour que Strapi démarre
Start-Sleep -Seconds 3

# Lancer Next.js
Write-Host "⚡ Démarrage de Next.js..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "cd 'J:\my-next-site'; `$env:NEXT_PUBLIC_API_URL='https://api.fernandgrascalvet.com'; npm run dev" -WindowStyle Normal

# Lancer FastAPI
Write-Host "🤖 Démarrage de FastAPI..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "cd 'J:\my-next-site\llm-api'; uvicorn api:app --host 0.0.0.0 --port 8000" -WindowStyle Normal

Write-Host "✅ Tous les services sont en cours de démarrage!" -ForegroundColor Green
Write-Host "🌐 Site accessible sur: http://localhost:3000" -ForegroundColor Cyan