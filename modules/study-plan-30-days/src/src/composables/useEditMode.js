import { computed, ref } from 'vue'
import {
  clearEditSession,
  getEditToken,
  isEditUnlockedStored,
  setEditSession,
  unlockEditMode,
} from '../utils/progressApi.js'

const unlocked = ref(false)
const modalOpen = ref(false)
const unlocking = ref(false)
const unlockError = ref('')

let initialized = false

function initFromSession() {
  if (initialized) return
  initialized = true
  const ok = isEditUnlockedStored()
  unlocked.value = ok
  // First visit (this tab): ask for passcode unless already unlocked this session
  modalOpen.value = !ok
}

/**
 * Edit-mode gate: passcode → Netlify Function → session unlock + editToken.
 * View mode = default for visitors / cancel / wrong code.
 */
export function useEditMode() {
  initFromSession()

  const isEditMode = computed(() => unlocked.value)
  const modeLabel = computed(() =>
    unlocked.value ? 'Chế độ: Sửa' : 'Chế độ: Xem',
  )

  async function submitPasscode(passcode) {
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
    } catch (err) {
      unlocked.value = false
      unlockError.value =
        err?.message?.includes('Invalid') || err?.message?.includes('401')
          ? 'Mã không đúng. Bạn vẫn có thể xem.'
          : err?.message || 'Không xác thực được mã.'
      return false
    } finally {
      unlocking.value = false
    }
  }

  /** Stay in view mode (cancel / skip). */
  function enterViewMode() {
    unlocked.value = false
    unlockError.value = ''
    modalOpen.value = false
    // Keep any prior unlock cleared so refresh re-prompts
    clearEditSession()
  }

  function openUnlockModal() {
    unlockError.value = ''
    modalOpen.value = true
  }

  /** Re-lock this tab (optional). */
  function lockEditMode() {
    clearEditSession()
    unlocked.value = false
  }

  /**
   * Mark unlocked without API (tests only) — not used in UI.
   * Prefer submitPasscode.
   */
  function restoreUnlockedFromStorage() {
    if (isEditUnlockedStored()) {
      unlocked.value = true
      modalOpen.value = false
    }
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
    restoreUnlockedFromStorage,
    getEditToken,
    setEditSession,
  }
}
