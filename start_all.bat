@echo off
echo Starting Stock Analysis Dashboard...
echo.

echo Starting Python Backend in new window...
start "Python Backend" cmd /k "cd backend && python -m venv venv && call venv\Scripts\activate && pip install -r requirements.txt && python app.py"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting React Frontend in new window...
start "React Frontend" cmd /k "npm install && npm run dev"

echo.
echo Both services are starting...
echo Backend will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:5173
echo.
echo Press any key to exit this window...
pause > nul
