// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
// These interfaces define the structure of data we expect from the backend API

/**
 * Structure of a single data point for interactive charts
 */
export interface ChartDataPoint {
  date: string                       // Date in YYYY-MM-DD format
  open: number | null                // Opening price
  high: number | null                // Highest price of the day
  low: number | null                 // Lowest price of the day
  close: number | null               // Closing price
  volume: number | null              // Trading volume
  sma: number | null                 // Simple Moving Average value
  daily_return: number | null        // Daily return percentage
  price_change: number | null        // Absolute price change from previous day
  price_change_pct: number | null    // Percentage price change from previous day
  run_info: {
    in_run: boolean                  // Whether this day is part of a run
    run_direction: string | null     // Direction of the run (upward/downward)
    run_length: number | null        // Length of the current run
    run_position: number | null      // Position within the run (1-based)
  } | null
}

/**
 * Structure of analysis results returned from the backend
 */
export interface AnalysisResults {
  sma: {
    values: number[]      // Simple Moving Average values
    dates: string[]       // Corresponding dates for SMA values
  }
  daily_returns: {
    values: number[]      // Daily return percentages
    dates: string[]       // Corresponding dates for returns
  }
  runs_analysis: {
    total_upward_runs: number        // Number of upward price streaks
    total_downward_runs: number      // Number of downward price streaks
    longest_upward_streak: number    // Longest consecutive upward days
    longest_downward_streak: number  // Longest consecutive downward days
    total_upward_days: number        // Total days with upward movement
    total_downward_days: number      // Total days with downward movement
  }
  max_profit: {
    total_profit: number             // Maximum possible profit
    transactions: Array<{            // Individual buy/sell transactions
      buy_day: number                // Day when stock was bought
      sell_day: number               // Day when stock was sold
      buy_price: number              // Price at which stock was bought
      sell_price: number             // Price at which stock was sold
      profit: number                 // Profit from this transaction
    }>
  }
  chart: string                      // Base64-encoded chart image
  chart_data: ChartDataPoint[]       // Detailed data points for interactive charts
  summary: {
    total_days: number               // Total number of trading days
    price_range: {
      min: number                    // Lowest price in the period
      max: number                    // Highest price in the period
    }
    avg_volume: number               // Average trading volume
    volatility: number               // Price volatility (standard deviation)
  }
}

/**
 * Structure of validation test results
 */
export interface ValidationResults {
  test_cases: Array<{
    test: string           // Name of the test
    expected: any          // Expected result
    actual: any            // Actual result
    passed: boolean        // Whether the test passed
  }>
  summary: {
    passed: number         // Number of tests that passed
    total: number          // Total number of tests
    success_rate: string   // Percentage of tests that passed
  }
}
