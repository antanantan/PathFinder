/// <reference types="vitest" /> 
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: '..', 
  test: {
    globals: true, //Enables global test APIs like `describe`, `it`, etc without importing them
    environment: 'jsdom', //Uses jsdom to simulate browser env
    setupFiles: ['./src/tests/setup.ts'], // File to run before each test file
  }
})
