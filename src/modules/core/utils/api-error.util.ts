export type AuthErrorCode =
  | 'INVALID_PASSCODE'
  | 'PASSCODE_FORMAT'
  | 'PASSCODE_NOT_CONFIGURED'
  | 'SESSION_EXPIRED'
  | 'NETWORK'
  | 'UNKNOWN'

const AUTH_I18N_KEY: Record<AuthErrorCode, string> = {
  INVALID_PASSCODE: 'auth.wrongCode',
  PASSCODE_FORMAT: 'auth.mustBeSixDigits',
  PASSCODE_NOT_CONFIGURED: 'auth.notConfigured',
  SESSION_EXPIRED: 'auth.sessionExpired',
  NETWORK: 'auth.networkError',
  UNKNOWN: 'auth.genericError',
}

const KNOWN_CODES = new Set<AuthErrorCode>([
  'INVALID_PASSCODE',
  'PASSCODE_FORMAT',
  'PASSCODE_NOT_CONFIGURED',
  'SESSION_EXPIRED',
  'NETWORK',
  'UNKNOWN',
])

export class AuthApiError extends Error {
  code: AuthErrorCode
  status: number

  constructor(message: string, code: AuthErrorCode, status = 0) {
    super(message)
    this.name = 'AuthApiError'
    this.code = code
    this.status = status
  }
}

export function stringFromUnknown(value: unknown): string {
  return typeof value === 'string' && value.trim() ? value.trim() : ''
}

/**
 * Nuxt/h3 `createError` JSON looks like:
 * `{ error: true, statusCode, statusMessage, message, data: { error, code } }`.
 * Prefer the nested string, never a boolean `error: true`.
 */
export function parseApiErrorMessage(data: unknown, status = 0): string {
  const body = (data || {}) as {
    error?: unknown
    statusMessage?: unknown
    message?: unknown
    data?: { error?: unknown }
  }
  return (
    stringFromUnknown(body.data?.error) ||
    stringFromUnknown(body.statusMessage) ||
    stringFromUnknown(body.message) ||
    stringFromUnknown(body.error) ||
    (status ? `HTTP ${status}` : '')
  )
}

export function parseApiErrorCode(
  data: unknown,
  status = 0,
  fallbackMessage = '',
): AuthErrorCode {
  const body = (data || {}) as { data?: { code?: unknown }; code?: unknown }
  const raw =
    stringFromUnknown(body.data?.code) || stringFromUnknown(body.code)
  if (KNOWN_CODES.has(raw as AuthErrorCode) && raw !== 'UNKNOWN') {
    return raw as AuthErrorCode
  }

  const msg = parseApiErrorMessage(data, status) || fallbackMessage
  if (/failed to fetch|networkerror|network error|load failed/i.test(msg)) {
    return 'NETWORK'
  }
  if (status === 503 || /not configured/i.test(msg)) {
    return 'PASSCODE_NOT_CONFIGURED'
  }
  if (/must be exactly 6|must be a 6-digit|6 digits|6 chữ số/i.test(msg)) {
    return 'PASSCODE_FORMAT'
  }
  if (/invalid passcode|incorrect passcode|incorrect code/i.test(msg)) {
    return 'INVALID_PASSCODE'
  }
  if (
    status === 401 ||
    /session expired|unauthorized|not unlocked|valid interview session/i.test(
      msg,
    )
  ) {
    return 'SESSION_EXPIRED'
  }
  return 'UNKNOWN'
}

export function toAuthApiError(err: unknown): AuthApiError {
  if (err instanceof AuthApiError) return err
  if (err instanceof TypeError) {
    return new AuthApiError(err.message || 'Network error', 'NETWORK', 0)
  }

  const fetchLike = err as {
    data?: unknown
    status?: number
    statusCode?: number
    statusMessage?: string
    message?: string
  }
  const status = Number(fetchLike?.statusCode || fetchLike?.status || 0) || 0
  const message =
    parseApiErrorMessage(fetchLike?.data, status) ||
    stringFromUnknown(fetchLike?.statusMessage) ||
    stringFromUnknown(fetchLike?.message) ||
    'Request failed'
  const code = parseApiErrorCode(fetchLike?.data, status, message)
  return new AuthApiError(message, code, status)
}

export function localizeAuthError(
  t: (key: string) => string,
  err: unknown,
): string {
  const mapped = err instanceof AuthApiError ? err : toAuthApiError(err)
  return t(AUTH_I18N_KEY[mapped.code] || AUTH_I18N_KEY.UNKNOWN)
}
