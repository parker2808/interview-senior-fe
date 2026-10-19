import type { Localized } from '@/modules/content/types'
import type { PracticeStep } from '@/modules/content/types/practice.type'
import type { DocLang } from '@/modules/core/constants/locale.constant'
import {
  foldSearchText,
  matchesAllKeywords,
  scoreKeywordHay,
  splitSearchKeywords,
} from '@/modules/knowledge-base/utils/search-text.util'

export type PracticeSearchKind = 'title' | 'tags' | 'body'

export type PracticeSearchHit = {
  id: string
  score: number
  kind: PracticeSearchKind
}

function joinLocalized(
  ...values: Array<Localized | string | undefined | null>
): string {
  const parts: string[] = []
  for (const value of values) {
    if (!value) continue
    if (typeof value === 'string') {
      parts.push(value)
      continue
    }
    if (value.vi) parts.push(value.vi)
    if (value.en) parts.push(value.en)
  }
  return parts.join(' ')
}

function taskBlob(step: PracticeStep): string {
  return step.tasks
    .map((task) =>
      joinLocalized(task.title, task.detail, task.code?.text || ''),
    )
    .join(' ')
}

/** Title + tags + concept terms + summary + tasks + doneWhen + pitfalls, both locales. */
export function practiceStepBlob(step: PracticeStep): string {
  return joinLocalized(
    step.title,
    step.summary,
    step.tags.join(' '),
    ...step.concepts.flatMap((concept) => [concept.term, concept.explain]),
    taskBlob(step),
    ...step.doneWhen,
    ...step.pitfalls,
    step.id,
  )
}

export function scorePracticeStep(
  step: PracticeStep,
  query: string,
  lang: DocLang,
): { score: number; kind: PracticeSearchKind } | null {
  const keywords = splitSearchKeywords(query)
  if (!keywords.length) return null
  if (!matchesAllKeywords(foldSearchText(practiceStepBlob(step)), keywords)) {
    return null
  }

  const titleHay = foldSearchText(
    joinLocalized(step.title[lang], step.title),
  )
  const tagHay = foldSearchText(
    joinLocalized(
      step.tags.join(' '),
      ...step.concepts.map((concept) => concept.term[lang]),
      ...step.concepts.map((concept) => concept.term),
    ),
  )
  const bodyHay = foldSearchText(
    joinLocalized(
      step.summary[lang],
      step.summary,
      taskBlob(step),
      ...step.doneWhen.map((item) => item[lang]),
      ...step.doneWhen,
      ...step.pitfalls.map((item) => item[lang]),
      ...step.pitfalls,
    ),
  )

  const titleScore = scoreKeywordHay(titleHay, keywords)
  const tagScore = scoreKeywordHay(tagHay, keywords)
  const bodyScore = scoreKeywordHay(bodyHay, keywords)

  const kind: PracticeSearchKind =
    titleScore > 0 ? 'title' : tagScore > 0 ? 'tags' : 'body'
  const fieldBase = kind === 'title' ? 300 : kind === 'tags' ? 160 : 80

  return {
    kind,
    score:
      fieldBase +
      titleScore +
      Math.round(tagScore * 0.5) +
      Math.round(bodyScore * 0.4),
  }
}

export function filterPracticeSteps(
  steps: PracticeStep[],
  options: { query: string; lang: DocLang },
): PracticeStep[] {
  const keywords = splitSearchKeywords(options.query)
  if (!keywords.length) return steps

  return steps
    .map((step, index) => {
      const scored = scorePracticeStep(step, options.query, options.lang)
      return scored
        ? { step, index, score: scored.score, kind: scored.kind }
        : null
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry != null)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.step)
}

export function practiceSearchHits(
  steps: PracticeStep[],
  query: string,
  lang: DocLang,
): PracticeSearchHit[] {
  const keywords = splitSearchKeywords(query)
  if (!keywords.length) return []

  return steps
    .map((step, index) => {
      const scored = scorePracticeStep(step, query, lang)
      return scored
        ? { id: step.id, score: scored.score, kind: scored.kind, index }
        : null
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry != null)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ id, score, kind }) => ({ id, score, kind }))
}
