import type { LocaleCode, Localized } from '@/modules/content/types'

export function pickLocale<T>(value: Localized<T> | undefined, lang: string): T | '' {
  if (!value) return '' as T | ''
  const locale: LocaleCode = lang === 'en' ? 'en' : 'vi'
  return value[locale] ?? value.vi ?? value.en ?? ('' as T | '')
}

export function contentLang(locale: string): LocaleCode {
  return locale === 'en' ? 'en' : 'vi'
}
