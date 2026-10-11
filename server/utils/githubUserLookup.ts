import {
  isGitHubLogin,
  normalizeGitHubLogin,
} from '@/modules/access/utils/github-username.util'

export type ResolvedGitHubUser = {
  login: string
  id: number
  name: string
  avatarUrl: string
}

export async function lookupGitHubUser(rawLogin: string): Promise<ResolvedGitHubUser> {
  const login = normalizeGitHubLogin(rawLogin)
  if (!isGitHubLogin(login)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid GitHub username',
      data: { code: 'BAD_LOGIN' },
    })
  }

  try {
    const user = await $fetch<{
      login: string
      id: number
      name: string | null
      avatar_url: string
    }>(`https://api.github.com/users/${encodeURIComponent(login)}`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
    if (!user?.id || !user.login) {
      throw createError({
        statusCode: 404,
        statusMessage: 'GitHub user not found',
        data: { code: 'GITHUB_NOT_FOUND' },
      })
    }
    return {
      login: user.login,
      id: Number(user.id),
      name: user.name || user.login,
      avatarUrl: user.avatar_url,
    }
  } catch (err: unknown) {
    const status = Number((err as { statusCode?: number; status?: number }).statusCode
      || (err as { status?: number }).status || 0)
    if (status === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: 'GitHub user not found',
        data: { code: 'GITHUB_NOT_FOUND' },
      })
    }
    if (status === 400) throw err
    throw createError({
      statusCode: 503,
      statusMessage: 'GitHub lookup failed',
      data: { code: 'GITHUB_LOOKUP_FAILED' },
    })
  }
}
