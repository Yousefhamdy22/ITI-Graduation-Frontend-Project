# Test Backend Connection and CORS
Write-Host "`n=== TESTING BACKEND CONNECTION ===" -ForegroundColor Cyan

$backendUrl = "http://localhost:5180"

# 1. Test if backend is running
Write-Host "`n1. Testing if backend is responding..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$backendUrl/api/Course/GetAllCourses" -Method Get -UseBasicParsing
    Write-Host "✅ Backend is responding!" -ForegroundColor Green
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor White
    Write-Host "   CORS Headers:" -ForegroundColor White
    $response.Headers.Keys | Where-Object { $_ -like "*Access-Control*" } | ForEach-Object {
        Write-Host "     $_`: $($response.Headers[$_])" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Backend is NOT responding!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n💡 Make sure backend is running on http://localhost:5180" -ForegroundColor Yellow
}

# 2. Check CORS from frontend origin
Write-Host "`n2. Testing CORS from frontend origin (localhost:4200)..." -ForegroundColor Yellow
try {
    $headers = @{
        'Origin' = 'http://localhost:4200'
        'Access-Control-Request-Method' = 'GET'
    }
    $response = Invoke-WebRequest -Uri "$backendUrl/api/Course/GetAllCourses" -Method Options -Headers $headers -UseBasicParsing
    Write-Host "✅ CORS preflight passed!" -ForegroundColor Green
    Write-Host "   Access-Control-Allow-Origin: $($response.Headers['Access-Control-Allow-Origin'])" -ForegroundColor White
} catch {
    Write-Host "❌ CORS is NOT configured properly!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n💡 Backend needs CORS configuration for http://localhost:4200" -ForegroundColor Yellow
}

Write-Host "`n=== FRONTEND CONFIGURATION ===" -ForegroundColor Cyan
$envContent = Get-Content "src\environment\environment.ts" -Raw
if ($envContent -match "apiUrl.*'([^']+)'") {
    Write-Host "Frontend API URL: $($matches[1])" -ForegroundColor White
} else {
    Write-Host "Could not find apiUrl in environment.ts" -ForegroundColor Red
}

Write-Host "`n=== RECOMMENDATIONS ===" -ForegroundColor Yellow
Write-Host "1. Make sure backend is running: dotnet run" -ForegroundColor White
Write-Host "2. Backend should listen on: http://localhost:5180" -ForegroundColor White
Write-Host "3. Backend needs CORS policy for: http://localhost:4200" -ForegroundColor White
Write-Host "4. Check Program.cs for: app.UseCors()" -ForegroundColor White
