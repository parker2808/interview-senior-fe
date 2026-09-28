<script setup lang="ts">
import { marked } from 'marked'
import { loadMarkdown, isBundledPath } from '@/modules/study-plan/utils/load-markdown.util'
import { classifyMarkdownHref } from '@/modules/study-plan/utils/markdown-links.util'

const props = defineProps<{
  path: string
}>()

const emit = defineEmits<{
  'open-doc': [path: string]
  'open-docs': [payload: { lang: string; slug: string; hash?: string }]
}>()

const loaded = computed(() => loadMarkdown(props.path))
const html = computed(
  () => marked.parse(loaded.value.text, { async: false }) as string,
)

function onDocClick(e: MouseEvent) {
  const a = (e.target as HTMLElement).closest('a')
  if (!a) return
  const href = a.getAttribute('href')
  const result = classifyMarkdownHref(props.path, href || '', isBundledPath)
  if (result.kind === 'ignore' || result.kind === 'hash') return
  if (result.kind === 'external' || result.kind === 'github') {
    e.preventDefault()
    window.open(result.url, '_blank', 'noopener,noreferrer')
    return
  }
  if (result.kind === 'docs') {
    e.preventDefault()
    emit('open-docs', {
      lang: result.lang,
      slug: result.slug,
      hash: result.hash,
    })
    return
  }
  if (result.kind === 'plan') {
    e.preventDefault()
    emit('open-doc', result.path)
  }
}
</script>

<template>
  <article class="animate-fade-up rounded-2xl border border-line bg-surface-elevated p-4 sm:p-6">
    <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-accent-ink">
      {{ path.startsWith('documents/') ? 'Knowledge base' : 'Tài liệu' }}
    </p>
    <h2 class="mb-4 break-all text-lg font-bold sm:text-xl">{{ path }}</h2>
    <div class="prose-doc" v-html="html" @click="onDocClick" />
  </article>
</template>
