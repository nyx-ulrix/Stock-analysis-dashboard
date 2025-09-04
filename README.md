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
-   **Node.js 16+** - [Download from nodejs.org](https://nodejs.org/)
-   **Git** - [Download from git-scm.com](https://git-scm.com/)

### One-Command Setup

**Windows:**

```cmd
start_all.bat
```

**macOS/Linux:**

```bash
chmod +x start_all.sh
./start_all.sh
```

### Manual Setup

See [SETUP.md](SETUP.md) for detailed installation instructions.

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
