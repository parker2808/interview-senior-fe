<script setup lang="ts">
import AppTopBar from '@/modules/core/components/AppTopBar/AppTopBar.vue'
import LocaleToggle from '@/modules/core/components/LocaleToggle/LocaleToggle.vue'
import ThemeToggle from '@/modules/core/components/ThemeToggle/ThemeToggle.vue'
import { shouldClearFdeSearch } from '@/modules/fde/utils/fde-keyboard.util'
import type { FdeLocalized } from '@/modules/fde/types/entities/fde-content.type'

type SearchHit = { slug: string; moduleTitle: FdeLocalized; entry: { id: string; section: string; title: FdeLocalized; shortAnswer: FdeLocalized }; score: number }
const { t, locale } = useI18n()
const query = ref('')
const searchRef = ref<HTMLInputElement | null>(null)
const debounced = ref('')
let timer: ReturnType<typeof setTimeout> | undefined
watch(query, (value) => { clearTimeout(timer); timer = setTimeout(() => { debounced.value = value }, 180) })
onUnmounted(() => clearTimeout(timer))
const { data, status } = await useAsyncData('jd-global-search', () => debounced.value.length >= 2 ? $fetch<SearchHit[]>('/api/jd/search', { query: { q: debounced.value } }) : Promise.resolve([]), { watch: [debounced] })
const lang = computed<'en' | 'vi'>(() => locale.value === 'en' ? 'en' : 'vi')
function onKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null
  if ((event.key === '/' && !['INPUT', 'TEXTAREA'].includes(target?.tagName || '')) || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k')) {
    event.preventDefault()
    searchRef.value?.focus()
  }
  if (shouldClearFdeSearch({ key: event.key, defaultPrevented: event.defaultPrevented, isComposing: event.isComposing, searchFocused: document.activeElement === searchRef.value, query: query.value, dialogOpen: !!document.querySelector('dialog[open], [aria-modal="true"]') })) {
    query.value = ''
    searchRef.value?.blur()
  }
}
onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  if (sessionStorage.getItem('jd-focus-search') === '1') { sessionStorage.removeItem('jd-focus-search'); searchRef.value?.focus() }
})
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })
</script>

<template>
  <div class="min-h-screen pb-16">
    <AppTopBar :title="t('jd.globalSearch')" lock-visible back-to="/jd" :back-label="t('jd.back')"><template #actions><LocaleToggle /><ThemeToggle /></template></AppTopBar>
    <main class="mx-auto max-w-3xl min-w-0 px-4 pt-5 sm:px-6">
      <h1 class="text-2xl font-bold text-ink">{{ t('jd.globalSearch') }}</h1>
      <p class="mt-2 text-sm text-ink-muted">{{ t('jd.searchHint') }}</p>
      <div class="sticky z-20 -mx-4 mt-4 border-y border-line bg-surface-elevated px-4 py-2 sm:mx-0 sm:rounded-lg sm:border" style="top:var(--app-header-h)">
        <label for="jd-global-search" class="sr-only">{{ t('jd.globalSearch') }}</label>
        <input id="jd-global-search" ref="searchRef" v-model="query" type="search" autocomplete="off" :placeholder="t('jd.search')" class="w-full min-w-0 rounded-lg border border-line bg-surface-elevated p-3 text-base text-ink" />
      </div>
      <p class="mt-4 text-sm text-ink-muted" aria-live="polite">{{ t('jd.searchResults', { count: data?.length || 0 }) }}</p>
      <p v-if="query.length >= 2 && status !== 'pending' && !data?.length" class="mt-4 text-ink-muted">{{ t('jd.noResults') }}</p>
      <div class="mt-3 space-y-3">
        <NuxtLink v-for="hit in data || []" :key="`${hit.slug}-${hit.entry.id}`" :to="`/jd/${hit.slug}`" class="block min-h-11 min-w-0 rounded-xl border border-line bg-surface-elevated p-4 text-ink">
          <p class="break-words text-xs text-accent-ink">{{ hit.moduleTitle[lang] }} · {{ t(`fde.sections.${hit.entry.section}`) }}</p>
          <h2 class="mt-1 break-words font-bold">{{ hit.entry.title[lang] }}</h2>
          <p class="mt-2 break-words text-sm text-ink-muted">{{ hit.entry.shortAnswer[lang] }}</p>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>
