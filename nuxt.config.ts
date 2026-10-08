// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import type { Plugin } from 'vite'

/**
 * Markdown is glob-imported into the client/SSR bundle. Inlining it as a
 * JS string (Vite `?raw`) puts snippets like `'undefined'` and `'use client'`
 * into Nitro's commonjs transform, which then fails to parse. Base64 keeps
 * those sequences out of the generated JS.
 */
function markdownAsBase64(): Plugin {
  return {
    name: 'markdown-as-base64',
    enforce: 'pre',
    transform(code, id) {
      const file = id.split('?')[0] ?? id
      if (!file.endsWith('.md')) return
      const b64 = Buffer.from(code, 'utf8').toString('base64')
      return {
        code: `const _md = ${JSON.stringify(b64)}
export default typeof Buffer === "undefined"
  ? new TextDecoder("utf-8").decode(Uint8Array.from(atob(_md), (c) => c.charCodeAt(0)))
  : Buffer.from(_md, "base64").toString("utf8")`,
        map: null,
      }
    },
  }
}

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const planRoot = path.resolve(rootDir, 'modules/study-plan-30-days/content')
const kbRoot = path.resolve(rootDir, 'documents')
const srcRoot = path.resolve(rootDir, 'src')

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
    '@plan': planRoot,
    '@kb': kbRoot,
  },

  vite: {
    plugins: [markdownAsBase64()],
    resolve: {
      alias: {
        '@': srcRoot,
        '@plan': planRoot,
        '@kb': kbRoot,
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
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  telemetry: false,
})
