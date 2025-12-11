# Test Questions API
Write-Host "`n=== TESTING QUESTIONS API ===" -ForegroundColor Cyan

$backendUrl = "http://localhost:5180"
$token = "" # Add your token here if needed

Write-Host "`n1. Testing GetAllQuestions endpoint..." -ForegroundColor Yellow
try {
    $headers = @{}
    if ($token) {
        $headers['Authorization'] = "Bearer $token"
    }
    
    $response = Invoke-RestMethod -Uri "$backendUrl/api/Question/GetAllQuestions" -Method Get -Headers $headers
    
    Write-Host "✅ Questions API is responding!" -ForegroundColor Green
    Write-Host "   Response type: $($response.GetType().Name)" -ForegroundColor White
    
    if ($response.value) {
        Write-Host "   Questions count: $($response.value.Count)" -ForegroundColor White
        if ($response.value.Count -gt 0) {
            Write-Host "`n   First question:" -ForegroundColor Cyan
            $response.value[0] | ConvertTo-Json -Depth 2 | Write-Host
        }
    } elseif ($response -is [Array]) {
        Write-Host "   Questions count: $($response.Count)" -ForegroundColor White
        if ($response.Count -gt 0) {
            Write-Host "`n   First question:" -ForegroundColor Cyan
            $response[0] | ConvertTo-Json -Depth 2 | Write-Host
        }
    } else {
        Write-Host "   Full response:" -ForegroundColor Cyan
        $response | ConvertTo-Json -Depth 3 | Write-Host
    }
    
} catch {
    Write-Host "❌ Questions API failed!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== DONE ===" -ForegroundColor Cyan
