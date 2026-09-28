/**
 * Hash + History navigation for list / day / resource views.
 * pushState keeps a stack so Back and the browser back button return to the
 * prior plan screen (e.g. Day 1 → KB doc → back to Day 1).
 */

/**
 * @typedef {{ view: 'list' }} ListRoute
 * @typedef {{ view: 'day', day: number }} DayRoute
 * @typedef {{ view: 'resource', path: string }} ResourceRoute
 * @typedef {ListRoute | DayRoute | ResourceRoute} AppRoute
 */

/**
 * @param {AppRoute} route
 * @returns {string} hash including leading #
 */
export function routeToHash(route) {
  if (route.view === 'day' && route.day) {
    return `#day/${route.day}`
  }
  if (route.view === 'resource' && route.path) {
    return `#doc/${encodeURIComponent(route.path)}`
  }
  return ''
}

/**
 * @param {string} hash location.hash
 * @param {{ isDay: (n: number) => boolean, isDoc: (path: string) => boolean }} checks
 * @returns {AppRoute}
 */
export function parseHash(hash, { isDay, isDoc }) {
  const raw = (hash || '').replace(/^#/, '')
  if (!raw) return { view: 'list' }

  const dayMatch = raw.match(/^day\/(\d+)$/)
  if (dayMatch) {
    const n = Number(dayMatch[1])
    if (isDay(n)) return { view: 'day', day: n }
    return { view: 'list' }
  }

  if (raw.startsWith('doc/')) {
    const path = decodeURIComponent(raw.slice(4))
    if (path && isDoc(path)) return { view: 'resource', path }
  }

  return { view: 'list' }
}

/**
 * @param {AppRoute | null | undefined} route
 * @returns {string}
 */
export function labelForRoute(route) {
  if (!route) return '← Danh sách'
  if (route.view === 'day' && route.day) {
    return `← Quay lại Day ${route.day}`
  }
  if (route.view === 'resource' && route.path) {
    const short = route.path.split('/').pop() || route.path
    return `← Quay lại ${short}`
  }
  return '← Danh sách'
}

/**
 * @param {import('vue').Ref<AppRoute>} routeRef
 * @param {{ isDay: (n: number) => boolean, isDoc: (path: string) => boolean, onNavigate?: () => void }} options
 */
export function createAppNav(routeRef, { isDay, isDoc, onNavigate }) {
  /** @type {import('vue').Ref<AppRoute | null>} */
  let backTargetRef = null

  function snapshot(route) {
    if (!route || typeof route !== 'object') return null
    if (route.view === 'day') return { view: 'day', day: route.day }
    if (route.view === 'resource') return { view: 'resource', path: route.path }
    return { view: 'list' }
  }

  function setBackTarget(value) {
    if (backTargetRef) backTargetRef.value = value
  }

  function syncUrl(route, { replace }) {
    const url = new URL(window.location.href)
    url.hash = routeToHash(route).replace(/^#/, '')
    const next = url.pathname + url.search + (url.hash ? `#${url.hash}` : '')
    if (replace) {
      // Keep prior `back` when replacing (e.g. day prev/next)
      const prevBack = snapshot(window.history.state?.back) ?? null
      history.replaceState({ route: snapshot(route), back: prevBack }, '', next)
      setBackTarget(prevBack)
    } else {
      const leaving = snapshot(routeRef.value)
      history.pushState({ route: snapshot(route), back: leaving }, '', next)
      setBackTarget(leaving)
    }
  }

  /**
   * @param {AppRoute} next
   * @param {{ replace?: boolean }} [opts]
   */
  function navigate(next, opts = {}) {
    const replace = Boolean(opts.replace)
    const same =
      routeRef.value.view === next.view &&
      (next.view !== 'day' || routeRef.value.day === next.day) &&
      (next.view !== 'resource' || routeRef.value.path === next.path)

    if (same && !replace) {
      onNavigate?.()
      return
    }

    if (replace || same) {
      syncUrl(next, { replace: true })
    } else {
      syncUrl(next, { replace: false })
    }
    routeRef.value = next
    onNavigate?.()
  }

  function goBack() {
    const back = window.history.state?.back
    if (back && typeof back === 'object' && back.view) {
      history.back()
      return
    }
    // Deep link / no stack → list
    navigate({ view: 'list' }, { replace: true })
  }

  function applyFromLocation() {
    const fromState = window.history.state?.route
    if (fromState && typeof fromState === 'object' && fromState.view) {
      routeRef.value = snapshot(fromState)
      setBackTarget(snapshot(window.history.state?.back))
      return
    }
    const parsed = parseHash(window.location.hash, { isDay, isDoc })
    const hash = routeToHash(parsed)
    history.replaceState(
      { route: snapshot(parsed), back: null },
      '',
      window.location.pathname + window.location.search + hash,
    )
    routeRef.value = parsed
    setBackTarget(null)
  }

  function onPopState(e) {
    const r = e.state?.route
    if (r && typeof r === 'object' && r.view) {
      routeRef.value = snapshot(r)
      setBackTarget(snapshot(e.state?.back))
    } else {
      applyFromLocation()
    }
    onNavigate?.()
  }

  /**
   * Wire history + seed current URL. Call once from setup.
   * @param {import('vue').Ref<AppRoute | null>} backRef
   */
  function bind(backRef) {
    backTargetRef = backRef
    applyFromLocation()
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }

  return { navigate, goBack, bind, applyFromLocation }
}
