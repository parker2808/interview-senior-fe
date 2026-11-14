<script setup lang="ts">
import AppTopBar from '@/modules/core/components/AppTopBar/AppTopBar.vue'
import LocaleToggle from '@/modules/core/components/LocaleToggle/LocaleToggle.vue'
import ThemeToggle from '@/modules/core/components/ThemeToggle/ThemeToggle.vue'
import type { FdeEntry } from '@/modules/fde/types/entities/fde-content.type'

const { t, locale } = useI18n()
const { data, error } = await useAsyncData('fde-cheat', () => $fetch<FdeEntry[]>('/api/fde/cheat'))
const mode = ref<'en' | 'vi' | 'both'>(locale.value === 'en' ? 'en' : 'vi')
const groups = computed(() => (['pitch', 'rescue', 'ask'] as const).map((section) => ({
  section,
  entries: data.value?.filter((entry) => entry.section === section) || [],
})))
const plain = (value: string) => value.replace(/\*\*|`/g, '')
</script>

<template>
  <div class="min-h-screen pb-12">
    <AppTopBar :title="t('fde.cheat')" lock-visible back-to="/fde" :back-label="t('fde.back')">
      <template #actions><LocaleToggle /><ThemeToggle /></template>
    </AppTopBar>
    <main class="mx-auto max-w-3xl px-4 pt-3 sm:px-6">
      <div class="flex items-center justify-between gap-2">
        <div>
          <p class="text-xs font-bold uppercase tracking-widest text-accent-ink">{{ t('fde.eyebrow') }}</p>
          <h1 class="text-xl font-bold text-ink">{{ t('fde.cheat') }}</h1>
        </div>
        <div class="flex gap-1">
          <button v-for="lang in (['en', 'vi', 'both'] as const)" :key="lang" type="button" :aria-pressed="mode === lang" class="rounded border border-line px-2 py-1 text-xs text-ink" :class="mode === lang ? 'bg-accent-soft' : ''" @click="mode = lang">{{ lang === 'both' ? t('fde.both') : lang.toUpperCase() }}</button>
        </div>
      </div>
      <p v-if="error" role="alert" class="mt-4 text-ink">{{ t('fde.unavailable') }}</p>
      <section v-for="group in groups" :key="group.section" class="mt-2 rounded-xl border border-line bg-surface-elevated px-3 py-2 sm:p-4">
        <h2 class="mb-1 text-base font-bold text-accent-ink">{{ t(`fde.sections.${group.section}`) }}</h2>
        <ol class="space-y-1 pl-5 text-xs leading-5 text-ink sm:text-sm" :class="group.section === 'pitch' ? 'list-decimal' : 'list-disc'">
          <li v-for="entry in group.entries" :key="entry.id">
            <p v-if="mode !== 'vi'" lang="en">{{ plain(entry.shortAnswer.en) }}</p>
            <p v-if="mode !== 'en'" lang="vi" :class="mode === 'both' ? 'text-ink-muted' : ''">{{ plain(entry.shortAnswer.vi) }}</p>
          </li>
        </ol>
      </section>
      <NuxtLink to="/fde" class="mt-2 inline-block text-xs font-semibold text-accent-ink">{{ t('fde.back') }}</NuxtLink>
    </main>
  </div>
</template>
