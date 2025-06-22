import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: '..',
  server: {
    host: true,// Allows access to dev server from outside the container
    port: 5173, // default vite port
  }, 

});
