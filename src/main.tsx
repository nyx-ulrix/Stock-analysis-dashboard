// =============================================================================
// REACT APPLICATION ENTRY POINT
// =============================================================================
// This file is the main entry point for the React application.
// It initializes the React application and renders it into the DOM.
//
// Key responsibilities:
// - Importing React and ReactDOM for rendering
// - Importing the main App component
// - Importing global CSS styles
// - Creating a React root and mounting the application
// - Enabling React.StrictMode for development warnings

// React core libraries for component rendering
import React from 'react'
import ReactDOM from 'react-dom/client'

// Main application component
import App from './App.tsx'

// Global CSS styles (includes Tailwind CSS)
import './index.css'

// Create a React root and render the App component
// React.StrictMode helps identify potential problems during development
// by enabling additional checks and warnings
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
