import type {
  InterviewCategoryId,
  InterviewCategoryMeta,
  InterviewLang,
  InterviewQuestion,
} from '@/modules/interview-qa/types/interview.type'
import {
  foldSearchText,
  matchesAllKeywords,
  scoreKeywordHay,
  splitSearchKeywords,
} from '@/modules/knowledge-base/utils/search-text.util'

function joinLocalized(
  ...values: Array<{ en?: string; vi?: string } | string | undefined | null>
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

/** Question + answer + example + follow-ups + tags, both locales. */
export function interviewQuestionBlob(item: InterviewQuestion): string {
  return joinLocalized(
    item.question,
    item.answer,
    item.example,
    ...(item.followUps || []),
    item.tags.join(' '),
    item.category,
    item.id,
  )
}

export function scoreInterviewQuestion(
  item: InterviewQuestion,
  query: string,
  lang: InterviewLang,
): number {
  const keywords = splitSearchKeywords(query)
  if (!keywords.length) return 0
  if (!matchesAllKeywords(foldSearchText(interviewQuestionBlob(item)), keywords)) {
    return 0
  }

  const questionHay = foldSearchText(joinLocalized(item.question[lang], item.question))
  const tagHay = foldSearchText(item.tags.join(' '))
  const answerHay = foldSearchText(joinLocalized(item.answer[lang], item.answer))
  const exampleHay = foldSearchText(joinLocalized(item.example?.[lang], item.example))
  const followHay = foldSearchText(joinLocalized(...(item.followUps || [])))

  const questionScore = scoreKeywordHay(questionHay, keywords)
  const tagScore = scoreKeywordHay(tagHay, keywords)
  const answerScore = scoreKeywordHay(answerHay, keywords)
  const exampleScore = scoreKeywordHay(exampleHay, keywords)
  const followScore = scoreKeywordHay(followHay, keywords)

  const fieldBase =
    questionScore > 0
      ? 300
      : tagScore > 0
        ? 160
        : answerScore > 0
          ? 80
          : exampleScore > 0
            ? 70
            : 50

  return (
    fieldBase +
    questionScore +
    Math.round(tagScore * 0.5) +
    Math.round(answerScore * 0.4) +
    Math.round(exampleScore * 0.35) +
    Math.round(followScore * 0.3)
  )
}

export function filterInterviewQuestions(
  items: InterviewQuestion[],
  options: {
    query: string
    category?: 'all' | InterviewCategoryId
    lang: InterviewLang
  },
): InterviewQuestion[] {
  const category = options.category ?? 'all'
  const byCategory =
    category === 'all'
      ? items
      : items.filter((item) => item.category === category)

  const keywords = splitSearchKeywords(options.query)
  if (!keywords.length) return byCategory

  return byCategory
    .map((item, index) => ({
      item,
      index,
      score: scoreInterviewQuestion(item, options.query, options.lang),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.item)
}

export function groupInterviewQuestions(
  items: InterviewQuestion[],
  categories: InterviewCategoryMeta[],
): Array<{ category: InterviewCategoryMeta; questions: InterviewQuestion[] }> {
  const byId = new Map<InterviewCategoryId, InterviewQuestion[]>()
  for (const item of items) {
    const list = byId.get(item.category) ?? []
    list.push(item)
    byId.set(item.category, list)
  }
  const groups: Array<{
    category: InterviewCategoryMeta
    questions: InterviewQuestion[]
  }> = []
  const seen = new Set<InterviewCategoryId>()
  for (const category of categories) {
    const questions = byId.get(category.id)
    if (!questions?.length) continue
    groups.push({ category, questions })
    seen.add(category.id)
  }
  for (const [id, questions] of byId) {
    if (seen.has(id) || !questions.length) continue
    groups.push({
      category: {
        id,
        title: { en: id, vi: id },
        blurb: { en: '', vi: '' },
      },
      questions,
    })
  }
  return groups
}
