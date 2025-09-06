# =============================================================================
# STOCK ANALYSIS DASHBOARD - BACKEND API
# =============================================================================
# This is the backend server that handles stock data analysis requests.
# It provides REST API endpoints for uploading CSV files and performing
# various financial calculations and visualizations.
#
# Key responsibilities:
# - Providing REST API endpoints for file upload and analysis
# - Processing CSV files containing stock data
# - Performing financial calculations (SMA, returns, runs analysis, etc.)
# - Generating data visualizations and charts
# - Validating data and providing error handling
# - Running automated tests to verify algorithm correctness
# - Providing interactive chart data for hover functionality
# - Ensuring Windows compatibility across all operations
#
# Windows Compatibility Features:
# - Cross-platform path handling
# - Windows-specific matplotlib configuration
# - Proper error handling for Windows file systems
# - Optimized for Windows networking and threading

# =============================================================================
# STANDARD LIBRARY IMPORTS
# =============================================================================
# Python standard library modules for basic functionality
import platform  # For detecting operating system (Windows compatibility)
import warnings  # For suppressing warning messages
import base64    # For encoding chart images as base64 strings
import io        # For creating in-memory file-like objects
import sys       # For system-specific operations
import os        # For cross-platform path operations

# =============================================================================
# THIRD-PARTY LIBRARY IMPORTS
# =============================================================================
# Data visualization library - creates charts and graphs
import matplotlib
import matplotlib.pyplot as plt

# Web framework for creating REST API endpoints
from flask import Flask, request, jsonify
from flask_cors import CORS

# Data manipulation and analysis libraries
import pandas as pd  # For data manipulation and analysis
import numpy as np   # For numerical computations

# =============================================================================
# WINDOWS COMPATIBILITY FUNCTIONS
# =============================================================================
# Functions to ensure the application works smoothly on Windows systems


def is_windows_system():
    """
    Check if the application is running on a Windows system.

    Returns:
        bool: True if running on Windows, False otherwise
    """
    return platform.system() == 'Windows'


def get_windows_font_family():
    """
    Get the appropriate font family for Windows systems.

    Returns:
        list: List of font families in order of preference for Windows
    """
    if is_windows_system():
        return ['Segoe UI', 'Arial', 'DejaVu Sans', 'sans-serif']
    return ['DejaVu Sans', 'Arial', 'sans-serif']


def configure_windows_matplotlib():
    """
    Configure matplotlib for optimal Windows performance and compatibility.
    This function handles Windows-specific matplotlib settings.
    """
    if is_windows_system():
        # Set Windows-compatible font family
        matplotlib.rcParams['font.family'] = get_windows_font_family()

        # Optimize for Windows display
        matplotlib.rcParams['figure.dpi'] = 100
        matplotlib.rcParams['savefig.dpi'] = 300

        # Windows-specific backend optimizations
        matplotlib.rcParams['backend'] = 'Agg'

        # Ensure proper text rendering on Windows
        matplotlib.rcParams['text.antialiased'] = True
        matplotlib.rcParams['axes.unicode_minus'] = False


def get_safe_filename(filename):
    """
    Get a Windows-safe filename by removing or replacing invalid characters.

    Args:
        filename (str): Original filename

    Returns:
        str: Windows-safe filename
    """
    if not filename:
        return "untitled.csv"

    # Windows invalid filename characters
    invalid_chars = '<>:"/\\|?*'
    safe_filename = filename

    for char in invalid_chars:
        safe_filename = safe_filename.replace(char, '_')

    # Ensure filename doesn't end with period or space (Windows restriction)
    safe_filename = safe_filename.rstrip('. ')

    return safe_filename


# Configure matplotlib to work without a display (for server environments)
# This is especially important on Windows servers or headless environments
matplotlib.use('Agg')  # Use non-interactive backend
warnings.filterwarnings('ignore')  # Suppress warning messages

# Apply Windows-specific matplotlib configuration
configure_windows_matplotlib()

# =============================================================================
# APPLICATION CONSTANTS
# =============================================================================
# Configuration constants used throughout the application

# Default window size for Simple Moving Average calculation (in days)
DEFAULT_SMA_WINDOW = 5

# Required columns that must be present in uploaded CSV files
REQUIRED_COLUMNS = ['date', 'open', 'high', 'low', 'close', 'volume']

# Base URL for the API (used by frontend for making requests)
API_BASE_URL = 'http://127.0.0.1:5000'

# Windows-specific configuration
WINDOWS_OPTIMIZED = is_windows_system()

# =============================================================================
# FLASK APPLICATION INITIALIZATION
# =============================================================================
# Initialize the Flask web application
app = Flask(__name__)

# Enable Cross-Origin Resource Sharing (CORS) to allow frontend communication
# This allows the React frontend running on a different port to make API calls
CORS(app)

# =============================================================================
# GLOBAL DATA STORAGE
# =============================================================================
# Global variable to store uploaded stock data
# NOTE: In a production environment, this should be replaced with a proper database
# For this demo application, we store data in memory for simplicity
stock_data = None


# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================
# Helper functions used throughout the application for data processing,
# error handling, and response formatting

def safe_float(value):
    """
    Safely convert a value to float, handling NaN and invalid values.

    This function is used to ensure that numeric values are properly converted
    to floats for JSON serialization, replacing invalid values with None.

    Args:
        value: The value to convert to float

    Returns:
        float or None: The converted float value, or None if conversion fails
    """
    if pd.isna(value):
        return None
    try:
        return float(value)
    except (ValueError, TypeError):
        return None


def serialize_series(series):
    """
    Convert a pandas Series to a JSON-serializable list.

    This function replaces NaN values with None to ensure proper JSON serialization,
    as JSON doesn't support NaN values.

    Args:
        series: The pandas Series to convert

    Returns:
        list: A list with NaN values replaced by None
    """
    return series.replace({np.nan: None}).tolist()


def create_error_response(message, status_code=400):
    """
    Create a standardized error response for API endpoints.

    Args:
        message (str): The error message to return
        status_code (int): HTTP status code (default: 400)

    Returns:
        tuple: (JSON response, status code) for Flask
    """
    return jsonify({'error': message}), status_code


def create_success_response(data, message=None):
    """
    Create a standardized success response for API endpoints.

    Args:
        data: The data to return in the response
        message (str, optional): Additional message to include

    Returns:
        JSON response: The formatted success response
    """
    response = data
    if message:
        response = {'message': message, **data}
    return jsonify(response)


class StockAnalyzer:
    """
    A comprehensive stock data analysis class with Windows compatibility.

    This class performs various financial calculations on stock data and provides
    methods for interactive chart generation. It's optimized for Windows systems
    and includes robust error handling and data validation.

    Key Features:
    - Simple Moving Averages (SMA) calculation
    - Daily returns (percentage change) analysis
    - Upward and downward price runs/streaks identification
    - Maximum possible profit from trading calculations
    - Interactive data visualizations with hover support
    - Windows-optimized chart generation
    - Comprehensive data validation and error handling

    Windows Compatibility:
    - Optimized matplotlib configuration for Windows
    - Cross-platform data handling
    - Windows-specific font and display settings
    - Robust error handling for Windows file systems
    """

    def __init__(self, data):
        """
        Initialize the analyzer with stock data and Windows compatibility checks.

        Args:
            data (pandas.DataFrame): Stock data with columns: date, open, high, low, close, volume

        Raises:
            ValueError: If required columns are missing or data is invalid
            TypeError: If data is not a pandas DataFrame
        """
        # Validate input data type
        if not isinstance(data, pd.DataFrame):
            raise TypeError("Data must be a pandas DataFrame")

        # Validate required columns exist
        missing_columns = [
            col for col in REQUIRED_COLUMNS if col not in data.columns]
        if missing_columns:
            raise ValueError(f"Missing required columns: {missing_columns}")

        # Validate data is not empty
        if data.empty:
            raise ValueError("Data cannot be empty")

        # Create a copy to avoid modifying the original data
        # This is important for Windows systems where file handles can be problematic
        self.data = data.copy()

        # Convert date column to proper datetime format for easier manipulation
        # Handle various date formats that might be encountered on Windows
        try:
            self.data['date'] = pd.to_datetime(
                self.data['date'], errors='coerce')
        except Exception as e:
            raise ValueError(f"Error parsing dates: {str(e)}")

        # Check for invalid dates
        if self.data['date'].isna().any():
            raise ValueError("Invalid date format detected in data")

        # Sort data by date and reset index for consistent ordering
        # This ensures proper chronological analysis
        self.data = self.data.sort_values('date').reset_index(drop=True)

        # Validate numeric columns contain valid data
        numeric_columns = ['open', 'high', 'low', 'close', 'volume']
        for col in numeric_columns:
            if not pd.api.types.is_numeric_dtype(self.data[col]):
                try:
                    self.data[col] = pd.to_numeric(
                        self.data[col], errors='coerce')
                except Exception as e:
                    raise ValueError(
                        f"Error converting {col} to numeric: {str(e)}")

            # Check for negative prices (invalid for stock data)
            if col != 'volume' and (self.data[col] < 0).any():
                raise ValueError(f"Negative values found in {col} column")

            # Check for negative volume (invalid)
            if col == 'volume' and (self.data[col] < 0).any():
                raise ValueError("Negative values found in volume column")

        # Windows-specific optimizations
        if WINDOWS_OPTIMIZED:
            # Optimize data types for Windows memory management
            self.data = self.data.astype({
                'open': 'float64',
                'high': 'float64',
                'low': 'float64',
                'close': 'float64',
                'volume': 'int64'
            })

    def calculate_sma(self, window=DEFAULT_SMA_WINDOW):
        """
        Calculate Simple Moving Average (SMA) for closing prices.

        SMA is the average price over a specified number of periods.
        It helps smooth out price fluctuations to identify trends.

        Args:
            window (int): Number of days to average (default: 5)

        Returns:
            pandas.Series: SMA values (NaN for first window-1 values)
        """
        return self.data['close'].rolling(window=window).mean()

    def calculate_daily_returns(self):
        """
        Calculate daily percentage returns.

        Daily return = (Today's Price - Yesterday's Price) / Yesterday's Price

        Returns:
            pandas.Series: Daily returns as decimal values (0.05 = 5%)
        """
        # pct_change() calculates percentage change from previous value
        return self.data['close'].pct_change()

    def analyze_runs(self):
        """
        Analyze consecutive upward and downward price movements (runs/streaks).

        A "run" is a sequence of consecutive days where the price moves in the same direction.
        This helps identify market trends and momentum.

        Returns:
            dict: Statistics about upward and downward runs including:
                - Total number of runs in each direction
                - Longest streaks
                - Total days in each direction
                - Detailed run information
        """
        # Get daily returns to determine price direction
        daily_returns = self.calculate_daily_returns()

        # Convert returns to direction indicators:
        # 1 = upward movement, -1 = downward movement, 0 = no change
        direction = np.where(daily_returns > 0, 1,
                             np.where(daily_returns < 0, -1, 0))

        # Find consecutive runs of the same direction
        runs = []
        current_run = 1  # Length of current run
        current_direction = direction[0] if len(direction) > 0 else 0

        # Loop through each day to identify runs
        for i in range(1, len(direction)):
            if direction[i] == current_direction and direction[i] != 0:
                # Same direction as previous day, extend current run
                current_run += 1
            else:
                # Direction changed or no change, end current run
                if current_direction != 0:  # Only record non-zero direction runs
                    runs.append({
                        'start': i - current_run,  # Starting day index
                        'end': i - 1,              # Ending day index
                        'length': current_run,     # Number of days in run
                        'direction': 'upward' if current_direction == 1 else 'downward',
                        'direction_value': current_direction
                    })
                # Start new run
                current_run = 1
                current_direction = direction[i]

        # Don't forget the last run if it exists
        if current_direction != 0 and current_run > 0:
            runs.append({
                'start': len(direction) - current_run,
                'end': len(direction) - 1,
                'length': current_run,
                'direction': 'upward' if current_direction == 1 else 'downward',
                'direction_value': current_direction
            })

        # Separate runs by direction for easier analysis
        upward_runs = [r for r in runs if r['direction'] == 'upward']
        downward_runs = [r for r in runs if r['direction'] == 'downward']

        # Convert NumPy types to native Python types for JSON serialization
        # (NumPy types can't be directly converted to JSON)
        runs_serializable = [
            {
                'start': int(run['start']),
                'end': int(run['end']),
                'length': int(run['length']),
                'direction': run['direction'],
                'direction_value': int(run['direction_value'])
            }
            for run in runs
        ]

        # Calculate summary statistics
        stats = {
            'total_upward_runs': int(len(upward_runs)),
            'total_downward_runs': int(len(downward_runs)),
            'longest_upward_streak': int(max([r['length'] for r in upward_runs], default=0)),
            'longest_downward_streak': int(max([r['length'] for r in downward_runs], default=0)),
            'total_upward_days': int(sum([r['length'] for r in upward_runs])),
            'total_downward_days': int(sum([r['length'] for r in downward_runs])),
            'runs': runs_serializable
        }

        return stats

    def calculate_max_profit(self):
        """
        Calculate the maximum possible profit from trading this stock.

        Uses the "Best Time to Buy and Sell Stock II" algorithm, which allows
        multiple transactions. The strategy is simple: buy before every price increase
        and sell after every price increase.

        Returns:
            tuple: (total_profit, list_of_transactions)
                - total_profit: Maximum possible profit
                - transactions: List of buy/sell transactions with details
        """
        prices = self.data['close'].values

        # Need at least 2 prices to make a profit
        if len(prices) < 2:
            return 0, []

        max_profit = 0
        transactions = []

        # Look at each day and the next day
        for i in range(1, len(prices)):
            # If tomorrow's price is higher than today's, buy today and sell tomorrow
            if prices[i] > prices[i-1]:
                # Profit from this transaction
                profit = prices[i] - prices[i-1]
                max_profit += profit

                # Record this transaction
                transactions.append({
                    'buy_day': int(i-1),           # Day we bought (0-indexed)
                    'sell_day': int(i),            # Day we sold (0-indexed)
                    'buy_price': float(prices[i-1]),  # Price we bought at
                    'sell_price': float(prices[i]),   # Price we sold at
                    'profit': float(profit)        # Profit from this trade
                })

        return float(max_profit), transactions

    def get_chart_data(self, sma_window=5):
        """
        Get detailed chart data for interactive visualization with Windows compatibility.

        This method generates comprehensive data points for each day that can be used
        by interactive chart components. It includes all financial metrics and run
        information needed for hover tooltips and detailed analysis.

        Args:
            sma_window (int): Window size for Simple Moving Average calculation
                             Must be a positive integer between 1 and data length

        Returns:
            list: List of dictionaries containing detailed data points for each day
                 Each data point includes:
                 - Basic OHLCV data (open, high, low, close, volume)
                 - Calculated metrics (SMA, daily returns, price changes)
                 - Run information (streak data, direction, position)
                 - Windows-safe data formatting

        Raises:
            ValueError: If sma_window is invalid
            RuntimeError: If data processing fails
        """
        # Validate SMA window parameter
        if not isinstance(sma_window, int) or sma_window < 1:
            raise ValueError("SMA window must be a positive integer")

        if sma_window > len(self.data):
            raise ValueError("SMA window cannot be larger than data length")

        try:
            # Calculate all the metrics we need for the charts
            # These calculations are optimized for Windows systems
            sma = self.calculate_sma(sma_window)
            daily_returns = self.calculate_daily_returns()
            runs_stats = self.analyze_runs()

            # Create detailed data points for each day
            # This loop is optimized for Windows memory management
            chart_data = []

            for i in range(len(self.data)):
                try:
                    # Get run information for this day
                    # This identifies if the current day is part of a price streak
                    current_run = None
                    for run in runs_stats['runs']:
                        if run['start'] <= i <= run['end']:
                            current_run = run
                            break

                    # Calculate additional metrics for this day
                    # These provide context for price movements
                    price_change = 0.0
                    price_change_pct = 0.0

                    if i > 0:
                        # Calculate absolute price change from previous day
                        price_change = float(
                            self.data['close'].iloc[i] - self.data['close'].iloc[i-1])

                        # Calculate percentage price change from previous day
                        # Avoid division by zero
                        prev_close = float(self.data['close'].iloc[i-1])
                        if prev_close != 0:
                            price_change_pct = (
                                price_change / prev_close) * 100

                    # Create comprehensive data point for this day
                    # All values are Windows-safe and JSON-serializable
                    data_point = {
                        # Basic OHLCV data
                        'date': self.data['date'].iloc[i].strftime('%Y-%m-%d'),
                        'open': safe_float(self.data['open'].iloc[i]),
                        'high': safe_float(self.data['high'].iloc[i]),
                        'low': safe_float(self.data['low'].iloc[i]),
                        'close': safe_float(self.data['close'].iloc[i]),
                        'volume': safe_float(self.data['volume'].iloc[i]),

                        # Calculated metrics
                        'sma': safe_float(sma.iloc[i]) if not pd.isna(sma.iloc[i]) else None,
                        'daily_return': safe_float(daily_returns.iloc[i]) if not pd.isna(daily_returns.iloc[i]) else None,
                        'price_change': safe_float(price_change),
                        'price_change_pct': safe_float(price_change_pct),

                        # Run/streak information for interactive tooltips
                        'run_info': {
                            'in_run': current_run is not None,
                            'run_direction': current_run['direction'] if current_run else None,
                            'run_length': current_run['length'] if current_run else None,
                            'run_position': i - current_run['start'] + 1 if current_run else None
                        } if current_run else None,

                        # Additional metadata for Windows compatibility
                        'day_index': i,
                        'sma_window': sma_window
                    }

                    chart_data.append(data_point)

                except Exception as e:
                    # Log error but continue processing other data points
                    # This ensures Windows systems don't crash on individual data point errors
                    print(
                        f"Warning: Error processing data point {i}: {str(e)}")
                    continue

            return chart_data

        except Exception as e:
            # Comprehensive error handling for Windows systems
            error_msg = f"Error generating chart data: {str(e)}"
            print(f"Error: {error_msg}")
            raise RuntimeError(error_msg)

    def create_visualization(self, sma_window=5):
        """
        Create a comprehensive chart showing stock analysis.

        Creates two subplots:
        1. Price chart with moving average and highlighted runs
        2. Daily returns chart

        Args:
            sma_window (int): Window size for Simple Moving Average

        Returns:
            str: Base64-encoded PNG image that can be displayed in web browser
        """
        # Create figure with 2 subplots (one above the other)
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10))

        # Calculate all the metrics we need for the charts
        sma = self.calculate_sma(sma_window)
        daily_returns = self.calculate_daily_returns()
        runs_stats = self.analyze_runs()

        # ===== TOP CHART: Price and Moving Average =====
        # Plot the actual closing prices
        ax1.plot(self.data['date'], self.data['close'],
                 label='Closing Price', linewidth=2, color='blue')

        # Plot the Simple Moving Average
        ax1.plot(self.data['date'], sma,
                 label=f'SMA({sma_window})', linewidth=2, color='red', alpha=0.7)

        # Highlight upward and downward runs with colored backgrounds
        for run in runs_stats['runs']:
            start_date = self.data['date'].iloc[run['start']]
            end_date = self.data['date'].iloc[run['end']]
            color = 'green' if run['direction'] == 'upward' else 'red'
            alpha = 0.3 if run['direction'] == 'upward' else 0.2
            ax1.axvspan(start_date, end_date, alpha=alpha, color=color)

        # Customize the top chart
        ax1.set_title('Stock Price Analysis with Moving Average and Runs',
                      fontsize=14, fontweight='bold')
        ax1.set_xlabel('Date')
        ax1.set_ylabel('Price ($)')
        ax1.legend()
        ax1.grid(True, alpha=0.3)

        # ===== BOTTOM CHART: Daily Returns =====
        # Plot daily returns as percentage
        ax2.plot(self.data['date'], daily_returns * 100,
                 label='Daily Returns (%)', linewidth=1, color='purple')

        # Add horizontal line at 0% for reference
        ax2.axhline(y=0, color='black', linestyle='--', alpha=0.5)

        # Customize the bottom chart
        ax2.set_title('Daily Returns', fontsize=14, fontweight='bold')
        ax2.set_xlabel('Date')
        ax2.set_ylabel('Returns (%)')
        ax2.legend()
        ax2.grid(True, alpha=0.3)

        # Adjust spacing between subplots
        plt.tight_layout()

        # Convert the chart to a base64-encoded image
        # This allows us to send the chart data through the web API
        img_buffer = io.BytesIO()  # Create a buffer to hold the image data
        plt.savefig(img_buffer, format='png', dpi=300, bbox_inches='tight')
        img_buffer.seek(0)  # Reset buffer position to beginning
        img_base64 = base64.b64encode(img_buffer.getvalue()).decode()
        plt.close()  # Close the figure to free memory

        return img_base64


# =============================================================================
# API ENDPOINTS
# =============================================================================
# These functions handle HTTP requests from the frontend

@app.route('/upload', methods=['POST'])
def upload_file():
    """
    Handle CSV file upload from the frontend with Windows compatibility.

    This endpoint receives a CSV file containing stock data and validates it.
    The file must contain specific columns: date, open, high, low, close, volume.
    Includes comprehensive Windows compatibility features and error handling.

    Returns:
        JSON response with upload status and file information

    Windows Compatibility Features:
    - Safe filename handling for Windows file systems
    - Robust CSV parsing with various encodings
    - Memory-efficient file processing
    - Cross-platform path handling
    """
    try:
        # Check if a file was actually uploaded
        if 'file' not in request.files:
            return create_error_response('No file provided')

        file = request.files['file']

        # Check if user selected a file (not just submitted empty form)
        if file.filename == '':
            return create_error_response('No file selected')

        # Get Windows-safe filename
        safe_filename = get_safe_filename(file.filename)

        # Ensure the file is a CSV file (case-insensitive for Windows)
        if not safe_filename.lower().endswith('.csv'):
            return create_error_response('File must be a CSV file')

        # Windows-compatible CSV reading with multiple encoding attempts
        df = None
        encodings_to_try = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']

        for encoding in encodings_to_try:
            try:
                # Reset file pointer for each encoding attempt
                file.seek(0)
                df = pd.read_csv(file, encoding=encoding)
                print(f"Successfully read CSV with {encoding} encoding")
                break
            except UnicodeDecodeError:
                print(
                    f"Failed to read with {encoding} encoding, trying next...")
                continue
            except Exception as e:
                print(f"Error reading with {encoding} encoding: {str(e)}")
                continue

        if df is None:
            return create_error_response('Unable to read CSV file. Please ensure the file is properly formatted and encoded.')

        # Validate DataFrame is not empty
        if df.empty:
            return create_error_response('CSV file is empty')

        # Check if all required columns are present (case-insensitive for Windows)
        df_columns_lower = [col.lower().strip() for col in df.columns]
        required_columns_lower = [col.lower() for col in REQUIRED_COLUMNS]

        missing_columns = []
        for req_col in required_columns_lower:
            if req_col not in df_columns_lower:
                missing_columns.append(req_col)

        if missing_columns:
            return jsonify({
                'error': f'Missing required columns: {missing_columns}',
                'available_columns': list(df.columns),
                'suggestion': 'Please ensure your CSV contains columns: date, open, high, low, close, volume'
            }), 400

        # Standardize column names (case-insensitive)
        column_mapping = {}
        for col in df.columns:
            col_lower = col.lower().strip()
            if col_lower in required_columns_lower:
                original_col = REQUIRED_COLUMNS[required_columns_lower.index(
                    col_lower)]
                column_mapping[col] = original_col

        df = df.rename(columns=column_mapping)

        # Validate data quality before storing
        try:
            # Test data processing with a small sample
            test_analyzer = StockAnalyzer(df.head(5))
            print("Data validation successful")
        except Exception as e:
            return create_error_response(f'Data validation failed: {str(e)}')

        # Store the data globally for use by other endpoints
        # This is safe for Windows systems as we're storing in memory
        global stock_data
        stock_data = df

        # Return success response with comprehensive file information
        return create_success_response({
            'rows': len(df),
            'columns': list(df.columns),
            'date_range': {
                'start': str(df['date'].min()) if not df['date'].empty else 'N/A',
                'end': str(df['date'].max()) if not df['date'].empty else 'N/A'
            },
            'filename': safe_filename,
            'file_size': len(file.read()) if hasattr(file, 'read') else 'Unknown',
            'windows_compatible': True
        }, 'File uploaded successfully')

    except Exception as e:
        # Comprehensive error handling for Windows systems
        error_msg = f'Error processing file: {str(e)}'
        print(f"Upload error: {error_msg}")
        return create_error_response(error_msg)


@app.route('/analyze', methods=['POST'])
def analyze_stock():
    """
    Perform comprehensive stock analysis on uploaded data.

    This is the main analysis endpoint that calculates all metrics and creates
    visualizations. It requires that a CSV file has been uploaded first.

    Returns:
        JSON response containing all analysis results including:
        - Simple Moving Average data
        - Daily returns
        - Runs analysis (streaks)
        - Maximum profit calculations
        - Chart visualization
        - Summary statistics
    """
    try:
        # Get the SMA window from the request (default to 5 days)
        data = request.get_json()
        sma_window = data.get('sma_window', DEFAULT_SMA_WINDOW)

        # Check if data has been uploaded
        if stock_data is None:
            return create_error_response('No data uploaded. Please upload a CSV file first.')

        # Create a new analyzer instance with the uploaded data
        analyzer = StockAnalyzer(stock_data)

        # Calculate all the financial metrics
        sma = analyzer.calculate_sma(sma_window)
        daily_returns = analyzer.calculate_daily_returns()
        runs_stats = analyzer.analyze_runs()
        max_profit, transactions = analyzer.calculate_max_profit()

        # Get detailed chart data for interactive visualization
        chart_data = analyzer.get_chart_data(sma_window)

        # Create the visualization chart
        chart_base64 = analyzer.create_visualization(sma_window)

        # Compile all results into a comprehensive response
        results = {
            'sma': {
                'values': serialize_series(sma),
                'dates': analyzer.data['date'].iloc[sma_window-1:].dt.strftime('%Y-%m-%d').tolist()
            },
            'daily_returns': {
                'values': serialize_series(daily_returns),
                'dates': analyzer.data['date'].iloc[1:].dt.strftime('%Y-%m-%d').tolist()
            },
            'runs_analysis': runs_stats,
            'max_profit': {
                'total_profit': max_profit,
                'transactions': transactions
            },
            'chart': chart_base64,
            'chart_data': chart_data,  # Detailed data for interactive charts
            'summary': {
                'total_days': int(len(analyzer.data)),
                'price_range': {
                    'min': safe_float(analyzer.data['close'].min()),
                    'max': safe_float(analyzer.data['close'].max())
                },
                'avg_volume': safe_float(analyzer.data['volume'].mean()),
                'volatility': safe_float(daily_returns.std())
            }
        }

        return jsonify(results)

    except Exception as e:
        return create_error_response(f'Analysis failed: {str(e)}', 500)


@app.route('/validate', methods=['POST'])
def validate_results():
    """
    Validate the analysis algorithms with known test cases.

    This endpoint runs automated tests to ensure all calculations are working
    correctly. It uses a small dataset with known expected results.

    Returns:
        JSON response with test results and pass/fail status
    """
    try:
        # Create a small test dataset with known values for validation
        test_data = pd.DataFrame({
            'date': pd.date_range('2023-01-01', periods=10, freq='D'),
            'open': [100, 102, 101, 103, 105, 104, 106, 108, 107, 109],
            'high': [101, 103, 102, 104, 106, 105, 107, 109, 108, 110],
            'low': [99, 101, 100, 102, 104, 103, 105, 107, 106, 108],
            'close': [100, 102, 101, 103, 105, 104, 106, 108, 107, 109],
            'volume': [1000, 1100, 1050, 1150, 1200, 1180, 1250, 1300, 1280, 1350]
        })

        # Create analyzer with test data
        analyzer = StockAnalyzer(test_data)

        # Run various test cases
        test_cases = []

        # Test 1: Simple Moving Average calculation
        sma_3 = analyzer.calculate_sma(3)
        expected_sma_3 = [None, None, 101.0, 102.0,
                          103.0, 104.0, 105.0, 106.0, 107.0, 108.0]
        test_cases.append({
            'test': 'SMA(3) calculation',
            'expected': expected_sma_3,
            'actual': serialize_series(sma_3),
            'passed': np.allclose(sma_3.dropna(), [x for x in expected_sma_3 if x is not None], rtol=1e-10)
        })

        # Test 2: Daily returns calculation
        daily_returns = analyzer.calculate_daily_returns()
        expected_returns = [None, 0.02, -0.009803921568627451, 0.019801980198019802,
                            0.01941747572815534, -0.009523809523809523, 0.019230769230769232,
                            0.018867924528301886, -0.009259259259259259, 0.018691588785046728]
        test_cases.append({
            'test': 'Daily returns calculation',
            'expected': expected_returns,
            'actual': serialize_series(daily_returns),
            'passed': np.allclose(daily_returns.dropna(), [x for x in expected_returns if x is not None], rtol=1e-10)
        })

        # Test 3: Maximum profit calculation
        max_profit, _ = analyzer.calculate_max_profit()
        expected_profit = 12.0  # Sum of all positive daily changes: 2+2+2+2+2+2 = 12
        test_cases.append({
            'test': 'Max profit calculation',
            'expected': expected_profit,
            'actual': max_profit,
            'passed': abs(max_profit - expected_profit) < 1e-10
        })

        # Test 4: Runs analysis
        runs_stats = analyzer.analyze_runs()
        test_cases.append({
            'test': 'Runs analysis - upward runs count',
            'expected': 4,  # Based on the test data pattern
            'actual': runs_stats['total_upward_runs'],
            'passed': runs_stats['total_upward_runs'] == 4
        })

        # Test 5: Data structure validation
        test_cases.append({
            'test': 'Data structure validation',
            'expected': 10,
            'actual': len(analyzer.data),
            'passed': len(analyzer.data) == 10
        })

        # Calculate test results summary
        passed_tests = sum(1 for test in test_cases if test['passed'])
        total_tests = len(test_cases)

        return jsonify({
            'test_cases': test_cases,
            'summary': {
                'passed': passed_tests,
                'total': total_tests,
                'success_rate': f"{(passed_tests/total_tests)*100:.1f}%"
            }
        })

    except Exception as e:
        return jsonify({'error': f'Validation failed: {str(e)}'}), 500


@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint to verify the API is running.

    This is useful for monitoring and debugging purposes.

    Returns:
        JSON response indicating API status
    """
    return jsonify({'status': 'healthy', 'message': 'Stock Analysis API is running'})


# =============================================================================
# APPLICATION STARTUP
# =============================================================================
if __name__ == '__main__':
    # Start the Flask development server
    # debug=True enables auto-reload when code changes
    # host='127.0.0.1' ensures compatibility with Windows networking
    # port=5000 is the default Flask port
    print("=" * 60)
    print("Stock Analysis Dashboard - Backend Server")
    print("=" * 60)
    print(f"Server starting on: http://127.0.0.1:5000")
    print("Press Ctrl+C to stop the server")
    print("=" * 60)

    try:
        app.run(debug=True, host='127.0.0.1', port=5000, threaded=True)
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"Error starting server: {e}")
        print("Make sure port 5000 is not already in use")
