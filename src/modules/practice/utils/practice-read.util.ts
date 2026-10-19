import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type {
  PracticeIndex,
  PracticeMeta,
  PracticeStep,
  PracticeStepSummary,
} from '@/modules/content/types/practice.type'
import { isPracticeStepId } from '@/modules/practice/utils/practice-id.util'

export function readJsonFile<T>(root: string, rel: string): T | null {
  const file = join(root, rel)
  if (!existsSync(file)) return null
  return JSON.parse(readFileSync(file, 'utf8')) as T
}

export function practiceDirExists(root: string): boolean {
  return (
    existsSync(join(root, 'practice/index.json')) ||
    existsSync(join(root, 'practice/meta.json')) ||
    existsSync(join(root, 'practice/steps'))
  )
}

export function toPracticeStepSummary(step: PracticeStep): PracticeStepSummary {
  return {
    id: step.id,
    milestone: step.milestone,
    order: step.order,
    title: step.title,
    summary: step.summary,
    estimateMin: step.estimateMin,
    tags: step.tags,
    prereqs: step.prereqs,
  }
}

export function indexFromMetaAndSteps(
  meta: PracticeMeta,
  steps: PracticeStep[],
): PracticeIndex {
  const byId = new Map(steps.map((step) => [step.id, step]))
  const ordered: PracticeStep[] = []
  for (const milestone of meta.milestones) {
    for (const id of milestone.steps) {
      const step = byId.get(id)
      if (step) ordered.push(step)
    }
  }
  for (const step of steps) {
    if (!ordered.some((item) => item.id === step.id)) ordered.push(step)
  }
  ordered.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
  return {
    version: meta.version,
    title: meta.title,
    intro: meta.intro,
    milestones: meta.milestones,
    steps: ordered.map(toPracticeStepSummary),
  }
}

function listStepFiles(root: string): string[] {
  const dir = join(root, 'practice/steps')
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .map((name) => name.replace(/\.json$/, ''))
}

export function loadPracticeStepsFromDir(root: string): PracticeStep[] {
  const out: PracticeStep[] = []
  for (const id of listStepFiles(root)) {
    if (!isPracticeStepId(id)) continue
    const step = readJsonFile<PracticeStep>(root, `practice/steps/${id}.json`)
    if (step) out.push(step)
  }
  out.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
  return out
}

export function loadPracticeIndexFromDir(root: string): PracticeIndex | null {
  const index = readJsonFile<PracticeIndex>(root, 'practice/index.json')
  if (index?.milestones && Array.isArray(index.steps)) return index

  const meta = readJsonFile<PracticeMeta>(root, 'practice/meta.json')
  if (!meta) return null
  return indexFromMetaAndSteps(meta, loadPracticeStepsFromDir(root))
}

export function loadPracticeStepFromDir(
  root: string,
  id: string,
): PracticeStep | null {
  if (!isPracticeStepId(id)) return null
  return readJsonFile<PracticeStep>(root, `practice/steps/${id}.json`)
}
