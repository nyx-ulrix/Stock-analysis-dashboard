// =============================================================================
// REACT APPLICATION ENTRY POINT
// =============================================================================
// This file is the main entry point for the React application.
// It renders the App component into the HTML root element.

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create a React root and render the App component
// React.StrictMode helps identify potential problems during development
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
