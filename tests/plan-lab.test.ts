import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import type { PlanDay } from '@/modules/content/types'
import {
  hasLabContent,
  isLabResourceId,
  visiblePlanResources,
} from '@/modules/content/utils/plan-lab.util'
import { doneMapToBitmask, bitmaskToDoneMap } from '@/modules/study-plan/utils/progress-codec.util'
import {
  fixtureDay as rawFixtureDay,
  NO_LAB_DAY,
  writeContentFixture,
} from './fixtures/plan-content-tree.mjs'

function fixtureDay(n: number): PlanDay {
  return rawFixtureDay(n) as PlanDay
}

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

describe('retired lab content', () => {
  it('treats empty lab.sections and a missing lab field as no Lab tab', () => {
    const stub = fixtureDay(1)
    const omitted = fixtureDay(NO_LAB_DAY)
    expect(stub.lab?.sections).toEqual([])
    expect(hasLabContent(stub)).toBe(false)
    expect(omitted.lab).toBeUndefined()
    expect(hasLabContent(omitted)).toBe(false)
    expect(hasLabContent({ lab: undefined })).toBe(false)
    expect(hasLabContent(null)).toBe(false)
  })

  it('still shows Lab when a day has real sections', () => {
    expect(
      hasLabContent({
        lab: {
          resourceId: 'lab-day-01',
          title: { en: 'Day 1 — Lab', vi: 'Ngày 1 — Lab' },
          sections: [
            {
              id: { en: 'setup', vi: 'setup' },
              title: { en: 'Setup', vi: 'Setup' },
              blocks: [],
            },
          ],
        },
      }),
    ).toBe(true)
  })

  it('keeps Plan-tab studyLinks and algorithm on both fixture shapes', () => {
    for (const n of [1, NO_LAB_DAY]) {
      const day = fixtureDay(n)
      expect(day.studyLinks.some((link) => link.kind === 'docs' && link.slug === 'javascript')).toBe(
        true,
      )
      expect(day.algorithm.resourceId).toBe(`algo-day-${String(n).padStart(2, '0')}`)
      expect(day.algorithm.label.en).toBeTruthy()
      expect(day.algorithm.label.vi).toBeTruthy()
    }
  })

  it('hides Lab overview links when no day has lab sections', () => {
    const resources = [
      { id: 'plan', aliases: [] as string[], title: { en: 'Plan', vi: 'Kế hoạch' } },
      { id: 'lab', aliases: ['lab-repo.md'], title: { en: 'Lab', vi: 'Lab' } },
      { id: 'lab-day-01', aliases: [], title: { en: 'Day 1 lab', vi: 'Lab ngày 1' } },
      { id: 'algo', aliases: [], title: { en: 'Algo', vi: 'Algo' } },
    ]
    expect(isLabResourceId('lab')).toBe(true)
    expect(isLabResourceId('lab-day-09')).toBe(true)
    expect(isLabResourceId('algo')).toBe(false)
    expect(visiblePlanResources(resources, false).map((item) => item.id)).toEqual([
      'plan',
      'algo',
    ])
    expect(visiblePlanResources(resources, true).map((item) => item.id)).toEqual(
      resources.map((item) => item.id),
    )
  })

  it('tracks progress by day number even when lab is a stub or omitted', () => {
    const mask = doneMapToBitmask({ 1: true, [NO_LAB_DAY]: true, 30: true })
    expect(bitmaskToDoneMap(mask)).toEqual({ 1: true, [NO_LAB_DAY]: true, 30: true })
  })

  it('accepts a 30-day tree with empty lab.sections and a day with no lab field', () => {
    const dir = writeContentFixture(tempDir('fe-lab-ok-'))
    const result = validate(dir)
    expect(result.status, result.stderr || result.stdout).toBe(0)
    expect(JSON.parse(readFileSync(path.join(dir, 'plan/days/day-01.json'), 'utf8')).lab.sections).toEqual(
      [],
    )
    expect(
      JSON.parse(readFileSync(path.join(dir, 'plan/days/day-02.json'), 'utf8')).lab,
    ).toBeUndefined()
  })

  it('still requires algorithm and rejects a non-array lab.sections', () => {
    const missingAlgo = writeContentFixture(tempDir('fe-lab-algo-'))
    const algoFile = path.join(missingAlgo, 'plan/days/day-03.json')
    const algoDay = JSON.parse(readFileSync(algoFile, 'utf8')) as Record<string, unknown>
    delete algoDay.algorithm
    writeFileSync(algoFile, `${JSON.stringify(algoDay, null, 2)}\n`)
    const algoResult = validate(missingAlgo)
    expect(algoResult.status).not.toBe(0)
    expect(algoResult.stderr).toMatch(/algorithm/)

    const badLab = writeContentFixture(tempDir('fe-lab-bad-'))
    const labFile = path.join(badLab, 'plan/days/day-04.json')
    const labDay = JSON.parse(readFileSync(labFile, 'utf8')) as Record<string, unknown>
    labDay.lab = { resourceId: 'lab-day-04', title: { en: 'Lab', vi: 'Lab' }, sections: null }
    writeFileSync(labFile, `${JSON.stringify(labDay, null, 2)}\n`)
    const labResult = validate(badLab)
    expect(labResult.status).not.toBe(0)
    expect(labResult.stderr).toMatch(/lab\.sections/)
  })
})
