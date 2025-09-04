// =============================================================================
// ANALYSIS CONTROLS COMPONENT
// =============================================================================


interface AnalysisControlsProps {
  smaWindow: number
  setSmaWindow: (window: number) => void
  onRunAnalysis: () => void
  onRunValidation: () => void
  file: File | null
  loading: boolean
}

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
      <h2 className="text-2xl font-semibold mb-4">Analysis Controls</h2>
      <div className="space-y-4">
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
            onClick={onRunAnalysis}
            disabled={!file || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-2 rounded font-medium"
          >
            {loading ? 'Processing...' : 'Run Analysis'}
          </button>
          
          <button
            onClick={onRunValidation}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-2 rounded font-medium"
          >
            Run Validation Tests
          </button>
        </div>
      </div>
    </div>
  )
}
