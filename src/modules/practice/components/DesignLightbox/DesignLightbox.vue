<script setup lang="ts">
import type { PracticeDesignScreen } from '@/modules/content/types'
import { pickLocale } from '@/modules/content/utils/pick-locale.util'
import { designScreenSrc } from '@/modules/practice/utils/spec-ref.util'

const props = defineProps<{
  screens: PracticeDesignScreen[]
  index: number
}>()

const emit = defineEmits<{
  close: []
  index: [next: number]
}>()

const { locale, t } = useI18n()
const lang = computed<'en' | 'vi'>(() => (locale.value === 'en' ? 'en' : 'vi'))

const zoom = ref(1)
const closeBtn = ref<HTMLButtonElement | null>(null)
const scroller = ref<HTMLElement | null>(null)

const screen = computed(() => props.screens[props.index] ?? null)
const src = computed(() => (screen.value ? designScreenSrc(screen.value.file) : ''))

function clampIndex(next: number) {
  const max = props.screens.length - 1
  if (max < 0) return 0
  return Math.min(max, Math.max(0, next))
}

function go(delta: number) {
  emit('index', clampIndex(props.index + delta))
  zoom.value = 1
  nextTick(() => {
    scroller.value?.scrollTo({ top: 0, left: 0 })
  })
}

function bumpZoom(delta: number) {
  zoom.value = Math.min(3, Math.max(1, Math.round((zoom.value + delta) * 10) / 10))
}

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    go(-1)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    go(1)
  } else if (event.key === '+' || event.key === '=') {
    event.preventDefault()
    bumpZoom(0.25)
  } else if (event.key === '-' || event.key === '_') {
    event.preventDefault()
    bumpZoom(-0.25)
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKey)
  document.body.style.overflow = 'hidden'
  nextTick(() => closeBtn.value?.focus())
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})

watch(
  () => props.index,
  () => {
    zoom.value = 1
  },
)
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[80] flex flex-col bg-[#0b1210] text-[#e7f0ec]"
      role="dialog"
      aria-modal="true"
      :aria-label="screen ? pickLocale(screen.title, lang) : t('practice.lightboxClose')"
    >
      <div class="flex shrink-0 items-center gap-2 border-b border-white/15 bg-[#121c19] px-3 py-2 sm:px-4">
        <div class="min-w-0 flex-1">
          <p v-if="screen" class="truncate text-sm font-semibold">
            {{ pickLocale(screen.title, lang) }}
          </p>
          <p v-if="screen" class="truncate text-xs text-white/70">
            {{ pickLocale(screen.caption, lang) }}
            · {{ Math.round(zoom * 100) }}%
          </p>
        </div>
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-sm font-semibold hover:bg-white/10"
          :aria-label="t('practice.lightboxZoomOut')"
          :disabled="zoom <= 1"
          @click="bumpZoom(-0.25)"
        >
          −
        </button>
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-sm font-semibold hover:bg-white/10"
          :aria-label="t('practice.lightboxZoomIn')"
          :disabled="zoom >= 3"
          @click="bumpZoom(0.25)"
        >
          +
        </button>
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-sm font-semibold hover:bg-white/10 disabled:opacity-40"
          :aria-label="t('practice.lightboxPrev')"
          :disabled="index <= 0"
          @click="go(-1)"
        >
          ←
        </button>
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-sm font-semibold hover:bg-white/10 disabled:opacity-40"
          :aria-label="t('practice.lightboxNext')"
          :disabled="index >= screens.length - 1"
          @click="go(1)"
        >
          →
        </button>
        <button
          ref="closeBtn"
          type="button"
          class="inline-flex h-10 min-w-10 items-center justify-center rounded-lg border border-white/20 px-3 text-sm font-semibold hover:bg-white/10"
          :aria-label="t('practice.lightboxClose')"
          @click="emit('close')"
        >
          Esc
        </button>
      </div>

      <div
        ref="scroller"
        class="min-h-0 flex-1 overflow-auto"
        @click.self="emit('close')"
      >
        <img
          v-if="screen"
          :src="src"
          :alt="pickLocale(screen.title, lang)"
          :width="screen.width"
          :height="screen.height"
          class="mx-auto block h-auto max-w-none"
          :style="{ width: `${Math.round(zoom * 100)}%` }"
        />
      </div>
    </div>
  </Teleport>
</template>
