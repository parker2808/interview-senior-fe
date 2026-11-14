<script setup lang="ts">
import AppTopBar from '@/modules/core/components/AppTopBar/AppTopBar.vue'
import LocaleToggle from '@/modules/core/components/LocaleToggle/LocaleToggle.vue'
import ThemeToggle from '@/modules/core/components/ThemeToggle/ThemeToggle.vue'
import { buildFdeIndex, searchFde, snippetHtml } from '@/modules/fde/utils/fde-search.util'
import type { FdeContent, FdeEntry, FdeLocalized } from '@/modules/fde/types/entities/fde-content.type'

const { t, locale } = useI18n()
const { data, error, status } = await useAsyncData('fde-content', () => $fetch<FdeContent>('/api/fde'))
const route = useRoute()
const searchRef = ref<HTMLInputElement | null>(null)
const query = ref('')
const selectedSection = ref('all')
const selectedRequirement = ref('all')
const languageMode = ref<'en' | 'vi' | 'both'>(locale.value === 'en' ? 'en' : 'vi')
const shownCount = ref(30)
const expanded = ref<string[]>([])
const indexed = computed(() => buildFdeIndex(data.value?.entries || []))
const sections = ['all', 'jd', 'concepts', 'interview', 'pitch', 'rescue', 'ask']

const results = computed(() => searchFde(indexed.value, query.value).filter(({ entry }) =>
  (selectedSection.value === 'all' || entry.section === selectedSection.value) &&
  (selectedRequirement.value === 'all' || entry.jdRequirement === selectedRequirement.value) &&
  entry.section !== 'cheat',
))
const visible = computed(() => results.value.slice(0, shownCount.value))
watch([query, selectedSection, selectedRequirement], () => { shownCount.value = 30 })
watch(() => route.hash, async () => {
  if (!import.meta.client) return
  if (!route.hash) return
  const id = decodeURIComponent(route.hash.slice(1))
  const index = results.value.findIndex(({ entry }) => entry.id === id)
  if (index >= shownCount.value) shownCount.value = index + 1
  await nextTick()
  document.getElementById(id)?.scrollIntoView({ block: 'start' })
}, { immediate: true })

function onKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null
  if ((event.key === '/' && !['INPUT', 'TEXTAREA'].includes(target?.tagName || '')) || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k')) {
    event.preventDefault()
    searchRef.value?.focus()
  }
  if (event.key === 'Escape') {
    query.value = ''
    searchRef.value?.blur()
  }
}
onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))

function text(value: FdeLocalized): string {
  return value[languageMode.value === 'en' ? 'en' : 'vi']
}
function plain(value: string): string {
  return value.replace(/\*\*|`/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
}
function languages(): ('en' | 'vi')[] {
  return languageMode.value === 'both' ? ['en', 'vi'] : [languageMode.value]
}
function toggle(id: string) {
  expanded.value = expanded.value.includes(id) ? expanded.value.filter((item) => item !== id) : [...expanded.value, id]
}
function requirement(entry: FdeEntry): string {
  const item = data.value?.requirements.find((row) => row.id === entry.jdRequirement)
  return item ? text(item.title) : entry.jdRequirement
}
</script>

<template>
  <div class="min-h-screen pb-20">
    <AppTopBar :title="t('fde.title')" lock-visible>
      <template #actions>
        <LocaleToggle />
        <ThemeToggle />
      </template>
    </AppTopBar>

    <main class="mx-auto max-w-4xl px-3 pt-6 sm:px-6">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-xs font-bold uppercase tracking-widest text-accent-ink">{{ t('fde.eyebrow') }}</p>
          <h1 class="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{{ t('fde.title') }}</h1>
          <p class="mt-1 text-sm text-ink-muted">{{ t('fde.subtitle') }}</p>
        </div>
        <NuxtLink to="/fde/cheat-sheet" class="shrink-0 rounded-xl bg-accent-soft px-3 py-2 text-sm font-semibold text-accent-ink">{{ t('fde.cheat') }}</NuxtLink>
      </div>

      <div class="sticky z-20 -mx-3 mt-5 border-y border-line bg-surface-elevated/95 px-3 py-3 shadow-sm backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:px-4" style="top:var(--app-header-h)">
        <label for="fde-search" class="sr-only">{{ t('fde.search') }}</label>
        <input id="fde-search" ref="searchRef" v-model="query" type="search" autocomplete="off" :placeholder="t('fde.search')" class="w-full rounded-lg border border-line bg-surface-elevated px-4 py-3 text-base text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft" />
        <div class="mt-2 flex gap-2 overflow-x-auto pb-1" :aria-label="t('fde.sectionFilter')">
          <button v-for="section in sections" :key="section" type="button" :aria-pressed="selectedSection === section" class="shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium" :class="selectedSection === section ? 'border-accent bg-accent-soft text-accent-ink' : 'border-line text-ink-muted'" @click="selectedSection = section">{{ t(`fde.sections.${section}`) }}</button>
        </div>
        <div class="mt-2 flex items-center gap-2 overflow-x-auto pb-1">
          <span class="shrink-0 text-xs font-semibold text-ink-muted">{{ t('fde.jdFilter') }}:</span>
          <button type="button" :aria-pressed="selectedRequirement === 'all'" class="shrink-0 rounded-full border px-2.5 py-1 text-xs" :class="selectedRequirement === 'all' ? 'border-accent bg-accent-soft text-accent-ink' : 'border-line text-ink-muted'" @click="selectedRequirement = 'all'">{{ t('fde.all') }}</button>
          <button v-for="item in data?.requirements || []" :key="item.id" type="button" :aria-pressed="selectedRequirement === item.id" class="shrink-0 rounded-full border px-2.5 py-1 text-xs" :class="selectedRequirement === item.id ? 'border-accent bg-accent-soft text-accent-ink' : 'border-line text-ink-muted'" @click="selectedRequirement = item.id">{{ text(item.title) }}</button>
        </div>
      </div>

      <div class="mt-4 flex items-center justify-between gap-2 text-sm text-ink-muted">
        <p aria-live="polite">{{ t('fde.results', { count: results.length }) }}</p>
        <div class="flex gap-1" :aria-label="t('fde.language')">
          <button v-for="lang in (['en', 'vi', 'both'] as const)" :key="lang" type="button" :aria-pressed="languageMode === lang" class="rounded-lg border px-2.5 py-1.5 text-xs font-bold" :class="languageMode === lang ? 'border-accent bg-accent-soft text-accent-ink' : 'border-line'" @click="languageMode = lang">{{ lang === 'both' ? t('fde.both') : lang.toUpperCase() }}</button>
        </div>
      </div>

      <p v-if="error" role="alert" class="mt-8 text-ink">{{ t('fde.unavailable') }}</p>
      <p v-else-if="status === 'pending'" class="mt-8 text-ink-muted">{{ t('fde.loading') }}</p>
      <p v-else-if="!results.length" class="mt-8 text-ink-muted">{{ t('fde.empty') }}</p>
      <div v-else class="mt-4 space-y-3">
        <article v-for="hit in visible" :id="hit.entry.id" :key="hit.entry.id" class="scroll-mt-64 rounded-2xl border border-line bg-surface-elevated p-4 shadow-sm sm:p-6">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2 text-xs font-semibold text-accent-ink">
                <span class="rounded bg-accent-soft px-2 py-1">{{ hit.entry.id }}</span>
                <span>{{ t(`fde.sections.${hit.entry.section}`) }}</span>
                <span class="text-ink-muted">{{ requirement(hit.entry) }}</span>
              </div>
              <h2 class="mt-2 text-lg font-bold leading-snug text-ink sm:text-xl">{{ plain(text(hit.entry.title)) }}</h2>
            </div>
            <a :href="`#${hit.entry.id}`" :aria-label="t('fde.linkTo', { id: hit.entry.id })" class="rounded p-2 text-accent-ink hover:bg-accent-soft">#</a>
          </div>
          <div v-if="query && hit.score" class="mt-2 border-l-2 border-accent pl-3 text-sm leading-relaxed text-ink-muted">
            <span v-if="languageMode !== 'both' && hit.matchedLang !== languageMode" class="font-semibold">{{ hit.matchedLang.toUpperCase() }}: </span>
            <span v-html="snippetHtml(hit)" />
          </div>
          <div v-for="lang in languages()" :key="lang" class="mt-4" :lang="lang">
            <p v-if="languageMode === 'both'" class="mb-1 text-xs font-bold uppercase text-accent-ink">{{ lang }}</p>
            <p class="text-base font-semibold leading-relaxed text-ink sm:text-lg">{{ plain(hit.entry.shortAnswer[lang]) }}</p>
            <ul class="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink-muted sm:text-base">
              <li v-for="(point, index) in hit.entry.keyPoints" :key="index">{{ plain(point[lang]) }}</li>
            </ul>
          </div>
          <button type="button" class="mt-4 min-h-11 rounded-lg border border-line px-3 py-2 text-sm font-semibold text-accent-ink hover:bg-accent-soft" :aria-expanded="expanded.includes(hit.entry.id)" @click="toggle(hit.entry.id)">{{ expanded.includes(hit.entry.id) ? t('fde.less') : t('fde.more') }}</button>
          <div v-if="expanded.includes(hit.entry.id)" class="mt-3 border-t border-line pt-3">
            <div v-for="lang in languages()" :key="lang" :lang="lang" class="mb-4">
              <p v-if="languageMode === 'both'" class="mb-1 text-xs font-bold uppercase text-accent-ink">{{ lang }}</p>
              <p class="whitespace-pre-line break-words text-sm leading-7 text-ink sm:text-base">{{ plain(hit.entry.detail[lang]) }}</p>
            </div>
          </div>
        </article>
      </div>
      <button v-if="results.length > shownCount" type="button" class="mt-6 w-full rounded-xl border border-line bg-surface-elevated py-3 font-semibold text-accent-ink" @click="shownCount += 30">{{ t('fde.loadMore') }}</button>
    </main>
  </div>
</template>
