/**
 * Local smoke checks for progress codec, edit-auth helpers, and API payload shape.
 * Run: npm run smoke
 * Uses a fake EDIT_PASSCODE (never the real owner code).
 * (Blobs write still needs a Netlify deploy + env secrets.)
 */
import assert from 'node:assert/strict'

// Fake secrets for local unit checks only — placeholders, not production values.
process.env.EDIT_PASSCODE = '111111'
process.env.PROGRESS_WRITE_TOKEN = 'smoke-write-token-not-real'
delete process.env.EDIT_TOKEN_SECRET

import {
  bitmaskToDoneMap,
  decodeShareToken,
  doneMapToBitmask,
  encodeShareToken,
  fromProgressJson,
  toExportJson,
} from '../src/utils/progressCodec.js'
import {
  isSixDigitPasscode,
  issueEditToken,
  safeEqualString,
  verifyEditToken,
  verifyPasscode,
} from '../netlify/lib/editAuth.js'

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

assert.equal(isSixDigitPasscode('111111'), true)
assert.equal(isSixDigitPasscode('11111'), false)
assert.equal(isSixDigitPasscode('1111111'), false)
assert.equal(isSixDigitPasscode('abcdef'), false)
assert.equal(safeEqualString('abc', 'abc'), true)
assert.equal(safeEqualString('abc', 'abd'), false)

assert.equal(verifyPasscode('111111').ok, true)
assert.equal(verifyPasscode('222222').ok, false)
assert.equal(verifyPasscode('12345').status, 401)

const issued = issueEditToken()
assert.ok(issued.token.includes('.'))
assert.equal(verifyEditToken(issued.token), true)
assert.equal(verifyEditToken('nope.bad'), false)
assert.equal(verifyEditToken(issued.token, Date.now() + 13 * 60 * 60 * 1000), false)

console.log('smoke-progress: ok')
