// =============================================================================
// INTERACTIVE CHART COMPONENT
// =============================================================================
// This component provides interactive charts with hover functionality
// It displays stock price data with SMA and allows users to hover for details
//
// Windows Compatibility Features:
// - Optimized for Windows browsers and display systems
// - Robust error handling for Windows-specific issues
// - Cross-platform data formatting
// - Windows-friendly tooltip positioning

import React, { useState, useCallback, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart
} from 'recharts'
import { ChartDataPoint } from '../types'

interface InteractiveChartProps {
  data: ChartDataPoint[]
  smaWindow: number
  onError?: (error: string) => void  // Error callback for Windows compatibility
}

// Windows-specific utility functions
const isWindowsBrowser = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.navigator.platform.toLowerCase().includes('win')
}

const formatNumberForWindows = (value: number | null, decimals: number = 2): string => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A'
  
  // Use Windows-compatible number formatting
  const formatted = value.toFixed(decimals)
  
  // Add thousand separators for better readability on Windows
  if (Math.abs(value) >= 1000) {
    return formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  
  return formatted
}

const formatCurrencyForWindows = (value: number | null): string => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A'
  
  // Windows-compatible currency formatting
  const formatted = formatNumberForWindows(value, 2)
  return `$${formatted}`
}

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

// Custom tooltip component for detailed hover information with Windows compatibility
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  // Error handling for Windows systems
  if (!active || !payload || payload.length === 0) {
    return null
  }

  try {
    const data = payload[0].payload as ChartDataPoint & { smaWindow?: number }
    
    // Validate data structure for Windows compatibility
    if (!data || typeof data !== 'object') {
      return (
        <div className="bg-red-50 p-2 border border-red-300 rounded text-red-600 text-xs">
          Invalid data format
        </div>
      )
    }
    
    return (
      <div className={`bg-white p-4 border border-gray-300 rounded-lg shadow-lg max-w-xs ${isWindowsBrowser() ? 'font-segoe' : ''}`}>
        <div className="text-sm font-semibold text-gray-800 mb-2">
          {data.date || 'Unknown Date'}
        </div>
        
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Open:</span>
            <span className="font-medium">{formatCurrencyForWindows(data.open)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">High:</span>
            <span className="font-medium text-green-600">{formatCurrencyForWindows(data.high)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Low:</span>
            <span className="font-medium text-red-600">{formatCurrencyForWindows(data.low)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Close:</span>
            <span className="font-medium">{formatCurrencyForWindows(data.close)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Volume:</span>
            <span className="font-medium">{formatNumberForWindows(data.volume, 0)}</span>
          </div>
          
          {data.sma !== null && data.sma !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-600">SMA({data.smaWindow || 5}):</span>
              <span className="font-medium text-blue-600">{formatCurrencyForWindows(data.sma)}</span>
            </div>
          )}
          
          {data.daily_return !== null && data.daily_return !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-600">Daily Return:</span>
              <span className={`font-medium ${data.daily_return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatNumberForWindows(data.daily_return * 100, 2)}%
              </span>
            </div>
          )}
          
          {data.price_change !== null && data.price_change !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-600">Price Change:</span>
              <span className={`font-medium ${data.price_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.price_change >= 0 ? '+' : ''}{formatCurrencyForWindows(data.price_change)}
              </span>
            </div>
          )}
          
          {data.run_info?.in_run && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Run:</span>
                  <span className={`font-medium ${data.run_info.run_direction === 'upward' ? 'text-green-600' : 'text-red-600'}`}>
                    {data.run_info.run_direction || 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Length:</span>
                  <span className="font-medium">{data.run_info.run_length || 0} days</span>
                </div>
                <div className="flex justify-between">
                  <span>Position:</span>
                  <span className="font-medium">{data.run_info.run_position || 0} of {data.run_info.run_length || 0}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    // Error handling for Windows systems
    console.error('Tooltip rendering error:', error)
    return (
      <div className="bg-red-50 p-2 border border-red-300 rounded text-red-600 text-xs">
        Error displaying data
      </div>
    )
  }
}

// Main interactive chart component with Windows compatibility
export const InteractiveChart: React.FC<InteractiveChartProps> = ({ data, smaWindow, onError }) => {
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Error handling callback for Windows systems
  const handleError = useCallback((error: string) => {
    setHasError(true)
    setErrorMessage(error)
    console.error('InteractiveChart error:', error)
    if (onError) {
      onError(error)
    }
  }, [onError])

  // Validate data with Windows compatibility
  const validatedData = useMemo(() => {
    try {
      if (!data || !Array.isArray(data) || data.length === 0) {
        handleError('No data available for chart')
        return []
      }

      // Validate each data point for Windows compatibility
      return data.map((point, index) => {
        try {
          // Ensure all required fields exist and are properly formatted
          const validatedPoint = {
            ...point,
            index,
            smaWindow,
            // Ensure numeric values are properly formatted for Windows
            open: typeof point.open === 'number' ? point.open : null,
            high: typeof point.high === 'number' ? point.high : null,
            low: typeof point.low === 'number' ? point.low : null,
            close: typeof point.close === 'number' ? point.close : null,
            volume: typeof point.volume === 'number' ? point.volume : null,
            sma: typeof point.sma === 'number' ? point.sma : null,
            daily_return: typeof point.daily_return === 'number' ? point.daily_return : null,
            price_change: typeof point.price_change === 'number' ? point.price_change : null,
            price_change_pct: typeof point.price_change_pct === 'number' ? point.price_change_pct : null,
            date: point.date || `Day ${index + 1}`
          }
          return validatedPoint
        } catch (pointError) {
          console.warn(`Error validating data point ${index}:`, pointError)
          return null
        }
      }).filter(Boolean) // Remove null entries
    } catch (error) {
      handleError(`Data validation failed: ${error}`)
      return []
    }
  }, [data, smaWindow, handleError])

  // Early return for error state
  if (hasError) {
    return (
      <div className="w-full h-96 bg-white rounded-lg shadow-lg p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">
            Chart Error
          </div>
          <div className="text-gray-600 text-sm">
            {errorMessage || 'Unable to display chart'}
          </div>
          <button 
            onClick={() => {
              setHasError(false)
              setErrorMessage(null)
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Prepare data for the chart with error handling
  const chartData = validatedData

  return (
    <div className="chart-container bg-transparent rounded-lg shadow-lg p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">
          Interactive Stock Analysis
        </h3>
        <p className="text-sm text-gray-300">
          Hover over the chart to see detailed information for each day
        </p>
      </div>

      <div className="chart-wrapper responsive-chart h-96">
        <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            tickFormatter={(value: string) => new Date(value).toLocaleDateString()}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            tickFormatter={(value: number) => `$${value.toFixed(2)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Price range area */}
          <Area
            type="monotone"
            dataKey="high"
            stroke="none"
            fill="#e6f7ff"
            fillOpacity={0.1}
          />
          <Area
            type="monotone"
            dataKey="low"
            stroke="none"
            fill="#fff2e6"
            fillOpacity={0.1}
          />
          
          {/* Closing price line */}
          <Line
            type="monotone"
            dataKey="close"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={false}
            name="Closing Price"
          />
          
          {/* SMA line */}
          <Line
            type="monotone"
            dataKey="sma"
            stroke="#f87171"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name={`SMA(${smaWindow})`}
          />
          
          {/* High price line */}
          <Line
            type="monotone"
            dataKey="high"
            stroke="#4ade80"
            strokeWidth={1}
            dot={false}
            name="High"
          />
          
          {/* Low price line */}
          <Line
            type="monotone"
            dataKey="low"
            stroke="#f87171"
            strokeWidth={1}
            dot={false}
            name="Low"
          />
        </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-blue-400"></div>
          <span className="text-gray-300">Closing Price</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-red-400 border-dashed border-t-2"></div>
          <span className="text-gray-300">SMA({smaWindow})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-green-400"></div>
          <span className="text-gray-300">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-red-400"></div>
          <span className="text-gray-300">Low</span>
        </div>
      </div>
    </div>
  )
}

// Daily returns chart component
export const DailyReturnsChart: React.FC<{ data: ChartDataPoint[] }> = ({ data }) => {
  const chartData = data.map((point, index) => ({
    ...point,
    index,
    daily_return_pct: point.daily_return ? point.daily_return * 100 : null
  }))

  return (
    <div className="chart-container bg-transparent rounded-lg shadow-lg p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">
          Daily Returns
        </h3>
        <p className="text-sm text-gray-300">
          Hover to see detailed return information
        </p>
      </div>

      <div className="chart-wrapper responsive-chart h-64">
        <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            tickFormatter={(value: string) => new Date(value).toLocaleDateString()}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            tickFormatter={(value: number) => `${value.toFixed(1)}%`}
          />
          <Tooltip 
            content={({ active, payload }: { active?: boolean; payload?: any[] }) => {
              if (active && payload && payload.length > 0) {
                const data = payload[0].payload as ChartDataPoint
                return (
                  <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
                    <div className="text-sm font-semibold text-gray-800 mb-1">
                      {data.date}
                    </div>
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Daily Return:</span>
                        <span className={`font-medium ${data.daily_return && data.daily_return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {data.daily_return ? (data.daily_return * 100).toFixed(2) + '%' : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price Change:</span>
                        <span className={`font-medium ${data.price_change && data.price_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {data.price_change ? (data.price_change >= 0 ? '+' : '') + '$' + data.price_change.toFixed(2) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <ReferenceLine y={0} stroke="#9CA3AF" strokeDasharray="2 2" />
          
          <Line
            type="monotone"
            dataKey="daily_return_pct"
            stroke="#a78bfa"
            strokeWidth={2}
            dot={false}
            name="Daily Returns (%)"
          />
        </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
