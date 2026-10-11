import type {
  AuditAction,
  ShareScope,
} from '@/modules/access/types/entities/access.type'

export function formatAccessDate(ms: number | null | undefined, locale: string) {
  if (!ms) return '—'
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(ms))
}

export function toDatetimeLocalValue(ms: number) {
  const date = new Date(ms)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function fromDatetimeLocalValue(value: string) {
  const parsed = Date.parse(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function maxCustomExpiryValue() {
  return toDatetimeLocalValue(Date.now() + 90 * 24 * 60 * 60 * 1000)
}

export function minCustomExpiryValue() {
  return toDatetimeLocalValue(Date.now() + 60 * 1000)
}

export function describeScope(scope: ShareScope) {
  if (scope.type === 'qa-all') return 'qa-all'
  if (scope.type === 'qa-categories') return scope.categoryIds.join(', ')
  return scope.questionIds.join(', ')
}

export function auditActionKey(action: AuditAction) {
  return `access.audit.${action}` as const
}
