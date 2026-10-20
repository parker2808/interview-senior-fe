import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import type {
  KnowledgeCatalog,
  KnowledgeDoc,
  KnowledgeDocSummary,
  PlanDay,
  PlanDaySummary,
  PlanIndex,
  PlanMeta,
  PlanResource,
  InterviewBank,
  PracticeDesignIndex,
  PracticeDesignPayload,
  PracticeIndex,
  PracticeMeta,
  PracticeStep,
} from '@/modules/content/types'
import {
  DEFAULT_SPEC_PATH,
  DESIGN_INDEX_REL,
} from '@/modules/practice/utils/design-read.util'
import { localeSpecPath } from '@/modules/practice/utils/spec-locale.util'
import { specHeadingsFromMarkdown } from '@/modules/practice/utils/spec-ref.util'
import { indexFromMetaAndSteps } from '@/modules/practice/utils/practice-read.util'
import { isPracticeStepId } from '@/modules/practice/utils/practice-id.util'
import {
  stripPlanDayDates,
  stripPlanIndexDates,
} from '@/modules/content/utils/plan-dates.util'
import { hasLabContent } from '@/modules/content/utils/plan-lab.util'

const DISK_ROOT = join(process.cwd(), '.data/content')

function fromDisk<T>(rel: string): T | null {
  const file = join(DISK_ROOT, rel)
  if (!existsSync(file)) return null
  return JSON.parse(readFileSync(file, 'utf8')) as T
}

function fromDiskText(rel: string): string | null {
  const file = join(DISK_ROOT, rel)
  if (!existsSync(file)) return null
  return readFileSync(file, 'utf8')
}

function safeContentRel(rel: string): string | null {
  const cleaned = String(rel || '').replace(/^\/+/, '').replaceAll('\\', '/')
  if (!cleaned || cleaned.includes('..')) return null
  return cleaned
}

export async function readContentTextOptional(rel: string): Promise<string | null> {
  const pathRel = safeContentRel(rel)
  if (!pathRel) return null
  try {
    const storage = useStorage('assets:siteContent')
    const slash = pathRel
    const colon = pathRel.replaceAll('/', ':')
    const value =
      (await storage.getItemRaw(slash)) ?? (await storage.getItemRaw(colon))
    if (typeof value === 'string') return value
    if (value instanceof Uint8Array) return new TextDecoder().decode(value)
    if (Buffer.isBuffer(value)) return value.toString('utf8')
  } catch {
    /* fall through to disk */
  }
  return fromDiskText(pathRel)
}

async function fromAssets<T>(rel: string): Promise<T | null> {
  try {
    const storage = useStorage('assets:siteContent')
    const slash = rel
    const colon = rel.replaceAll('/', ':')
    const value =
      (await storage.getItem<T>(slash)) ?? (await storage.getItem<T>(colon))
    return value ?? null
  } catch {
    return null
  }
}

export async function readContentJsonOptional<T>(rel: string): Promise<T | null> {
  const asset = await fromAssets<T>(rel)
  if (asset != null) return asset
  return fromDisk<T>(rel)
}

export async function readContentJson<T>(rel: string): Promise<T> {
  const value = await readContentJsonOptional<T>(rel)
  if (value != null) return value
  throw createError({
    statusCode: 500,
    statusMessage: `Content file missing: ${rel}. Did scripts/pull-data.mjs run before the build?`,
  })
}

export async function readKnowledgeCatalog(): Promise<KnowledgeCatalog> {
  return readContentJson<KnowledgeCatalog>('knowledge-base/index.json')
}

export async function readKnowledgeDoc(slug: string): Promise<KnowledgeDoc> {
  return readContentJson<KnowledgeDoc>(`knowledge-base/${slug}.json`)
}

let hasLabCache: Promise<boolean> | null = null

/** Content is pulled at build time, so the answer is fixed for the life of the server. */
function planHasLab(): Promise<boolean> {
  hasLabCache ??= (async () => {
    for (let n = 1; n <= 30; n++) {
      try {
        if (hasLabContent(await readPlanDay(n))) return true
      } catch {
        /* missing day: no lab */
      }
    }
    return false
  })()
  return hasLabCache
}

export async function readPlanIndex(): Promise<PlanIndex> {
  let index: PlanIndex
  try {
    index = await readContentJson<PlanIndex>('plan/index.json')
  } catch {
    const meta = await readContentJson<PlanMeta>('plan/meta.json')
    const days: PlanDaySummary[] = []
    for (let n = 1; n <= 30; n++) {
      const day = await readPlanDay(n)
      const { lab: _lab, ...summary } = day
      days.push(summary)
    }
    index = { ...meta, days }
  }
  return stripPlanIndexDates({ ...index, hasLab: await planHasLab() })
}

export async function readPlanDay(n: number): Promise<PlanDay> {
  const id = String(n).padStart(2, '0')
  return stripPlanDayDates(
    await readContentJson<PlanDay>(`plan/days/day-${id}.json`),
  )
}

export async function readPlanResource(id: string): Promise<PlanResource> {
  try {
    return await readContentJson<PlanResource>(`plan/resources/${id}.json`)
  } catch {
    const resolved = await resolveResourceId(id)
    if (resolved && resolved !== id) {
      return readContentJson<PlanResource>(`plan/resources/${resolved}.json`)
    }
    throw createError({
      statusCode: 404,
      statusMessage: `Unknown plan resource: ${id}`,
    })
  }
}

export async function resolveResourceId(raw: string): Promise<string | null> {
  const id = decodeURIComponent(String(raw || ''))
    .replace(/^\.\/+/, '')
    .replace(/^(vi|en)\//, '')
  if (!id) return null

  const index = await readPlanIndex()
  const direct = index.resources.find((item) => item.id === id)
  if (direct) return direct.id

  const byAlias = index.resources.find((item) => item.aliases.includes(id))
  if (byAlias) return byAlias.id

  const algo = id.match(/(?:^|\/)(?:artifacts\/algo\/problems\/)?day-(\d+)(?:\.md)?$/)
  if (algo) return `algo-day-${String(Number(algo[1])).padStart(2, '0')}`

  const algoAlt = id.match(/^algo-day-(\d+)$/)
  if (algoAlt) return `algo-day-${String(Number(algoAlt[1])).padStart(2, '0')}`

  try {
    const files = listResourceIds()
    if (files.includes(id)) return id
    const aliasHit = files.find((file) => {
      try {
        const resource = fromDisk<PlanResource>(`plan/resources/${file}.json`)
        return resource?.aliases.includes(id)
      } catch {
        return false
      }
    })
    if (aliasHit) return aliasHit
  } catch {
    /* ignore */
  }

  return null
}

function listResourceIds() {
  const dir = join(DISK_ROOT, 'plan/resources')
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .map((name) => name.replace(/\.json$/, ''))
}

function practiceNotFound(detail: string) {
  return createError({
    statusCode: 404,
    statusMessage: detail,
  })
}

export async function hasPracticeContent(): Promise<boolean> {
  const index = await readContentJsonOptional<PracticeIndex>('practice/index.json')
  if (index?.steps) return true
  const meta = await readContentJsonOptional<PracticeMeta>('practice/meta.json')
  return Boolean(meta?.milestones)
}

export async function readPracticeIndex(): Promise<PracticeIndex> {
  const index = await readContentJsonOptional<PracticeIndex>('practice/index.json')
  if (index?.milestones && Array.isArray(index.steps)) return index

  const meta = await readContentJsonOptional<PracticeMeta>('practice/meta.json')
  if (!meta?.milestones) {
    throw practiceNotFound('Practice content is not available')
  }

  const steps: PracticeStep[] = []
  for (const milestone of meta.milestones) {
    for (const id of milestone.steps || []) {
      if (!isPracticeStepId(id)) continue
      const step = await readContentJsonOptional<PracticeStep>(
        `practice/steps/${id}.json`,
      )
      if (step) steps.push(step)
    }
  }
  return indexFromMetaAndSteps(meta, steps)
}

export async function readPracticeStep(id: string): Promise<PracticeStep> {
  if (!isPracticeStepId(id)) {
    throw practiceNotFound(`Unknown practice step: ${id}`)
  }
  const step = await readContentJsonOptional<PracticeStep>(
    `practice/steps/${id}.json`,
  )
  if (!step) {
    throw practiceNotFound(`Unknown practice step: ${id}`)
  }
  return step
}

export async function readPracticeSteps(): Promise<PracticeStep[]> {
  const index = await readPracticeIndex()
  const out: PracticeStep[] = []
  for (const item of index.steps) {
    try {
      out.push(await readPracticeStep(item.id))
    } catch {
      /* skip missing step files */
    }
  }
  return out
}

export async function hasPracticeDesign(): Promise<boolean> {
  const index = await readContentJsonOptional<PracticeDesignIndex>(DESIGN_INDEX_REL)
  return Boolean(index && Array.isArray(index.screens))
}

export async function readPracticeDesign(): Promise<PracticeDesignPayload> {
  const index = await readContentJsonOptional<PracticeDesignIndex>(DESIGN_INDEX_REL)
  if (!index || !Array.isArray(index.screens)) {
    throw practiceNotFound('Practice design content is not available')
  }
  const specPath = safeContentRel(index.specPath || DEFAULT_SPEC_PATH) || DEFAULT_SPEC_PATH
  const specMarkdown = (await readContentTextOptional(specPath)) ?? ''
  const specMarkdownVi =
    (await readContentTextOptional(localeSpecPath(specPath, 'vi'))) ?? ''
  const headings = specMarkdown ? specHeadingsFromMarkdown(specMarkdown) : []
  const headingsVi = specMarkdownVi ? specHeadingsFromMarkdown(specMarkdownVi) : []
  return { index, specMarkdown, specMarkdownVi, headings, headingsVi }
}

export async function readInterviewBank(): Promise<InterviewBank> {
  const categoriesFile = await readContentJson<{
    categories: InterviewBank['categories']
  }>('qna/categories.json')
  const questionsFile = await readContentJson<{
    questions: InterviewBank['questions']
  }>('qna/questions.json')
  return {
    categories: categoriesFile.categories,
    questions: questionsFile.questions,
  }
}

export function publicCacheHeaders() {
  return {
    'Cache-Control':
      'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400',
  }
}

export function findDocSummary(
  catalog: KnowledgeCatalog,
  slug: string,
): KnowledgeDocSummary | undefined {
  return catalog.docs.find((doc) => doc.slug === slug)
}

export function adjacentDocs(catalog: KnowledgeCatalog, slug: string) {
  const i = catalog.docs.findIndex((doc) => doc.slug === slug)
  return {
    prev: i > 0 ? catalog.docs[i - 1] : null,
    next: i >= 0 && i < catalog.docs.length - 1 ? catalog.docs[i + 1] : null,
  }
}
