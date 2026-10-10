// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { cpSync, existsSync, mkdirSync } from 'node:fs'

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const srcRoot = path.resolve(rootDir, 'src')
const contentDir = path.resolve(rootDir, '.data/content')
mkdirSync(contentDir, { recursive: true })

function copyContentIntoNitroOutput(nitro: { options: { output: { serverDir: string } } }) {
  if (!existsSync(path.join(contentDir, 'knowledge-base'))) return
  const dest = path.join(nitro.options.output.serverDir, '.data/content')
  mkdirSync(dest, { recursive: true })
  cpSync(contentDir, dest, { recursive: true, dereference: true })
}

export default defineNuxtConfig({
  compatibilityDate: '2025-01-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n', 'nuxt-auth-utils'],

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
            'Hub, knowledge base, 30-day plan, and GitHub-protected interview Q&A for Senior Frontend prep.',
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

  // Do NOT set nitro.hooks.compiled here — defu replaces the Vercel preset
  // hook that writes .vercel/output/config.json, and Vercel then looks for dist.
  hooks: {
    'nitro:init'(nitro) {
      nitro.hooks.hook('compiled', () => {
        copyContentIntoNitroOutput(nitro)
      })
    },
  },

  runtimeConfig: {
    session: {
      maxAge: 60 * 60 * 24 * 7,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    oauth: {
      github: {
        clientId: '',
        clientSecret: '',
      },
    },
  },

  routeRules: {
    '/api/knowledge-base/**': {
      headers: {
        'Cache-Control':
          'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    },
    '/api/plan/**': {
      headers: {
        'Cache-Control':
          'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    },
    '/api/auth/**': {
      headers: { 'Cache-Control': 'private, no-store' },
    },
    '/api/interview/**': {
      headers: { 'Cache-Control': 'private, no-store' },
    },
    '/api/progress': {
      headers: { 'Cache-Control': 'private, no-store' },
    },
  },

  nitro: {
    preset: 'vercel',
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  telemetry: false,
})
