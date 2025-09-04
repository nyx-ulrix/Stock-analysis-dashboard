@echo off
setlocal enabledelayedexpansion

echo 🚀 Starting Stock Analysis Dashboard...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed
echo.

REM Setup Backend
echo Setting up Python backend...
cd backend

REM Remove existing virtual environment if it exists
if exist venv (
    echo Removing existing virtual environment...
    rmdir /s /q venv
)

REM Create virtual environment
echo Creating Python virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ❌ Failed to create virtual environment
    pause
    exit /b 1
)

REM Activate virtual environment and install dependencies
echo Installing Python dependencies...
call venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install Python dependencies
    pause
    exit /b 1
)

REM Start backend in new window
echo Starting Python backend...
start "Python Backend" cmd /k "cd /d %~dp0backend && call venv\Scripts\activate && python app.py"

REM Wait for backend to start
echo Waiting for backend to start...
timeout /t 8 /nobreak > nul

REM Check if backend is running
curl -s http://localhost:5000/health >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Backend may not be ready yet. Please check the backend window.
) else (
    echo ✅ Backend is running on http://localhost:5000
)

REM Setup Frontend
echo.
echo Setting up React frontend...
cd ..

REM Install frontend dependencies
echo Installing Node.js dependencies...
npm install
if errorlevel 1 (
    echo ❌ Failed to install Node.js dependencies
    pause
    exit /b 1
)

REM Start frontend in new window
echo Starting React frontend...
start "React Frontend" cmd /k "npm run dev"

echo.
echo 🎉 Stock Analysis Dashboard is starting!
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000 (or next available port)
echo.
echo Both services are running in separate windows.
echo Close those windows to stop the services.
echo.
echo Press any key to exit this setup window...
pause > nul
