@echo off
REM =============================================================================
REM START FRONTEND SERVER - WINDOWS
REM =============================================================================
REM This script starts the React Vite development server

echo ========================================
echo Starting Stock Analysis Frontend Server
echo ========================================
echo.

cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules" (
    echo ERROR: Node modules not found!
    echo Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        echo Try running: npm cache clean --force
        pause
        exit /b 1
    )
)

echo.
echo Starting Vite development server...
echo The application will open in your default browser
echo Press Ctrl+C to stop the server
echo.

REM Start the Vite development server
npm run dev

pause

