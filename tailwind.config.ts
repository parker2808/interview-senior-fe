import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './plugins/**/*.{js,ts}',
    './src/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: 'var(--ink)',
          muted: 'var(--ink-muted)',
          faint: 'var(--ink-faint)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          soft: 'var(--accent-soft)',
          ink: 'var(--accent-ink)',
        },
        line: 'var(--line)',
        surface: {
          DEFAULT: 'var(--bg)',
          elevated: 'var(--bg-elevated)',
        },
        done: {
          DEFAULT: 'var(--done)',
          soft: 'var(--done-soft)',
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
