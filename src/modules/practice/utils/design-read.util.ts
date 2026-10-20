import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { PracticeDesignIndex } from '@/modules/content/types/practice.type'
import { localeSpecPath } from '@/modules/practice/utils/spec-locale.util'
import { specHeadingsFromMarkdown } from '@/modules/practice/utils/spec-ref.util'

export const DEFAULT_SPEC_PATH = 'plans/portfolio-design-system.md'
export const DESIGN_INDEX_REL = 'practice/design/index.json'
export const DESIGN_SCREENS_REL = 'practice/design/screens'

export function designIndexExists(root: string): boolean {
  return existsSync(join(root, DESIGN_INDEX_REL))
}

export function loadPracticeDesignIndexFromDir(root: string): PracticeDesignIndex | null {
  const file = join(root, DESIGN_INDEX_REL)
  if (!existsSync(file)) return null
  try {
    return JSON.parse(readFileSync(file, 'utf8')) as PracticeDesignIndex
  } catch {
    return null
  }
}

export function loadPracticeSpecMarkdownFromDir(
  root: string,
  specPath = DEFAULT_SPEC_PATH,
): string | null {
  const rel = String(specPath || DEFAULT_SPEC_PATH).replace(/^\/+/, '')
  if (!rel || rel.includes('..')) return null
  const file = join(root, rel)
  if (!existsSync(file)) return null
  return readFileSync(file, 'utf8')
}

export function listDesignScreenFiles(root: string): string[] {
  const dir = join(root, DESIGN_SCREENS_REL)
  if (!existsSync(dir)) return []
  return readdirSync(dir).filter((name) => name.toLowerCase().endsWith('.webp'))
}

export function loadPracticeDesignFromDir(root: string) {
  const index = loadPracticeDesignIndexFromDir(root)
  if (!index) return null
  const specPath = index.specPath || DEFAULT_SPEC_PATH
  const specMarkdown = loadPracticeSpecMarkdownFromDir(root, specPath) ?? ''
  const specMarkdownVi =
    loadPracticeSpecMarkdownFromDir(root, localeSpecPath(specPath, 'vi')) ?? ''
  const headings = specMarkdown ? specHeadingsFromMarkdown(specMarkdown) : []
  const headingsVi = specMarkdownVi ? specHeadingsFromMarkdown(specMarkdownVi) : []
  return { index, specMarkdown, specMarkdownVi, headings, headingsVi }
}
