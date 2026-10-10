<script setup lang="ts">
import type { TocItem } from '@/modules/knowledge-base/types/entities/doc.type'
import DocTocNode from '@/modules/knowledge-base/components/DocToc/DocTocNode.vue'
import {
  nestTocItems,
  tocAncestorIds,
  tocParentIds,
} from '@/modules/knowledge-base/utils/toc-tree.util'

const props = defineProps<{
  items: TocItem[]
  activeId: string
}>()

const emit = defineEmits<{
  navigate: [id: string]
}>()

const tree = computed(() => nestTocItems(props.items))
const expanded = ref<Record<string, boolean>>({})

function applyIds(ids: string[], open: boolean, replace = false) {
  const next = replace ? {} : { ...expanded.value }
  for (const id of ids) next[id] = open
  expanded.value = next
}

function revealActive(replace = false) {
  const path = tocAncestorIds(tree.value, props.activeId)
  if (!path.length && !replace) return
  applyIds(path, true, replace)
}

function toggle(id: string) {
  expanded.value = {
    ...expanded.value,
    [id]: !expanded.value[id],
  }
}

function expandAll() {
  applyIds(tocParentIds(tree.value), true)
}

function collapseAll() {
  const path = tocAncestorIds(tree.value, props.activeId)
  const next: Record<string, boolean> = {}
  for (const id of path) next[id] = true
  expanded.value = next
}

watch(
  () => props.items.map((item) => `${item.id}:${item.level}`).join('|'),
  () => {
    const valid = new Set(props.items.map((item) => item.id))
    const kept: Record<string, boolean> = {}
    for (const [id, open] of Object.entries(expanded.value)) {
      if (valid.has(id) && open) kept[id] = true
    }
    expanded.value = kept
    revealActive()
  },
)

watch(
  () => props.activeId,
  () => {
    revealActive(false)
  },
)

onMounted(() => revealActive())
</script>

<template>
  <nav class="space-y-2 p-4" aria-label="On this page">
    <div class="flex items-start justify-between gap-2">
      <p class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
        {{ $t('docs.onThisPage') }}
      </p>
      <div v-if="items.length" class="flex shrink-0 gap-2">
        <button
          type="button"
          class="text-[11px] font-medium text-ink-muted underline-offset-2 hover:text-ink hover:underline"
          @click="expandAll"
        >
          {{ $t('docs.expandAll') }}
        </button>
        <button
          type="button"
          class="text-[11px] font-medium text-ink-muted underline-offset-2 hover:text-ink hover:underline"
          @click="collapseAll"
        >
          {{ $t('docs.collapseAll') }}
        </button>
      </div>
    </div>
    <p v-if="!items.length" class="text-sm text-ink-faint">
      {{ $t('docs.noToc') }}
    </p>
    <ul v-else class="space-y-0.5">
      <DocTocNode
        v-for="node in tree"
        :key="node.id"
        :node="node"
        :depth="0"
        :active-id="activeId"
        :expanded="expanded"
        @navigate="emit('navigate', $event)"
        @toggle="toggle"
      />
    </ul>
  </nav>
</template>
