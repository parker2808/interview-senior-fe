export type FdeLocalized = { en: string; vi: string }

export type FdeEntry = {
  id: string
  section: 'jd' | 'concepts' | 'interview' | 'pitch' | 'rescue' | 'ask' | 'cheat'
  jdRequirement: string
  tags: string[]
  title: FdeLocalized
  shortAnswer: FdeLocalized
  keyPoints: FdeLocalized[]
  detail: FdeLocalized
}

export type FdeContent = {
  version: number
  requirements: { id: string; title: FdeLocalized }[]
  entries: FdeEntry[]
}
