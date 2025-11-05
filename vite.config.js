import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Root-level Vite config (used by the dev server)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      // Forward API calls to the backend to avoid CORS in development
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
