/** Fold Vietnamese (and other) diacritics so "hieu nang" matches "hiệu năng". */
export function foldSearchText(value: string): string {
  return String(value || '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Split a query into unique folded keywords. Drops 1-char tokens when a longer keyword exists. */
export function splitSearchKeywords(query: string): string[] {
  const folded = foldSearchText(query)
  if (!folded) return []
  const parts = folded.split(/\s+/).filter(Boolean)
  const long = parts.filter((part) => part.length >= 2)
  const tokens = long.length ? long : parts.filter((part) => part.length >= 2)
  const seen = new Set<string>()
  const out: string[] = []
  for (const token of tokens) {
    if (seen.has(token)) continue
    seen.add(token)
    out.push(token)
  }
  return out
}

export function matchesAllKeywords(foldedHay: string, keywords: string[]): boolean {
  if (!foldedHay || !keywords.length) return false
  return keywords.every((keyword) => foldedHay.includes(keyword))
}

function qualityForToken(hay: string, token: string): number {
  if (!hay || !token) return 0
  if (hay === token) return 100
  if (hay.startsWith(token)) return 80
  const idx = hay.indexOf(token)
  if (idx >= 0) return 50 - Math.min(idx, 30)
  const words = hay.split(/[\s-]+/).filter(Boolean)
  for (const word of words) {
    if (word.startsWith(token)) return 40
  }
  if (token.length >= 3) {
    for (const word of words) {
      if (word.includes(token)) return 20
    }
  }
  return 0
}

/** Quality of how `keywords` sit in an already-folded haystack. 0 if none hit. */
export function scoreKeywordHay(foldedHay: string, keywords: string[]): number {
  if (!foldedHay || !keywords.length) return 0
  if (keywords.length === 1) return qualityForToken(foldedHay, keywords[0])

  const phrase = keywords.join(' ')
  const phraseHit = qualityForToken(foldedHay, phrase)
  if (phraseHit) return phraseHit + 12

  const parts = keywords.map((keyword) => qualityForToken(foldedHay, keyword))
  const present = parts.filter((score) => score > 0)
  if (!present.length) return 0
  return Math.round(present.reduce((sum, score) => sum + score, 0) / keywords.length)
}

export function escapeHtml(value: string): string {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function foldWithMap(text: string): { folded: string; map: number[] } {
  const map: number[] = []
  let folded = ''
  let pendingSpace = false

  for (let i = 0; i < text.length; i += 1) {
    const raw = text[i]
    if (/[\u0300-\u036f]/.test(raw)) continue

    const piece = raw
      .toLowerCase()
      .replace(/đ/g, 'd')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    for (const ch of piece) {
      if (/[a-z0-9-]/.test(ch)) {
        if (pendingSpace && folded.length) {
          folded += ' '
          map.push(i)
        }
        pendingSpace = false
        folded += ch
        map.push(i)
      } else {
        pendingSpace = true
      }
    }
  }

  return { folded, map }
}

export function findFoldRange(
  text: string,
  query: string,
): { start: number; end: number } | null {
  const needle = foldSearchText(query)
  if (!needle) return null
  const { folded, map } = foldWithMap(text)
  const idx = folded.indexOf(needle)
  if (idx < 0 || !map.length) return null
  const start = map[idx]
  const last = map[Math.min(idx + needle.length - 1, map.length - 1)]
  let end = last + 1
  while (end < text.length && /[\u0300-\u036f]/.test(text[end])) end += 1
  return { start, end }
}

type FoldRange = { start: number; end: number }

function collectKeywordRanges(text: string, query: string): FoldRange[] {
  const keywords = splitSearchKeywords(query)
  const needles = keywords.length ? keywords : [foldSearchText(query)].filter(Boolean)
  const ranges: FoldRange[] = []
  for (const needle of needles) {
    const range = findFoldRange(text, needle)
    if (range) ranges.push(range)
  }
  if (!ranges.length) {
    const whole = findFoldRange(text, query)
    if (whole) ranges.push(whole)
  }
  ranges.sort((a, b) => a.start - b.start || a.end - b.end)
  const merged: FoldRange[] = []
  for (const range of ranges) {
    const last = merged[merged.length - 1]
    if (last && range.start <= last.end) {
      last.end = Math.max(last.end, range.end)
    } else {
      merged.push({ ...range })
    }
  }
  return merged
}

const MARK =
  '<mark class="rounded bg-accent-soft px-0.5 text-accent-ink">'

function wrapRanges(text: string, ranges: FoldRange[]): string {
  if (!ranges.length) return escapeHtml(text)
  let html = ''
  let cursor = 0
  for (const range of ranges) {
    if (range.start > cursor) html += escapeHtml(text.slice(cursor, range.start))
    html += MARK + escapeHtml(text.slice(range.start, range.end)) + '</mark>'
    cursor = range.end
  }
  if (cursor < text.length) html += escapeHtml(text.slice(cursor))
  return html
}

export function highlightSearchText(text: string, query: string): string {
  const value = String(text || '')
  return wrapRanges(value, collectKeywordRanges(value, query))
}

export function highlightSnippet(
  text: string,
  query: string,
  max = 180,
): string {
  const flat = String(text || '').replace(/\s+/g, ' ').trim()
  if (!flat) return ''
  const keywords = splitSearchKeywords(query)
  const phrase = keywords.join(' ')
  const range =
    (phrase ? findFoldRange(flat, phrase) : null) ||
    collectKeywordRanges(flat, query)[0] ||
    findFoldRange(flat, query)
  if (!range) {
    const cut = flat.length <= max ? flat : `${flat.slice(0, max - 1).trim()}…`
    return escapeHtml(cut)
  }

  const matchLen = range.end - range.start
  const pad = Math.max(24, Math.floor((max - matchLen) / 2))
  let start = Math.max(0, range.start - pad)
  let end = Math.min(flat.length, range.end + pad)
  if (start > 0) {
    const space = flat.lastIndexOf(' ', start)
    if (space >= start - 24) start = space + 1
  }
  if (end < flat.length) {
    const space = flat.indexOf(' ', end)
    if (space !== -1 && space <= end + 24) end = space
  }

  const prefix = start > 0 ? '…' : ''
  const suffix = end < flat.length ? '…' : ''
  const windowed = flat.slice(start, end)
  return prefix + wrapRanges(windowed, collectKeywordRanges(windowed, query)) + suffix
}
