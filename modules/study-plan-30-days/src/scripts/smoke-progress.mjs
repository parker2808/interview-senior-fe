/**
 * Local smoke checks for progress codec + API payload shape.
 * Run: npm run smoke
 * (Blobs write still needs a Netlify deploy + PROGRESS_WRITE_TOKEN.)
 */
import assert from 'node:assert/strict'
import {
  bitmaskToDoneMap,
  decodeShareToken,
  doneMapToBitmask,
  encodeShareToken,
  fromProgressJson,
  toExportJson,
} from '../src/utils/progressCodec.js'

function normalizeLikeFunction(raw) {
  if (!raw || typeof raw !== 'object') return null
  const completed = Array.isArray(raw.completed) ? raw.completed : null
  if (!completed) return null
  const days = []
  const seen = new Set()
  for (const n of completed) {
    const day = Number(n)
    if (!Number.isInteger(day) || day < 1 || day > 30) continue
    if (seen.has(day)) continue
    seen.add(day)
    days.push(day)
  }
  days.sort((a, b) => a - b)
  return {
    version: 1,
    updatedAt: raw.updatedAt || '2026-10-03',
    owner: raw.owner || 'Parker',
    completed: days,
    ...(raw.note ? { note: raw.note } : {}),
  }
}

const map = { 1: true, 3: true, 30: true }
const mask = doneMapToBitmask(map)
assert.equal(encodeShareToken(mask), mask.toString(36))
assert.deepEqual(bitmaskToDoneMap(decodeShareToken(encodeShareToken(mask))), map)

const exported = toExportJson(map, 'hi')
assert.deepEqual(exported.completed, [1, 3, 30])
assert.equal(exported.note, 'hi')
assert.deepEqual(fromProgressJson(exported), map)

const normalized = normalizeLikeFunction({
  completed: [3, 1, 1, 99, '30', 0],
  owner: 'Parker',
  note: 'ok',
})
assert.deepEqual(normalized.completed, [1, 3, 30])
assert.equal(normalized.owner, 'Parker')
assert.equal(normalizeLikeFunction({ foo: 1 }), null)

console.log('smoke-progress: ok')
