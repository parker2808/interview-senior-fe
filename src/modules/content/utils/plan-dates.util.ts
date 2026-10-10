import type { PlanDay, PlanDaySummary, PlanIndex } from '@/modules/content/types'

/** Calendar `date` is a leftover from the old 03/10–01/11/2026 schedule. Do not display it. */
export function stripPlanDate<T extends { date?: string }>(value: T): Omit<T, 'date'> {
  const { date: _date, ...rest } = value
  return rest
}

export function stripPlanIndexDates(index: PlanIndex): PlanIndex {
  return {
    ...index,
    days: (index.days || []).map((day) => stripPlanDate(day) as PlanDaySummary),
  }
}

export function stripPlanDayDates(day: PlanDay): PlanDay {
  return stripPlanDate(day) as PlanDay
}
