// =============================================================================
// API UTILITIES
// =============================================================================
// Centralized API communication functions

const API_BASE_URL = 'http://127.0.0.1:5000'

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

/**
 * Generic API request function
 */
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const result = await response.json()
    
    if (response.ok) {
      return { data: result }
    } else {
      return { error: result.error || 'Request failed' }
    }
  } catch (error) {
    return { error: `Network error: ${error}` }
  }
}

/**
 * Upload CSV file
 */
export async function uploadFile(file: File): Promise<ApiResponse<any>> {
  const formData = new FormData()
  formData.append('file', file)
  
  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()
    
    if (response.ok) {
      return { data: result, message: result.message }
    } else {
      return { error: result.error || 'Upload failed' }
    }
  } catch (error) {
    return { error: `Upload error: ${error}` }
  }
}

/**
 * Run stock analysis
 */
export async function runAnalysis(smaWindow: number): Promise<ApiResponse<any>> {
  return apiRequest('/analyze', {
    method: 'POST',
    body: JSON.stringify({ sma_window: smaWindow }),
  })
}

/**
 * Run validation tests
 */
export async function runValidation(): Promise<ApiResponse<any>> {
  return apiRequest('/validate', {
    method: 'POST',
  })
}
