// =============================================================================
// API UTILITIES - BACKEND COMMUNICATION
// =============================================================================
// This file contains all the functions needed to communicate with the backend API.
// It provides a clean interface for making HTTP requests and handling responses.
//
// Key responsibilities:
// - Making HTTP requests to the Flask backend
// - Handling API responses and errors
// - Providing type-safe interfaces for API communication
// - Centralizing API configuration and endpoints

// Backend server configuration
const API_BASE_URL = 'http://127.0.0.1:5000'

/**
 * Generic response structure for all API calls
 * @template T - The type of data expected in the response
 */
export interface ApiResponse<T> {
  data?: T        // Successful response data
  error?: string  // Error message if request failed
  message?: string // Additional message from the server
}

/**
 * Generic function for making API requests to the backend
 * 
 * This function handles:
 * - Building the full URL with the base URL and endpoint
 * - Setting appropriate headers (Content-Type: application/json)
 * - Making the HTTP request using the Fetch API
 * - Parsing JSON responses
 * - Handling both success and error cases
 * - Providing consistent error handling
 * 
 * @template T - The expected type of the response data
 * @param endpoint - The API endpoint to call (e.g., '/analyze', '/upload')
 * @param options - Additional fetch options (method, body, headers, etc.)
 * @returns Promise that resolves to an ApiResponse containing data or error
 */
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    // Make the HTTP request to the backend
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',  // Tell the server we're sending JSON
        ...options.headers,  // Allow additional headers to be passed in
      },
      ...options,  // Spread any additional options (method, body, etc.)
    })

    // Parse the JSON response from the server
    const result = await response.json()
    
    // Check if the request was successful (status code 200-299)
    if (response.ok) {
      return { data: result }  // Return the data on success
    } else {
      // Return error message on failure
      return { error: result.error || 'Request failed' }
    }
  } catch (error) {
    // Handle network errors or other exceptions
    return { error: `Network error: ${error}` }
  }
}

/**
 * Upload a CSV file containing stock data to the backend
 * 
 * This function:
 * - Creates a FormData object to handle file upload
 * - Sends the file to the /upload endpoint
 * - Handles the response and provides appropriate feedback
 * 
 * @param file - The CSV file to upload (must contain stock data columns)
 * @returns Promise that resolves to upload result or error
 */
export async function uploadFile(file: File): Promise<ApiResponse<any>> {
  // Create FormData object for file upload (required for multipart/form-data)
  const formData = new FormData()
  formData.append('file', file)  // Add the file to the form data
  
  try {
    // Make POST request to upload endpoint with the file
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,  // Send the file as form data
    })

    // Parse the JSON response
    const result = await response.json()
    
    // Handle successful upload
    if (response.ok) {
      return { data: result, message: result.message }
    } else {
      // Handle upload failure
      return { error: result.error || 'Upload failed' }
    }
  } catch (error) {
    // Handle network or other errors
    return { error: `Upload error: ${error}` }
  }
}

/**
 * Run comprehensive stock analysis on the uploaded data
 * 
 * This function calls the backend to perform:
 * - Simple Moving Average calculations
 * - Daily returns analysis
 * - Price run/streak analysis
 * - Maximum profit calculations
 * - Data visualization generation
 * 
 * @param smaWindow - Number of days to use for Simple Moving Average calculation
 * @returns Promise that resolves to analysis results or error
 */
export async function runAnalysis(smaWindow: number): Promise<ApiResponse<any>> {
  return apiRequest('/analyze', {
    method: 'POST',
    body: JSON.stringify({ sma_window: smaWindow }),  // Send SMA window as JSON
  })
}

/**
 * Run validation tests to verify the analysis algorithms are working correctly
 * 
 * This function calls the backend to run automated tests that verify:
 * - SMA calculations are accurate
 * - Daily returns are calculated correctly
 * - Maximum profit algorithm works as expected
 * - All data structures are properly formatted
 * 
 * @returns Promise that resolves to validation test results or error
 */
export async function runValidation(): Promise<ApiResponse<any>> {
  return apiRequest('/validate', {
    method: 'POST',
  })
}
