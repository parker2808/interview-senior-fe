import { readContentJsonOptional } from './contentStore'
import type { JdModule, JdRow } from '@/modules/jd/types/entities/jd-module.type'

type ModuleIndex = { version: 2; modules: JdRow[] }

const fallback: JdRow = {
  slug: 'fde', source: 'fde/fde-prep.json', organizationAlias: 'FDE',
  role: { en: 'FDE interview preparation', vi: 'Ôn tập phỏng vấn FDE' },
  level: { en: 'Study pack', vi: 'Bộ ôn tập' }, date: '2026-11-15',
  tags: ['fde'], status: 'active',
  title: { en: 'FDE study pack', vi: 'Bộ ôn tập FDE' },
  summary: { en: 'Bilingual interview study collection.', vi: 'Bộ tài liệu ôn phỏng vấn bằng tiếng Anh và tiếng Việt.' },
}

export async function activeModules(): Promise<JdRow[]> {
  return (await moduleRows()).filter((row) => row.status === 'active')
}

async function moduleRows(): Promise<JdRow[]> {
  const index = await readContentJsonOptional<ModuleIndex>('modules/index.json')
  const rows = index?.version === 2 && Array.isArray(index.modules)
    ? index.modules : (await readContentJsonOptional('fde/fde-prep.json') ? [fallback] : [])
  return rows.filter((row) =>
    (row.slug === 'fde' ? row.status === 'active' && row.source === 'fde/fde-prep.json' :
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.slug) && row.source === `modules/${row.slug}.json`))
}

export async function archivedModules(): Promise<JdRow[]> {
  return (await moduleRows()).filter((row) => row.status === 'archived' && row.slug !== 'fde' &&
    typeof row.purgeAfter === 'string' && Number.isFinite(Date.parse(row.purgeAfter)))
}

export async function activeModule(slug: string): Promise<JdModule | null> {
  const row = (await activeModules()).find((item) => item.slug === slug)
  if (!row) return null
  return readContentJsonOptional<JdModule>(row.source)
}
