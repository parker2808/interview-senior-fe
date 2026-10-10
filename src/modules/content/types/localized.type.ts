export type LocaleCode = 'en' | 'vi'

export type Localized<T = string> = Record<LocaleCode, T>
