export type JdAction = 'review' | 'delete' | 'restore'
export type StartTokenProvider = (slug: string, action: JdAction) => Promise<string | null>

export const unconfiguredStartToken: StartTokenProvider = async () => null

export async function telegramHandoff(slug: string, action: JdAction = 'review', provider: StartTokenProvider = unconfiguredStartToken): Promise<{ url: string } | null> {
  const bot = process.env.JD_TELEGRAM_BOT_USERNAME
  if (!bot || !/^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(bot)) return null
  const token = await provider(slug, action)
  if (!token || !/^(?:jd_|jdd_|jdr_)[0-9a-f]{48}$/.test(token) ||
    (action === 'delete' && !token.startsWith('jdd_')) ||
    (action === 'restore' && !token.startsWith('jdr_')) ||
    (action === 'review' && !token.startsWith('jd_'))) return null
  return { url: `https://t.me/${bot}?start=${token}` }
}

export async function moduleActionHandoff(slug: string, action: 'delete' | 'restore', provider: StartTokenProvider = unconfiguredStartToken) {
  if (slug === 'fde' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null
  const deepLink = await telegramHandoff(slug, action, provider)
  const bot = process.env.JD_TELEGRAM_BOT_USERNAME
  return {
    command: `/${action === 'delete' ? 'jd_delete' : 'jd_restore'} ${slug}`,
    url: deepLink?.url || (bot && /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(bot) ? `https://t.me/${bot}` : null),
    deepLink: !!deepLink,
  }
}
