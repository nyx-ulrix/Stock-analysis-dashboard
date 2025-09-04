// =============================================================================
// VALIDATION RESULTS COMPONENT
// =============================================================================

import { ValidationResults } from '../types'

interface ValidationResultsProps {
  results: ValidationResults
}

export function ValidationResultsComponent({ results }: ValidationResultsProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Validation Test Results</h2>
      
      {/* Test Summary */}
      <div className="bg-gray-700 p-4 rounded mb-4">
        <div className="text-lg font-bold">
          Success Rate: {results.summary.success_rate}
        </div>
        <div className="text-sm text-gray-300">
          {results.summary.passed} out of {results.summary.total} tests passed
        </div>
      </div>
      
      {/* Individual Test Results */}
      <div className="space-y-2">
        {results.test_cases.map((test, index) => (
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
  )
}
