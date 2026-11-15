import { describe, expect, it } from 'vitest'
import { canShowJdAction } from '../src/modules/jd/utils/jd-actions.util'
import { moduleActionHandoff } from '../server/utils/jdTelegram'

describe('JD action visibility and fallback', () => {
  it('shows Delete only for edit-mode active non-FDE modules on cards and pages', async () => {
    const action = await moduleActionHandoff('fictional', 'delete')
    expect(canShowJdAction('fictional', 'active', false, action)).toBe(false)
    expect(canShowJdAction('fictional', 'active', true, action)).toBe(true)
    expect(canShowJdAction('fde', 'active', true, action)).toBe(false)
    expect(canShowJdAction('fictional', 'archived', true, action)).toBe(false)
    expect(canShowJdAction('fictional', 'active', true, null)).toBe(false)
  })

  it('shows Restore only for archived edit-mode modules, with the exact fallback command', async () => {
    const action = await moduleActionHandoff('older', 'restore')
    expect(action).toEqual({ command: '/jd_restore older', url: null, deepLink: false })
    expect(canShowJdAction('older', 'archived', true, action, 'restore')).toBe(true)
    expect(canShowJdAction('older', 'archived', false, action, 'restore')).toBe(false)
    expect(canShowJdAction('older', 'active', true, action, 'restore')).toBe(false)
  })
})
