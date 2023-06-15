import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   proxy: {
  //     // Mengatur proxy untuk mengatasi masalah CORS
  //     "/api": {
  //       target: "https://matrikdev-music-api.vercel.app",
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ""),
  //     },
  //   },
  // },
  plugins: [vue()],
});
