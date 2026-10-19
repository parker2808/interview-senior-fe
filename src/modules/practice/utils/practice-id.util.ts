export const PRACTICE_STEP_ID_RE = /^p\d{2}$/
export const PRACTICE_STEP_COUNT = 33

export function isPracticeStepId(id: string): boolean {
  return PRACTICE_STEP_ID_RE.test(id)
}

export function practiceStepIdFromOrder(order: number): string {
  return `p${String(order).padStart(2, '0')}`
}

export function practiceStepOrder(id: string): number | null {
  if (!isPracticeStepId(id)) return null
  const n = Number(id.slice(1))
  return Number.isInteger(n) ? n : null
}
