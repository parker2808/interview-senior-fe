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

const MARK =
  '<mark class="rounded bg-accent-soft px-0.5 text-accent-ink">'

function wrapRange(text: string, start: number, end: number): string {
  return (
    escapeHtml(text.slice(0, start)) +
    MARK +
    escapeHtml(text.slice(start, end)) +
    '</mark>' +
    escapeHtml(text.slice(end))
  )
}

export function highlightSearchText(text: string, query: string): string {
  const value = String(text || '')
  const range = findFoldRange(value, query)
  if (!range) return escapeHtml(value)
  return wrapRange(value, range.start, range.end)
}

export function highlightSnippet(
  text: string,
  query: string,
  max = 180,
): string {
  const flat = String(text || '').replace(/\s+/g, ' ').trim()
  if (!flat) return ''
  const range = findFoldRange(flat, query)
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
  const inner = findFoldRange(windowed, query)
  const body = inner
    ? wrapRange(windowed, inner.start, inner.end)
    : escapeHtml(windowed)
  return prefix + body + suffix
}
