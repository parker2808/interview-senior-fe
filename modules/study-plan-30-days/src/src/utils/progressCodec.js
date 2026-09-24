/**
 * Progress encoding helpers — compact bitmask for share URLs.
 * Days 1–30 → bits 0–29 in a 30-bit integer, encoded as base36.
 */

const DAY_COUNT = 30

/** @param {Record<string|number, boolean>} doneMap */
export function doneMapToBitmask(doneMap) {
  let mask = 0
  for (let day = 1; day <= DAY_COUNT; day++) {
    if (doneMap[day]) mask |= 1 << (day - 1)
  }
  return mask >>> 0
}

/** @param {number} mask */
export function bitmaskToDoneMap(mask) {
  const out = {}
  const m = mask >>> 0
  for (let day = 1; day <= DAY_COUNT; day++) {
    if (m & (1 << (day - 1))) out[day] = true
  }
  return out
}

/** @param {number} mask */
export function encodeShareToken(mask) {
  return (mask >>> 0).toString(36)
}

/** @param {string} token */
export function decodeShareToken(token) {
  if (!token || !/^[0-9a-z]+$/i.test(token)) return null
  const mask = parseInt(token, 36)
  if (!Number.isFinite(mask) || mask < 0) return null
  return mask >>> 0
}

/**
 * @param {Record<string|number, boolean>} doneMap
 * @returns {{ version: number, updatedAt: string, completed: number[], note?: string }}
 */
export function toExportJson(doneMap, note = '') {
  const completed = []
  for (let day = 1; day <= DAY_COUNT; day++) {
    if (doneMap[day]) completed.push(day)
  }
  const payload = {
    version: 1,
    updatedAt: new Date().toISOString().slice(0, 10),
    completed,
  }
  if (note) payload.note = note
  return payload
}

/**
 * @param {unknown} data
 * @returns {Record<number, boolean>|null}
 */
export function fromProgressJson(data) {
  if (!data || typeof data !== 'object') return null
  const completed = data.completed
  if (!Array.isArray(completed)) return null
  const out = {}
  for (const n of completed) {
    const day = Number(n)
    if (Number.isInteger(day) && day >= 1 && day <= DAY_COUNT) {
      out[day] = true
    }
  }
  return out
}

export { DAY_COUNT }
