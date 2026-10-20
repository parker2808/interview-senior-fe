<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    navOpen?: boolean
    lockScroll?: boolean
  }>(),
  {
    navOpen: false,
    lockScroll: true,
  },
)

const emit = defineEmits<{
  'update:navOpen': [value: boolean]
}>()

const slots = useSlots()
const mainRef = ref<HTMLElement | null>(null)
const topBarHeight = ref(56)

const navOpenModel = computed({
  get: () => props.navOpen,
  set: (value: boolean) => emit('update:navOpen', value),
})

const hasPinnedNav = computed(() => Boolean(slots['nav-pinned']))

function onTopBarHeightChange(height: number) {
  topBarHeight.value = height
}

onMounted(() => {
  if (!props.lockScroll) return
  document.documentElement.classList.add('docs-lock-scroll')
  document.body.classList.add('docs-lock-scroll')
})

onUnmounted(() => {
  document.documentElement.classList.remove('docs-lock-scroll')
  document.body.classList.remove('docs-lock-scroll')
})

defineExpose({
  mainRef,
  onTopBarHeightChange,
})
</script>

<template>
  <div
    class="docs-shell flex h-dvh max-h-dvh flex-col overflow-hidden"
    :style="{ '--docs-header-h': `${topBarHeight}px` }"
  >
    <slot name="topbar" :on-height-change="onTopBarHeightChange" :scroll-target="mainRef" />

    <div class="docs-split flex min-h-0 flex-1 flex-col lg:flex-row">
      <aside
        class="hidden min-h-0 w-64 shrink-0 flex-col overflow-hidden border-r border-line bg-surface-elevated/70 lg:flex xl:w-72"
      >
        <div v-if="hasPinnedNav" class="shrink-0 border-b border-line">
          <slot name="nav-pinned" />
        </div>
        <div class="docs-nav-pane min-h-0 flex-1">
          <slot name="nav" />
        </div>
      </aside>

      <Teleport to="body">
        <div v-if="navOpenModel" class="fixed inset-0 z-40 lg:hidden">
          <div class="absolute inset-0 bg-ink/40" @click="navOpenModel = false" />
          <aside
            class="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] min-w-0 flex-col overflow-hidden bg-surface-elevated shadow-xl"
          >
            <div class="flex items-center justify-between border-b border-line px-3 py-2">
              <slot name="nav-header" />
              <button
                type="button"
                class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink"
                :aria-label="$t('docs.closeNav')"
                :title="$t('docs.closeNav')"
                @click="navOpenModel = false"
              >
                <svg
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <div v-if="hasPinnedNav" class="shrink-0 border-b border-line">
              <slot name="nav-pinned" />
            </div>
            <div class="docs-nav-pane min-h-0 flex-1">
              <slot name="nav" />
            </div>
          </aside>
        </div>
      </Teleport>

      <main
        ref="mainRef"
        class="docs-main docs-pane min-h-0 min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8"
      >
        <slot />
      </main>
    </div>
  </div>
</template>
