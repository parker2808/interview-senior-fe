export default defineNuxtPlugin(() => {
  if (!import.meta.client) return
  try {
    history.scrollRestoration = 'manual'
  } catch {
    /* ignore */
  }
})
