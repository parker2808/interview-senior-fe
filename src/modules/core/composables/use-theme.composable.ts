export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'sf_theme'

export function useTheme() {
  const theme = useState<ThemeMode>('sf-theme', () => 'light')

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
    if (!import.meta.client) return
    let initial: ThemeMode = 'light'
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'dark' || stored === 'light') initial = stored
      else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        initial = 'dark'
      }
    } catch {
      /* ignore */
    }
    apply(initial)
  }

  return { theme, apply, toggle, init }
}
