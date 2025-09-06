@echo off
REM =============================================================================
REM WINDOWS COMPATIBILITY TEST SCRIPT
REM =============================================================================
REM This script tests if the Stock Analysis Dashboard works correctly on Windows

echo ========================================
echo Windows Compatibility Test
echo ========================================
echo.

REM Test Python installation
echo Testing Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo FAIL: Python not found
    goto :end
) else (
    echo PASS: Python found
)

REM Test Node.js installation
echo Testing Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo FAIL: Node.js not found
    goto :end
) else (
    echo PASS: Node.js found
)

REM Test virtual environment
echo Testing virtual environment...
cd backend
if not exist "venv\Scripts\activate.bat" (
    echo FAIL: Virtual environment not found
    goto :end
) else (
    echo PASS: Virtual environment exists
)

REM Test Python dependencies
echo Testing Python dependencies...
call venv\Scripts\activate.bat
python -c "import pandas, flask, numpy, matplotlib; print('All imports successful')" >nul 2>&1
if errorlevel 1 (
    echo FAIL: Python dependencies missing
    goto :end
) else (
    echo PASS: Python dependencies installed
)

REM Test pandas version
echo Testing pandas version...
python -c "import pandas as pd; print(f'Pandas version: {pd.__version__}')"

cd ..

REM Test Node.js dependencies
echo Testing Node.js dependencies...
if not exist "node_modules" (
    echo FAIL: Node modules not found
    goto :end
) else (
    echo PASS: Node modules exist
)

REM Test application import
echo Testing application import...
cd backend
call venv\Scripts\activate.bat
python -c "from app import app; print('Flask app imported successfully')" >nul 2>&1
if errorlevel 1 (
    echo FAIL: Cannot import Flask app
    goto :end
) else (
    echo PASS: Flask app imports correctly
)

cd ..

echo.
echo ========================================
echo All tests passed! ✓
echo ========================================
echo.
echo Your Windows environment is ready!
echo Run the following to start the application:
echo.
echo 1. Backend: start_backend.bat
echo 2. Frontend: start_frontend.bat
echo.

:end
pause

