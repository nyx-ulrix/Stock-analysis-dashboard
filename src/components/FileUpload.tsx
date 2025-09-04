// =============================================================================
// FILE UPLOAD COMPONENT
// =============================================================================

import { useRef } from 'react'
import { uploadFile } from '../api'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onUploadSuccess: (message: string) => void
  onUploadError: (error: string) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

export function FileUpload({ 
  onFileSelect, 
  onUploadSuccess, 
  onUploadError, 
  loading, 
  setLoading 
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    onFileSelect(selectedFile)
    setLoading(true)

    const result = await uploadFile(selectedFile)
    
    if (result.data) {
      onUploadSuccess(`✅ File uploaded successfully! ${result.data.rows} rows processed.`)
    } else {
      onUploadError(`❌ Upload failed: ${result.error}`)
    }
    
    setLoading(false)
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Upload Stock Data</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select CSV file (must contain: date, open, high, low, close, volume columns)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>
      </div>
    </div>
  )
}
