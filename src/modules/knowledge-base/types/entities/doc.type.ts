export type TocItem = {
  id: string
  text: string
  level: 2 | 3
}

export type LoadedMarkdown = {
  ok: boolean
  path: string
  text: string
}
