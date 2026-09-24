import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@plan': fileURLToPath(new URL('../30-days', import.meta.url)),
    },
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
})
