import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [Vue(), tailwindcss()],
  optimizeDeps: {
    // Only scan the real app entry so any stray HTML files in public/ never break dep-scan
    entries: ['index.html'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },
  server: {
    port: 3000,
  },
})
