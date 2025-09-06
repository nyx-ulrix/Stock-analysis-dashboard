# Troubleshooting Guide

## Common Issues and Solutions

### Issue: "Cannot connect to backend" or "@app.route('/', methods=['GET']) don't exist"

**Problem**: The frontend is trying to make API calls to the backend, but the backend server isn't running.

**Root Cause**: This is a **full-stack application** that requires both:

-   **React Frontend** (runs on port 3000)
-   **Flask Backend** (runs on port 5000)

**Solution**:

#### Option 1: Use the Easy Startup Script (Recommended)

1. Double-click `start_full_app.bat`
2. This will start both servers automatically

#### Option 2: Manual Startup

1. **Start Backend First**:

    ```powershell
    cd backend
    .\venv\Scripts\Activate
    python app.py
    ```

    You should see: `Server starting on: http://127.0.0.1:5000`

2. **Start Frontend Second** (in a new terminal):
    ```powershell
    npm run dev
    ```
    You should see: `Local: http://127.0.0.1:3000`

#### Option 3: Use Individual Scripts

1. Double-click `start_backend.bat`
2. Double-click `start_frontend.bat`

### Issue: "Module not found" or Import errors

**Solution**:

1. Run the setup script first: `.\setup_windows.ps1`
2. This installs all required dependencies

### Issue: "Port already in use"

**Solution**:

1. Close any applications using ports 3000 or 5000
2. Or restart your computer
3. Check what's using the ports:
    ```powershell
    netstat -ano | findstr :3000
    netstat -ano | findstr :5000
    ```

### Issue: "CORS error" or Network errors

**Solution**:

1. Make sure both servers are running on `127.0.0.1` (not `0.0.0.0`)
2. Check Windows Firewall settings
3. Ensure both servers are running simultaneously

### Issue: Frontend shows "Backend Disconnected"

**Solution**:

1. Start the Flask backend server first
2. Wait for it to fully start (you'll see the startup message)
3. Then start the frontend

## Verification Steps

1. **Check Backend**: Open `http://127.0.0.1:5000/health` in browser

    - Should return: `{"status": "healthy", "message": "Stock Analysis API is running"}`

2. **Check Frontend**: Open `http://127.0.0.1:3000` in browser

    - Should show the Stock Analysis Dashboard
    - Should show "✅ Backend Connected" status

3. **Check Both Running**: You should have two command windows open:
    - One running Flask backend
    - One running React frontend

## File Structure Check

Make sure you have this structure:

```
Stock-analysis-dashboard/
├── backend/
│   ├── app.py              # Flask server
│   ├── requirements.txt    # Python dependencies
│   └── venv/              # Python virtual environment
├── src/                    # React frontend
├── package.json           # Node.js dependencies
├── node_modules/          # Node.js packages
├── start_full_app.bat     # Easy startup script
└── start_full_app.ps1     # PowerShell startup script
```

## Still Having Issues?

1. **Check Prerequisites**:

    - Python 3.11+ installed
    - Node.js 18+ installed
    - Both added to PATH

2. **Run Setup Again**:

    ```powershell
    .\setup_windows.ps1
    ```

3. **Check Logs**:

    - Look at the terminal output for error messages
    - Check browser console for JavaScript errors

4. **Restart Everything**:
    - Close all terminals
    - Restart your computer
    - Try the setup process again
