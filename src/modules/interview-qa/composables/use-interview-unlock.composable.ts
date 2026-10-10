import { useAuthSession } from '@/modules/core/composables/use-auth-session.composable'
import { localizeAuthError } from '@/modules/core/utils/api-error.util'
import type {
  InterviewCategoryMeta,
  InterviewQuestion,
} from '@/modules/interview-qa/types/interview.type'
import {
  fetchInterviewQuestions,
  lockInterviewSession,
  unlockInterview,
} from '@/modules/interview-qa/services/interview-auth.service'

export function useInterviewUnlock() {
  const { t } = useI18n()
  const { refresh } = useAuthSession()

  const unlocked = useState('interview-unlocked', () => false)
  const unlocking = useState('interview-unlocking', () => false)
  const loadingQuestions = useState('interview-loading-questions', () => false)
  const unlockError = useState('interview-unlock-error', () => '')
  const loadError = useState('interview-load-error', () => '')
  const categories = useState<InterviewCategoryMeta[]>(
    'interview-categories',
    () => [],
  )
  const questions = useState<InterviewQuestion[]>(
    'interview-questions',
    () => [],
  )
  const sessionReady = useState('interview-session-ready', () => false)

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
      loadError.value = localizeAuthError(t, err)
    } finally {
      loadingQuestions.value = false
    }
  }

  useAsyncData(
    'interview-session-boot',
    async () => {
      const session = await refresh()
      sessionReady.value = true
      unlocked.value = session.interview
      return session
    },
    { server: true },
  )

  onMounted(() => {
    if (unlocked.value && !questions.value.length) {
      void loadQuestions()
    }
  })

  async function submitPasscode(passcode: string) {
    unlockError.value = ''
    loadError.value = ''
    const trimmed = String(passcode || '').trim()
    if (!/^\d{6}$/.test(trimmed)) {
      unlockError.value = t('auth.mustBeSixDigits')
      return false
    }
    unlocking.value = true
    try {
      await unlockInterview(trimmed)
      await refresh()
      await loadQuestions()
      if (!unlocked.value) {
        unlockError.value = loadError.value || t('auth.genericError')
        return false
      }
      return true
    } catch (err: unknown) {
      unlocked.value = false
      unlockError.value = localizeAuthError(t, err)
      return false
    } finally {
      unlocking.value = false
    }
  }

  async function lock() {
    await lockInterviewSession()
    await refresh()
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
    sessionReady,
    submitPasscode,
    lock,
    reload: loadQuestions,
  }
}
