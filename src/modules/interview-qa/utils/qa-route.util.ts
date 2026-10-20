export function questionIdFromQuery(query: unknown): string {
  if (typeof query === 'string' && query.trim()) return query.trim()
  if (Array.isArray(query) && query[0]) return String(query[0]).trim()
  return ''
}

export function questionIdFromHash(hash: string): string {
  const value = String(hash || '')
  if (!value.startsWith('#')) return ''
  try {
    return decodeURIComponent(value.slice(1)).trim()
  } catch {
    return value.slice(1).trim()
  }
}

/** Prefer `?q=` (stable across auth/retry). Fall back to `#id` for old links. */
export function requestedQuestionId(input: {
  query?: unknown
  hash?: string
}): string {
  return questionIdFromQuery(input.query) || questionIdFromHash(input.hash || '')
}

export function interviewPathForQuestion(id: string): string {
  const trimmed = String(id || '').trim()
  return trimmed ? `/interview?q=${encodeURIComponent(trimmed)}` : '/interview'
}

export function withQuestionQuery(
  query: Record<string, string | string[] | null | undefined>,
  id: string,
): Record<string, string | string[] | null | undefined> {
  const next = { ...query }
  const trimmed = String(id || '').trim()
  if (trimmed) next.q = trimmed
  else delete next.q
  return next
}

export function questionExists(
  questions: Array<{ id: string }>,
  id: string,
): boolean {
  const trimmed = String(id || '').trim()
  if (!trimmed) return false
  return questions.some((item) => item.id === trimmed)
}
