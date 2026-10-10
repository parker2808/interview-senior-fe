export type TocItem = {
  id: string
  text: string
  level: number
}

export type LoadedMarkdown = {
  ok: boolean
  path: string
  text: string
}
