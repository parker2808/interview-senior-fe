<script setup lang="ts">
import type { TocItem } from '@/modules/content/types'
import { specRefHref } from '@/modules/practice/utils/spec-ref.util'

const props = withDefaults(
  defineProps<{
    refs: string[]
    headings?: Array<Pick<TocItem, 'id' | 'text'>>
  }>(),
  { headings: () => [] },
)

function hrefFor(ref: string) {
  return specRefHref(ref, props.headings)
}
</script>

<template>
  <div v-if="refs.length" class="flex flex-wrap gap-1.5">
    <NuxtLink
      v-for="ref in refs"
      :key="ref"
      :to="hrefFor(ref)"
      class="inline-flex min-h-8 items-center rounded-full border border-line bg-surface px-2.5 text-xs font-semibold text-accent-ink transition hover:border-accent"
    >
      {{ ref }}
    </NuxtLink>
  </div>
</template>
