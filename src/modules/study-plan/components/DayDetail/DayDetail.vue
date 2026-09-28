<script setup lang="ts">
import { marked } from 'marked'
import type { DayMeta } from '@/modules/study-plan/constants/days.constant'
import { loadMarkdown } from '@/modules/study-plan/utils/load-markdown.util'
import { classifyMarkdownHref } from '@/modules/study-plan/utils/markdown-links.util'
import { isBundledPath } from '@/modules/study-plan/utils/load-markdown.util'
import { autolinkMarkdownPaths } from '@/modules/study-plan/utils/autolink-md.util'

const props = defineProps<{
  day: DayMeta
  done: boolean
  readOnly: boolean
}>()

const emit = defineEmits<{
  toggle: []
  prev: []
  next: []
  'open-doc': [path: string]
  'open-docs': [payload: { lang: string; slug: string; hash?: string }]
}>()

const tab = ref<'starter' | 'worksheet'>('starter')

watch(
  () => props.day.day,
  () => {
    tab.value = 'starter'
  },
)

const activePath = computed(() =>
  tab.value === 'starter' ? props.day.starter : props.day.worksheet,
)

const html = computed(() => {
  const raw = marked.parse(loadMarkdown(activePath.value).text, {
    async: false,
  }) as string
  return autolinkMarkdownPaths(raw, activePath.value)
})

function onDocClick(e: MouseEvent) {
  const a = (e.target as HTMLElement).closest('a')
  if (!a) return
  const href = a.getAttribute('href')
  const result = classifyMarkdownHref(activePath.value, href || '', isBundledPath)
  if (result.kind === 'ignore' || result.kind === 'hash') return
  e.preventDefault()
  if (result.kind === 'external' || result.kind === 'github') {
    window.open(result.url, '_blank', 'noopener,noreferrer')
    return
  }
  if (result.kind === 'docs') {
    emit('open-docs', {
      lang: result.lang || 'vi',
      slug: result.slug,
      hash: result.hash,
    })
    return
  }
  if (result.kind === 'plan') {
    emit('open-doc', result.path)
  }
}
</script>

<template>
  <article class="animate-fade-up rounded-2xl border border-line bg-surface-elevated p-4 sm:p-6">
    <header class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-accent-ink">
          Day {{ String(day.day).padStart(2, '0') }} · {{ day.date }}
        </p>
        <h2 class="mt-1 text-xl font-bold sm:text-2xl">{{ day.theme }}</h2>
      </div>
      <label
        class="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-medium"
        :class="readOnly ? 'opacity-70' : ''"
      >
        <input
          type="checkbox"
          class="h-5 w-5 accent-accent"
          :checked="done"
          :disabled="readOnly"
          @change="$emit('toggle')"
        />
        <span>
          {{
            readOnly
              ? done
                ? 'Đã xong (xem)'
                : 'Chưa xong'
              : done
                ? 'Đã xong'
                : 'Đánh dấu xong'
          }}
        </span>
      </label>
    </header>

    <div class="mb-3 flex gap-2" role="tablist">
      <button
        type="button"
        role="tab"
        class="min-h-10 rounded-lg px-3 text-sm font-semibold"
        :class="tab === 'starter' ? 'bg-accent text-white' : 'bg-white border border-line'"
        @click="tab = 'starter'"
      >
        Starter
      </button>
      <button
        type="button"
        role="tab"
        class="min-h-10 rounded-lg px-3 text-sm font-semibold"
        :class="tab === 'worksheet' ? 'bg-accent text-white' : 'bg-white border border-line'"
        @click="tab = 'worksheet'"
      >
        Worksheet
      </button>
    </div>

    <p class="mb-4 font-mono text-xs text-ink-faint">
      <code>{{ activePath }}</code>
    </p>

    <div class="prose-doc" v-html="html" @click="onDocClick" />

    <footer class="mt-8 flex flex-col gap-2 border-t border-line pt-4 sm:flex-row sm:justify-between">
      <button
        type="button"
        class="min-h-11 rounded-lg border border-line bg-white px-4 text-sm font-semibold disabled:opacity-40"
        :disabled="day.day <= 1"
        @click="$emit('prev')"
      >
        ← Day trước
      </button>
      <button
        type="button"
        class="min-h-11 rounded-lg border border-line bg-white px-4 text-sm font-semibold disabled:opacity-40"
        :disabled="day.day >= 30"
        @click="$emit('next')"
      >
        Day sau →
      </button>
    </footer>
  </article>
</template>
