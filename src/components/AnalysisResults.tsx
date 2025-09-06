// =============================================================================
// ANALYSIS RESULTS COMPONENT
// =============================================================================
// This component displays the comprehensive results of stock analysis.
// It renders charts, statistics, and detailed analysis data in an
// organized and visually appealing format.
//
// Key responsibilities:
// - Displaying the generated price analysis chart
// - Showing summary statistics in card format
// - Presenting runs analysis (price streaks) with color coding
// - Displaying maximum profit analysis with transaction details
// - Organizing data in a clear, readable layout

// Type definition for analysis results data structure
import { AnalysisResults } from '../types'
import { InteractiveChart, DailyReturnsChart } from './InteractiveChart'

/**
 * Props interface for the AnalysisResultsComponent
 */
interface AnalysisResultsProps {
  results: AnalysisResults  // The complete analysis results from the backend
  smaWindow: number        // SMA window size for interactive charts
}

/**
 * AnalysisResultsComponent that displays comprehensive stock analysis results
 * 
 * This component renders multiple sections of analysis data:
 * 1. Price chart visualization with moving averages and runs
 * 2. Summary statistics cards showing key metrics
 * 3. Runs analysis showing price streaks and trends
 * 4. Maximum profit analysis with detailed transaction breakdown
 * 
 * @param props - Component props containing the analysis results
 */
export function AnalysisResultsComponent({ results, smaWindow }: AnalysisResultsProps) {
  return (
    <div className="space-y-8">
      {/* Interactive Charts Section */}
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Interactive Price Analysis</h2>
          <p className="text-gray-300 mb-4">
            Hover over the chart to see detailed information for each day
          </p>
          {/* Interactive chart with hover functionality */}
          <InteractiveChart data={results.chart_data} smaWindow={smaWindow} />
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Daily Returns Analysis</h2>
          <p className="text-gray-300 mb-4">
            Interactive daily returns chart with hover details
          </p>
          {/* Interactive daily returns chart */}
          <DailyReturnsChart data={results.chart_data} />
        </div>

        {/* Static Chart for Reference */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Static Analysis Chart</h2>
          <p className="text-gray-300 mb-4">
            Traditional chart view for reference
          </p>
          {/* Display the base64-encoded chart image from the backend */}
          <img 
            src={`data:image/png;base64,${results.chart}`} 
            alt="Stock Analysis Chart"
            className="w-full h-auto rounded"
          />
        </div>
      </div>

      {/* Summary Statistics Cards Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Summary Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Days Card */}
          <div className="bg-gray-700 p-4 rounded">
            <div className="text-sm text-gray-300">Total Days</div>
            <div className="text-xl font-bold">{results.summary.total_days}</div>
          </div>
          
          {/* Price Range Card */}
          <div className="bg-gray-700 p-4 rounded">
            <div className="text-sm text-gray-300">Price Range</div>
            <div className="text-lg font-bold">
              ${results.summary.price_range.min.toFixed(2)} - ${results.summary.price_range.max.toFixed(2)}
            </div>
          </div>
          
          {/* Average Volume Card */}
          <div className="bg-gray-700 p-4 rounded">
            <div className="text-sm text-gray-300">Avg Volume</div>
            <div className="text-xl font-bold">{results.summary.avg_volume.toLocaleString()}</div>
          </div>
          
          {/* Volatility Card */}
          <div className="bg-gray-700 p-4 rounded">
            <div className="text-sm text-gray-300">Volatility</div>
            <div className="text-xl font-bold">{(results.summary.volatility * 100).toFixed(2)}%</div>
          </div>
        </div>
      </div>

      {/* Runs Analysis Section - Price Streaks and Trends */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Runs Analysis</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Upward Runs Count */}
          <div className="bg-green-700 p-4 rounded">
            <div className="text-sm text-green-200">Upward Runs</div>
            <div className="text-xl font-bold">{results.runs_analysis.total_upward_runs}</div>
          </div>
          
          {/* Downward Runs Count */}
          <div className="bg-red-700 p-4 rounded">
            <div className="text-sm text-red-200">Downward Runs</div>
            <div className="text-xl font-bold">{results.runs_analysis.total_downward_runs}</div>
          </div>
          
          {/* Longest Upward Streak */}
          <div className="bg-green-600 p-4 rounded">
            <div className="text-sm text-green-200">Longest Upward Streak</div>
            <div className="text-xl font-bold">{results.runs_analysis.longest_upward_streak} days</div>
          </div>
          
          {/* Longest Downward Streak */}
          <div className="bg-red-600 p-4 rounded">
            <div className="text-sm text-red-200">Longest Downward Streak</div>
            <div className="text-xl font-bold">{results.runs_analysis.longest_downward_streak} days</div>
          </div>
        </div>
      </div>

      {/* Maximum Profit Analysis Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Maximum Profit Analysis</h2>
        
        {/* Profit Summary Card */}
        <div className="bg-gray-700 p-4 rounded mb-4">
          <div className="text-lg font-bold text-green-400">
            Total Maximum Profit: ${results.max_profit.total_profit.toFixed(2)}
          </div>
          <div className="text-sm text-gray-300 mt-2">
            Number of Transactions: {results.max_profit.transactions.length}
          </div>
        </div>
        
        {/* Transaction Details Table - Only show if there are transactions */}
        {results.max_profit.transactions.length > 0 && (
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
                  {/* Render each transaction as a table row */}
                  {results.max_profit.transactions.map((transaction, index) => (
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
  )
}
