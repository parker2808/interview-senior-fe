<script setup lang="ts">
import BackLink from '@/modules/core/components/BackLink/BackLink.vue'
import { useHideOnScrollBar } from '@/modules/core/composables/use-hide-on-scroll-bar.composable'

const props = withDefaults(
  defineProps<{
    title: string
    homeTo?: string
    homeLabel?: string
    backTo?: string
    backLabel?: string
    lockVisible?: boolean
    scrollTarget?: Window | HTMLElement | null
    innerClass?: string
  }>(),
  {
    homeTo: '/',
    homeLabel: 'Hub',
    backTo: undefined,
    backLabel: undefined,
    lockVisible: false,
    innerClass: 'mx-auto max-w-hub px-2 sm:px-4',
  },
)

const emit = defineEmits<{
  heightchange: [height: number]
}>()

const rootRef = ref<HTMLElement | null>(null)
const measuredHeight = ref(56)
let resizeObserver: ResizeObserver | null = null

const { isVisible, onFocusIn, onFocusOut } = useHideOnScrollBar({
  lockVisible: computed(() => props.lockVisible),
  scrollTarget: computed(() => props.scrollTarget),
})

const spacerHeight = computed(() => (isVisible.value ? measuredHeight.value : 0))

function updateHeight(nextHeight: number) {
  measuredHeight.value = nextHeight
  emit('heightchange', nextHeight)

  if (import.meta.client) {
    document.documentElement.style.setProperty('--app-header-h', `${nextHeight}px`)
  }
}

onMounted(() => {
  const el = rootRef.value
  if (!el) return

  updateHeight(Math.ceil(el.getBoundingClientRect().height))
  if (typeof ResizeObserver === 'undefined') return

  resizeObserver = new ResizeObserver(([entry]) => {
    updateHeight(Math.ceil(entry.contentRect.height))
  })

  resizeObserver.observe(el)
})

onUnmounted(() => resizeObserver?.disconnect())
</script>

<template>
  <div class="shrink-0">
    <div
      aria-hidden="true"
      :style="{ height: `${spacerHeight}px` }"
    />

    <header
      ref="rootRef"
      class="fixed inset-x-0 top-0 z-30 border-b border-line bg-surface-elevated/95 pt-[env(safe-area-inset-top)] backdrop-blur transition-transform duration-200 ease-out motion-reduce:transition-none"
      :class="isVisible ? 'translate-y-0' : '-translate-y-full'"
      @focusin="onFocusIn"
      @focusout="onFocusOut"
    >
      <div :class="innerClass">
        <div class="flex h-12 items-center gap-1.5 sm:gap-2">
          <slot name="leading" />

          <NuxtLink
            :to="homeTo"
            class="inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-elevated text-sm font-semibold text-ink transition hover:border-accent hover:text-accent-ink"
            :class="backTo ? 'w-10 sm:w-auto sm:gap-2 sm:px-3' : 'gap-2 px-3'"
            :aria-label="homeLabel"
            :title="homeLabel"
          >
            <svg
              class="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M3 10.5 12 3l9 7.5" />
              <path d="M5 9.5V21h14V9.5" />
              <path d="M9 21v-6h6v6" />
            </svg>
            <span :class="backTo ? 'hidden sm:inline' : 'inline'">{{ homeLabel }}</span>
          </NuxtLink>

          <BackLink
            v-if="backTo"
            :to="backTo"
            :label="backLabel"
            icon-only
          />

          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold text-ink">
              {{ title }}
            </p>
          </div>

          <slot name="actions" />
        </div>
      </div>
    </header>
  </div>
</template>
