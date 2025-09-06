@echo off
REM =============================================================================
REM STOCK ANALYSIS DASHBOARD - FULL APPLICATION STARTUP SCRIPT
REM =============================================================================
REM This script starts both the Flask backend and React frontend servers
REM for the Stock Analysis Dashboard application.
REM
REM Prerequisites:
REM - Python 3.11+ installed
REM - Node.js 18+ installed
REM - All dependencies installed (run setup_windows.ps1 first)
REM
REM Usage:
REM - Double-click this file to start both servers
REM - Or run from command line: start_full_app.bat
REM =============================================================================

echo.
echo =============================================================================
echo STOCK ANALYSIS DASHBOARD - STARTING FULL APPLICATION
echo =============================================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.11+ and try again
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ and try again
    pause
    exit /b 1
)

REM Check if backend directory exists
if not exist "backend" (
    echo ERROR: Backend directory not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

REM Check if backend virtual environment exists
if not exist "backend\venv" (
    echo ERROR: Backend virtual environment not found
    echo Please run setup_windows.ps1 first to install dependencies
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo ERROR: Node modules not found
    echo Please run setup_windows.ps1 first to install dependencies
    pause
    exit /b 1
)

echo Starting Flask backend server...
echo.

REM Start the Flask backend server in a new window
start "Stock Analysis Backend" cmd /k "cd backend && .\venv\Scripts\activate && python app.py"

REM Wait a moment for the backend to start
echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo.
echo Starting React frontend server...
echo.

REM Start the React frontend server in a new window
start "Stock Analysis Frontend" cmd /k "npm run dev"

echo.
echo =============================================================================
echo APPLICATION STARTED SUCCESSFULLY!
echo =============================================================================
echo.
echo Backend Server:  http://127.0.0.1:5000
echo Frontend Server: http://127.0.0.1:3000
echo.
echo The application should open automatically in your browser.
echo If not, manually navigate to: http://127.0.0.1:3000
echo.
echo To stop the application:
echo - Close both command windows
echo - Or press Ctrl+C in each window
echo.
echo =============================================================================
echo.

REM Keep this window open to show status
echo Press any key to close this window (servers will continue running)...
pause >nul
