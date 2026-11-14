import type { JdModule } from '@/modules/jd/types/entities/jd-module.type'

export type JdTab = 'jd' | 'concepts' | 'interview' | 'cv' | 'cheat' | 'test'

export function tabEntries(module: JdModule, tab: JdTab) {
  if (tab === 'cv' || tab === 'test') return []
  const sections = tab === 'interview' ? ['interview', 'ask', 'rescue', 'pitch'] : [tab]
  return module.entries.filter((entry) => sections.includes(entry.section))
}

export function liveKbHref(ref: { slug: string; sectionId: string; state: string }, lang: 'en' | 'vi'): string | null {
  if (ref.state !== 'live' || !/^[a-z0-9-]+$/.test(ref.slug) || !/^[a-z0-9-]+$/.test(ref.sectionId)) return null
  return `/docs/${lang}/${ref.slug}#${ref.sectionId}`
}
