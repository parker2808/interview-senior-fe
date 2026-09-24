<script setup>
import { computed, ref, watch } from 'vue'
import { marked } from 'marked'
import { loadMarkdown } from '../data/markdown.js'
import { classifyMarkdownHref } from '../utils/markdownLinks.js'

const props = defineProps({
  day: { type: Object, required: true },
  done: { type: Boolean, required: true },
  readOnly: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle', 'prev', 'next', 'open-doc'])

const tab = ref('starter') // starter | worksheet

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
  const { text } = loadMarkdown(activePath.value)
  return marked.parse(text, { async: false })
})

function onDocClick(e) {
  const a = e.target.closest('a')
  if (!a) return
  const href = a.getAttribute('href')
  const result = classifyMarkdownHref(activePath.value, href, (path) =>
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
  <article class="detail">
    <header class="head">
      <div>
        <p class="eyebrow">Day {{ String(day.day).padStart(2, '0') }} · {{ day.date }}</p>
        <h2>{{ day.theme }}</h2>
      </div>
      <label class="done-toggle" :class="{ disabled: readOnly }">
        <input
          type="checkbox"
          :checked="done"
          :disabled="readOnly"
          @change="$emit('toggle')"
        />
        <span>{{ readOnly ? (done ? 'Đã xong (xem)' : 'Chưa xong') : done ? 'Đã xong' : 'Đánh dấu xong' }}</span>
      </label>
    </header>

    <div class="tabs" role="tablist">
      <button
        type="button"
        role="tab"
        :aria-selected="tab === 'starter'"
        :class="{ active: tab === 'starter' }"
        @click="tab = 'starter'"
      >
        Starter
      </button>
      <button
        type="button"
        role="tab"
        :aria-selected="tab === 'worksheet'"
        :class="{ active: tab === 'worksheet' }"
        @click="tab = 'worksheet'"
      >
        Worksheet
      </button>
    </div>

    <p class="file-path">
      <code>{{ activePath }}</code>
    </p>

    <div class="md" v-html="html" @click="onDocClick"></div>

    <footer class="nav">
      <button type="button" :disabled="day.day <= 1" @click="$emit('prev')">
        ← Day trước
      </button>
      <button type="button" :disabled="day.day >= 30" @click="$emit('next')">
        Day sau →
      </button>
    </footer>
  </article>
</template>

<style scoped>
.detail {
  background: var(--bg-elevated);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 1.1rem 1rem 1.25rem;
  box-shadow: var(--shadow);
  animation: fade-up 0.28s var(--ease) both;
}

.head {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.eyebrow {
  margin: 0;
  color: var(--ink-muted);
  font-size: 0.85rem;
}

h2 {
  margin: 0.2rem 0 0;
  font-size: 1.35rem;
  letter-spacing: -0.02em;
}

.done-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 0.4rem 0.8rem;
  background: #f7faf9;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
}

.done-toggle:has(input:checked) {
  background: var(--done-soft);
  border-color: #86efac;
  color: var(--done);
}

.done-toggle.disabled {
  opacity: 0.75;
  cursor: default;
}

.tabs {
  display: flex;
  gap: 0.35rem;
  border-bottom: 1px solid var(--line);
  margin-bottom: 0.65rem;
}

.tabs button {
  border: 0;
  background: transparent;
  padding: 0.55rem 0.85rem;
  color: var(--ink-muted);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  font-weight: 500;
}

.tabs button.active {
  color: var(--accent-ink);
  border-bottom-color: var(--accent);
}

.file-path {
  margin: 0 0 0.85rem;
  font-size: 0.78rem;
  color: var(--ink-faint);
}

.file-path code {
  font-family: var(--mono);
}

.md {
  font-size: 0.95rem;
  line-height: 1.65;
}

.md :deep(h1),
.md :deep(h2),
.md :deep(h3) {
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.md :deep(h1) {
  font-size: 1.35rem;
}

.md :deep(h2) {
  font-size: 1.15rem;
  margin-top: 1.4rem;
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
  overflow-x: auto;
  display: block;
}

.md :deep(th),
.md :deep(td) {
  border: 1px solid var(--line);
  padding: 0.4rem 0.55rem;
  text-align: left;
}

.md :deep(blockquote) {
  margin-left: 0;
  padding-left: 0.85rem;
  border-left: 3px solid var(--accent);
  color: var(--ink-muted);
}

.nav {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--line);
}

.nav button {
  border: 1px solid var(--line);
  background: #f7faf9;
  border-radius: 8px;
  padding: 0.45rem 0.8rem;
}

.nav button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (min-width: 720px) {
  .detail {
    padding: 1.35rem 1.4rem 1.5rem;
  }
}
</style>
