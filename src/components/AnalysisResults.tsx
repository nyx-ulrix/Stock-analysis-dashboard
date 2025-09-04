// =============================================================================
// ANALYSIS RESULTS COMPONENT
// =============================================================================

import { AnalysisResults } from '../types'

interface AnalysisResultsProps {
  results: AnalysisResults
}

export function AnalysisResultsComponent({ results }: AnalysisResultsProps) {
  return (
    <div className="space-y-8">
      {/* Price Chart Visualization */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Price Analysis Chart</h2>
        <img 
          src={`data:image/png;base64,${results.chart}`} 
          alt="Stock Analysis Chart"
          className="w-full h-auto rounded"
        />
      </div>

      {/* Summary Statistics Cards */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Summary Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700 p-4 rounded">
            <div className="text-sm text-gray-300">Total Days</div>
            <div className="text-xl font-bold">{results.summary.total_days}</div>
          </div>
          
          <div className="bg-gray-700 p-4 rounded">
            <div className="text-sm text-gray-300">Price Range</div>
            <div className="text-lg font-bold">
              ${results.summary.price_range.min.toFixed(2)} - ${results.summary.price_range.max.toFixed(2)}
            </div>
          </div>
          
          <div className="bg-gray-700 p-4 rounded">
            <div className="text-sm text-gray-300">Avg Volume</div>
            <div className="text-xl font-bold">{results.summary.avg_volume.toLocaleString()}</div>
          </div>
          
          <div className="bg-gray-700 p-4 rounded">
            <div className="text-sm text-gray-300">Volatility</div>
            <div className="text-xl font-bold">{(results.summary.volatility * 100).toFixed(2)}%</div>
          </div>
        </div>
      </div>

      {/* Runs Analysis - Price Streaks */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Runs Analysis</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-700 p-4 rounded">
            <div className="text-sm text-green-200">Upward Runs</div>
            <div className="text-xl font-bold">{results.runs_analysis.total_upward_runs}</div>
          </div>
          
          <div className="bg-red-700 p-4 rounded">
            <div className="text-sm text-red-200">Downward Runs</div>
            <div className="text-xl font-bold">{results.runs_analysis.total_downward_runs}</div>
          </div>
          
          <div className="bg-green-600 p-4 rounded">
            <div className="text-sm text-green-200">Longest Upward Streak</div>
            <div className="text-xl font-bold">{results.runs_analysis.longest_upward_streak} days</div>
          </div>
          
          <div className="bg-red-600 p-4 rounded">
            <div className="text-sm text-red-200">Longest Downward Streak</div>
            <div className="text-xl font-bold">{results.runs_analysis.longest_downward_streak} days</div>
          </div>
        </div>
      </div>

      {/* Maximum Profit Analysis */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Maximum Profit Analysis</h2>
        
        {/* Profit Summary */}
        <div className="bg-gray-700 p-4 rounded mb-4">
          <div className="text-lg font-bold text-green-400">
            Total Maximum Profit: ${results.max_profit.total_profit.toFixed(2)}
          </div>
          <div className="text-sm text-gray-300 mt-2">
            Number of Transactions: {results.max_profit.transactions.length}
          </div>
        </div>
        
        {/* Transaction Details Table */}
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
