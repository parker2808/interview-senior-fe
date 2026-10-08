export function stripPlanLocalePrefix(path: string) {
  return String(path || '')
    .replace(/^\.?\/+/, '')
    .replace(/^\/+/, '')
    .replace(/^(vi|en)\//, '')
}

const LAB_HEADING_KEYS: Record<string, string> = {
  'done when': 'plan.labDoneWhen',
  'tiêu chí xong': 'plan.labDoneWhen',
  'stretch goal': 'plan.labStretch',
  'mục tiêu thêm': 'plan.labStretch',
  'hints': 'plan.labHints',
  'gợi ý': 'plan.labHints',
  'suggested commit': 'plan.labCommit',
  'commit gợi ý': 'plan.labCommit',
  'commit message': 'plan.labCommit',
}

export function applyPlanHeadingI18n(
  html: string,
  t: (key: string) => string,
) {
  return html.replace(
    /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi,
    (full, inner: string) => {
      const text = inner
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase()
      const key = LAB_HEADING_KEYS[text]
      return key ? `<h2>${t(key)}</h2>` : full
    },
  )
}
