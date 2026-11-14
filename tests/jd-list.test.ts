import { describe, expect, it } from 'vitest'
import { filterModules, groupModules } from '@/modules/jd/utils/jd-list.util'
import type { JdRow } from '@/modules/jd/types/entities/jd-module.type'

const row: JdRow = { slug: 'fictional', source: 'modules/fictional.json', status: 'active', organizationAlias: 'Example', role: { en: 'Frontend', vi: 'Giao diện' }, level: { en: 'Sample', vi: 'Mẫu' }, date: '2026-11-15', tags: ['fixture'], title: { en: 'Keyboard', vi: 'Bàn phím' }, summary: { en: 'Example', vi: 'Ví dụ' } }

describe('JD dashboard selection', () => {
  it('hides archived rows and matches missing Vietnamese accents', () => {
    const rows = [row, { ...row, slug: 'old', status: 'archived' as const }]
    expect(filterModules(rows, { query: 'ban phim', status: 'active', tag: 'all', date: 'all' })).toEqual([row])
    expect(groupModules(rows, 'organizationAlias', 'en')[0]?.[1]).toHaveLength(2)
  })
})
