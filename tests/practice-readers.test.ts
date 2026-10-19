import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import {
  isPracticeStepId,
  PRACTICE_STEP_ID_RE,
} from '@/modules/practice/utils/practice-id.util'
import {
  bitmaskToDoneMap,
  decodeShareToken,
  doneMapToBitmask,
  encodeShareToken,
  fromProgressJson,
} from '@/modules/practice/utils/progress-codec.util'
import {
  loadPracticeIndexFromDir,
  loadPracticeStepFromDir,
  loadPracticeStepsFromDir,
  practiceDirExists,
} from '@/modules/practice/utils/practice-read.util'
import { writeContentFixture } from './fixtures/plan-content-tree.mjs'
import {
  fixturePracticeStepP06,
  writePracticeFixture,
} from './fixtures/practice-content-tree.mjs'

const repoRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const temps: string[] = []

function tempDir(prefix: string) {
  const dir = mkdtempSync(path.join(tmpdir(), prefix))
  temps.push(dir)
  return dir
}

afterEach(() => {
  while (temps.length) {
    const dir = temps.pop()
    if (dir) rmSync(dir, { recursive: true, force: true })
  }
})

function validate(dir: string) {
  return spawnSync(process.execPath, ['scripts/validate-content.mjs'], {
    cwd: repoRoot,
    env: { ...process.env, CONTENT_DIR: dir },
    encoding: 'utf8',
  })
}

describe('practice readers', () => {
  it('only accepts ids matching ^p\\d{2}$', () => {
    expect(PRACTICE_STEP_ID_RE.test('p06')).toBe(true)
    expect(isPracticeStepId('p06')).toBe(true)
    expect(isPracticeStepId('p33')).toBe(true)
    expect(isPracticeStepId('p6')).toBe(false)
    expect(isPracticeStepId('P06')).toBe(false)
    expect(isPracticeStepId('p006')).toBe(false)
    expect(isPracticeStepId('foo')).toBe(false)
    expect(isPracticeStepId('p06.json')).toBe(false)
  })

  it('reads index.json and the exact p06 fixture shape', () => {
    const dir = writePracticeFixture(tempDir('fe-practice-ok-'))
    const index = loadPracticeIndexFromDir(dir)
    expect(index?.version).toBe(1)
    expect(index?.milestones).toHaveLength(8)
    expect(index?.steps).toHaveLength(33)
    expect(index?.steps.some((step) => step.id === 'p06')).toBe(true)

    const step = loadPracticeStepFromDir(dir, 'p06')
    const expected = fixturePracticeStepP06()
    expect(step).toMatchObject({
      kind: 'practice-step',
      id: 'p06',
      milestone: 'm1',
      order: 6,
      estimateMin: 180,
      prereqs: ['p03', 'p05'],
      tags: ['prisma', 'mysql', 'migrations'],
      commit: 'feat(api): prisma schema + seed',
    })
    expect(step?.title.en).toBe(expected.title.en)
    expect(step?.summary.en).toBe(expected.summary.en)
    expect(step?.kbLinks[0]?.slug).toBe('system-design')
    expect(step?.tasks.some((task) => task.code?.text.includes('pnpm prisma migrate dev'))).toBe(
      true,
    )
    expect(loadPracticeStepsFromDir(dir)).toHaveLength(33)
  })

  it('returns null (404) for a well-formed id with no file, and for invalid ids', () => {
    const dir = writePracticeFixture(tempDir('fe-practice-404-'))
    expect(loadPracticeStepFromDir(dir, 'p99')).toBeNull()
    expect(loadPracticeStepFromDir(dir, 'p6')).toBeNull()
    expect(loadPracticeStepFromDir(dir, 'nope')).toBeNull()
  })

  it('rebuilds the index from meta.json + steps when index.json is missing', () => {
    const dir = writePracticeFixture(tempDir('fe-practice-meta-'))
    rmSync(path.join(dir, 'practice/index.json'))
    const index = loadPracticeIndexFromDir(dir)
    expect(index?.steps.map((step) => step.id)).toContain('p06')
    expect(index?.milestones.map((item) => item.id)).toEqual([
      'm0',
      'm1',
      'm2',
      'm3',
      'm4',
      'm5',
      'm6',
      'm7',
    ])
  })

  it('treats a missing practice/ folder as unavailable, not a hard failure', () => {
    const dir = writeContentFixture(tempDir('fe-practice-absent-'), {
      practice: false,
    })
    expect(practiceDirExists(dir)).toBe(false)
    expect(loadPracticeIndexFromDir(dir)).toBeNull()
    expect(loadPracticeStepFromDir(dir, 'p06')).toBeNull()
    const result = validate(dir)
    expect(result.status, result.stderr || result.stdout).toBe(0)
  })

  it('validates a full practice tree and rejects a broken step', () => {
    const ok = writeContentFixture(tempDir('fe-practice-validate-'))
    const okResult = validate(ok)
    expect(okResult.status, okResult.stderr || okResult.stdout).toBe(0)

    const bad = writePracticeFixture(tempDir('fe-practice-bad-'))
    const file = path.join(bad, 'practice/steps/p08.json')
    const step = JSON.parse(readFileSync(file, 'utf8')) as Record<string, unknown>
    step.concepts = []
    writeFileSync(file, `${JSON.stringify(step, null, 2)}\n`)
    const badResult = validate(bad)
    expect(badResult.status).not.toBe(0)
    expect(badResult.stderr).toMatch(/concepts/)
  })

  it('round-trips progress including p33 (beyond 32-bit shift)', () => {
    const map = { p01: true, p32: true, p33: true }
    const token = encodeShareToken(doneMapToBitmask(map))
    expect(bitmaskToDoneMap(decodeShareToken(token)!)).toEqual(map)
    expect(fromProgressJson({ completed: ['p06', 33] })).toEqual({
      p06: true,
      p33: true,
    })
  })
})
