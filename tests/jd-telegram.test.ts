import { afterEach, describe, expect, it, vi } from 'vitest'
import { moduleActionHandoff, telegramHandoff } from '../server/utils/jdTelegram'

afterEach(() => { delete process.env.JD_TELEGRAM_BOT_USERNAME })

describe('JD bot handoff', () => {
  it('uses only a matching opaque action token, never a module slug or job-review token', async () => {
    process.env.JD_TELEGRAM_BOT_USERNAME = 'Example_bot'
    for (const [action, prefix] of [['delete', 'jdd_'], ['restore', 'jdr_']] as const) {
      const token = `${prefix}${'a'.repeat(48)}`
      const provider = vi.fn(async () => token)
      expect(await telegramHandoff('fictional-module', action, provider)).toEqual({ url: `https://t.me/Example_bot?start=${token}` })
      expect(provider).toHaveBeenCalledWith('fictional-module', action)
      expect(JSON.stringify(await moduleActionHandoff('fictional-module', action, provider))).not.toContain('fictional-module?')
      expect(await telegramHandoff('fictional-module', action, async () => `jd_${'a'.repeat(48)}`)).toBeNull()
      expect(await telegramHandoff('fictional-module', action, async () => 'fictional-module')).toBeNull()
    }
  })

  it('refuses invalid bot names and never puts the slug in a fallback URL', async () => {
    process.env.JD_TELEGRAM_BOT_USERNAME = 'bad/name'
    expect(await telegramHandoff('fictional-module', 'delete', async () => `jdd_${'a'.repeat(48)}`)).toBeNull()
    expect(await moduleActionHandoff('fictional-module', 'delete')).toEqual({ command: '/jd_delete fictional-module', url: null, deepLink: false })
    process.env.JD_TELEGRAM_BOT_USERNAME = 'Example_bot'
    expect(await moduleActionHandoff('fictional-module', 'restore')).toEqual({ command: '/jd_restore fictional-module', url: 'https://t.me/Example_bot', deepLink: false })
    expect(await moduleActionHandoff('fde', 'delete')).toBeNull()
  })
})
