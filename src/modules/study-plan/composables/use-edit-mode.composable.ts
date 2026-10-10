import { useAuthSession } from '@/modules/core/composables/use-auth-session.composable'
import { clearAuthSession } from '@/modules/core/services/auth-session.service'
import { localizeAuthError } from '@/modules/core/utils/api-error.util'
import { unlockEditMode } from '@/modules/study-plan/services/progress.service'

export function useEditMode() {
  const { t } = useI18n()
  const { refresh } = useAuthSession()

  const unlocked = useState('edit-unlocked', () => false)
  const modalOpen = useState('edit-modal-open', () => false)
  const unlocking = useState('edit-unlocking', () => false)
  const unlockError = useState('edit-unlock-error', () => '')
  const dismissed = useState('edit-modal-dismissed', () => false)
  const booted = useState('edit-session-booted', () => false)

  async function applySession(editValid: boolean) {
    unlocked.value = editValid
    if (editValid) {
      modalOpen.value = false
      return
    }
    if (!dismissed.value) modalOpen.value = true
  }

  const boot = useAsyncData(
    'edit-session-boot',
    async () => {
      const session = await refresh()
      await applySession(session.edit)
      booted.value = true
      return session
    },
    { server: true },
  )

  async function submitPasscode(passcode: string) {
    unlockError.value = ''
    const trimmed = String(passcode || '').trim()
    if (!/^\d{6}$/.test(trimmed)) {
      unlockError.value = t('auth.mustBeSixDigits')
      return false
    }
    unlocking.value = true
    try {
      await unlockEditMode(trimmed)
      const session = await refresh()
      await applySession(session.edit)
      if (!session.edit) {
        unlockError.value = t('auth.genericError')
        return false
      }
      dismissed.value = false
      return true
    } catch (err: unknown) {
      unlocked.value = false
      unlockError.value = localizeAuthError(t, err)
      return false
    } finally {
      unlocking.value = false
    }
  }

  async function enterViewMode() {
    unlocked.value = false
    unlockError.value = ''
    modalOpen.value = false
    dismissed.value = true
    await clearAuthSession('edit').catch(() => {})
    await refresh()
  }

  function openUnlockModal() {
    unlockError.value = ''
    modalOpen.value = true
  }

  async function lockEditMode() {
    await enterViewMode()
  }

  return {
    isEditMode: computed(() => unlocked.value),
    modeLabel: computed(() =>
      unlocked.value ? t('plan.modeEdit') : t('plan.modeView'),
    ),
    modalOpen,
    unlocking,
    unlockError,
    sessionPending: computed(() => boot.pending.value && !booted.value),
    submitPasscode,
    enterViewMode,
    openUnlockModal,
    lockEditMode,
  }
}
