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

type InterviewBankPayload = {
  ok: true
  categories: InterviewCategoryMeta[]
  questions: InterviewQuestion[]
}

const emptyBank = (): InterviewBankPayload => ({
  ok: true,
  categories: [],
  questions: [],
})

export async function useInterviewUnlock() {
  const { t } = useI18n()
  const { refresh } = useAuthSession()

  const unlocked = useState('interview-unlocked', () => false)
  const unlocking = useState('interview-unlocking', () => false)
  const unlockError = useState('interview-unlock-error', () => '')
  const loadError = useState('interview-load-error', () => '')

  const sessionAsync = await useAsyncData(
    'interview-session-boot',
    async () => {
      const session = await refresh()
      unlocked.value = session.interview
      return session
    },
    { server: true },
  )

  const questionsAsync = await useAsyncData(
    'interview-questions',
    () => fetchInterviewQuestions(),
    {
      server: true,
      immediate: Boolean(sessionAsync.data.value?.interview),
      default: emptyBank,
    },
  )

  const categories = computed(
    () => questionsAsync.data.value?.categories ?? [],
  )
  const questions = computed(
    () => questionsAsync.data.value?.questions ?? [],
  )
  const loadingQuestions = computed(() => Boolean(questionsAsync.pending.value))
  const sessionReady = computed(() => !sessionAsync.pending.value)

  watch(
    () => questionsAsync.error.value,
    (err) => {
      loadError.value = err ? localizeAuthError(t, err) : ''
    },
    { immediate: true },
  )

  async function loadQuestions() {
    loadError.value = ''
    try {
      await questionsAsync.refresh()
      if (questionsAsync.error.value) {
        throw questionsAsync.error.value
      }
      unlocked.value = true
    } catch (err: unknown) {
      loadError.value = localizeAuthError(t, err)
      const status = Number((err as { status?: number }).status || 0)
      if (status === 401) unlocked.value = false
      else unlocked.value = true
      throw err
    }
  }

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
    questionsAsync.data.value = emptyBank()
    questionsAsync.error.value = null
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
