<script setup lang="ts">
import type { PlanDaySummary, PlanWeek } from '@/modules/content/types'
import { pickLocale } from '@/modules/content/utils/pick-locale.util'

const props = defineProps<{
  days: PlanDaySummary[]
  weeks: PlanWeek[]
  activeDay: number
  isDone: (day: number) => boolean
}>()

defineEmits<{
  select: [day: number]
}>()

const { locale } = useI18n()
const lang = computed<'en' | 'vi'>(() => (locale.value === 'en' ? 'en' : 'vi'))

const daysByWeek = computed(() => {
  const grouped = new Map<number, PlanDaySummary[]>()
  for (const day of props.days) {
    const items = grouped.get(day.week) ?? []
    items.push(day)
    grouped.set(day.week, items)
  }
  return grouped
})
</script>

<template>
  <nav class="flex h-full flex-col gap-5 overflow-y-auto p-4" :aria-label="$t('plan.backDayList')">
    <div v-for="week in weeks" :key="week.week" class="space-y-2">
      <p class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
        {{ pickLocale(week.title, lang) }}
      </p>
      <ul class="space-y-1">
        <li v-for="day in daysByWeek.get(week.week) ?? []" :key="day.day">
          <button
            type="button"
            class="flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border-l-2 px-2.5 text-left text-sm transition"
            :class="
              day.day === activeDay
                ? 'border-accent bg-accent-soft font-semibold text-accent-ink'
                : 'border-transparent text-ink-muted hover:bg-white hover:text-ink'
            "
            @click="$emit('select', day.day)"
          >
            <span class="min-w-0 truncate">
              Day {{ String(day.day).padStart(2, '0') }}
              ·
              {{ pickLocale(day.title, lang) }}
            </span>
            <span
              v-if="isDone(day.day)"
              class="shrink-0 text-[11px] font-semibold text-done"
            >
              {{ $t('plan.done') }}
            </span>
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>
