# Stock Analysis Dashboard - Setup Guide

This guide will help you get the Stock Analysis Dashboard running on any device after forking the repository.

## Prerequisites

Before starting, ensure you have the following installed:

### Required Software

-   **Python 3.8+** - [Download from python.org](https://www.python.org/downloads/)
-   **Node.js 16+** - [Download from nodejs.org](https://nodejs.org/)
-   **Git** - [Download from git-scm.com](https://git-scm.com/)

### Verify Installation

```bash
# Check Python version
python --version
# Should show Python 3.8 or higher

# Check Node.js version
node --version
# Should show v16 or higher

# Check npm version
npm --version
# Should show v8 or higher
```

## Quick Start (All Platforms)

### Option 1: One-Command Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-username/Stock-analysis-dashboard.git
cd Stock-analysis-dashboard

# Run the setup script for your platform
# Windows:
start_all.bat

# macOS/Linux:
chmod +x start_all.sh
./start_all.sh
```

### Option 2: Manual Setup

#### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python app.py
```

#### Step 2: Frontend Setup (New Terminal)

```bash
# Navigate to project root
cd ..

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

## Platform-Specific Instructions

### Windows

1. **PowerShell/Command Prompt:**

    ```cmd
    # Use the provided batch files
    start_all.bat
    ```

2. **Git Bash:**
    ```bash
    # Use the shell script
    chmod +x start_all.sh
    ./start_all.sh
    ```

### macOS

```bash
# Make scripts executable
chmod +x start_all.sh

# Run setup
./start_all.sh
```

### Linux

```bash
# Make scripts executable
chmod +x start_all.sh

# Run setup
./start_all.sh
```

## Troubleshooting

### Common Issues

#### 1. Python Virtual Environment Issues

**Problem:** Permission denied when creating virtual environment
**Solution:**

```bash
# Remove existing venv and recreate
rm -rf venv  # Linux/macOS
rmdir /s venv  # Windows

# Create new virtual environment
python -m venv venv
```

#### 2. Node.js Installation Issues

**Problem:** npm install fails
**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json  # Linux/macOS
rmdir /s node_modules & del package-lock.json  # Windows

# Reinstall
npm install
```

#### 3. Port Already in Use

**Problem:** Port 3000 or 5000 already in use
**Solution:**

-   The application will automatically try alternative ports
-   Or manually specify ports in the configuration files

#### 4. Python Dependencies Issues

**Problem:** pip install fails
**Solution:**

```bash
# Upgrade pip
python -m pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt
```

### Platform-Specific Issues

#### Windows

-   **PowerShell Execution Policy:** If scripts don't run, change execution policy:
    ```powershell
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
    ```

#### macOS

-   **Xcode Command Line Tools:** If Python compilation fails:
    ```bash
    xcode-select --install
    ```

#### Linux

-   **Python Development Headers:** If pip install fails:

    ```bash
    # Ubuntu/Debian
    sudo apt-get install python3-dev

    # CentOS/RHEL
    sudo yum install python3-devel
    ```

## Verification

After setup, verify everything is working:

1. **Backend Health Check:**

    ```bash
    curl http://localhost:5000/health
    # Should return: {"status": "healthy", "message": "Stock Analysis API is running"}
    ```

2. **Frontend Access:**

    - Open browser to `http://localhost:3000` (or the port shown in terminal)
    - You should see the Stock Analysis Dashboard

3. **Test Upload:**
    - Try uploading one of the sample CSV files
    - Run analysis to verify everything works

## Sample Data

The repository includes sample CSV files for testing:

-   `test_data_normal.csv` - Normal market data
-   `test_data_volatile.csv` - Volatile market data
-   `test_data_bull.csv` - Bull market data
-   `test_data_bear.csv` - Bear market data
-   `test_data_small.csv` - Small dataset for quick testing

## Development

### Backend Development

```bash
cd backend
python app.py
# Backend runs on http://localhost:5000
```

### Frontend Development

```bash
npm run dev
# Frontend runs on http://localhost:3000 (or next available port)
```

### Building for Production

```bash
# Build frontend
npm run build

# The built files will be in the 'dist' directory
```

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Verify all prerequisites are installed correctly
3. Check that ports 3000 and 5000 are available
4. Ensure you have sufficient permissions to create files and directories

## File Structure

```
Stock-analysis-dashboard/
├── backend/
│   ├── app.py              # Flask backend server
│   ├── requirements.txt    # Python dependencies
│   └── venv/              # Python virtual environment
├── src/
│   ├── components/        # React components
│   ├── App.tsx           # Main React app
│   ├── api.ts            # API communication
│   └── types.ts          # TypeScript type definitions
├── public/               # Static assets
├── package.json          # Node.js dependencies
├── start_all.bat         # Windows startup script
├── start_all.sh          # Unix startup script
└── README.md            # Project documentation
```

## Next Steps

Once everything is running:

1. Upload a CSV file with stock data
2. Configure the SMA window size
3. Run analysis to see charts and metrics
4. Try the validation tests to verify calculations
5. Explore the different analysis features

Happy analyzing! 📈
