<script setup lang="ts">
import type {
  PracticeMilestone,
  PracticeStepSummary,
} from '@/modules/content/types'
import { pickLocale } from '@/modules/content/utils/pick-locale.util'

const props = defineProps<{
  milestones: PracticeMilestone[]
  steps: PracticeStepSummary[]
  activeId: string
  isDone: (id: string) => boolean
}>()

defineEmits<{
  select: [id: string]
}>()

const { locale } = useI18n()
const lang = computed<'en' | 'vi'>(() => (locale.value === 'en' ? 'en' : 'vi'))

const stepsByMilestone = computed(() => {
  const grouped = new Map<string, PracticeStepSummary[]>()
  for (const step of props.steps) {
    const items = grouped.get(step.milestone) ?? []
    items.push(step)
    grouped.set(step.milestone, items)
  }
  return grouped
})
</script>

<template>
  <nav class="flex min-w-0 flex-col gap-5 p-4" :aria-label="$t('practice.backList')">
    <div
      v-for="milestone in milestones"
      :key="milestone.id"
      class="space-y-2"
    >
      <p class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
        {{ milestone.id.toUpperCase() }} · {{ pickLocale(milestone.title, lang) }}
      </p>
      <ul class="space-y-1">
        <li
          v-for="step in stepsByMilestone.get(milestone.id) ?? []"
          :key="step.id"
        >
          <button
            type="button"
            class="flex min-h-10 min-w-0 w-full items-center justify-between gap-2 rounded-lg border-l-2 px-2.5 text-left text-sm transition"
            :class="
              step.id === activeId
                ? 'border-accent bg-accent-soft font-semibold text-accent-ink'
                : 'border-transparent text-ink-muted hover:bg-white hover:text-ink'
            "
            @click="$emit('select', step.id)"
          >
            <span class="min-w-0 truncate">
              {{ step.id.toUpperCase() }} · {{ pickLocale(step.title, lang) }}
            </span>
            <span
              v-if="isDone(step.id)"
              class="shrink-0 text-[11px] font-semibold text-done"
            >
              {{ $t('practice.done') }}
            </span>
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>
