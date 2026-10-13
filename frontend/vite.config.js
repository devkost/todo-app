import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Запросы к /api проксируются на FastAPI (http://localhost:8000),
// поэтому браузер не делает cross-origin запросов и CORS не мешает.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
