import type { ShareScope } from '@/modules/access/types/entities/access.type'

export type ScopedQuestion = {
  id: string
  category: string
}

export function parseShareScope(raw: unknown): ShareScope | null {
  if (!raw || typeof raw !== 'object') return null
  const body = raw as { type?: unknown; categoryIds?: unknown; questionIds?: unknown }
  if (body.type === 'qa-all') return { type: 'qa-all' }
  if (body.type === 'qa-categories') {
    const categoryIds = Array.isArray(body.categoryIds)
      ? body.categoryIds.map((id) => String(id || '').trim()).filter(Boolean)
      : []
    if (!categoryIds.length) return null
    return { type: 'qa-categories', categoryIds }
  }
  if (body.type === 'qa-questions') {
    const questionIds = Array.isArray(body.questionIds)
      ? body.questionIds.map((id) => String(id || '').trim()).filter(Boolean)
      : []
    if (!questionIds.length) return null
    return { type: 'qa-questions', questionIds }
  }
  return null
}

export function questionInScope(
  question: ScopedQuestion,
  scope: ShareScope,
): boolean {
  if (scope.type === 'qa-all') return true
  if (scope.type === 'qa-categories') {
    return scope.categoryIds.includes(question.category)
  }
  return scope.questionIds.includes(question.id)
}

export function filterBankByScope<
  Q extends ScopedQuestion,
  C extends { id: string },
>(
  questions: Q[],
  categories: C[],
  scope: ShareScope,
): { questions: Q[]; categories: C[] } {
  const nextQuestions = questions.filter((item) => questionInScope(item, scope))
  const used = new Set(nextQuestions.map((item) => item.category))
  return {
    questions: nextQuestions,
    categories: categories.filter((category) => used.has(category.id)),
  }
}

export function describeShareScope(scope: ShareScope) {
  if (scope.type === 'qa-all') return 'all-qa'
  if (scope.type === 'qa-categories') {
    return `categories:${scope.categoryIds.join(',')}`
  }
  return `questions:${scope.questionIds.length}`
}
