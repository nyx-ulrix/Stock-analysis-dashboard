// =============================================================================
// STOCK ANALYSIS DASHBOARD - FRONTEND
// =============================================================================
// This is the main React component that provides the user interface for
// uploading stock data and viewing analysis results.

import React, { useState, useRef } from 'react'

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
// These interfaces define the structure of data we expect from the backend API

/**
 * Structure of analysis results returned from the backend
 */
interface AnalysisResults {
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
interface ValidationResults {
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

// =============================================================================
// MAIN COMPONENT
// =============================================================================

function App() {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  // React state variables to track the application's current state
  
  const [file, setFile] = useState<File | null>(null)                    // Currently selected CSV file
  const [uploadStatus, setUploadStatus] = useState<string>('')           // Status messages for user feedback
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null)  // Analysis results from backend
  const [validationResults, setValidationResults] = useState<ValidationResults | null>(null)  // Test validation results
  const [smaWindow, setSmaWindow] = useState<number>(5)                  // Simple Moving Average window size
  const [loading, setLoading] = useState<boolean>(false)                 // Loading state for async operations
  const fileInputRef = useRef<HTMLInputElement>(null)                   // Reference to file input element

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================
  
  /**
   * Handle file selection and upload to the backend
   * @param event - File input change event
   */
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    // Update state to show file is selected
    setFile(selectedFile)
    setLoading(true)
    setUploadStatus('Uploading file...')

    // Create FormData object to send file to backend
    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      // Send POST request to backend upload endpoint
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      
      if (response.ok) {
        // Success: show confirmation with file details
        setUploadStatus(`✅ File uploaded successfully! ${result.rows} rows processed.`)
      } else {
        // Error: show error message from backend
        setUploadStatus(`❌ Upload failed: ${result.error}`)
      }
    } catch (error) {
      // Network or other error
      setUploadStatus(`❌ Upload error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Run stock analysis on the uploaded data
   */
  const runAnalysis = async () => {
    // Check if a file has been uploaded first
    if (!file) {
      setUploadStatus('❌ Please upload a file first')
      return
    }

    setLoading(true)
    setUploadStatus('Running analysis...')

    try {
      // Send analysis request to backend with SMA window parameter
      const response = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sma_window: smaWindow }),
      })

      const result = await response.json()
      
      if (response.ok) {
        // Success: store results and show confirmation
        setAnalysisResults(result)
        setUploadStatus('✅ Analysis completed successfully!')
      } else {
        // Error: show error message from backend
        setUploadStatus(`❌ Analysis failed: ${result.error}`)
      }
    } catch (error) {
      // Network or other error
      setUploadStatus(`❌ Analysis error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Run validation tests to verify the analysis algorithms are working correctly
   */
  const runValidation = async () => {
    setLoading(true)
    setUploadStatus('Running validation tests...')

    try {
      // Send validation request to backend
      const response = await fetch('http://127.0.0.1:5000/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()
      
      if (response.ok) {
        // Success: store validation results and show summary
        setValidationResults(result)
        setUploadStatus(`✅ Validation completed! ${result.summary.passed}/${result.summary.total} tests passed`)
      } else {
        // Error: show error message from backend
        setUploadStatus(`❌ Validation failed: ${result.error}`)
      }
    } catch (error) {
      // Network or other error
      setUploadStatus(`❌ Validation error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  // =============================================================================
  // RENDER COMPONENT
  // =============================================================================
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <h1 className="text-4xl font-bold mb-8 text-center">Stock Analysis Dashboard</h1>
        
        {/* ===== FILE UPLOAD SECTION ===== */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Upload Stock Data</h2>
          <div className="space-y-4">
            {/* File Input */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Select CSV file (must contain: date, open, high, low, close, volume columns)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
            </div>
            
            {/* SMA Window Configuration */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">SMA Window:</label>
              <input
                type="number"
                value={smaWindow}
                onChange={(e) => setSmaWindow(parseInt(e.target.value) || 5)}
                min="1"
                max="50"
                className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={runAnalysis}
                disabled={!file || loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-2 rounded font-medium"
              >
                {loading ? 'Processing...' : 'Run Analysis'}
              </button>
              
              <button
                onClick={runValidation}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-2 rounded font-medium"
              >
                Run Validation Tests
              </button>
            </div>
            
            {/* Status Messages */}
            {uploadStatus && (
              <div className="text-sm p-3 bg-gray-700 rounded">
                {uploadStatus}
              </div>
            )}
          </div>
        </div>

        {/* ===== ANALYSIS RESULTS SECTION ===== */}
        {analysisResults && (
          <div className="space-y-8">
            {/* Price Chart Visualization */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Price Analysis Chart</h2>
              <img 
                src={`data:image/png;base64,${analysisResults.chart}`} 
                alt="Stock Analysis Chart"
                className="w-full h-auto rounded"
              />
            </div>

            {/* Summary Statistics Cards */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Summary Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Total Trading Days */}
                <div className="bg-gray-700 p-4 rounded">
                  <div className="text-sm text-gray-300">Total Days</div>
                  <div className="text-xl font-bold">{analysisResults.summary.total_days}</div>
                </div>
                
                {/* Price Range */}
                <div className="bg-gray-700 p-4 rounded">
                  <div className="text-sm text-gray-300">Price Range</div>
                  <div className="text-lg font-bold">
                    ${analysisResults.summary.price_range.min.toFixed(2)} - ${analysisResults.summary.price_range.max.toFixed(2)}
                  </div>
                </div>
                
                {/* Average Volume */}
                <div className="bg-gray-700 p-4 rounded">
                  <div className="text-sm text-gray-300">Avg Volume</div>
                  <div className="text-xl font-bold">{analysisResults.summary.avg_volume.toLocaleString()}</div>
                </div>
                
                {/* Volatility */}
                <div className="bg-gray-700 p-4 rounded">
                  <div className="text-sm text-gray-300">Volatility</div>
                  <div className="text-xl font-bold">{(analysisResults.summary.volatility * 100).toFixed(2)}%</div>
                </div>
              </div>
            </div>

            {/* Runs Analysis - Price Streaks */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Runs Analysis</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Upward Runs Count */}
                <div className="bg-green-700 p-4 rounded">
                  <div className="text-sm text-green-200">Upward Runs</div>
                  <div className="text-xl font-bold">{analysisResults.runs_analysis.total_upward_runs}</div>
                </div>
                
                {/* Downward Runs Count */}
                <div className="bg-red-700 p-4 rounded">
                  <div className="text-sm text-red-200">Downward Runs</div>
                  <div className="text-xl font-bold">{analysisResults.runs_analysis.total_downward_runs}</div>
                </div>
                
                {/* Longest Upward Streak */}
                <div className="bg-green-600 p-4 rounded">
                  <div className="text-sm text-green-200">Longest Upward Streak</div>
                  <div className="text-xl font-bold">{analysisResults.runs_analysis.longest_upward_streak} days</div>
                </div>
                
                {/* Longest Downward Streak */}
                <div className="bg-red-600 p-4 rounded">
                  <div className="text-sm text-red-200">Longest Downward Streak</div>
                  <div className="text-xl font-bold">{analysisResults.runs_analysis.longest_downward_streak} days</div>
                </div>
              </div>
            </div>

            {/* Maximum Profit Analysis */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Maximum Profit Analysis</h2>
              
              {/* Profit Summary */}
              <div className="bg-gray-700 p-4 rounded mb-4">
                <div className="text-lg font-bold text-green-400">
                  Total Maximum Profit: ${analysisResults.max_profit.total_profit.toFixed(2)}
                </div>
                <div className="text-sm text-gray-300 mt-2">
                  Number of Transactions: {analysisResults.max_profit.transactions.length}
                </div>
              </div>
              
              {/* Transaction Details Table */}
              {analysisResults.max_profit.transactions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Transaction Details</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-600">
                          <th className="text-left py-2">Buy Day</th>
                          <th className="text-left py-2">Sell Day</th>
                          <th className="text-left py-2">Buy Price</th>
                          <th className="text-left py-2">Sell Price</th>
                          <th className="text-left py-2">Profit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisResults.max_profit.transactions.map((transaction, index) => (
                          <tr key={index} className="border-b border-gray-700">
                            <td className="py-2">{transaction.buy_day}</td>
                            <td className="py-2">{transaction.sell_day}</td>
                            <td className="py-2">${transaction.buy_price.toFixed(2)}</td>
                            <td className="py-2">${transaction.sell_price.toFixed(2)}</td>
                            <td className="py-2 text-green-400">${transaction.profit.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== VALIDATION RESULTS SECTION ===== */}
        {validationResults && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Validation Test Results</h2>
            
            {/* Test Summary */}
            <div className="bg-gray-700 p-4 rounded mb-4">
              <div className="text-lg font-bold">
                Success Rate: {validationResults.summary.success_rate}
              </div>
              <div className="text-sm text-gray-300">
                {validationResults.summary.passed} out of {validationResults.summary.total} tests passed
              </div>
            </div>
            
            {/* Individual Test Results */}
            <div className="space-y-2">
              {validationResults.test_cases.map((test, index) => (
                <div key={index} className={`p-3 rounded ${test.passed ? 'bg-green-900' : 'bg-red-900'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{test.test}</span>
                    <span className={`text-sm ${test.passed ? 'text-green-400' : 'text-red-400'}`}>
                      {test.passed ? '✅ PASSED' : '❌ FAILED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Export the App component as the default export
export default App
