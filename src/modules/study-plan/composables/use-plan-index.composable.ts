import type { PlanDay, PlanIndex, PlanResource } from '@/modules/content/types'

export function usePlanIndex() {
  return useAsyncData(
    'plan-index',
    () => $fetch<PlanIndex>('/api/plan/days'),
    {
      default: () => ({
        weeks: [],
        gaps: [],
        resources: [],
        days: [],
      }),
    },
  )
}

export function usePlanDay(dayNumber: Ref<number> | ComputedRef<number>) {
  return useAsyncData(
    () => `plan-day-${dayNumber.value}`,
    () => $fetch<PlanDay>(`/api/plan/days/${dayNumber.value}`),
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
