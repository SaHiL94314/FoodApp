import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/user': 'http://localhost:3000',
      '/plans': 'http://localhost:3000',
      '/review': 'http://localhost:3000'
    }
  }
});
