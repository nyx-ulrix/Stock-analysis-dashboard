# =============================================================================
# STOCK ANALYSIS DASHBOARD - FULL APPLICATION STARTUP SCRIPT (PowerShell)
# =============================================================================
# This script starts both the Flask backend and React frontend servers
# for the Stock Analysis Dashboard application.
#
# Prerequisites:
# - Python 3.11+ installed
# - Node.js 18+ installed
# - All dependencies installed (run setup_windows.ps1 first)
#
# Usage:
# - Right-click and "Run with PowerShell"
# - Or run from PowerShell: .\start_full_app.ps1
# =============================================================================

Write-Host ""
Write-Host "=============================================================================" -ForegroundColor Cyan
Write-Host "STOCK ANALYSIS DASHBOARD - STARTING FULL APPLICATION" -ForegroundColor Cyan
Write-Host "=============================================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ ERROR: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python 3.11+ and try again" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js 18+ and try again" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if backend directory exists
if (-not (Test-Path "backend")) {
    Write-Host "❌ ERROR: Backend directory not found" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if backend virtual environment exists
if (-not (Test-Path "backend\venv")) {
    Write-Host "❌ ERROR: Backend virtual environment not found" -ForegroundColor Red
    Write-Host "Please run setup_windows.ps1 first to install dependencies" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "❌ ERROR: Node modules not found" -ForegroundColor Red
    Write-Host "Please run setup_windows.ps1 first to install dependencies" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✓ All prerequisites found" -ForegroundColor Green
Write-Host ""

Write-Host "Starting Flask backend server..." -ForegroundColor Yellow
Write-Host ""

# Start the Flask backend server in a new window
$backendScript = @"
cd backend
.\venv\Scripts\Activate
python app.py
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendScript

# Wait a moment for the backend to start
Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Starting React frontend server..." -ForegroundColor Yellow
Write-Host ""

# Start the React frontend server in a new window
$frontendScript = @"
npm run dev
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendScript

Write-Host ""
Write-Host "=============================================================================" -ForegroundColor Cyan
Write-Host "APPLICATION STARTED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "=============================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend Server:  http://127.0.0.1:5000" -ForegroundColor White
Write-Host "Frontend Server: http://127.0.0.1:3000" -ForegroundColor White
Write-Host ""
Write-Host "The application should open automatically in your browser." -ForegroundColor White
Write-Host "If not, manually navigate to: http://127.0.0.1:3000" -ForegroundColor White
Write-Host ""
Write-Host "To stop the application:" -ForegroundColor White
Write-Host "- Close both PowerShell windows" -ForegroundColor White
Write-Host "- Or press Ctrl+C in each window" -ForegroundColor White
Write-Host ""
Write-Host "=============================================================================" -ForegroundColor Cyan
Write-Host ""

# Keep this window open to show status
Read-Host "Press Enter to close this window (servers will continue running)"
