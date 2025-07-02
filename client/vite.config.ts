import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: 'localhost',
    proxy: {
      '/api': {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path:string) => path.replace(/^\/api/, ''),
      }
    }
  }
})
