import type { PlanDay, PlanResourceSummary } from '@/modules/content/types'

export function hasLabContent(day: Pick<PlanDay, 'lab'> | null | undefined): boolean {
  const sections = day?.lab?.sections
  return Array.isArray(sections) && sections.length > 0
}

/** Plan resources that only exist to support Lab content (shared setup + per-day labs). */
export function isLabResourceId(id: string): boolean {
  return id === 'lab' || /^lab-day-\d+$/.test(id)
}

export function visiblePlanResources<T extends Pick<PlanResourceSummary, 'id'>>(
  resources: T[] | undefined,
  hasLab?: boolean,
): T[] {
  const items = resources ?? []
  if (hasLab) return items
  return items.filter((item) => !isLabResourceId(item.id))
}
