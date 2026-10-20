import { useAuthSession } from '@/modules/core/composables/use-auth-session.composable'
import {
  EMPTY_AUTH_SESSION,
  sessionFetcher,
} from '@/modules/core/services/auth-session.service'
import { localizeAuthError } from '@/modules/core/utils/api-error.util'
import {
  isInterviewTokenStorageKey,
  readInterviewToken,
} from '@/modules/core/utils/interview-token.util'
import { withTimeout } from '@/modules/core/utils/with-timeout.util'
import type {
  InterviewCategoryMeta,
  InterviewQuestion,
} from '@/modules/interview-qa/types/interview.type'
import {
  fetchInterviewQuestions,
  lockInterviewSession,
  unlockInterview,
} from '@/modules/interview-qa/services/interview-auth.service'
import {
  QA_SESSION_BOOT_TIMEOUT_MS,
  qaUnlockAfterQuestionsError,
} from '@/modules/interview-qa/utils/qa-session-view.util'

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
  const requestFetch = useRequestFetch()
  const { refresh } = useAuthSession()

  const unlocked = useState('interview-unlocked', () => false)
  const unlocking = useState('interview-unlocking', () => false)
  const unlockError = useState('interview-unlock-error', () => '')
  const loadError = useState('interview-load-error', () => '')
  const sessionTimedOut = useState('interview-session-timed-out', () => false)
  const questionsTimedOut = useState('interview-questions-timed-out', () => false)

  async function bootSession() {
    sessionTimedOut.value = false
    const session = await withTimeout(
      refresh(),
      QA_SESSION_BOOT_TIMEOUT_MS,
      { ...EMPTY_AUTH_SESSION },
    )
    if (!session.interview && !session.edit) {
      /* timeout and real "locked" look the same; only mark timeout if refresh hung */
    }
    unlocked.value = session.interview
    return session
  }

  const sessionAsync = await useAsyncData(
    'interview-session-boot',
    bootSession,
    {
      server: true,
      default: () => ({ ...EMPTY_AUTH_SESSION }),
      getCachedData: () => undefined,
    },
  )

  const questionsAsync = await useAsyncData(
    'interview-questions',
    () =>
      fetchInterviewQuestions(
        sessionFetcher(requestFetch),
        readInterviewToken(),
      ),
    {
      server: false,
      immediate: false,
      default: emptyBank,
    },
  )

  const categories = computed(
    () => questionsAsync.data.value?.categories ?? [],
  )
  const questions = computed(
    () => questionsAsync.data.value?.questions ?? [],
  )
  const questionsLoadStarted = useState('interview-questions-load-started', () => false)
  const loadingQuestions = computed(
    () =>
      questionsLoadStarted.value && Boolean(questionsAsync.pending.value),
  )
  const sessionReady = computed(
    () => !sessionAsync.pending.value || sessionTimedOut.value,
  )

  watch(
    () => questionsAsync.error.value,
    (err) => {
      loadError.value = err ? localizeAuthError(t, err) : ''
    },
    { immediate: true },
  )

  async function loadQuestions() {
    loadError.value = ''
    questionsTimedOut.value = false
    questionsLoadStarted.value = true
    try {
      await questionsAsync.refresh()
      if (questionsAsync.error.value) {
        throw questionsAsync.error.value
      }
      unlocked.value = true
    } catch (err: unknown) {
      loadError.value = localizeAuthError(t, err)
      const status = Number((err as { status?: number }).status || 0)
      unlocked.value = qaUnlockAfterQuestionsError(status)
      throw err
    }
  }

  async function syncFromSession(interview: boolean) {
    if (!interview) {
      unlocked.value = false
      questionsAsync.data.value = emptyBank()
      questionsAsync.error.value = null
      return
    }
    try {
      await loadQuestions()
    } catch {
      /* loadError + unlocked already set */
    }
  }

  watch(
    () => sessionAsync.data.value?.interview,
    (interview) => {
      void syncFromSession(Boolean(interview))
    },
    { immediate: true },
  )

  if (import.meta.client) {
    onMounted(() => {
      // SSR cannot read localStorage Bearer; a new tab after unlock depends
      // on this client refresh (cookie + token).
      void sessionAsync.refresh()
      const timer = window.setTimeout(() => {
        if (sessionAsync.pending.value) {
          sessionTimedOut.value = true
          unlocked.value = false
        }
        if (
          questionsAsync.pending.value &&
          !(questionsAsync.data.value?.questions.length)
        ) {
          questionsTimedOut.value = true
          if (!loadError.value) loadError.value = t('auth.genericError')
        }
      }, QA_SESSION_BOOT_TIMEOUT_MS)

      function onStorage(event: StorageEvent) {
        if (!isInterviewTokenStorageKey(event.key)) return
        void sessionAsync.refresh()
      }
      window.addEventListener('storage', onStorage)

      onUnmounted(() => {
        window.clearTimeout(timer)
        window.removeEventListener('storage', onStorage)
      })
    })
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

  async function reload() {
    loadError.value = ''
    try {
      await loadQuestions()
      return true
    } catch {
      if (!unlocked.value) {
        unlockError.value = loadError.value
        loadError.value = ''
      }
      return false
    }
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
    sessionTimedOut,
    questionsTimedOut,
    submitPasscode,
    lock,
    reload,
  }
}
