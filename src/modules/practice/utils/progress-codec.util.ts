import {
  isPracticeStepId,
  PRACTICE_STEP_COUNT,
  practiceStepIdFromOrder,
} from '@/modules/practice/utils/practice-id.util'

/** Two unsigned 32-bit words — 33 steps do not fit in one JS bit-shift word. */
export type PracticeBitmask = { lo: number; hi: number }

export function doneMapToBitmask(
  doneMap: Record<string, boolean>,
): PracticeBitmask {
  let lo = 0
  let hi = 0
  for (let order = 1; order <= PRACTICE_STEP_COUNT; order++) {
    const id = practiceStepIdFromOrder(order)
    if (!doneMap[id]) continue
    if (order <= 32) lo |= 1 << (order - 1)
    else hi |= 1 << (order - 33)
  }
  return { lo: lo >>> 0, hi: hi >>> 0 }
}

export function bitmaskToDoneMap(mask: PracticeBitmask): Record<string, boolean> {
  const out: Record<string, boolean> = {}
  const lo = mask.lo >>> 0
  const hi = mask.hi >>> 0
  for (let order = 1; order <= PRACTICE_STEP_COUNT; order++) {
    const bit =
      order <= 32 ? lo & (1 << (order - 1)) : hi & (1 << (order - 33))
    if (bit) out[practiceStepIdFromOrder(order)] = true
  }
  return out
}

export function encodeShareToken(mask: PracticeBitmask): string {
  const lo = (mask.lo >>> 0).toString(36)
  const hi = mask.hi >>> 0
  return hi ? `${lo}.${hi.toString(36)}` : lo
}

export function decodeShareToken(token: string): PracticeBitmask | null {
  if (!token || !/^[0-9a-z]+(\.[0-9a-z]+)?$/i.test(token)) return null
  const [loRaw, hiRaw] = token.toLowerCase().split('.')
  const lo = parseInt(loRaw, 36)
  const hi = hiRaw ? parseInt(hiRaw, 36) : 0
  if (!Number.isFinite(lo) || lo < 0 || !Number.isFinite(hi) || hi < 0) return null
  return { lo: lo >>> 0, hi: hi >>> 0 }
}

export function toExportJson(
  doneMap: Record<string, boolean>,
  note = '',
) {
  const completed = Object.keys(doneMap)
    .filter((id) => doneMap[id] && isPracticeStepId(id))
    .sort()
  const payload: Record<string, unknown> = {
    version: 1,
    updatedAt: new Date().toISOString().slice(0, 10),
    completed,
  }
  if (note) payload.note = note
  return payload
}

export function fromProgressJson(data: unknown): Record<string, boolean> | null {
  if (!data || typeof data !== 'object') return null
  const completed = (data as { completed?: unknown }).completed
  if (!Array.isArray(completed)) return null
  const out: Record<string, boolean> = {}
  for (const item of completed) {
    if (typeof item === 'string' && isPracticeStepId(item)) {
      out[item] = true
      continue
    }
    const n = Number(item)
    if (Number.isInteger(n) && n >= 1 && n <= PRACTICE_STEP_COUNT) {
      out[practiceStepIdFromOrder(n)] = true
    }
  }
  return out
}

export { PRACTICE_STEP_COUNT }
