<script setup lang="ts">
import AppTopBar from '@/modules/core/components/AppTopBar/AppTopBar.vue'
import LocaleToggle from '@/modules/core/components/LocaleToggle/LocaleToggle.vue'
import ThemeToggle from '@/modules/core/components/ThemeToggle/ThemeToggle.vue'
import { renderFdeDetail } from '@/modules/fde/utils/fde-markdown.util'
import { tabEntries, liveKbHref, type JdTab } from '@/modules/jd/utils/jd-tabs.util'
import type { JdModule } from '@/modules/jd/types/entities/jd-module.type'

const { t, locale } = useI18n()
const route = useRoute()
const slug = String(route.params.slug || '')
const { data, error } = await useAsyncData(`jd-${slug}`, () => $fetch<JdModule>(`/api/jd/${encodeURIComponent(slug)}`))
const tabs: JdTab[] = ['jd', 'concepts', 'interview', 'cv', 'cheat', 'test']
const tab = ref<JdTab>('jd')
const expanded = ref<string[]>([])
const lang = computed<'en' | 'vi'>(() => locale.value === 'en' ? 'en' : 'vi')
const entries = computed(() => data.value ? tabEntries(data.value, tab.value) : [])
const plain = (value: string) => value.replace(/\*\*|`/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
const requirement = (id: string) => data.value?.requirements.find((row) => row.id === id)?.title[lang.value] || id
useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }], title: t('jd.title') })
</script>

<template>
  <div class="min-h-screen pb-16">
    <AppTopBar :title="t('jd.title')" lock-visible back-to="/jd" :back-label="t('jd.back')"><template #actions><LocaleToggle /><ThemeToggle /></template></AppTopBar>
    <main class="mx-auto max-w-4xl min-w-0 px-4 pt-5 sm:px-6">
      <NuxtLink to="/jd" class="inline-flex min-h-11 items-center text-accent-ink">{{ t('jd.back') }}</NuxtLink>
      <h1 class="mt-2 break-words text-2xl font-bold text-ink">{{ t('jd.title') }}</h1>
      <p v-if="error" role="alert" class="mt-5 text-ink-muted">{{ t('fde.unavailable') }}</p>
      <div v-else-if="data">
        <nav class="sticky z-20 -mx-4 mt-4 flex gap-2 overflow-x-auto border-y border-line bg-surface-elevated/95 px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-lg sm:border" style="top:var(--app-header-h)" :aria-label="t('jd.title')">
          <button v-for="item in tabs" :key="item" type="button" :aria-current="tab === item ? 'page' : undefined" class="min-h-11 shrink-0 rounded-lg border border-line px-3 text-sm text-ink" :class="tab === item ? 'bg-accent-soft font-bold text-accent-ink' : ''" @click="tab = item">{{ t(`jd.tabs.${item}`) }}</button>
        </nav>
        <p v-if="tab === 'cv'" class="mt-6 text-ink-muted">{{ t('jd.cvEmpty') }}</p>
        <p v-else-if="tab === 'test'" class="mt-6 text-ink-muted">{{ t('jd.testEmpty') }}</p>
        <p v-else-if="!entries.length" class="mt-6 text-ink-muted">{{ t('jd.empty') }}</p>
        <div v-else class="mt-4 space-y-3">
          <article v-for="entry in entries" :id="entry.id" :key="entry.id" class="min-w-0 scroll-mt-40 rounded-xl border border-line bg-surface-elevated p-4">
            <p class="break-words text-xs text-accent-ink">{{ requirement(entry.jdRequirement) }}</p>
            <h2 class="mt-1 break-words text-lg font-bold text-ink">{{ plain(entry.title[lang]) }}</h2>
            <h3 class="mt-3 text-xs font-semibold uppercase text-ink-muted">{{ t('jd.answer') }}</h3>
            <p class="mt-1 break-words text-base font-semibold text-ink">{{ plain(entry.shortAnswer[lang]) }}</p>
            <ul class="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted"><li v-for="(point, index) in entry.keyPoints" :key="index" class="break-words">{{ plain(point[lang]) }}</li></ul>
            <div v-for="ref in entry.kbRefs || []" :key="`${ref.slug}-${ref.sectionId}`" class="mt-2 break-words text-sm">
              <NuxtLink v-if="liveKbHref(ref, lang)" :to="liveKbHref(ref, lang)!" class="text-accent-ink underline">{{ t('jd.general') }}: {{ ref.slug }}</NuxtLink>
              <span v-else class="text-ink-muted">{{ t('jd.pending') }}</span>
            </div>
            <button type="button" class="mt-3 min-h-11 rounded-lg border border-line px-3 text-sm text-accent-ink" :aria-expanded="expanded.includes(entry.id)" @click="expanded = expanded.includes(entry.id) ? expanded.filter((id) => id !== entry.id) : [...expanded, entry.id]">{{ t('jd.detail') }}</button>
            <div v-if="expanded.includes(entry.id)" class="prose-doc mt-3 min-w-0 max-w-full break-words border-t border-line pt-3 text-sm text-ink" v-html="renderFdeDetail(entry.detail[lang])" />
          </article>
        </div>
      </div>
    </main>
  </div>
</template>
