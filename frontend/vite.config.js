import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // relative paths, works when served from a subfolder,
  build: {
    outDir: '../backend/dist',   // relative to frontend folder
    emptyOutDir: true,   // cleans it before rebuilding
  }
})
