const RECENT_KEY = 'sf-docs-recent-v1'
const MAX_RECENT = 8

export type RecentDoc = {
  slug: string
  lang: string
  at: number
}

export function readRecentDocs(): RecentDoc[] {
  if (!import.meta.client) return []
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function pushRecentDoc(slug: string, lang: string) {
  if (!import.meta.client) return
  const next: RecentDoc[] = [
    { slug, lang, at: Date.now() },
    ...readRecentDocs().filter((r) => !(r.slug === slug && r.lang === lang)),
  ].slice(0, MAX_RECENT)
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
}
