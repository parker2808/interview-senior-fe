import { localizeAuthError } from '@/modules/core/utils/api-error.util'
import type {
  InterviewCategoryMeta,
  InterviewQuestion,
} from '@/modules/interview-qa/types/interview.type'
import { fetchInterviewQuestions } from '@/modules/interview-qa/services/interview-auth.service'

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
  const { loggedIn } = useUserSession()

  const loadError = useState('interview-load-error', () => '')

  const questionsAsync = await useAsyncData(
    'interview-questions',
    () => fetchInterviewQuestions(),
    {
      server: true,
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
    } catch (err: unknown) {
      loadError.value = localizeAuthError(t, err)
      throw err
    }
  }

  return {
    unlocked: computed(() => loggedIn.value),
    loadingQuestions,
    loadError,
    categories,
    questions,
    reload: loadQuestions,
  }
}
