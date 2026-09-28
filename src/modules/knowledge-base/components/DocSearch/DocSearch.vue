<script setup lang="ts">
import type { DocLang } from '@/modules/core/constants/locale.constant'
import {
  searchDocs,
  type DocSearchHit,
} from '@/modules/knowledge-base/utils/doc-search-index.util'

const props = defineProps<{
  open: boolean
  lang: DocLang
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  select: [payload: { slug: string; hash?: string }]
}>()

const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const activeIndex = ref(0)

const results = computed(() => searchDocs(query.value, props.lang, 50))

watch(
  () => props.open,
  (open) => {
    if (open) {
      query.value = ''
      activeIndex.value = 0
      nextTick(() => inputRef.value?.focus())
    }
  },
)

watch(results, () => {
  activeIndex.value = 0
})

function onKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    emit('update:open', !props.open)
    return
  }
  if (!props.open) return
  if (e.key === 'Escape') {
    emit('update:open', false)
    return
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, results.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (e.key === 'Enter') {
    const hit = results.value[activeIndex.value]
    if (hit) choose(hit)
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))

function choose(hit: DocSearchHit) {
  emit('select', {
    slug: hit.slug,
    hash: hit.headingId || undefined,
  })
  emit('update:open', false)
}

function highlight(text: string) {
  const q = query.value.trim()
  if (!q) return text
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  try {
    const exact = new RegExp(`(${escaped})`, 'ig')
    if (exact.test(text)) {
      return text.replace(
        exact,
        '<mark class="rounded bg-accent-soft px-0.5 text-accent-ink">$1</mark>',
      )
    }
    // Prefix-in-word: "hois" → mark "Hois" in "Hoisting"
    const prefix = new RegExp(`\\b(${escaped}[\\w-]*)`, 'i')
    return text.replace(
      prefix,
      '<mark class="rounded bg-accent-soft px-0.5 text-accent-ink">$1</mark>',
    )
  } catch {
    return text
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 p-4 pt-[10vh] sm:pt-[14vh]"
      role="dialog"
      aria-modal="true"
      @click.self="emit('update:open', false)"
    >
      <div
        class="animate-fade-up flex max-h-[min(32rem,78vh)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-line bg-surface-elevated shadow-xl"
      >
        <div class="border-b border-line p-3">
          <input
            ref="inputRef"
            v-model="query"
            type="search"
            class="min-h-11 w-full rounded-lg border border-line bg-white px-3 text-base outline-none focus:border-accent"
            :placeholder="$t('docs.searchPlaceholder')"
            autocomplete="off"
          />
        </div>
        <ul class="flex-1 overflow-y-auto p-2">
          <li v-if="!results.length" class="px-3 py-4 text-sm text-ink-muted">
            {{ $t('docs.emptySearch') }}
          </li>
          <li v-for="(hit, i) in results" :key="hit.id">
            <button
              type="button"
              class="flex min-h-12 w-full flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left text-sm transition"
              :class="
                i === activeIndex
                  ? 'bg-accent-soft'
                  : 'hover:bg-accent-soft/60'
              "
              @mouseenter="activeIndex = i"
              @click="choose(hit)"
            >
              <span
                class="font-medium text-ink"
                v-html="highlight(hit.heading)"
              />
              <span class="text-xs text-ink-faint">
                <template v-if="hit.level === 0">{{ hit.slug }}</template>
                <template v-else
                  >{{ hit.topicTitle }} · {{ hit.slug }}</template
                >
              </span>
            </button>
          </li>
        </ul>
        <p class="border-t border-line px-3 py-2 text-xs text-ink-faint">
          {{ $t('docs.searchHint') }} · ↑↓ Enter
        </p>
      </div>
    </div>
  </Teleport>
</template>
