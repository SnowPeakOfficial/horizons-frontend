import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Expose on local network so mobile devices can connect
    port: 3001, // Match backend WEB_URL so Stripe success redirect lands correctly
  }
})
