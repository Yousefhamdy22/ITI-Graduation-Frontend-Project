# Fix CORS Issue - Restart Frontend
Write-Host "`n=== FIXING CORS ISSUE ===" -ForegroundColor Cyan

Write-Host "`n1. Stopping any running Angular dev server..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*ng serve*" -or $_.CommandLine -like "*vite*" } | Stop-Process -Force

Write-Host "`n2. Clearing Angular cache..." -ForegroundColor Yellow
if (Test-Path ".angular\cache") {
    Remove-Item -Path ".angular\cache" -Recurse -Force
    Write-Host "✅ Cache cleared" -ForegroundColor Green
}

Write-Host "`n3. Verifying environment.ts configuration..." -ForegroundColor Yellow
$envContent = Get-Content "src\environment\environment.ts" -Raw
if ($envContent -match "apiUrl.*'([^']+)'") {
    Write-Host "✅ API URL configured as: $($matches[1])" -ForegroundColor Green
}

Write-Host "`n4. Starting Angular development server..." -ForegroundColor Yellow
Write-Host "   Run this command in a new terminal:" -ForegroundColor Cyan
Write-Host "   npm start" -ForegroundColor White
Write-Host "   OR" -ForegroundColor Cyan
Write-Host "   ng serve" -ForegroundColor White

Write-Host "`n=== DONE ===" -ForegroundColor Green
Write-Host "After restarting the dev server, refresh your browser (Ctrl+F5)" -ForegroundColor Yellow
