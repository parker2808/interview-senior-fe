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
} from '@/modules/content/types'
import {
  stripPlanDayDates,
  stripPlanIndexDates,
} from '@/modules/content/utils/plan-dates.util'

const DISK_ROOT = join(process.cwd(), '.data/content')

function fromDisk<T>(rel: string): T | null {
  const file = join(DISK_ROOT, rel)
  if (!existsSync(file)) return null
  return JSON.parse(readFileSync(file, 'utf8')) as T
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

export async function readContentJson<T>(rel: string): Promise<T> {
  const asset = await fromAssets<T>(rel)
  if (asset != null) return asset
  const disk = fromDisk<T>(rel)
  if (disk != null) return disk
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

export async function readPlanIndex(): Promise<PlanIndex> {
  try {
    return stripPlanIndexDates(
      await readContentJson<PlanIndex>('plan/index.json'),
    )
  } catch {
    const meta = await readContentJson<PlanMeta>('plan/meta.json')
    const days: PlanDaySummary[] = []
    for (let n = 1; n <= 30; n++) {
      const day = await readPlanDay(n)
      const { lab: _lab, ...summary } = day
      days.push(summary)
    }
    return stripPlanIndexDates({ ...meta, days })
  }
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

export { publicCacheHeaders } from '@/modules/core/utils/cache-headers.util'

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
