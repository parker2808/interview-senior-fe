import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

const planRoot = fileURLToPath(new URL('../content', import.meta.url))
const kbRoot = fileURLToPath(new URL('../../../documents', import.meta.url))
const repoRoot = fileURLToPath(new URL('../../..', import.meta.url))

// Vercel Root Directory = repo root (see /vercel.json) so Vite can glob
// both module content/ and shared documents/{en,vi}/.
export default defineConfig({
  base: '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@plan': planRoot,
      '@kb': kbRoot,
    },
  },
  server: {
    fs: {
      allow: [planRoot, kbRoot, repoRoot],
    },
  },
})
