<script setup lang="ts">
import type { TocNode } from '@/modules/knowledge-base/utils/toc-tree.util'

defineOptions({ name: 'DocTocNode' })

const props = defineProps<{
  node: TocNode
  depth: number
  activeId: string
  expanded: Record<string, boolean>
}>()

const emit = defineEmits<{
  navigate: [id: string]
  toggle: [id: string]
}>()

const { t } = useI18n()

const hasChildren = computed(() => props.node.children.length > 0)
const isOpen = computed(() => Boolean(props.expanded[props.node.id]))
const isActive = computed(() => props.activeId === props.node.id)

function onToggleKey(event: KeyboardEvent) {
  if (!hasChildren.value) return
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    if (!isOpen.value) emit('toggle', props.node.id)
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    if (isOpen.value) emit('toggle', props.node.id)
  }
}
</script>

<template>
  <li>
    <div
      class="flex items-start gap-0.5"
      :style="{ paddingLeft: `${depth * 0.7}rem` }"
    >
      <button
        v-if="hasChildren"
        type="button"
        class="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-muted transition hover:bg-white hover:text-ink"
        :aria-expanded="isOpen"
        :aria-label="
          isOpen ? t('docs.collapseSection') : t('docs.expandSection')
        "
        @click.stop="emit('toggle', node.id)"
        @keydown="onToggleKey"
      >
        <svg
          class="h-3.5 w-3.5 transition-transform"
          :class="isOpen ? 'rotate-90' : ''"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M9 6l7 6-7 6" />
        </svg>
      </button>
      <span v-else class="inline-flex h-8 w-8 shrink-0" aria-hidden="true" />
      <button
        type="button"
        class="min-h-8 min-w-0 flex-1 rounded-md px-1.5 py-1 text-left text-sm leading-snug transition"
        :class="[
          depth === 0 ? 'font-medium text-ink' : 'text-ink-muted',
          isActive
            ? 'bg-accent-soft font-medium text-accent-ink'
            : 'hover:bg-white hover:text-ink',
        ]"
        :aria-current="isActive ? 'true' : undefined"
        @click="emit('navigate', node.id)"
      >
        {{ node.text }}
      </button>
    </div>
    <ul v-if="hasChildren && isOpen" class="mt-0.5 space-y-0.5">
      <DocTocNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
        :active-id="activeId"
        :expanded="expanded"
        @navigate="emit('navigate', $event)"
        @toggle="emit('toggle', $event)"
      />
    </ul>
  </li>
</template>
