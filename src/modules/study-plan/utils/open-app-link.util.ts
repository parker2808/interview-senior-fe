/** App routes that should leave the current page intact (new tab). */

export function docsHref(lang: string, slug: string, hash?: string) {
  const suffix = hash ? `#${hash}` : ''
  return `/docs/${lang}/${slug}${suffix}`
}

export function interviewHref(id: string) {
  return `/interview?q=${encodeURIComponent(id)}`
}

export function openInNewTab(href: string) {
  if (!import.meta.client) return
  window.open(href, '_blank', 'noopener,noreferrer')
}
