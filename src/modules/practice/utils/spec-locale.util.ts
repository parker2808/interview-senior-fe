export function localeSpecPath(specPath: string, locale: string): string {
  const rel = String(specPath || '').replace(/^\/+/, '')
  if (!rel) return rel
  if (locale !== 'vi') return rel
  if (/\.vi\.md$/i.test(rel)) return rel
  return rel.replace(/\.md$/i, '.vi.md')
}

export function pickSpecMarkdown(
  specs: { en?: string | null; vi?: string | null },
  locale: string,
): { markdown: string; usedLocale: 'en' | 'vi' } {
  if (locale === 'vi' && String(specs.vi || '').trim()) {
    return { markdown: String(specs.vi), usedLocale: 'vi' }
  }
  return { markdown: String(specs.en || ''), usedLocale: 'en' }
}
