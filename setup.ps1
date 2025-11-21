Write-Host "========================================" -ForegroundColor Cyan
Write-Host "E-Learning Platform - Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
$npmVersion = npm --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ npm version: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "✗ npm is not installed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installing Dependencies..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "This may take a few minutes..." -ForegroundColor Yellow
Write-Host ""

npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✓ Setup Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Quick Start Commands:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  npm start" -ForegroundColor Yellow
    Write-Host "    → Start development server (http://localhost:4200)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  npm run start:mock" -ForegroundColor Yellow
    Write-Host "    → Start app with mock API (Recommended)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Demo Credentials:" -ForegroundColor Cyan
    Write-Host "  Admin:      admin@elearning.com / Admin@123" -ForegroundColor Gray
    Write-Host "  Instructor: instructor@elearning.com / Instructor@123" -ForegroundColor Gray
    Write-Host "  Student:    student@elearning.com / Student@123" -ForegroundColor Gray
    Write-Host ""
    Write-Host "For more details, see SETUP_GUIDE.md" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "✗ Setup failed! Please check the errors above." -ForegroundColor Red
    Write-Host ""
    exit 1
}
