import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './src/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#14201c',
          muted: '#5a6b64',
          faint: '#8a9a93',
        },
        accent: {
          DEFAULT: '#0f766e',
          soft: '#ccfbf1',
          ink: '#115e59',
        },
        line: '#d5e0db',
        surface: {
          DEFAULT: '#f4f7f6',
          elevated: '#ffffff',
        },
        done: {
          DEFAULT: '#15803d',
          soft: '#dcfce7',
        },
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        hub: '72rem',
        prose: '48rem',
      },
      screens: {
        xs: '390px',
      },
    },
  },
  plugins: [],
} satisfies Config
