<script setup lang="ts">
import AppTopBar from '@/modules/core/components/AppTopBar/AppTopBar.vue'
import LocaleToggle from '@/modules/core/components/LocaleToggle/LocaleToggle.vue'
import ThemeToggle from '@/modules/core/components/ThemeToggle/ThemeToggle.vue'
import type { JdRow } from '@/modules/jd/types/entities/jd-module.type'
import JdModuleAction from '@/modules/jd/components/JdModuleAction.vue'
import { useEditMode } from '@/modules/study-plan/composables/use-edit-mode.composable'
import { filterModules, groupModules } from '@/modules/jd/utils/jd-list.util'
import { canShowJdAction } from '@/modules/jd/utils/jd-actions.util'

const { t, locale } = useI18n()
const { isEditMode } = useEditMode()
const requestFetch = useRequestFetch()
const { data } = await useAsyncData('jd-modules', () => requestFetch<JdRow[]>('/api/jd'), { watch: [isEditMode] })
const { data: archivedData } = await useAsyncData('jd-archived-modules', () => isEditMode.value ? requestFetch<JdRow[]>('/api/jd', { query: { status: 'archived' } }) : Promise.resolve([]), { watch: [isEditMode] })
const query = ref('')
const status = ref<'active' | 'archived'>('active')
const tag = ref('all')
const date = ref('all')
const group = ref<'organizationAlias' | 'role'>('organizationAlias')
watch(isEditMode, (enabled) => { if (!enabled) status.value = 'active' })
const visibleRows = computed(() => status.value === 'archived' && isEditMode.value ? archivedData.value || [] : data.value || [])
const tags = computed(() => [...new Set(visibleRows.value.flatMap((row) => row.tags))].sort())
const filtered = computed(() => filterModules(visibleRows.value, { query: query.value, status: status.value, tag: tag.value, date: date.value }))
const groups = computed(() => groupModules(filtered.value, group.value, locale.value === 'en' ? 'en' : 'vi'))
const text = (value: { en: string; vi: string }) => value[locale.value === 'en' ? 'en' : 'vi']
</script>

<template>
  <div class="min-h-screen pb-16">
    <AppTopBar :title="t('jd.title')" lock-visible><template #actions><LocaleToggle /><ThemeToggle /></template></AppTopBar>
    <main class="mx-auto max-w-4xl min-w-0 px-4 pt-5 sm:px-6">
      <h1 class="text-2xl font-bold text-ink">{{ t('jd.title') }}</h1>
      <p class="mt-2 text-sm text-ink-muted">{{ t('jd.hint') }}</p>
      <NuxtLink to="/search" class="mt-3 inline-flex min-h-11 items-center rounded-lg border border-line px-4 text-accent-ink">{{ t('jd.globalSearch') }}</NuxtLink>
      <div v-if="isEditMode" class="mt-3 flex flex-wrap gap-2" role="group" :aria-label="t('jd.status')">
        <button v-for="item in (['active', 'archived'] as const)" :key="item" type="button" class="min-h-11 rounded-lg border border-line px-4 text-accent-ink" :aria-pressed="status === item" @click="status = item; tag = 'all'">{{ t(`jd.${item}`) }}</button>
      </div>
      <div class="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <label class="min-w-0 text-xs text-ink-muted">{{ t('jd.filter') }}
          <input v-model="query" type="search" :placeholder="t('jd.search')" class="mt-1 w-full min-w-0 rounded-lg border border-line bg-surface-elevated p-3 text-base text-ink" />
        </label>
        <label class="min-w-0 text-xs text-ink-muted">{{ t('jd.tag') }}
          <select v-model="tag" class="mt-1 w-full rounded-lg border border-line bg-surface-elevated p-3 text-base text-ink"><option value="all">{{ t('jd.all') }}</option><option v-for="item in tags" :key="item" :value="item">{{ item }}</option></select>
        </label>
        <label class="min-w-0 text-xs text-ink-muted">{{ t('jd.date') }}
          <select v-model="date" class="mt-1 w-full rounded-lg border border-line bg-surface-elevated p-3 text-base text-ink"><option value="all">{{ t('jd.all') }}</option><option value="recent">{{ t('jd.recent') }}</option></select>
        </label>
        <label class="min-w-0 text-xs text-ink-muted">{{ t('jd.group') }}
          <select v-model="group" class="mt-1 w-full rounded-lg border border-line bg-surface-elevated p-3 text-base text-ink"><option value="organizationAlias">{{ t('jd.organization') }}</option><option value="role">{{ t('jd.role') }}</option></select>
        </label>
      </div>
      <p v-if="!filtered.length" class="mt-6 text-ink-muted">{{ t('jd.empty') }}</p>
      <section v-for="[label, rows] in groups" :key="label" class="mt-6 min-w-0">
        <h2 class="break-words text-lg font-bold text-ink">{{ label }}</h2>
        <div class="mt-2 grid gap-3 sm:grid-cols-2">
          <article v-for="row in rows" :key="row.slug" class="min-w-0 rounded-xl border border-line bg-surface-elevated p-4">
            <h3 class="break-words text-lg font-bold text-ink">{{ text(row.title) }}</h3>
            <p class="break-words text-sm text-ink-muted">{{ row.organizationAlias }} · {{ text(row.role) }} · {{ text(row.level) }}</p>
            <p class="mt-1 text-sm text-ink-muted">{{ row.date }} · {{ row.tags.join(', ') }} <span v-if="row.testScore !== undefined">· {{ row.testScore }}%</span></p>
            <p class="mt-2 break-words text-sm text-ink">{{ text(row.summary) }}</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <NuxtLink v-if="status === 'active'" :to="`/jd/${row.slug}`" class="inline-flex min-h-11 items-center rounded-lg bg-accent-soft px-3 text-sm font-semibold text-accent-ink">{{ t('jd.open') }}</NuxtLink>
              <a v-if="status === 'active' && row.telegram" :href="row.telegram.url" rel="noopener noreferrer" class="inline-flex min-h-11 items-center rounded-lg border border-line px-3 text-sm text-accent-ink">{{ t('jd.telegram') }}</a>
              <span v-else-if="status === 'active'" class="inline-flex min-h-11 items-center text-xs text-ink-muted">{{ t('jd.telegramUnavailable') }}</span>
            </div>
            <p v-if="status === 'archived'" class="mt-2 break-words text-sm text-ink-muted">{{ t('jd.restoreUntil', { date: row.purgeAfter }) }}</p>
            <JdModuleAction v-if="canShowJdAction(row.slug, row.status, isEditMode, row.action, status === 'archived' ? 'restore' : 'delete')" :action="row.action!" :kind="status === 'archived' ? 'restore' : 'delete'" />
          </article>
        </div>
      </section>
    </main>
  </div>
</template>
