import { describe, expect, it } from 'vitest'
import { shouldClearFdeSearch } from '../src/modules/fde/utils/fde-keyboard.util'

const idle = {
  key: 'Escape', defaultPrevented: false, isComposing: false,
  searchFocused: false, query: '', dialogOpen: false,
}

describe('FDE Escape behavior', () => {
  it('leaves an idle page alone', () => {
    expect(shouldClearFdeSearch(idle)).toBe(false)
  })

  it('handles a focused search even when empty', () => {
    expect(shouldClearFdeSearch({ ...idle, searchFocused: true })).toBe(true)
  })

  it('clears a non-empty query even when search is not focused', () => {
    expect(shouldClearFdeSearch({ ...idle, query: 'monday' })).toBe(true)
  })

  it.each([
    { dialogOpen: true }, { defaultPrevented: true }, { isComposing: true }, { key: 'Enter' },
  ])('does not steal dialog, handled, composing or non-Escape keys: %j', (overrides) => {
    expect(shouldClearFdeSearch({ ...idle, searchFocused: true, query: 'monday', ...overrides })).toBe(false)
  })
})
