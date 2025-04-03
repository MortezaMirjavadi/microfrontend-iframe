import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@microfrontend-iframe/core-lib": resolve(__dirname, "../core-lib/src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "core-lib": ["../core-lib/src/index.ts"],
        },
      },
    },
    sourcemap: true,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "uuid"],
    exclude: [],
  },
});
