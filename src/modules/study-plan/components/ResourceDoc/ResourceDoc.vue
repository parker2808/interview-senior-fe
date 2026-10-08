<script setup lang="ts">
import { marked } from 'marked'
import { loadMarkdown, isBundledPath } from '@/modules/study-plan/utils/load-markdown.util'
import { classifyMarkdownHref } from '@/modules/study-plan/utils/markdown-links.util'
import { autolinkMarkdownPaths } from '@/modules/study-plan/utils/autolink-md.util'
import {
  applyPlanHeadingI18n,
  stripPlanLocalePrefix,
} from '@/modules/study-plan/utils/plan-locale-path.util'

const props = defineProps<{
  path: string
}>()

const emit = defineEmits<{
  'open-doc': [path: string]
  'open-docs': [payload: { lang: string; slug: string; hash?: string }]
}>()

const { locale, t } = useI18n()
const lang = computed<'en' | 'vi'>(() =>
  locale.value === 'en' ? 'en' : 'vi',
)
const loaded = computed(() => loadMarkdown(props.path, lang.value))
const html = computed(() => {
  const raw = marked.parse(loaded.value.text, { async: false }) as string
  return applyPlanHeadingI18n(
    autolinkMarkdownPaths(raw, loaded.value.path),
    t,
  )
})

function onDocClick(e: MouseEvent) {
  const a = (e.target as HTMLElement).closest('a')
  if (!a) return
  const href = a.getAttribute('href')
  const result = classifyMarkdownHref(
    loaded.value.path,
    href || '',
    (path) => isBundledPath(path, lang.value),
  )
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
    <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-accent-ink">
      {{ path.startsWith('documents/') ? t('plan.resourceKb') : t('plan.resourceDoc') }}
    </p>
    <h2 class="mb-4 break-all text-lg font-bold sm:text-xl">{{ stripPlanLocalePrefix(loaded.path) }}</h2>
    <div class="prose-doc" v-html="html" @click="onDocClick" />
  </article>
</template>
