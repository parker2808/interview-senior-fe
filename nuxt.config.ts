// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { mkdirSync } from 'node:fs'

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const srcRoot = path.resolve(rootDir, 'src')
const contentDir = path.resolve(rootDir, '.data/content')
mkdirSync(contentDir, { recursive: true })

export default defineNuxtConfig({
  compatibilityDate: '2025-01-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n'],

  css: ['~/src/assets/css/main.css'],

  app: {
    head: {
      title: 'Senior FE Interview Prep',
      htmlAttrs: { lang: 'vi' },
      script: [{ src: '/theme-init.js', tagPosition: 'head' }],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap',
        },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Hub, knowledge base, 30-day plan, and PIN-locked interview Q&A for Senior Frontend prep.',
        },
      ],
    },
  },

  alias: {
    '@': srcRoot,
  },

  vite: {
    resolve: {
      alias: {
        '@': srcRoot,
      },
    },
  },

  i18n: {
    locales: [
      { code: 'vi', language: 'vi-VN', name: 'Tiếng Việt', file: 'vi.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'vi',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'sf_locale',
      fallbackLocale: 'vi',
    },
    bundle: {
      optimizeTranslationDirective: false,
    },
  },

  nitro: {
    preset: 'vercel',
    serverAssets: [
      {
        baseName: 'siteContent',
        dir: '.data/content',
      },
    ],
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  telemetry: false,
})
