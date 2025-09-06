# Windows Setup Guide for Stock Analysis Dashboard

## Overview
This is a **full-stack application** that requires both a **React frontend** and a **Flask backend** to run properly.

## Architecture
- **Frontend (React/Vite)**: Runs on `http://127.0.0.1:3000`
- **Backend (Flask API)**: Runs on `http://127.0.0.1:5000`
- **Communication**: Frontend makes API calls to backend endpoints

## Prerequisites
1. **Python 3.11+** installed
2. **Node.js 18+** installed
3. **Git** (optional, for cloning)

## Quick Start (Recommended)

### Option 1: Use the Automated Setup Script
1. Open PowerShell as Administrator
2. Navigate to the project directory
3. Run: `.\setup_windows.ps1`
4. This will install all dependencies and create startup scripts

### Option 2: Manual Setup

#### Step 1: Backend Setup (Flask API)
```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
python app.py
```

#### Step 2: Frontend Setup (React App)
```powershell
# Open new PowerShell window
# Navigate to project root
cd Stock-analysis-dashboard

# Install dependencies
npm install

# Start frontend server
npm run dev
```

## Running the Application

### Method 1: Use the Startup Scripts
1. **Start Backend**: Double-click `start_backend.bat`
2. **Start Frontend**: Double-click `start_frontend.bat`

### Method 2: Manual Startup
1. **Terminal 1** (Backend):
   ```powershell
   cd backend
   .\venv\Scripts\Activate
   python app.py
   ```

2. **Terminal 2** (Frontend):
   ```powershell
   npm run dev
   ```

## Verification
1. Backend should show: `Server starting on: http://127.0.0.1:5000`
2. Frontend should show: `Local: http://127.0.0.1:3000`
3. Open browser to `http://127.0.0.1:3000`

## Troubleshooting

### Error: "Cannot connect to backend"
- **Cause**: Backend server not running
- **Solution**: Start the Flask backend first (`python app.py` in backend directory)

### Error: "Module not found" or "Import error"
- **Cause**: Dependencies not installed
- **Solution**: Run `pip install -r requirements.txt` in backend directory

### Error: "Port already in use"
- **Cause**: Another application using port 3000 or 5000
- **Solution**: 
  - Kill processes using the ports
  - Or change ports in configuration files

### Error: "CORS error"
- **Cause**: Frontend trying to access backend from different origin
- **Solution**: Ensure both are running on localhost (127.0.0.1)

## File Structure
```
Stock-analysis-dashboard/
├── backend/                 # Flask API server
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   └── venv/              # Python virtual environment
├── src/                    # React frontend source
│   ├── components/         # React components
│   ├── api.ts             # API communication functions
│   └── App.tsx            # Main React component
├── package.json           # Node.js dependencies
├── start_backend.bat      # Windows batch file to start backend
├── start_frontend.bat     # Windows batch file to start frontend
└── setup_windows.ps1      # PowerShell setup script
```

## API Endpoints
The backend provides these endpoints:
- `POST /upload` - Upload CSV file
- `POST /analyze` - Run stock analysis
- `POST /validate` - Validate algorithms
- `GET /health` - Health check

## Important Notes
1. **Both servers must be running** for the application to work
2. **Backend must start first** before frontend
3. **Use localhost (127.0.0.1)** not 0.0.0.0 for Windows compatibility
4. **Keep both terminals open** while using the application

## Support
If you encounter issues:
1. Check that both servers are running
2. Verify ports 3000 and 5000 are available
3. Check Windows Firewall settings
4. Ensure all dependencies are installed

