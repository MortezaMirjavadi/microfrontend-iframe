import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    strictPort: true,
    cors: true, // Enable CORS for development
    headers: {
      // Allow iframe embedding from any origin in development
      "Access-Control-Allow-Origin": "*",
    },
  },
  preview: {
    port: 5175, // Use 5175 for guest-app-2
  },
  base: "./", // Ensures assets load correctly within the iframe
});
