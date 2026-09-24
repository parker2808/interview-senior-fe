import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Netlify (and local) serve from site root `/`.
export default defineConfig({
  base: '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@plan': fileURLToPath(
        new URL('../documents/study-plan/30-days', import.meta.url),
      ),
    },
  },
  server: {
    fs: {
      // Allow importing markdown from ../documents during `vite` / `vite build`
      allow: ['..'],
    },
  },
})
