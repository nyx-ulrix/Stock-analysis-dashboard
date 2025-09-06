@echo off
REM =============================================================================
REM START BACKEND SERVER - WINDOWS
REM =============================================================================
REM This script starts the Python Flask backend server

echo ========================================
echo Starting Stock Analysis Backend Server
echo ========================================
echo.

cd /d "%~dp0backend"

REM Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo ERROR: Virtual environment not found!
    echo Please run setup_windows.bat first
    pause
    exit /b 1
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Check if requirements are installed
python -c "import pandas, flask, matplotlib" >nul 2>&1
if errorlevel 1 (
    echo ERROR: Required packages not installed!
    echo Installing dependencies...
    pip install -r requirements.txt
)

echo.
echo Starting Flask server on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

REM Start the Flask application
python app.py

pause

