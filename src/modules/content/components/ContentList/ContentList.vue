<script setup lang="ts">
import type { ListBlock, Localized } from '@/modules/content/types'
import {
  expandListItemSource,
  looksLikeBlockMarkdown,
  normalizeListItem,
  type NestedListItem,
} from '@/modules/content/utils/list-block.util'
import { pickLocale } from '@/modules/content/utils/pick-locale.util'
import {
  renderInline,
  renderMarkdown,
} from '@/modules/content/utils/inline-md.util'

const props = defineProps<{
  block: ListBlock
  lang: string
}>()

function itemHtml(item: Localized) {
  const raw = expandListItemSource(pickLocale(item, props.lang))
  if (looksLikeBlockMarkdown(raw)) return renderMarkdown(raw)
  return renderInline(raw)
}

function itemsOf(block: ListBlock) {
  return (block.items || []).map((item) =>
    normalizeListItem(item as Localized | NestedListItem),
  )
}
</script>

<template>
  <ol v-if="block.style === 'ol'">
    <li v-for="(item, i) in itemsOf(block)" :key="i">
      <div class="content-list__item" v-html="itemHtml(item.text)" />
      <ContentList
        v-if="item.children"
        :block="item.children"
        :lang="lang"
      />
    </li>
  </ol>
  <ul v-else>
    <li v-for="(item, i) in itemsOf(block)" :key="i">
      <div class="content-list__item" v-html="itemHtml(item.text)" />
      <ContentList
        v-if="item.children"
        :block="item.children"
        :lang="lang"
      />
    </li>
  </ul>
</template>
