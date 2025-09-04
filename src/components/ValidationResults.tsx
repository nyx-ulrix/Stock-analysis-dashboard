// =============================================================================
// VALIDATION RESULTS COMPONENT
// =============================================================================
// This component displays the results of automated validation tests
// that verify the analysis algorithms are working correctly.
//
// Key responsibilities:
// - Displaying test summary with pass/fail counts and success rate
// - Showing individual test results with clear pass/fail indicators
// - Using color coding to make results easy to understand
// - Providing detailed information about what each test validates

// Type definition for validation results data structure
import { ValidationResults } from '../types'

/**
 * Props interface for the ValidationResultsComponent
 */
interface ValidationResultsProps {
  results: ValidationResults  // The validation test results from the backend
}

/**
 * ValidationResultsComponent that displays automated test validation results
 * 
 * This component renders:
 * 1. Test summary showing overall success rate and pass/fail counts
 * 2. Individual test results with color-coded pass/fail indicators
 * 3. Clear visual feedback for each test case
 * 
 * @param props - Component props containing the validation results
 */
export function ValidationResultsComponent({ results }: ValidationResultsProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      {/* Component Header */}
      <h2 className="text-2xl font-semibold mb-4">Validation Test Results</h2>
      
      {/* Test Summary Section */}
      <div className="bg-gray-700 p-4 rounded mb-4">
        <div className="text-lg font-bold">
          Success Rate: {results.summary.success_rate}
        </div>
        <div className="text-sm text-gray-300">
          {results.summary.passed} out of {results.summary.total} tests passed
        </div>
      </div>
      
      {/* Individual Test Results Section */}
      <div className="space-y-2">
        {/* Render each test case with appropriate styling */}
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
