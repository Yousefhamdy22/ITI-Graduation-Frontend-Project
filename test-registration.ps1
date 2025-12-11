# Test Registration Endpoints
Write-Host "`n=== TESTING REGISTRATION ENDPOINTS ===" -ForegroundColor Cyan

$baseUrl = "https://localhost:44329/api"

# Test Student Registration
Write-Host "`n1. Testing Student Registration..." -ForegroundColor Yellow
$studentData = @{
    email = "test-student-$(Get-Random)@example.com"
    password = "Test@123456"
    confirmPassword = "Test@123456"
    firstName = "Test"
    lastName = "Student"
    gender = "male"
    phoneNumber = "01234567890"
    createdAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/Auth/register-student" `
        -Method Post `
        -ContentType "application/json" `
        -Body $studentData `
        -SkipCertificateCheck
    
    Write-Host "✅ Student Registration Success!" -ForegroundColor Green
    Write-Host "   User ID: $($response.user.id)" -ForegroundColor White
    Write-Host "   Email: $($response.user.email)" -ForegroundColor White
    Write-Host "   Token: $($response.accessToken.Substring(0, 20))..." -ForegroundColor White
} catch {
    Write-Host "❌ Student Registration Failed!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

# Test Instructor Registration
Write-Host "`n2. Testing Instructor Registration..." -ForegroundColor Yellow
$instructorData = @{
    email = "test-instructor-$(Get-Random)@example.com"
    password = "Test@123456"
    confirmPassword = "Test@123456"
    firstName = "Test"
    lastName = "Instructor"
    phoneNumber = "01234567890"
    createdAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/Auth_Instructor/register-Instructor" `
        -Method Post `
        -ContentType "application/json" `
        -Body $instructorData `
        -SkipCertificateCheck
    
    Write-Host "✅ Instructor Registration Success!" -ForegroundColor Green
    Write-Host "   User ID: $($response.user.id)" -ForegroundColor White
    Write-Host "   Email: $($response.user.email)" -ForegroundColor White
    Write-Host "   Token: $($response.accessToken.Substring(0, 20))..." -ForegroundColor White
} catch {
    Write-Host "❌ Instructor Registration Failed!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== TEST COMPLETE ===" -ForegroundColor Cyan
