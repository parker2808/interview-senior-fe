<script setup lang="ts">
import type { DocLang } from '@/modules/core/constants/locale.constant'
import type { DocSearchHit } from '@/modules/knowledge-base/utils/doc-search-index.util'
import { highlightSearchText } from '@/modules/knowledge-base/utils/search-text.util'

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
const pending = ref(false)
const results = ref<DocSearchHit[]>([])
const searched = ref('')

let debounceTimer: ReturnType<typeof setTimeout> | null = null
let requestSeq = 0

watch(
  () => props.open,
  (open) => {
    if (open) {
      query.value = ''
      results.value = []
      searched.value = ''
      pending.value = false
      activeIndex.value = 0
      nextTick(() => inputRef.value?.focus())
    } else if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
  },
)

watch(results, () => {
  activeIndex.value = 0
})

async function runSearch(raw: string) {
  const q = raw.trim()
  const seq = ++requestSeq
  if (q.length < 2) {
    results.value = []
    searched.value = q
    pending.value = false
    return
  }
  pending.value = true
  try {
    const data = await $fetch<{ hits: DocSearchHit[] }>(
      '/api/knowledge-base/search',
      { query: { q, lang: props.lang, limit: 40 } },
    )
    if (seq !== requestSeq) return
    results.value = data.hits || []
    searched.value = q
  } catch {
    if (seq !== requestSeq) return
    results.value = []
    searched.value = q
  } finally {
    if (seq === requestSeq) pending.value = false
  }
}

watch([query, () => props.lang], ([value]) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  const q = String(value || '').trim()
  if (!props.open) return
  if (q.length < 2) {
    requestSeq += 1
    pending.value = false
    results.value = []
    searched.value = q
    return
  }
  pending.value = true
  debounceTimer = setTimeout(() => {
    void runSearch(q)
  }, 280)
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
    activeIndex.value = Math.min(
      activeIndex.value + 1,
      Math.max(results.value.length - 1, 0),
    )
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (e.key === 'Enter') {
    const hit = results.value[activeIndex.value]
    if (hit) choose(hit)
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  if (debounceTimer) clearTimeout(debounceTimer)
})

function choose(hit: DocSearchHit) {
  emit('select', {
    slug: hit.slug,
    hash: hit.headingId || undefined,
  })
  emit('update:open', false)
}

const showEmpty = computed(
  () =>
    !pending.value &&
    searched.value.length >= 2 &&
    !results.value.length,
)
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
            aria-autocomplete="list"
            :aria-busy="pending"
          />
        </div>
        <ul class="flex-1 overflow-y-auto p-2" role="listbox">
          <li
            v-if="pending && !results.length"
            class="space-y-2 px-2 py-2"
            role="status"
            aria-live="polite"
            :aria-label="$t('docs.searching')"
          >
            <div
              v-for="row in 5"
              :key="row"
              class="search-skel rounded-lg px-3 py-2"
            >
              <div class="skeleton-bar h-4 w-2/3" />
              <div class="skeleton-bar mt-2 h-3 w-full" />
            </div>
          </li>
          <li
            v-else-if="showEmpty"
            class="px-3 py-4 text-sm text-ink-muted"
          >
            {{ $t('docs.emptySearch') }}
          </li>
          <li v-for="(hit, i) in results" :key="hit.id" role="option" :aria-selected="i === activeIndex">
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
                v-html="highlightSearchText(hit.headingTitle, searched)"
              />
              <span
                v-if="hit.snippet && hit.kind === 'body'"
                class="line-clamp-2 text-xs text-ink-muted"
                v-html="hit.snippet"
              />
              <span class="text-xs text-ink-faint">
                <template v-if="hit.kind === 'title'">{{ hit.slug }}</template>
                <template v-else>{{ hit.title }} · {{ hit.slug }}</template>
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

<style scoped>
.skeleton-bar {
  border-radius: 0.5rem;
  background: var(--line);
  animation: skeleton-pulse 1.2s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0%,
  100% {
    opacity: 0.55;
  }
  50% {
    opacity: 1;
  }
}
</style>
