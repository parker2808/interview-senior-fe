<script setup lang="ts">
const visible = ref(false)

const DOCS_MAIN = '.docs-main'

function docsMain(): HTMLElement | null {
  if (!import.meta.client) return null
  return document.querySelector(DOCS_MAIN) as HTMLElement | null
}

/** Prefer inner docs scroller on desktop/tablet layout; else window. */
function scrollTargets(): Array<Window | HTMLElement> {
  const targets: Array<Window | HTMLElement> = [window]
  const main = docsMain()
  if (main) targets.unshift(main)
  return targets
}

function maxScrollTop(): { el: Window | HTMLElement; top: number } {
  let best: { el: Window | HTMLElement; top: number } = { el: window, top: window.scrollY }
  const main = docsMain()
  if (main && main.scrollTop >= best.top) {
    best = { el: main, top: main.scrollTop }
  }
  return best
}

function onScroll() {
  visible.value = maxScrollTop().top > 280
}

function scrollTop() {
  const { el } = maxScrollTop()
  if (el === window) window.scrollTo({ top: 0, behavior: 'smooth' })
  else (el as HTMLElement).scrollTo({ top: 0, behavior: 'smooth' })
}

const cleanups: Array<() => void> = []

function bindAll() {
  while (cleanups.length) cleanups.pop()?.()
  for (const target of scrollTargets()) {
    const handler = () => onScroll()
    target.addEventListener('scroll', handler, { passive: true })
    cleanups.push(() => target.removeEventListener('scroll', handler))
  }
  onScroll()
}

onMounted(() => {
  bindAll()
  window.addEventListener('resize', bindAll)
  // Re-bind when navigating between hub/docs/plan (main appears/disappears)
  let timer: ReturnType<typeof setTimeout> | null = null
  const mo = new MutationObserver(() => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => bindAll(), 80)
  })
  mo.observe(document.body, { childList: true, subtree: true })
  onUnmounted(() => {
    mo.disconnect()
    if (timer) clearTimeout(timer)
    window.removeEventListener('resize', bindAll)
    while (cleanups.length) cleanups.pop()?.()
  })
})
</script>

<template>
  <Transition name="fade">
    <button
      v-if="visible"
      type="button"
      class="scroll-top-btn fixed bottom-5 right-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface-elevated text-ink shadow-md transition hover:border-accent hover:text-accent-ink sm:bottom-8 sm:right-6"
      :aria-label="$t('common.scrollTop')"
      :title="$t('common.scrollTop')"
      @click="scrollTop"
    >
      <svg
        class="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
