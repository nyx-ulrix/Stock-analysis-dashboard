# =============================================================================
# WINDOWS POWERSHELL SETUP SCRIPT FOR STOCK ANALYSIS DASHBOARD
# =============================================================================
# This script automates the setup process for Windows users using PowerShell
# It handles both Python backend and Node.js frontend setup

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Stock Analysis Dashboard - Windows Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Found Python: $pythonVersion" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python 3.8+ from https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host "Make sure to check 'Add Python to PATH' during installation" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version 2>&1
    Write-Host "Found Node.js: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js 16+ from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Setup Python Backend
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setting up Python Backend..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Set-Location backend

# Create virtual environment
Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
try {
    python -m venv venv
    Write-Host "Virtual environment created successfully!" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Failed to create virtual environment" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Activate virtual environment and install dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
try {
    & "venv\Scripts\Activate.ps1"
    pip install --upgrade pip
    pip install -r requirements.txt
    Write-Host "Python dependencies installed successfully!" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Failed to install Python dependencies" -ForegroundColor Red
    Write-Host "You may need to run: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

Set-Location ..

# Setup Node.js Frontend
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setting up Node.js Frontend..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Install Node.js dependencies
Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "Node.js dependencies installed successfully!" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Failed to install Node.js dependencies" -ForegroundColor Red
    Write-Host "Try running: npm cache clean --force" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host ""
Write-Host "OPTION 1 - Easy Start (Recommended):" -ForegroundColor Green
Write-Host "   Double-click: start_full_app.bat" -ForegroundColor White
Write-Host "   Or run: .\start_full_app.ps1" -ForegroundColor White
Write-Host ""
Write-Host "OPTION 2 - Manual Start:" -ForegroundColor Yellow
Write-Host "1. Backend (in one PowerShell terminal):" -ForegroundColor Yellow
Write-Host "   Set-Location backend" -ForegroundColor White
Write-Host "   .\venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host "   python app.py" -ForegroundColor White
Write-Host ""
Write-Host "2. Frontend (in another PowerShell terminal):" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "The application will be available at:" -ForegroundColor Cyan
Write-Host "- Backend API: http://127.0.0.1:5000" -ForegroundColor White
Write-Host "- Frontend UI: http://127.0.0.1:3000" -ForegroundColor White
Write-Host ""
Write-Host "IMPORTANT: Both servers must be running for the app to work!" -ForegroundColor Red
Write-Host ""

Read-Host "Press Enter to exit"

