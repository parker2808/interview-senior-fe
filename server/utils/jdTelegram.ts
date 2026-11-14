export type StartTokenProvider = (slug: string) => Promise<string | null>

export const unconfiguredStartToken: StartTokenProvider = async () => null

export async function telegramHandoff(slug: string, provider: StartTokenProvider = unconfiguredStartToken): Promise<{ url: string } | null> {
  const bot = process.env.JD_TELEGRAM_BOT_USERNAME
  if (!bot || !/^[a-zA-Z0-9_]{5,32}$/.test(bot)) return null
  const token = await provider(slug)
  if (!token || !/^[a-zA-Z0-9_-]{1,64}$/.test(token)) return null
  return { url: `https://t.me/${bot}?start=${token}` }
}
