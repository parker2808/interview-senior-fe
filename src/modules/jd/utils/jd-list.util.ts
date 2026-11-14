import { foldSearchText } from '@/modules/knowledge-base/utils/search-text.util'
import type { JdRow } from '@/modules/jd/types/entities/jd-module.type'

export function filterModules(rows: JdRow[], filters: { query: string; status: 'active' | 'archived'; tag: string; date: string }): JdRow[] {
  const query = foldSearchText(filters.query)
  return rows.filter((row) => row.status === filters.status &&
    (filters.tag === 'all' || row.tags.includes(filters.tag)) &&
    (filters.date !== 'recent' || Date.parse(row.date) >= Date.now() - 30 * 86400000) &&
    foldSearchText([row.organizationAlias, row.role.en, row.role.vi, row.title.en, row.title.vi, ...row.tags].join(' ')).includes(query))
}

export function groupModules(rows: JdRow[], key: 'organizationAlias' | 'role', lang: 'en' | 'vi'): [string, JdRow[]][] {
  const groups = new Map<string, JdRow[]>()
  for (const row of rows) {
    const label = key === 'role' ? row.role[lang] : row.organizationAlias
    groups.set(label, [...(groups.get(label) || []), row])
  }
  return [...groups.entries()].sort(([first], [second]) => first.localeCompare(second))
}
