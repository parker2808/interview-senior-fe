<script setup lang="ts">
import type { TocItem } from '@/modules/knowledge-base/types/entities/doc.type'

const props = defineProps<{
  items: TocItem[]
  activeId: string
}>()

defineEmits<{
  navigate: [id: string]
}>()
</script>

<template>
  <nav class="space-y-2 p-4" aria-label="On this page">
    <p class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
      {{ $t('docs.onThisPage') }}
    </p>
    <p v-if="!items.length" class="text-sm text-ink-faint">
      {{ $t('docs.noToc') }}
    </p>
    <ul class="space-y-1">
      <li v-for="item in items" :key="item.id">
        <button
          type="button"
          class="block min-h-9 w-full rounded-md px-2 text-left text-sm transition"
          :class="[
            item.level === 3 ? 'pl-4 text-ink-muted' : 'font-medium text-ink',
            activeId === item.id
              ? 'bg-accent-soft text-accent-ink'
              : 'hover:bg-white',
          ]"
          @click="$emit('navigate', item.id)"
        >
          {{ item.text }}
        </button>
      </li>
    </ul>
  </nav>
</template>
