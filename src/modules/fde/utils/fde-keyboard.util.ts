type EscapeContext = {
  key: string
  defaultPrevented: boolean
  isComposing: boolean
  searchFocused: boolean
  query: string
  dialogOpen: boolean
}

export function shouldClearFdeSearch(context: EscapeContext): boolean {
  return context.key === 'Escape' && !context.defaultPrevented && !context.isComposing &&
    !context.dialogOpen && (context.searchFocused || context.query.length > 0)
}
