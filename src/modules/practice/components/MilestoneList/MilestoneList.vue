<script setup lang="ts">
import type {
  PracticeMilestone,
  PracticeStep,
  PracticeStepSummary,
} from '@/modules/content/types'
import { pickLocale } from '@/modules/content/utils/pick-locale.util'

const props = defineProps<{
  milestones: PracticeMilestone[]
  steps: Array<PracticeStep | PracticeStepSummary>
  isDone: (id: string) => boolean
  readOnly: boolean
  milestoneProgress: (id: string) => { total: number; done: number }
}>()

defineEmits<{
  open: [id: string]
  toggle: [id: string]
}>()

const { locale } = useI18n()
const lang = computed<'en' | 'vi'>(() =>
  locale.value === 'en' ? 'en' : 'vi',
)

const stepsByMilestone = computed(() => {
  const grouped = new Map<string, Array<PracticeStep | PracticeStepSummary>>()
  for (const step of props.steps) {
    const items = grouped.get(step.milestone) ?? []
    items.push(step)
    grouped.set(step.milestone, items)
  }
  return grouped
})

const visibleMilestones = computed(() =>
  props.milestones.filter(
    (milestone) => (stepsByMilestone.value.get(milestone.id) ?? []).length > 0,
  ),
)

function percent(id: string) {
  const stats = props.milestoneProgress(id)
  return Math.round((stats.done / Math.max(stats.total, 1)) * 100)
}
</script>

<template>
  <section class="space-y-4">
    <section
      v-for="milestone in visibleMilestones"
      :key="milestone.id"
      class="rounded-2xl border border-line bg-surface-elevated/80"
    >
      <header class="border-b border-line px-4 py-4 sm:px-5">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div class="min-w-0">
            <p class="text-xs font-semibold uppercase tracking-wider text-accent-ink">
              {{ milestone.id.toUpperCase() }}
            </p>
            <h3 class="mt-1 text-lg font-bold text-ink sm:text-xl">
              {{ pickLocale(milestone.title, lang) }}
            </h3>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-ink-muted">
              {{ pickLocale(milestone.goal, lang) }}
            </p>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-ink">
              {{ pickLocale(milestone.outcome, lang) }}
            </p>
          </div>

          <div class="min-w-[10rem] rounded-xl border border-line bg-surface-elevated px-3 py-2 text-sm">
            <p class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
              {{ $t('practice.progress') }}
            </p>
            <p class="mt-1 font-semibold text-ink">
              {{ props.milestoneProgress(milestone.id).done }}/{{
                props.milestoneProgress(milestone.id).total
              }}
            </p>
            <div
              class="mt-2 h-2 overflow-hidden rounded-full bg-line"
              role="progressbar"
              :aria-valuenow="percent(milestone.id)"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                class="h-full rounded-full bg-accent transition-all"
                :style="{ width: `${percent(milestone.id)}%` }"
              />
            </div>
          </div>
        </div>
      </header>

      <ul class="space-y-3 p-3 sm:p-4">
        <li
          v-for="step in stepsByMilestone.get(milestone.id) ?? []"
          :key="step.id"
          class="overflow-hidden rounded-2xl border border-line bg-surface-elevated transition"
          :class="props.isDone(step.id) ? 'border-done/40 bg-done-soft/40' : ''"
        >
          <div class="flex items-start gap-3 px-3 py-4 sm:px-4">
            <label class="mt-0.5 flex shrink-0 cursor-pointer items-center justify-center">
              <input
                type="checkbox"
                class="themed-checkbox"
                :checked="props.isDone(step.id)"
                :disabled="props.readOnly"
                :aria-label="`Mark ${step.id} done`"
                @click.stop
                @change="$emit('toggle', step.id)"
              />
            </label>

            <button
              type="button"
              class="min-w-0 flex-1 text-left"
              @click="$emit('open', step.id)"
            >
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-mono text-sm font-semibold text-accent-ink">
                  {{ step.id.toUpperCase() }}
                </span>
                <span class="text-xs text-ink-faint">
                  {{ step.estimateMin }} {{ $t('practice.minutes') }}
                </span>
              </div>
              <h4 class="mt-1 text-sm font-semibold text-ink sm:text-base">
                {{ pickLocale(step.title, lang) }}
              </h4>
              <p class="mt-1 text-sm text-ink-muted">
                {{ pickLocale(step.summary, lang) }}
              </p>
            </button>

            <button
              type="button"
              class="hidden min-h-10 shrink-0 rounded-lg border border-line bg-surface px-3 text-sm font-medium text-ink transition hover:border-accent hover:text-accent-ink sm:inline-flex sm:items-center"
              @click="$emit('open', step.id)"
            >
              {{ $t('practice.openStep') }}
            </button>
          </div>
        </li>
      </ul>
    </section>
  </section>
</template>
