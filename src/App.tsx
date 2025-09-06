// =============================================================================
// STOCK ANALYSIS DASHBOARD - MAIN APPLICATION COMPONENT
// =============================================================================
// This is the main React component that orchestrates the entire application.
// It manages the application state and coordinates between different components
// to provide a complete stock analysis experience.
//
// Key responsibilities:
// - Managing global application state (file upload, analysis results, etc.)
// - Handling user interactions and API calls
// - Coordinating data flow between components
// - Providing the main UI layout and structure

// React hooks for managing component state
import { useState, useEffect } from 'react'

// Type definitions for our data structures
import { AnalysisResults, ValidationResults } from './types'

// API functions for communicating with the backend
import { runAnalysis, runValidation, checkBackendHealth } from './api'

// UI components that make up the application interface
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
  // React state variables that control the application's behavior and display.
  // Each state variable has a corresponding setter function to update it.
  
  // File management state
  const [file, setFile] = useState<File | null>(null)  // Currently selected CSV file
  
  // UI feedback state
  const [uploadStatus, setUploadStatus] = useState<string>('')  // Status messages for user
  const [loading, setLoading] = useState<boolean>(false)  // Loading indicator state
  
  // Analysis results state
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null)  // Stock analysis data
  const [validationResults, setValidationResults] = useState<ValidationResults | null>(null)  // Test validation results
  
  // Analysis configuration state
  const [smaWindow, setSmaWindow] = useState<number>(5)  // Simple Moving Average window size
  
  // Backend connectivity state
  const [backendConnected, setBackendConnected] = useState<boolean>(false)  // Backend server status

  // =============================================================================
  // EFFECTS
  // =============================================================================
  // React effects that run when the component mounts or when dependencies change
  
  /**
   * Check backend connectivity when the component mounts
   * This ensures the user knows if the backend server is running
   */
  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await checkBackendHealth()
      setBackendConnected(isConnected)
      
      if (!isConnected) {
        setUploadStatus('⚠️ Backend server not running. Please start the Flask backend first.')
      }
    }
    
    checkConnection()
  }, [])

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================
  // Functions that respond to user interactions and update the application state.
  // These handlers are passed down to child components as props.
  
  /**
   * Handles file selection from the file upload component
   * @param selectedFile - The CSV file selected by the user
   */
  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
  }

  /**
   * Handles successful file upload
   * @param message - Success message to display to the user
   */
  const handleUploadSuccess = (message: string) => {
    setUploadStatus(message)
  }

  /**
   * Handles file upload errors
   * @param error - Error message to display to the user
   */
  const handleUploadError = (error: string) => {
    setUploadStatus(error)
  }

  /**
   * Runs the stock analysis with the current SMA window setting
   * This function calls the backend API to perform comprehensive stock analysis
   */
  const handleRunAnalysis = async () => {
    // Check if backend is connected
    if (!backendConnected) {
      setUploadStatus('❌ Backend server not running. Please start the Flask backend first.')
      return
    }

    // Validate that a file has been uploaded before running analysis
    if (!file) {
      setUploadStatus('❌ Please upload a file first')
      return
    }

    // Set loading state and show progress message
    setLoading(true)
    setUploadStatus('Running analysis...')

    // Call the backend API to perform analysis
    const result = await runAnalysis(smaWindow)
    
    // Handle the API response
    if (result.data) {
      setAnalysisResults(result.data)
      setUploadStatus('✅ Analysis completed successfully!')
    } else {
      setUploadStatus(`❌ Analysis failed: ${result.error}`)
    }
    
    // Clear loading state
    setLoading(false)
  }

  /**
   * Runs validation tests to verify the analysis algorithms are working correctly
   * This function calls the backend API to run automated tests
   */
  const handleRunValidation = async () => {
    // Check if backend is connected
    if (!backendConnected) {
      setUploadStatus('❌ Backend server not running. Please start the Flask backend first.')
      return
    }

    // Set loading state and show progress message
    setLoading(true)
    setUploadStatus('Running validation tests...')

    // Call the backend API to run validation tests
    const result = await runValidation()
    
    // Handle the API response
    if (result.data) {
      setValidationResults(result.data)
      setUploadStatus(`✅ Validation completed! ${result.data.summary.passed}/${result.data.summary.total} tests passed`)
    } else {
      setUploadStatus(`❌ Validation failed: ${result.error}`)
    }
    
    // Clear loading state
    setLoading(false)
  }

  // =============================================================================
  // RENDER COMPONENT
  // =============================================================================
  // The JSX that defines the visual structure of the application.
  // This is what gets rendered to the DOM when the component mounts.
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Application Header */}
        <h1 className="text-4xl font-bold mb-8 text-center">Stock Analysis Dashboard</h1>
        
        {/* Backend Status Indicator */}
        <div className={`mb-6 p-4 rounded-lg text-center ${
          backendConnected 
            ? 'bg-green-900 border border-green-500' 
            : 'bg-red-900 border border-red-500'
        }`}>
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              backendConnected ? 'bg-green-400' : 'bg-red-400'
            }`}></div>
            <span className="font-semibold">
              {backendConnected 
                ? '✅ Backend Connected' 
                : '❌ Backend Disconnected'
              }
            </span>
          </div>
          {!backendConnected && (
            <p className="mt-2 text-sm text-gray-300">
              Please start the Flask backend server first. Run: <code className="bg-gray-800 px-2 py-1 rounded">python app.py</code> in the backend directory.
            </p>
          )}
        </div>
        
        {/* File Upload Component - Allows users to select and upload CSV files */}
        <FileUpload
          onFileSelect={handleFileSelect}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          setLoading={setLoading}
        />

        {/* Analysis Controls - Configuration and action buttons */}
        <AnalysisControls
          smaWindow={smaWindow}
          setSmaWindow={setSmaWindow}
          onRunAnalysis={handleRunAnalysis}
          onRunValidation={handleRunValidation}
          file={file}
          loading={loading}
        />

        {/* Status Messages - Shows feedback to the user */}
        <StatusMessage message={uploadStatus} />

        {/* Analysis Results - Displays charts and analysis data (only when available) */}
        {analysisResults && (
          <AnalysisResultsComponent results={analysisResults} smaWindow={smaWindow} />
        )}

        {/* Validation Results - Shows test results (only when available) */}
        {validationResults && (
          <ValidationResultsComponent results={validationResults} />
        )}
      </div>
    </div>
  )
}

// Export the App component as the default export
export default App
