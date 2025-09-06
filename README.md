# Stock Analysis Dashboard

A comprehensive stock market analysis tool that combines Python backend processing with a React frontend interface. This project analyzes stock market data, calculates trading metrics, identifies market trends, and provides visualizations.

## Features

### Core Functionalities

-   **Simple Moving Average (SMA)**: Calculate SMA for configurable window sizes
-   **Runs Analysis**: Identify and analyze consecutive upward and downward price movements
-   **Daily Returns**: Compute simple daily returns using the formula: (P_t - P_t-1) / P_t-1
-   **Maximum Profit**: Implement Best Time to Buy and Sell Stock II algorithm for optimal trading strategy
-   **Data Visualization**: Interactive charts showing price trends, SMA, and runs analysis

### Technical Features

-   CSV file upload functionality
-   Real-time data processing
-   Comprehensive validation with 5+ test cases
-   Responsive React frontend with modern UI
-   Optimized Python backend with Flask
-   Interactive data visualization using matplotlib

## Quick Start

### Prerequisites

-   **Python 3.8+** - [Download from python.org](https://www.python.org/downloads/)
    -   ⚠️ **Windows users**: Make sure to check "Add Python to PATH" during installation
-   **Node.js 16+** - [Download from nodejs.org](https://nodejs.org/)

### Automated Setup (Windows)

**Option 1: Command Prompt**

```cmd
setup_windows.bat
```

**Option 2: PowerShell**

```powershell
.\setup_windows.ps1
```

### Manual Installation & Running

1. **Start the Python Backend**:

    **Windows Command Prompt:**

    ```cmd
    cd backend
    python -m venv venv
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
    python app.py
    ```

    **Windows PowerShell:**

    ```powershell
    Set-Location backend
    python -m venv venv
    .\venv\Scripts\Activate.ps1
    pip install -r requirements.txt
    python app.py
    ```

2. **Start the React Frontend** (in a new terminal):
    ```cmd
    npm install
    npm run dev
    ```

### Quick Start Scripts (Windows)

After setup, you can use these convenient scripts:

-   **Backend**: Double-click `start_backend.bat`
-   **Frontend**: Double-click `start_frontend.bat`

### Access the Application

-   **Backend API:** http://localhost:5000
-   **Frontend UI:** http://localhost:3000 (or next available port)

## Usage

1. **Upload Data**: Click "Choose File" and select a CSV file with stock data
2. **Configure Analysis**: Set the SMA window size (default: 5 days)
3. **Run Analysis**: Click "Run Analysis" to process your data
4. **View Results**: Explore the interactive charts and detailed metrics
5. **Validate Results**: Click "Run Validation Tests" to verify calculations

### CSV Format Requirements

Your CSV file must contain these columns:

-   `date`: Date in YYYY-MM-DD format
-   `open`: Opening price
-   `high`: Highest price of the day
-   `low`: Lowest price of the day
-   `close`: Closing price
-   `volume`: Trading volume

## API Endpoints

### Backend API (http://localhost:5000)

-   `POST /upload` - Upload CSV file
-   `POST /analyze` - Run comprehensive stock analysis
-   `POST /validate` - Run validation tests
-   `GET /health` - Health check

## Analysis Features

### 1. Simple Moving Average (SMA)

Calculates the average closing price over a specified window period, smoothing out short-term price fluctuations.

### 2. Runs Analysis

-   Counts consecutive upward and downward price movements
-   Identifies the longest streaks in each direction
-   Provides detailed statistics on market trends

### 3. Daily Returns

Computes percentage change between consecutive closing prices using the standard formula.

### 4. Maximum Profit Calculation

Implements the optimal trading strategy that maximizes profit by buying and selling at the right times, allowing multiple transactions.

### 5. Data Visualization

-   Interactive price charts with SMA overlay
-   Color-coded runs highlighting (green for upward, red for downward)
-   Daily returns visualization
-   Comprehensive summary statistics

## Validation & Testing

The system includes comprehensive validation with 5+ test cases covering:

-   SMA calculation accuracy
-   Daily returns computation
-   Maximum profit algorithm
-   Runs analysis correctness
-   Data structure validation

## Performance Optimizations

-   **Vectorized Operations**: Uses NumPy for efficient mathematical computations
-   **Pandas Optimization**: Leverages pandas for fast data manipulation
-   **Memory Management**: Efficient data structures and garbage collection
-   **Caching**: Results are cached to avoid redundant calculations
-   **Async Processing**: Non-blocking API calls for better user experience

## Troubleshooting (Windows)

### Common Issues and Solutions

**1. "Python is not recognized as an internal or external command"**

-   Solution: Reinstall Python and check "Add Python to PATH" during installation
-   Alternative: Add Python to PATH manually in System Environment Variables

**2. "Execution Policy Error" in PowerShell**

-   Solution: Run PowerShell as Administrator and execute:
    ```powershell
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
    ```

**3. "Port 5000 is already in use"**

-   Solution: Kill the process using port 5000:
    ```cmd
    netstat -ano | findstr :5000
    taskkill /PID <PID_NUMBER> /F
    ```

**4. "Virtual environment activation fails"**

-   Command Prompt: Use `call venv\Scripts\activate.bat`
-   PowerShell: Use `.\venv\Scripts\Activate.ps1`

**5. "npm install fails"**

-   Solution: Clear npm cache and try again:
    ```cmd
    npm cache clean --force
    npm install
    ```

**6. "matplotlib backend error"**

-   The application automatically handles Windows matplotlib configuration
-   If issues persist, ensure you have the latest Visual C++ redistributables installed

## Technologies Used

### Backend

-   **Python 3.8+**: Core programming language
-   **Flask**: Web framework for API
-   **Pandas**: Data manipulation and analysis
-   **NumPy**: Numerical computing
-   **Matplotlib**: Data visualization
-   **Flask-CORS**: Cross-origin resource sharing

### Frontend

-   **React 19**: Modern UI framework
-   **TypeScript**: Type-safe JavaScript
-   **Tailwind CSS**: Utility-first CSS framework
-   **Vite**: Fast build tool and dev server
