import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Project Pages URL: https://parker2808.github.io/interview-senior-fe/
// Local/dev uses `/` so `npm run dev` keeps working without a path prefix.
const base = process.env.GITHUB_PAGES === 'true' ? '/interview-senior-fe/' : '/'

export default defineConfig({
  base,
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

