// =============================================================================
// FILE UPLOAD COMPONENT
// =============================================================================
// This component provides a user interface for selecting and uploading CSV files
// containing stock data. It handles file validation and communicates with the
// backend to process the uploaded files.
//
// Key responsibilities:
// - Providing a file input interface for CSV file selection
// - Validating file types (must be .csv)
// - Uploading files to the backend API
// - Providing feedback to the parent component about upload status
// - Managing loading states during upload

// React hooks for managing component state and references
import { useRef } from 'react'

// API function for uploading files to the backend
import { uploadFile } from '../api'

/**
 * Props interface for the FileUpload component
 * These props are passed down from the parent App component
 */
interface FileUploadProps {
  onFileSelect: (file: File) => void        // Callback when a file is selected
  onUploadSuccess: (message: string) => void  // Callback for successful upload
  onUploadError: (error: string) => void   // Callback for upload errors
  setLoading: (loading: boolean) => void   // Function to update loading state
}

/**
 * FileUpload component that handles CSV file selection and upload
 * 
 * This component renders a file input and handles the upload process:
 * 1. User selects a CSV file using the file input
 * 2. File is immediately passed to parent component via onFileSelect
 * 3. File is uploaded to backend API
 * 4. Success/error feedback is provided to parent component
 * 
 * @param props - Component props containing callbacks and state
 */
export function FileUpload({ 
  onFileSelect, 
  onUploadSuccess, 
  onUploadError, 
  setLoading 
}: FileUploadProps) {
  // Reference to the file input element for programmatic access
  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * Handles file selection and upload process
   * 
   * This function is called when the user selects a file from the file input.
   * It performs the following steps:
   * 1. Extracts the selected file from the event
   * 2. Notifies the parent component about the file selection
   * 3. Sets loading state to show progress
   * 4. Uploads the file to the backend API
   * 5. Handles the response and provides feedback
   * 6. Clears the loading state
   * 
   * @param event - File input change event containing the selected file
   */
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // Extract the selected file from the input event
    const selectedFile = event.target.files?.[0]
    
    // Exit early if no file was selected
    if (!selectedFile) return

    // Notify parent component about file selection
    onFileSelect(selectedFile)
    
    // Set loading state to show progress indicator
    setLoading(true)

    // Upload the file to the backend API
    const result = await uploadFile(selectedFile)
    
    // Handle the upload response
    if (result.data) {
      // Success: notify parent with success message and row count
      onUploadSuccess(`✅ File uploaded successfully! ${result.data.rows} rows processed.`)
    } else {
      // Error: notify parent with error message
      onUploadError(`❌ Upload failed: ${result.error}`)
    }
    
    // Clear loading state
    setLoading(false)
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-8">
      {/* Component Header */}
      <h2 className="text-2xl font-semibold mb-4">Upload Stock Data</h2>
      
      <div className="space-y-4">
        {/* File Input Section */}
        <div>
          {/* Instructions for the user */}
          <label className="block text-sm font-medium mb-2">
            Select CSV file (must contain: date, open, high, low, close, volume columns)
          </label>
          
          {/* File input element with custom styling */}
          <input
            ref={fileInputRef}  // Reference for programmatic access
            type="file"         // File input type
            accept=".csv"       // Only accept CSV files
            onChange={handleFileUpload}  // Handle file selection
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>
      </div>
    </div>
  )
}
