import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '127.0.0.1', // Explicit host for Windows compatibility
    open: true,
    strictPort: false, // Allow Vite to try the next available port if 3000 is in use
    cors: true // Enable CORS for better Windows networking
  },
  // Windows-specific optimizations
  resolve: {
    preserveSymlinks: false // Better Windows symlink handling
  },
  // Optimize for Windows file system
  optimizeDeps: {
    force: false // Don't force optimization on Windows
  }
})
