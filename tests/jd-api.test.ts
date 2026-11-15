import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { issueEditToken } from '../server/utils/editAuth'

const sample = { version: 2, requirements: [], entries: [{ id: 'answer', section: 'concepts', title: { en: 'Focus', vi: 'Focus' }, shortAnswer: { en: 'Focus', vi: 'Focus' }, detail: { en: 'Focus', vi: 'Focus' }, keyPoints: [], tags: [] }] }
const base = { organizationAlias: 'Example (fictional)', role: { en: 'Frontend', vi: 'Giao diện' }, level: { en: 'Sample', vi: 'Mẫu' }, date: '2026-11-15', tags: ['fixture'], title: { en: 'Focus', vi: 'Focus' }, summary: { en: 'Sample', vi: 'Mẫu' } }
const rows = [
  { ...base, slug: 'fde', source: 'fde/fde-prep.json', status: 'active' },
  { ...base, slug: 'fictional', source: 'modules/fictional.json', status: 'active' },
  { ...base, slug: 'older', source: 'modules/older.json', status: 'archived', archivedAt: '2026-11-15T00:00:00.000Z', purgeAfter: '2026-11-22T00:00:00.000Z' },
]
vi.mock('../server/utils/contentStore', () => ({ readContentJsonOptional: vi.fn(async (path: string) => path === 'modules/index.json' ? { version: 2, modules: rows } : path === 'fde/fde-prep.json' || path === 'modules/fictional.json' || path === 'modules/older.json' ? sample : null) }))

type Event = { slug?: string; status?: string; q?: string; cookie?: string; headers: Record<string, string> }
let list: (event: Event) => Promise<unknown>
let detail: (event: Event) => Promise<unknown>
let search: (event: Event) => Promise<unknown>
const visitor = (): Event => ({ headers: {} })
const owner = (): Event => ({ headers: {}, cookie: issueEditToken().token })

beforeAll(async () => {
  vi.stubGlobal('defineEventHandler', (handler: unknown) => handler)
  vi.stubGlobal('setHeader', () => {})
  vi.stubGlobal('getQuery', (event: Event) => ({ status: event.status, q: event.q }))
  vi.stubGlobal('getRouterParam', (event: Event) => event.slug)
  vi.stubGlobal('getCookie', (event: Event) => event.cookie)
  vi.stubGlobal('getHeader', (event: Event, name: string) => event.headers[name])
  vi.stubGlobal('createError', ({ statusCode }: { statusCode: number }) => Object.assign(new Error('Missing'), { statusCode }))
  list = (await import('../server/api/jd/index.get')).default as typeof list
  detail = (await import('../server/api/jd/[slug].get')).default as typeof detail
  search = (await import('../server/api/jd/search.get')).default as typeof search
})
beforeEach(() => { delete process.env.JD_TELEGRAM_BOT_USERNAME })

describe('JD read API', () => {
  it('hides archived rows and action data from visitors, retains FDE', async () => {
    expect((await list(visitor()) as typeof rows).map((row) => row.slug)).toEqual(['fde', 'fictional'])
    expect(await list({ ...visitor(), status: 'archived' })).toEqual([])
    expect(JSON.stringify(await list(visitor()))).not.toContain('jd_delete')
    await expect(async () => detail({ ...visitor(), slug: 'older' })).rejects.toMatchObject({ statusCode: 404 })
    expect(JSON.stringify(await search({ ...visitor(), q: 'Focus' }))).not.toContain('older')
    expect(JSON.stringify(await search({ ...visitor(), q: 'Focus' }))).toContain('fde')
  })

  it('returns an edit-only restore deadline and action, never an FDE action', async () => {
    const archived = await list({ ...owner(), status: 'archived' }) as Array<{ slug: string; purgeAfter: string; action: { command: string } }>
    expect(archived).toHaveLength(1)
    expect(archived[0]).toMatchObject({ slug: 'older', purgeAfter: '2026-11-22T00:00:00.000Z', action: { command: '/jd_restore older' } })
    expect(JSON.stringify(await list(owner()))).not.toContain('/jd_delete fde')
    expect(await detail({ ...owner(), slug: 'fictional' })).toMatchObject({ action: { command: '/jd_delete fictional' } })
    expect(await detail({ ...owner(), slug: 'fde' })).not.toHaveProperty('action')
  })
})
