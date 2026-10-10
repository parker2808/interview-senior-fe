export type GitHubIdentity = {
  login?: string | null
  id?: number | string | null
}

export type GitHubAllowlist = {
  logins: string[]
  ids: string[]
}

export type AllowlistEnv = {
  AUTH_ALLOWED_GITHUB_LOGINS?: string
  AUTH_ALLOWED_GITHUB_IDS?: string
}

const DEFAULT_ALLOWED_LOGINS = 'parker2808'

function splitList(value: string | undefined) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function parseGitHubAllowlist(
  env: AllowlistEnv = process.env,
): GitHubAllowlist {
  const rawLogins = env.AUTH_ALLOWED_GITHUB_LOGINS
  const logins = splitList(
    rawLogins == null || rawLogins.trim() === ''
      ? DEFAULT_ALLOWED_LOGINS
      : rawLogins,
  ).map((login) => login.toLowerCase())

  return {
    logins,
    ids: splitList(env.AUTH_ALLOWED_GITHUB_IDS),
  }
}

export function isAllowedGitHubUser(
  user: GitHubIdentity | null | undefined,
  env: AllowlistEnv = process.env,
): boolean {
  const login = String(user?.login || '')
    .trim()
    .toLowerCase()
  const id = String(user?.id ?? '').trim()
  if (!login) return false

  const { logins, ids } = parseGitHubAllowlist(env)
  const loginOk = logins.includes(login)
  if (!loginOk) return false
  if (ids.length === 0) return true
  return Boolean(id) && ids.includes(id)
}
