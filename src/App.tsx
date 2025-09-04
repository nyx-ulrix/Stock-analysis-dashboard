// =============================================================================
// STOCK ANALYSIS DASHBOARD - FRONTEND
// =============================================================================
// This is the main React component that provides the user interface for
// uploading stock data and viewing analysis results.

import { useState } from 'react'
import { AnalysisResults, ValidationResults } from './types'
import { runAnalysis, runValidation } from './api'
import { FileUpload } from './components/FileUpload'
import { AnalysisControls } from './components/AnalysisControls'
import { StatusMessage } from './components/StatusMessage'
import { AnalysisResultsComponent } from './components/AnalysisResults'
import { ValidationResultsComponent } from './components/ValidationResults'

// =============================================================================
// MAIN COMPONENT
// =============================================================================

function App() {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  const [file, setFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<string>('')
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null)
  const [validationResults, setValidationResults] = useState<ValidationResults | null>(null)
  const [smaWindow, setSmaWindow] = useState<number>(5)
  const [loading, setLoading] = useState<boolean>(false)

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================
  
  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
  }

  const handleUploadSuccess = (message: string) => {
    setUploadStatus(message)
  }

  const handleUploadError = (error: string) => {
    setUploadStatus(error)
  }

  const handleRunAnalysis = async () => {
    if (!file) {
      setUploadStatus('❌ Please upload a file first')
      return
    }

    setLoading(true)
    setUploadStatus('Running analysis...')

    const result = await runAnalysis(smaWindow)
    
    if (result.data) {
      setAnalysisResults(result.data)
      setUploadStatus('✅ Analysis completed successfully!')
    } else {
      setUploadStatus(`❌ Analysis failed: ${result.error}`)
    }
    
    setLoading(false)
  }

  const handleRunValidation = async () => {
    setLoading(true)
    setUploadStatus('Running validation tests...')

    const result = await runValidation()
    
    if (result.data) {
      setValidationResults(result.data)
      setUploadStatus(`✅ Validation completed! ${result.data.summary.passed}/${result.data.summary.total} tests passed`)
    } else {
      setUploadStatus(`❌ Validation failed: ${result.error}`)
    }
    
    setLoading(false)
  }

  // =============================================================================
  // RENDER COMPONENT
  // =============================================================================
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <h1 className="text-4xl font-bold mb-8 text-center">Stock Analysis Dashboard</h1>
        
        {/* File Upload Section */}
        <FileUpload
          onFileSelect={handleFileSelect}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          loading={loading}
          setLoading={setLoading}
        />

        {/* Analysis Controls */}
        <AnalysisControls
          smaWindow={smaWindow}
          setSmaWindow={setSmaWindow}
          onRunAnalysis={handleRunAnalysis}
          onRunValidation={handleRunValidation}
          file={file}
          loading={loading}
        />

        {/* Status Messages */}
        <StatusMessage message={uploadStatus} />

        {/* Analysis Results */}
        {analysisResults && (
          <AnalysisResultsComponent results={analysisResults} />
        )}

        {/* Validation Results */}
        {validationResults && (
          <ValidationResultsComponent results={validationResults} />
        )}
      </div>
    </div>
  )
}

// Export the App component as the default export
export default App
