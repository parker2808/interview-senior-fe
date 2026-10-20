export type QaSessionView = {
  sessionPending: boolean
  sessionTimedOut: boolean
  unlocked: boolean
  questionsPending: boolean
  questionsTimedOut?: boolean
  questionCount: number
  loadError: string
}

export function qaIsContentLoading(view: QaSessionView): boolean {
  if (view.sessionTimedOut && !view.unlocked) return false
  if (view.questionsTimedOut && view.questionCount === 0) return false
  if (view.sessionPending && !view.unlocked && !view.sessionTimedOut) return true
  if (
    view.unlocked &&
    view.questionsPending &&
    view.questionCount === 0 &&
    !view.questionsTimedOut
  ) {
    return true
  }
  return false
}

export function qaIsGateOpen(view: QaSessionView): boolean {
  return !qaIsContentLoading(view) && !view.unlocked
}

export function qaShouldShowQuestions(view: QaSessionView): boolean {
  return view.unlocked && view.questionCount > 0 && !view.loadError
}

/** 401 means "ask for PIN again", not a dead-end retry that drops `?q=`. */
export function qaUnlockAfterQuestionsError(status: number): boolean {
  return Number(status || 0) !== 401
}

export const QA_SESSION_BOOT_TIMEOUT_MS = 8000
