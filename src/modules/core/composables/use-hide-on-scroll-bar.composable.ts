import type { ComputedRef, Ref } from 'vue'

type UseHideOnScrollBarOptions = {
  lockVisible?: Ref<boolean> | ComputedRef<boolean>
  scrollTarget?: Ref<Window | HTMLElement | null | undefined> | ComputedRef<Window | HTMLElement | null | undefined>
  hideThreshold?: number
  deltaTolerance?: number
  topVisibleOffset?: number
}

export function useHideOnScrollBar(options: UseHideOnScrollBarOptions = {}) {
  const isVisible = ref(true)
  const focusWithin = ref(false)
  const lastY = ref(0)
  const hideThreshold = options.hideThreshold ?? 16
  const deltaTolerance = options.deltaTolerance ?? 2
  const topVisibleOffset = options.topVisibleOffset ?? 4
  let downDistance = 0

  const externalLock = computed(() => options.lockVisible?.value ?? false)
  const scrollTarget = computed<Window | HTMLElement | null>(() => {
    const target = options.scrollTarget?.value
    if (target) return target
    return import.meta.client ? window : null
  })
  const lockedVisible = computed(() => externalLock.value || focusWithin.value)
  let teardown: (() => void) | null = null
  let stopWatching: (() => void) | null = null
  let suppressNextScroll = false

  function getScrollTop(target: Window | HTMLElement | null) {
    if (!target) return 0
    return target === window ? Math.max(window.scrollY, 0) : Math.max(target.scrollTop, 0)
  }

  function setVisible(nextVisible: boolean) {
    if (isVisible.value === nextVisible) return
    isVisible.value = nextVisible
    suppressNextScroll = true
  }

  function showBar() {
    setVisible(true)
    downDistance = 0
  }

  function hideBar() {
    if (!lockedVisible.value) setVisible(false)
  }

  function onScroll() {
    const y = getScrollTop(scrollTarget.value)

    if (suppressNextScroll) {
      suppressNextScroll = false
      lastY.value = y
      return
    }

    if (lockedVisible.value || y <= topVisibleOffset) {
      showBar()
      lastY.value = y
      return
    }

    const delta = y - lastY.value
    lastY.value = y

    if (Math.abs(delta) <= deltaTolerance) return

    if (delta < 0) {
      showBar()
      return
    }

    downDistance += delta

    if (downDistance >= hideThreshold) {
      hideBar()
    }
  }

  function onFocusIn() {
    focusWithin.value = true
    showBar()
  }

  function onFocusOut(event: FocusEvent) {
    const currentTarget = event.currentTarget as HTMLElement | null
    const nextTarget = event.relatedTarget as Node | null

    if (currentTarget && nextTarget && currentTarget.contains(nextTarget)) return

    focusWithin.value = false
  }

  watch(lockedVisible, (locked) => {
    if (locked) showBar()
  })

  onMounted(() => {
    stopWatching = watch(
      scrollTarget,
      (target) => {
        teardown?.()
        teardown = null

        if (!target) return

        const listener = () => onScroll()
        lastY.value = getScrollTop(target)
        target.addEventListener('scroll', listener, { passive: true })
        teardown = () => target.removeEventListener('scroll', listener)
      },
      { immediate: true },
    )
  })

  onUnmounted(() => {
    stopWatching?.()
    teardown?.()
    stopWatching = null
    teardown = null
  })

  return {
    isVisible,
    showBar,
    onFocusIn,
    onFocusOut,
  }
}
