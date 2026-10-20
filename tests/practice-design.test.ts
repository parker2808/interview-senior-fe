import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import { writeContentFixture } from './fixtures/plan-content-tree.mjs'
import {
  FIXTURE_FIGMA,
  fixtureDesignSpecMarkdown,
  writePracticeDesignFixture,
} from './fixtures/practice-design-tree.mjs'
import { practiceDesignFigma } from '@/modules/practice/utils/design-figma.util'
import {
  designIndexExists,
  listDesignScreenFiles,
  loadPracticeDesignFromDir,
  loadPracticeDesignIndexFromDir,
  loadPracticeSpecMarkdownFromDir,
} from '@/modules/practice/utils/design-read.util'
import {
  designScreenSrc,
  headingMatchesSection,
  mapSpecRefToHeading,
  matchingSpecHeadingIds,
  parseSpecSectionId,
  specHeadingsFromMarkdown,
  specRefHref,
} from '@/modules/practice/utils/spec-ref.util'

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

describe('§-ref mapping', () => {
  const markdown = fixtureDesignSpecMarkdown()
  const headings = specHeadingsFromMarkdown(markdown)

  it('parses §X.Y, § X.Y, and bare numbers', () => {
    expect(parseSpecSectionId('§5.1')).toBe('5.1')
    expect(parseSpecSectionId('§ 1.5')).toBe('1.5')
    expect(parseSpecSectionId('1')).toBe('1')
    expect(parseSpecSectionId('not-a-ref')).toBeNull()
  })

  it('maps §1 to the 1. heading and not 1.5', () => {
    expect(headingMatchesSection('1. Product overview', '1')).toBe(true)
    expect(headingMatchesSection('1.5 Navigation', '1')).toBe(false)
    expect(headingMatchesSection('1.5 Navigation', '1.5')).toBe(true)

    const hit = mapSpecRefToHeading('§1', headings)
    expect(hit?.text).toMatch(/^1\b/)
    expect(hit?.text).not.toMatch(/^1\.5/)

    const nested = mapSpecRefToHeading('§1.5', headings)
    expect(nested?.text.startsWith('1.5')).toBe(true)
  })

  it('maps §5.1 to the home heading anchor used in gallery/step links', () => {
    const hit = mapSpecRefToHeading('§5.1', headings)
    expect(hit).toBeTruthy()
    expect(hit?.text.startsWith('5.1')).toBe(true)
    expect(specRefHref('§5.1', headings)).toBe(
      `/practice/design?tab=spec#${encodeURIComponent(hit!.id)}`,
    )
    expect(hit!.id).toBe('s-5-1')
  })

  it('searches the spec with keyword AND and Vietnamese folding', () => {
    const hieu = matchingSpecHeadingIds(markdown, headings, 'hieu nang')
    expect(hieu.length).toBeGreaterThan(0)
    expect(headings.find((item) => item.id === hieu[0])?.text).toMatch(/Hiệu năng|hieu/i)

    const both = matchingSpecHeadingIds(markdown, headings, 'lightbox scroll')
    expect(both.length).toBeGreaterThan(0)

    const miss = matchingSpecHeadingIds(markdown, headings, 'webpack rust')
    expect(miss).toEqual([])
  })
})

describe('practice design readers', () => {
  it('loads optional design index, spec markdown, and webp screens', () => {
    const dir = writePracticeDesignFixture(tempDir('fe-design-ok-'), { ffmpeg: false })
    expect(designIndexExists(dir)).toBe(true)
    const loaded = loadPracticeDesignFromDir(dir)
    expect(loaded?.index.version).toBe(1)
    expect(loaded?.index.screens).toHaveLength(5)
    expect(loaded?.index.screens[0]?.specRefs).toEqual(['§5.1'])
    expect(practiceDesignFigma(loaded?.index.figma)).toEqual(FIXTURE_FIGMA)
    expect(loaded?.specMarkdown).toContain('## 1. Product overview')
    expect(loaded?.specMarkdown).toContain('### 1.5 Navigation')
    expect(loaded?.specMarkdownVi).toContain('## 1. Tổng quan sản phẩm')
    expect(loaded?.headings.some((item) => item.id === 's-1-5')).toBe(true)
    expect(loaded?.headingsVi.some((item) => item.id === 's-1-5')).toBe(true)
    expect(loaded?.headings.some((item) => item.text.startsWith('5.1'))).toBe(true)
    expect(listDesignScreenFiles(dir).some((name) => name.endsWith('.webp'))).toBe(true)
    expect(designScreenSrc('practice/design/screens/01-home-light.webp')).toBe(
      '/assets/practice-design/screens/01-home-light.webp',
    )
    expect(loadPracticeSpecMarkdownFromDir(dir)?.length).toBeGreaterThan(100)
  })

  it('treats missing design as unavailable and still validates', () => {
    const dir = writeContentFixture(tempDir('fe-design-absent-'), {
      practice: true,
      design: false,
    })
    expect(loadPracticeDesignIndexFromDir(dir)).toBeNull()
    expect(loadPracticeDesignFromDir(dir)).toBeNull()
    const result = validate(dir)
    expect(result.status, result.stderr || result.stdout).toBe(0)
  })

  it('validates a full tree that includes design screens', () => {
    const dir = writeContentFixture(tempDir('fe-design-validate-'), { ffmpeg: false })
    const result = validate(dir)
    expect(result.status, result.stderr || result.stdout).toBe(0)
  })

  it('keeps figma optional: absent is valid and hides the CTA', () => {
    const dir = writeContentFixture(tempDir('fe-design-no-figma-'), {
      ffmpeg: false,
      figma: false,
    })
    const loaded = loadPracticeDesignFromDir(dir)
    expect(loaded?.index.figma).toBeUndefined()
    expect(practiceDesignFigma(loaded?.index.figma)).toBeNull()
    const result = validate(dir)
    expect(result.status, result.stderr || result.stdout).toBe(0)
  })

  it('rejects a present figma object with a non-http url', () => {
    const dir = writePracticeDesignFixture(tempDir('fe-design-bad-figma-'), {
      ffmpeg: false,
    })
    const file = path.join(dir, 'practice/design/index.json')
    const index = JSON.parse(readFileSync(file, 'utf8')) as Record<string, unknown>
    index.figma = {
      url: 'javascript:alert(1)',
      label: { en: 'Open in Figma', vi: 'Mở trong Figma' },
      note: { en: 'Note', vi: 'Ghi chú' },
    }
    writeFileSync(file, `${JSON.stringify(index, null, 2)}\n`)
    expect(practiceDesignFigma(index.figma as never)).toBeNull()
    const result = validate(dir)
    expect(result.status).not.toBe(0)
    expect(result.stderr).toMatch(/figma/)
  })
})
