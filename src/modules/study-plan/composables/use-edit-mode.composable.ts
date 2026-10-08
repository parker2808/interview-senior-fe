import {
  clearEditSession,
  isEditUnlockedStored,
  unlockEditMode,
} from '@/modules/study-plan/services/progress.service'

const unlocked = ref(false)
const modalOpen = ref(false)
const unlocking = ref(false)
const unlockError = ref('')
let initialized = false

function initFromSession() {
  if (!import.meta.client || initialized) return
  initialized = true
  const ok = isEditUnlockedStored()
  unlocked.value = ok
  modalOpen.value = !ok
}

export function useEditMode() {
  initFromSession()
  const { t } = useI18n()

  const isEditMode = computed(() => unlocked.value)
  const modeLabel = computed(() =>
    unlocked.value ? t('plan.modeEdit') : t('plan.modeView'),
  )

  async function submitPasscode(passcode: string) {
    unlockError.value = ''
    const trimmed = String(passcode || '').trim()
    if (!/^\d{6}$/.test(trimmed)) {
      unlockError.value = 'Mã phải đúng 6 chữ số.'
      return false
    }
    unlocking.value = true
    try {
      await unlockEditMode(trimmed)
      unlocked.value = true
      modalOpen.value = false
      return true
    } catch (err: unknown) {
      unlocked.value = false
      const message = err instanceof Error ? err.message : String(err)
      unlockError.value =
        message.includes('Invalid') || message.includes('401')
          ? 'Mã không đúng. Bạn vẫn có thể xem.'
          : message || 'Không xác thực được mã.'
      return false
    } finally {
      unlocking.value = false
    }
  }

  function enterViewMode() {
    unlocked.value = false
    unlockError.value = ''
    modalOpen.value = false
    clearEditSession()
  }

  function openUnlockModal() {
    unlockError.value = ''
    modalOpen.value = true
  }

  function lockEditMode() {
    clearEditSession()
    unlocked.value = false
  }

  return {
    isEditMode,
    modeLabel,
    modalOpen,
    unlocking,
    unlockError,
    submitPasscode,
    enterViewMode,
    openUnlockModal,
    lockEditMode,
  }
}
