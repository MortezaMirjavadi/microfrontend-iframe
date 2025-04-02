import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    // Optional: Proxy requests to guest apps if needed (e.g., for API calls)
    // proxy: {
    //   '/api/app1': 'http://localhost:5174',
    // },
  },
});
