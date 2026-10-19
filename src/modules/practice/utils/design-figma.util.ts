import type { PracticeDesignFigma } from '@/modules/content/types/practice.type'

/** Present only when `figma.url` is an http(s) link. Otherwise the header hides the CTA. */
export function practiceDesignFigma(
  figma: PracticeDesignFigma | null | undefined,
): PracticeDesignFigma | null {
  if (!figma || typeof figma !== 'object') return null
  const url = String(figma.url || '').trim()
  if (!/^https?:\/\//i.test(url)) return null
  return { ...figma, url }
}
