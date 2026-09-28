<script setup lang="ts">
import type { DocTopic } from '@/modules/knowledge-base/constants/doc-catalog.constant'
import type { DocLang } from '@/modules/core/constants/locale.constant'

const props = defineProps<{
  open: boolean
  topics: DocTopic[]
  lang: DocLang
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  select: [slug: string]
}>()

const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.topics
  return props.topics.filter((t) => {
    const title = t.title[props.lang].toLowerCase()
    return title.includes(q) || t.slug.includes(q) || t.group.includes(q)
  })
})

watch(
  () => props.open,
  (open) => {
    if (open) {
      query.value = ''
      nextTick(() => inputRef.value?.focus())
    }
  },
)

function onKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    emit('update:open', !props.open)
  }
  if (e.key === 'Escape' && props.open) {
    emit('update:open', false)
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))

function choose(slug: string) {
  emit('select', slug)
  emit('update:open', false)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 p-4 pt-[12vh] sm:pt-[18vh]"
      role="dialog"
      aria-modal="true"
      @click.self="emit('update:open', false)"
    >
      <div
        class="animate-fade-up w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-surface-elevated shadow-xl"
      >
        <div class="border-b border-line p-3">
          <input
            ref="inputRef"
            v-model="query"
            type="search"
            class="min-h-11 w-full rounded-lg border border-line bg-white px-3 text-base outline-none focus:border-accent"
            :placeholder="$t('docs.searchPlaceholder')"
          />
        </div>
        <ul class="max-h-72 overflow-y-auto p-2">
          <li v-if="!filtered.length" class="px-3 py-4 text-sm text-ink-muted">
            {{ $t('docs.emptySearch') }}
          </li>
          <li v-for="t in filtered" :key="t.slug">
            <button
              type="button"
              class="flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-left text-sm hover:bg-accent-soft"
              @click="choose(t.slug)"
            >
              <span class="font-medium text-ink">{{ t.title[lang] }}</span>
              <span class="text-xs text-ink-faint">{{ t.slug }}</span>
            </button>
          </li>
        </ul>
        <p class="border-t border-line px-3 py-2 text-xs text-ink-faint">
          {{ $t('docs.searchHint') }}
        </p>
      </div>
    </div>
  </Teleport>
</template>
