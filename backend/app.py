# =============================================================================
# STOCK ANALYSIS DASHBOARD - BACKEND API
# =============================================================================
# This is the backend server that handles stock data analysis requests.
# It provides REST API endpoints for uploading CSV files and performing
# various financial calculations and visualizations.

# Import necessary libraries for data processing and web API
import warnings
import base64
import io

# Data visualization library - creates charts and graphs
import matplotlib
import matplotlib.pyplot as plt

# Web framework for creating REST API endpoints
from flask import Flask, request, jsonify
from flask_cors import CORS

# Data manipulation libraries
import pandas as pd
import numpy as np

# Configure matplotlib to work without a display (for server environments)
matplotlib.use('Agg')  # Use non-interactive backend
warnings.filterwarnings('ignore')  # Suppress warning messages

# =============================================================================
# CONSTANTS
# =============================================================================
DEFAULT_SMA_WINDOW = 5
REQUIRED_COLUMNS = ['date', 'open', 'high', 'low', 'close', 'volume']
API_BASE_URL = 'http://127.0.0.1:5000'

# Initialize Flask application
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for frontend communication

# Global variable to store uploaded data (in production, use a database)
stock_data = None


# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def safe_float(value):
    """Convert value to float, return None if NaN or invalid."""
    if pd.isna(value):
        return None
    try:
        return float(value)
    except (ValueError, TypeError):
        return None


def serialize_series(series):
    """Convert pandas Series to JSON-serializable list, replacing NaN with None."""
    return series.replace({np.nan: None}).tolist()


def create_error_response(message, status_code=400):
    """Create standardized error response."""
    return jsonify({'error': message}), status_code


def create_success_response(data, message=None):
    """Create standardized success response."""
    response = data
    if message:
        response = {'message': message, **data}
    return jsonify(response)


class StockAnalyzer:
    """
    A class that performs various financial calculations on stock data.

    This class takes stock price data and provides methods to calculate:
    - Simple Moving Averages (SMA)
    - Daily returns (percentage change)
    - Upward and downward price runs/streaks
    - Maximum possible profit from trading
    - Data visualizations
    """

    def __init__(self, data):
        """
        Initialize the analyzer with stock data.

        Args:
            data (pandas.DataFrame): Stock data with columns: date, open, high, low, close, volume
        """
        # Create a copy to avoid modifying the original data
        self.data = data.copy()

        # Convert date column to proper datetime format for easier manipulation
        self.data['date'] = pd.to_datetime(self.data['date'])

        # Sort data by date and reset index for consistent ordering
        self.data = self.data.sort_values('date').reset_index(drop=True)

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
    Handle CSV file upload from the frontend.

    This endpoint receives a CSV file containing stock data and validates it.
    The file must contain specific columns: date, open, high, low, close, volume.

    Returns:
        JSON response with upload status and file information
    """
    # Check if a file was actually uploaded
    if 'file' not in request.files:
        return create_error_response('No file provided')

    file = request.files['file']

    # Check if user selected a file (not just submitted empty form)
    if file.filename == '':
        return create_error_response('No file selected')

    # Ensure the file is a CSV file
    if not file.filename.endswith('.csv'):
        return create_error_response('File must be a CSV')

    try:
        # Read the CSV file into a pandas DataFrame
        df = pd.read_csv(file)

        # Check if all required columns are present
        missing_columns = [
            col for col in REQUIRED_COLUMNS if col not in df.columns]
        if missing_columns:
            return jsonify({
                'error': f'Missing required columns: {missing_columns}',
                'available_columns': list(df.columns)
            }), 400

        # Store the data globally for use by other endpoints
        global stock_data
        stock_data = df

        # Return success response with file information
        return create_success_response({
            'rows': len(df),
            'columns': list(df.columns),
            'date_range': {
                'start': df['date'].min(),
                'end': df['date'].max()
            }
        }, 'File uploaded successfully')

    except Exception as e:
        return create_error_response(f'Error processing file: {str(e)}')


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
    # port=5000 is the default Flask port
    app.run(debug=True, port=5000)
