import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Read the bound backend service URL injected by Vercel (or fallback to local backend)
const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: backendUrl,
        changeOrigin: true,
      },
      '/uploads': {
        target: backendUrl,
        changeOrigin: true,
      }
    }
  }
})
