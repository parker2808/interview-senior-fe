<script setup lang="ts">
import type { ContentSection } from '@/modules/content/types'
import ContentList from '@/modules/content/components/ContentList/ContentList.vue'
import { prepareReadableSections } from '@/modules/content/utils/in-content-toc.util'
import { looksLikeBlockMarkdown } from '@/modules/content/utils/list-block.util'
import { pickLocale } from '@/modules/content/utils/pick-locale.util'
import {
  renderInline,
  renderMarkdown,
} from '@/modules/content/utils/inline-md.util'

const props = defineProps<{
  sections: ContentSection[]
  lang: string
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const prepared = computed(() => prepareReadableSections(props.sections, props.lang))

function text(value: { en: string; vi: string } | undefined) {
  return pickLocale(value, props.lang)
}

function html(value: { en: string; vi: string } | undefined) {
  const raw = text(value)
  if (looksLikeBlockMarkdown(raw)) return renderMarkdown(raw)
  return renderInline(raw)
}

function md(value: { en: string; vi: string } | undefined) {
  return renderMarkdown(text(value))
}

function headingTag(level: number) {
  return `h${Math.min(6, Math.max(1, level))}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}
</script>

<template>
  <div class="prose-doc" @click="emit('click', $event)">
    <span
      v-for="id in prepared.hiddenIds"
      :id="id"
      :key="`toc-anchor-${id}`"
      class="sr-only"
    />
    <template
      v-for="(section, sIndex) in prepared.sections"
      :key="`${text(section.id)}-${sIndex}`"
    >
      <template v-for="(block, bIndex) in section.blocks" :key="`${block.type}-${bIndex}`">
        <component
          :is="headingTag(block.level)"
          v-if="block.type === 'heading'"
          :id="text(block.id)"
          v-html="html(block.text)"
        />

        <p v-else-if="block.type === 'paragraph'" v-html="html(block.text)" />

        <ContentList
          v-else-if="block.type === 'list'"
          :block="block"
          :lang="lang"
        />

        <blockquote
          v-else-if="block.type === 'callout'"
          :class="`content-callout content-callout--${block.kind}`"
          v-html="md(block.text)"
        />

        <pre v-else-if="block.type === 'code'"><code :class="block.lang ? `language-${block.lang}` : ''">{{ text(block.code) }}</code></pre>

        <table v-else-if="block.type === 'table'">
          <thead v-if="block.headers.some((cell) => text(cell))">
            <tr>
              <th
                v-for="(cell, i) in block.headers"
                :key="i"
                :style="block.align?.[i] ? { textAlign: block.align[i] || undefined } : undefined"
                v-html="html(cell)"
              />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, r) in block.rows" :key="r">
              <td
                v-for="(cell, c) in row"
                :key="c"
                :style="block.align?.[c] ? { textAlign: block.align[c] || undefined } : undefined"
                v-html="html(cell)"
              />
            </tr>
          </tbody>
        </table>

        <section
          v-else-if="block.type === 'senior-answer'"
          class="content-senior"
        >
          <p class="content-senior__label">{{ text(block.label) }}</p>
          <div v-html="md(block.text)" />
        </section>

        <section
          v-else-if="block.type === 'key-takeaways'"
          class="content-takeaways"
        >
          <p class="content-senior__label">{{ $t('content.keyTakeaways') }}</p>
          <ul>
            <li
              v-for="(item, i) in block.items"
              :key="i"
            >
              <div class="content-list__item" v-html="html(item)" />
            </li>
          </ul>
        </section>

        <div v-else-if="block.type === 'markdown'" v-html="md(block.text)" />

        <hr v-else-if="block.type === 'thematic-break'" />
      </template>
    </template>
  </div>
</template>

<style scoped>
.content-senior,
.content-takeaways {
  margin-bottom: 1rem;
}

.content-senior__label {
  margin-bottom: 0.35rem;
  font-size: 0.75rem;
  font-weight: 650;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--accent-ink);
}

.content-callout {
  margin-bottom: 1rem;
}
</style>
