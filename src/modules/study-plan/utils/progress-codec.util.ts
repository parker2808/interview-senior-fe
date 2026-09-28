const DAY_COUNT = 30

export function doneMapToBitmask(doneMap: Record<string | number, boolean>) {
  let mask = 0
  for (let day = 1; day <= DAY_COUNT; day++) {
    if (doneMap[day]) mask |= 1 << (day - 1)
  }
  return mask >>> 0
}

export function bitmaskToDoneMap(mask: number) {
  const out: Record<number, boolean> = {}
  const m = mask >>> 0
  for (let day = 1; day <= DAY_COUNT; day++) {
    if (m & (1 << (day - 1))) out[day] = true
  }
  return out
}

export function encodeShareToken(mask: number) {
  return (mask >>> 0).toString(36)
}

export function decodeShareToken(token: string) {
  if (!token || !/^[0-9a-z]+$/i.test(token)) return null
  const mask = parseInt(token, 36)
  if (!Number.isFinite(mask) || mask < 0) return null
  return mask >>> 0
}

export function toExportJson(
  doneMap: Record<string | number, boolean>,
  note = '',
) {
  const completed: number[] = []
  for (let day = 1; day <= DAY_COUNT; day++) {
    if (doneMap[day]) completed.push(day)
  }
  const payload: Record<string, unknown> = {
    version: 1,
    updatedAt: new Date().toISOString().slice(0, 10),
    completed,
  }
  if (note) payload.note = note
  return payload
}

export function fromProgressJson(data: unknown) {
  if (!data || typeof data !== 'object') return null
  const completed = (data as { completed?: unknown }).completed
  if (!Array.isArray(completed)) return null
  const out: Record<number, boolean> = {}
  for (const n of completed) {
    const day = Number(n)
    if (Number.isInteger(day) && day >= 1 && day <= DAY_COUNT) {
      out[day] = true
    }
  }
  return out
}

export { DAY_COUNT }
