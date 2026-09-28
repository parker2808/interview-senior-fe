export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'sf_theme'

function readStored(): ThemeMode {
  if (!import.meta.client) return 'light'
  try {
    const fromDom = document.documentElement.dataset.theme
    if (fromDom === 'dark' || fromDom === 'light') return fromDom
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') return stored
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  } catch {
    /* ignore */
  }
  return 'light'
}

export function useTheme() {
  const theme = useState<ThemeMode>('sf-theme', () =>
    import.meta.client ? readStored() : 'light',
  )

  function apply(mode: ThemeMode) {
    theme.value = mode
    if (!import.meta.client) return
    const root = document.documentElement
    root.dataset.theme = mode
    root.classList.toggle('dark', mode === 'dark')
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      /* ignore */
    }
  }

  function toggle() {
    apply(theme.value === 'dark' ? 'light' : 'dark')
  }

  function init() {
    apply(readStored())
  }

  return { theme, apply, toggle, init }
}
