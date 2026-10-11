const GITHUB_LOGIN = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/

export function normalizeGitHubLogin(value: unknown) {
  return String(value || '').trim().replace(/^@/, '')
}

export function isGitHubLogin(value: unknown): value is string {
  const login = normalizeGitHubLogin(value)
  return GITHUB_LOGIN.test(login)
}
