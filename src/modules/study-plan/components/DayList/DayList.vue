<script setup lang="ts">
import type { PlanDaySummary, PlanWeek } from '@/modules/content/types'
import PlanDayContent from '@/modules/study-plan/components/PlanDayContent/PlanDayContent.vue'
import { pickLocale } from '@/modules/content/utils/pick-locale.util'

const props = defineProps<{
  days: PlanDaySummary[]
  weeks: PlanWeek[]
  weekFilter: number
  isDone: (day: number) => boolean
  readOnly: boolean
  weekProgress: (week: number) => { total: number; done: number }
}>()

defineEmits<{
  'update:weekFilter': [value: number]
  open: [day: number]
  toggle: [day: number]
}>()

const { locale } = useI18n()
const openDays = ref<Set<number>>(new Set([1]))

const lang = computed<'en' | 'vi'>(() =>
  locale.value === 'en' ? 'en' : 'vi',
)

const visibleWeeks = computed(() =>
  props.weeks.filter((week) =>
    props.weekFilter === 0 ? true : week.week === props.weekFilter,
  ),
)

const daysByWeek = computed(() => {
  const grouped = new Map<number, PlanDaySummary[]>()
  for (const day of props.days) {
    const items = grouped.get(day.week) ?? []
    items.push(day)
    grouped.set(day.week, items)
  }
  return grouped
})

function toggleOpen(day: number) {
  const next = new Set(openDays.value)
  if (next.has(day)) next.delete(day)
  else next.add(day)
  openDays.value = next
}
</script>

<template>
  <section>
    <div
      class="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
    >
      <label class="flex flex-col gap-1 text-sm font-medium text-ink-muted sm:flex-row sm:items-center sm:gap-2">
        {{ $t('plan.filter') }}
        <select
          class="min-h-11 rounded-lg border border-line bg-surface-elevated px-3 text-ink"
          :value="props.weekFilter"
          @change="
            $emit('update:weekFilter', Number(($event.target as HTMLSelectElement).value))
          "
        >
          <option :value="0">{{ $t('plan.allWeeks') }}</option>
          <option
            v-for="week in weeks"
            :key="week.week"
            :value="week.week"
          >
            {{ pickLocale(week.title, lang) }}
          </option>
        </select>
      </label>
    </div>

    <div class="space-y-4">
      <section
        v-for="week in visibleWeeks"
        :key="week.week"
        class="rounded-2xl border border-line bg-surface-elevated/80"
      >
        <header class="border-b border-line px-4 py-4 sm:px-5">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div class="min-w-0">
              <p class="text-xs font-semibold uppercase tracking-wider text-accent-ink">
                {{ pickLocale(week.range, lang) }}
              </p>
              <h3 class="mt-1 text-lg font-bold text-ink sm:text-xl">
                {{ pickLocale(week.title, lang) }}
              </h3>
              <p class="mt-2 max-w-3xl text-sm leading-6 text-ink-muted">
                {{ pickLocale(week.goal, lang) }}
              </p>
              <ul class="mt-3 space-y-1 text-sm text-ink">
                <li
                  v-for="(outcome, index) in week.outcomes"
                  :key="index"
                  class="flex items-start gap-2"
                >
                  <span class="mt-1 text-accent-ink">•</span>
                  <span>{{ pickLocale(outcome, lang) }}</span>
                </li>
              </ul>
            </div>

            <div class="rounded-xl border border-line bg-surface-elevated px-3 py-2 text-sm">
              <p class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                {{ $t('plan.progress') }}
              </p>
              <p class="mt-1 font-semibold text-ink">
                {{ props.weekProgress(week.week).done }}/{{ props.weekProgress(week.week).total }}
              </p>
            </div>
          </div>
        </header>

        <ul class="space-y-3 p-3 sm:p-4">
          <li
            v-for="d in daysByWeek.get(week.week) ?? []"
            :key="d.day"
            class="overflow-hidden rounded-2xl border border-line bg-surface-elevated transition"
            :class="props.isDone(d.day) ? 'border-done/40 bg-done-soft/40' : ''"
          >
            <div class="flex items-start gap-3 px-3 py-4 sm:px-4">
              <label class="mt-0.5 flex shrink-0 cursor-pointer items-center justify-center">
                <input
                  type="checkbox"
                  class="themed-checkbox"
                  :checked="props.isDone(d.day)"
                  :disabled="props.readOnly"
                  :aria-label="`Mark day ${d.day} done`"
                  @click.stop
                  @change="$emit('toggle', d.day)"
                />
              </label>

              <button
                type="button"
                class="min-w-0 flex-1 text-left"
                @click="toggleOpen(d.day)"
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="font-mono text-sm font-semibold text-accent-ink">
                        Day {{ String(d.day).padStart(2, '0') }}
                      </span>
                      <span class="text-xs text-ink-faint">{{ d.date }}</span>
                    </div>
                    <h4 class="mt-1 text-sm font-semibold text-ink sm:text-base">
                      {{ pickLocale(d.title, lang) }}
                    </h4>
                    <p class="mt-1 text-sm text-ink-muted">
                      {{ pickLocale(d.goal, lang) }}
                    </p>
                  </div>
                  <span class="shrink-0 text-xs font-semibold text-ink-faint">
                    {{ openDays.has(d.day) ? $t('plan.collapse') : $t('plan.expand') }}
                  </span>
                </div>
              </button>

              <button
                type="button"
                class="hidden min-h-10 shrink-0 rounded-lg border border-line bg-surface px-3 text-sm font-medium text-ink transition hover:border-accent hover:text-accent-ink sm:inline-flex sm:items-center"
                @click="$emit('open', d.day)"
              >
                {{ $t('plan.openDay') }}
              </button>
            </div>

            <div
              v-if="openDays.has(d.day)"
              class="border-t border-line px-3 py-4 sm:px-4"
            >
              <PlanDayContent :content="d" />
              <button
                type="button"
                class="mt-4 min-h-10 rounded-lg border border-line bg-surface px-3 text-sm font-medium text-ink transition hover:border-accent hover:text-accent-ink sm:hidden"
                @click="$emit('open', d.day)"
              >
                {{ $t('plan.openDay') }}
              </button>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>
