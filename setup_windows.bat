@echo off
REM =============================================================================
REM WINDOWS SETUP SCRIPT FOR STOCK ANALYSIS DASHBOARD
REM =============================================================================
REM This script automates the setup process for Windows users
REM It handles both Python backend and Node.js frontend setup

echo ========================================
echo Stock Analysis Dashboard - Windows Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 16+ from https://nodejs.org/
    pause
    exit /b 1
)

echo Python and Node.js found!
echo.

REM Setup Python Backend
echo ========================================
echo Setting up Python Backend...
echo ========================================

cd backend

REM Create virtual environment
echo Creating Python virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ERROR: Failed to create virtual environment
    pause
    exit /b 1
)

REM Activate virtual environment and install dependencies
echo Installing Python dependencies...
call venv\Scripts\activate.bat
pip install --upgrade pip
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)

echo Python backend setup complete!
echo.

cd ..

REM Setup Node.js Frontend
echo ========================================
echo Setting up Node.js Frontend...
echo ========================================

REM Install Node.js dependencies
echo Installing Node.js dependencies...
npm install
if errorlevel 1 (
    echo ERROR: Failed to install Node.js dependencies
    echo Try running: npm cache clean --force
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo.
echo 1. Backend (in one terminal):
echo    cd backend
echo    call venv\Scripts\activate.bat
echo    python app.py
echo.
echo 2. Frontend (in another terminal):
echo    npm run dev
echo.
echo The application will be available at:
echo - Backend API: http://localhost:5000
echo - Frontend UI: http://localhost:3000
echo.
pause

