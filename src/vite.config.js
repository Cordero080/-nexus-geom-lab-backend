import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Keep default port behavior; proxy avoids CORS in dev
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // Preserve path, enable websockets if needed
        ws: true,
      },
    },
  },
});
