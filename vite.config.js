// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from "url";
import vue from '@vitejs/plugin-vue'
import { univerPlugin } from "@univerjs/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), univerPlugin()],
  define: { 'process.env': {} },
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    ],
  }, server: {
    host: "0.0.0.0",
    port: 8002,
  },
})
