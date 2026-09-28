<script setup lang="ts">
const visible = ref(false)
const mainSelector = '.docs-main'

function scrollParent(): HTMLElement | Window {
  if (!import.meta.client) return window
  if (window.matchMedia('(min-width: 1024px)').matches) {
    const main = document.querySelector(mainSelector) as HTMLElement | null
    if (main && main.scrollHeight > main.clientHeight + 8) return main
  }
  return window
}

function onScroll() {
  const el = scrollParent()
  const top = el === window ? window.scrollY : (el as HTMLElement).scrollTop
  visible.value = top > 360
}

function scrollTop() {
  const el = scrollParent()
  if (el === window) window.scrollTo({ top: 0, behavior: 'smooth' })
  else (el as HTMLElement).scrollTo({ top: 0, behavior: 'smooth' })
}

let removeScroll: (() => void) | null = null

onMounted(() => {
  const bind = () => {
    removeScroll?.()
    const el = scrollParent()
    const target: Window | HTMLElement = el
    const handler = () => onScroll()
    target.addEventListener('scroll', handler, { passive: true })
    removeScroll = () => target.removeEventListener('scroll', handler)
    onScroll()
  }
  bind()
  window.addEventListener('resize', bind)
  onUnmounted(() => {
    removeScroll?.()
    window.removeEventListener('resize', bind)
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
