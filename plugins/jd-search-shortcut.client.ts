export default defineNuxtPlugin(() => {
  const router = useRouter()
  function onKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null
    if (event.defaultPrevented || router.currentRoute.value.path === '/search' || router.currentRoute.value.path.startsWith('/fde') ||
      (target && (['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable))) return
    if (event.key !== '/' && !((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k')) return
    event.preventDefault()
    sessionStorage.setItem('jd-focus-search', '1')
    router.push('/search')
  }
  window.addEventListener('keydown', onKeydown)
})
