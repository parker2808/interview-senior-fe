<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import { loadMarkdown } from '../data/markdown.js'
import { classifyMarkdownHref } from '../utils/markdownLinks.js'

const props = defineProps({
  path: { type: String, required: true },
})

const emit = defineEmits(['back', 'open-doc'])

const loaded = computed(() => loadMarkdown(props.path))
const html = computed(() => marked.parse(loaded.value.text, { async: false }))

function onDocClick(e) {
  const a = e.target.closest('a')
  if (!a) return
  const href = a.getAttribute('href')
  const result = classifyMarkdownHref(props.path, href, (path) =>
    loadMarkdown(path).ok,
  )
  if (result.kind === 'ignore' || result.kind === 'hash') return
  if (result.kind === 'external' || result.kind === 'github') {
    e.preventDefault()
    window.open(result.url, '_blank', 'noopener,noreferrer')
    return
  }
  if (result.kind === 'plan') {
    e.preventDefault()
    emit('open-doc', result.path)
  }
}
</script>

<template>
  <article class="doc">
    <header>
      <p class="eyebrow">Tài liệu</p>
      <h2>{{ path }}</h2>
    </header>
    <div class="md" v-html="html" @click="onDocClick"></div>
  </article>
</template>

<style scoped>
.doc {
  background: var(--bg-elevated);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 1.1rem 1rem 1.4rem;
  box-shadow: var(--shadow);
  animation: fade-up 0.28s var(--ease) both;
}

.eyebrow {
  margin: 0;
  color: var(--ink-muted);
  font-size: 0.85rem;
}

h2 {
  margin: 0.25rem 0 1rem;
  font-size: 1.05rem;
  font-family: var(--mono);
  font-weight: 500;
  word-break: break-all;
}

.md {
  font-size: 0.95rem;
  line-height: 1.65;
}

.md :deep(h1) {
  font-size: 1.35rem;
}

.md :deep(h2) {
  font-size: 1.15rem;
}

.md :deep(pre),
.md :deep(code) {
  font-family: var(--mono);
  font-size: 0.86em;
}

.md :deep(pre) {
  overflow-x: auto;
  background: #0f1a17;
  color: #e7f2ed;
  padding: 0.85rem 1rem;
  border-radius: 8px;
}

.md :deep(code) {
  background: #e8f0ec;
  padding: 0.1em 0.35em;
  border-radius: 4px;
}

.md :deep(pre code) {
  background: transparent;
  padding: 0;
}

.md :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  display: block;
  overflow-x: auto;
}

.md :deep(th),
.md :deep(td) {
  border: 1px solid var(--line);
  padding: 0.4rem 0.55rem;
  text-align: left;
}

.md :deep(a) {
  color: var(--accent-ink);
}

@media (min-width: 720px) {
  .doc {
    padding: 1.35rem 1.4rem 1.5rem;
  }
}
</style>
