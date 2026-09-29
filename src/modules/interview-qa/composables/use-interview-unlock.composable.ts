import type {
  InterviewCategoryMeta,
  InterviewQuestion,
} from '@/modules/interview-qa/types/interview.type'
import {
  clearInterviewSession,
  fetchInterviewQuestions,
  isInterviewUnlockedStored,
  unlockInterview,
} from '@/modules/interview-qa/services/interview-auth.service'

export function useInterviewUnlock() {
  const unlocked = ref(false)
  const unlocking = ref(false)
  const loadingQuestions = ref(false)
  const unlockError = ref('')
  const loadError = ref('')
  const categories = ref<InterviewCategoryMeta[]>([])
  const questions = ref<InterviewQuestion[]>([])
  let booted = false

  async function loadQuestions() {
    loadingQuestions.value = true
    loadError.value = ''
    try {
      const data = await fetchInterviewQuestions()
      categories.value = data.categories
      questions.value = data.questions
      unlocked.value = true
    } catch (err: unknown) {
      unlocked.value = false
      categories.value = []
      questions.value = []
      clearInterviewSession()
      loadError.value =
        err instanceof Error ? err.message : 'Failed to load questions'
    } finally {
      loadingQuestions.value = false
    }
  }

  async function boot() {
    if (!import.meta.client || booted) return
    booted = true
    if (isInterviewUnlockedStored()) {
      await loadQuestions()
    }
  }

  async function submitPasscode(passcode: string) {
    unlockError.value = ''
    const trimmed = String(passcode || '').trim()
    if (!/^\d{6}$/.test(trimmed)) {
      unlockError.value = 'Passcode must be exactly 6 digits.'
      return false
    }
    unlocking.value = true
    try {
      await unlockInterview(trimmed)
      await loadQuestions()
      if (!unlocked.value) {
        unlockError.value = loadError.value || 'Unlock failed.'
        return false
      }
      return true
    } catch (err: unknown) {
      unlocked.value = false
      const message = err instanceof Error ? err.message : String(err)
      unlockError.value =
        message.includes('Invalid') || message.includes('401')
          ? 'Incorrect passcode.'
          : message || 'Could not verify passcode.'
      return false
    } finally {
      unlocking.value = false
    }
  }

  function lock() {
    clearInterviewSession()
    unlocked.value = false
    categories.value = []
    questions.value = []
    unlockError.value = ''
    loadError.value = ''
  }

  return {
    unlocked,
    unlocking,
    loadingQuestions,
    unlockError,
    loadError,
    categories,
    questions,
    boot,
    submitPasscode,
    lock,
    reload: loadQuestions,
  }
}
