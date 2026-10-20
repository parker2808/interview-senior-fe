/**
 * After a redeploy, SPA navigation can request hashed chunks that no longer
 * exist. The Q&A page then sits on a skeleton forever. Reload once so the
 * new HTML/JS (and PIN gate) can boot.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const FLAG = 'sf-chunk-reload'

  function reloadOnce() {
    try {
      if (sessionStorage.getItem(FLAG)) return
      sessionStorage.setItem(FLAG, '1')
    } catch {
      /* ignore */
    }
    window.location.reload()
  }

  nuxtApp.hook('app:chunkError', () => {
    reloadOnce()
  })

  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault()
    reloadOnce()
  })

  const nuxt = nuxtApp as {
    hook: (name: string, fn: () => void) => void
  }
  try {
    nuxt.hook('app:manifest:update', () => {
      /* new build available — next failed chunk will reload */
    })
  } catch {
    /* older Nuxt */
  }
})
