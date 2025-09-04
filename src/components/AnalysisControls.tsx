// =============================================================================
// ANALYSIS CONTROLS COMPONENT
// =============================================================================
// This component provides the user interface for configuring and running
// stock analysis operations. It includes controls for setting analysis
// parameters and buttons to trigger different types of analysis.
//
// Key responsibilities:
// - Providing SMA window configuration input
// - Rendering action buttons for analysis and validation
// - Managing button states based on loading and file availability
// - Communicating user actions back to the parent component

/**
 * Props interface for the AnalysisControls component
 * These props are passed down from the parent App component
 */
interface AnalysisControlsProps {
  smaWindow: number                    // Current SMA window size setting
  setSmaWindow: (window: number) => void  // Function to update SMA window size
  onRunAnalysis: () => void           // Callback to run stock analysis
  onRunValidation: () => void         // Callback to run validation tests
  file: File | null                   // Currently selected file (null if none)
  loading: boolean                    // Whether an operation is in progress
}

/**
 * AnalysisControls component that provides configuration and action controls
 * 
 * This component renders:
 * 1. SMA window size input for configuring the moving average calculation
 * 2. Analysis button to run stock analysis (disabled if no file uploaded)
 * 3. Validation button to run test validation (always available)
 * 
 * Button states are managed based on:
 * - File availability (analysis requires a file)
 * - Loading state (buttons disabled during operations)
 * 
 * @param props - Component props containing state and callbacks
 */
export function AnalysisControls({
  smaWindow,
  setSmaWindow,
  onRunAnalysis,
  onRunValidation,
  file,
  loading
}: AnalysisControlsProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-8">
      {/* Component Header */}
      <h2 className="text-2xl font-semibold mb-4">Analysis Controls</h2>
      
      <div className="space-y-4">
        {/* SMA Window Configuration Section */}
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium">SMA Window:</label>
          <input
            type="number"                    // Number input for numeric values
            value={smaWindow}                // Current SMA window value
            onChange={(e) => setSmaWindow(parseInt(e.target.value) || 5)}  // Update on change
            min="1"                         // Minimum value of 1 day
            max="50"                        // Maximum value of 50 days
            className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
          />
        </div>
        
        {/* Action Buttons Section */}
        <div className="flex space-x-4">
          {/* Run Analysis Button */}
          <button
            onClick={onRunAnalysis}         // Trigger analysis when clicked
            disabled={!file || loading}     // Disabled if no file or loading
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-2 rounded font-medium"
          >
            {loading ? 'Processing...' : 'Run Analysis'}
          </button>
          
          {/* Run Validation Button */}
          <button
            onClick={onRunValidation}       // Trigger validation when clicked
            disabled={loading}              // Disabled only when loading
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-2 rounded font-medium"
          >
            Run Validation Tests
          </button>
        </div>
      </div>
    </div>
  )
}
