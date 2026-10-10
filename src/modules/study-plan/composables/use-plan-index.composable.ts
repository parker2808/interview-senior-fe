import type { PlanDay, PlanIndex, PlanResource } from '@/modules/content/types'
import {
  stripPlanDayDates,
  stripPlanIndexDates,
} from '@/modules/content/utils/plan-dates.util'

export function usePlanIndex() {
  return useAsyncData(
    'plan-index',
    async () => stripPlanIndexDates(await $fetch<PlanIndex>('/api/plan/days')),
  )
}

export function usePlanDay(dayNumber: Ref<number> | ComputedRef<number>) {
  return useAsyncData(
    () => `plan-day-${dayNumber.value}`,
    async () =>
      stripPlanDayDates(
        await $fetch<PlanDay>(`/api/plan/days/${dayNumber.value}`),
      ),
    { watch: [dayNumber] },
  )
}

export function usePlanResource(id: Ref<string> | ComputedRef<string>) {
  return useAsyncData(
    () => `plan-resource-${id.value}`,
    () =>
      $fetch<PlanResource>(
        `/api/plan/resources/${encodeURIComponent(id.value)}`,
      ),
    { watch: [id] },
  )
}

export function planResourceHref(idOrPath: string) {
  return `/plan/doc/${encodeURIComponent(idOrPath)}`
}
