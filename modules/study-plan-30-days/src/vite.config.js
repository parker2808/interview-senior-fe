import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Netlify (and local) serve from site root `/`.
// Module markdown lives in ../content; shared KB is ../../../documents (not bundled).
export default defineConfig({
  base: '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@plan': fileURLToPath(new URL('../content', import.meta.url)),
    },
  },
  server: {
    fs: {
      // Allow importing markdown from sibling `content/` during vite / build
      allow: ['..'],
    },
  },
})
