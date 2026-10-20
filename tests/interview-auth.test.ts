import { describe, expect, it } from 'vitest'
import {
  INTERVIEW_TOKEN_STORAGE_KEY,
  clearInterviewToken,
  interviewAuthHeaders,
  isInterviewTokenStorageKey,
  memoryTokenStorage,
  readInterviewToken,
  writeInterviewToken,
} from '@/modules/core/utils/interview-token.util'
import { withTimeout } from '@/modules/core/utils/with-timeout.util'
import {
  QA_SESSION_BOOT_TIMEOUT_MS,
  qaIsContentLoading,
  qaIsGateOpen,
  qaShouldShowQuestions,
  qaUnlockAfterQuestionsError,
} from '@/modules/interview-qa/utils/qa-session-view.util'
import {
  interviewPathForQuestion,
  questionExists,
  requestedQuestionId,
  withQuestionQuery,
} from '@/modules/interview-qa/utils/qa-route.util'

describe('interview token storage (cross-tab)', () => {
  it('shares the token through localStorage-shaped storage, not per-tab memory', () => {
    const shared = memoryTokenStorage()
    writeInterviewToken('tok.abc', shared)
    expect(readInterviewToken(shared)).toBe('tok.abc')
    expect(interviewAuthHeaders('tok.abc')).toEqual({
      Authorization: 'Bearer tok.abc',
    })
    expect(isInterviewTokenStorageKey(INTERVIEW_TOKEN_STORAGE_KEY)).toBe(true)
    clearInterviewToken(shared)
    expect(readInterviewToken(shared)).toBe('')
    expect(interviewAuthHeaders('')).toEqual({})
  })
})

describe('Q&A gate vs skeleton vs deep link', () => {
  it('shows the PIN gate when session boot finishes locked, without waiting forever', () => {
    const locked = {
      sessionPending: false,
      sessionTimedOut: false,
      unlocked: false,
      questionsPending: false,
      questionCount: 0,
      loadError: '',
    }
    expect(qaIsContentLoading(locked)).toBe(false)
    expect(qaIsGateOpen(locked)).toBe(true)
    expect(qaShouldShowQuestions(locked)).toBe(false)
  })

  it('stops the skeleton after a boot timeout so the PIN can appear without a full reload', () => {
    const hung = {
      sessionPending: true,
      sessionTimedOut: true,
      unlocked: false,
      questionsPending: false,
      questionCount: 0,
      loadError: '',
    }
    expect(qaIsContentLoading(hung)).toBe(false)
    expect(qaIsGateOpen(hung)).toBe(true)
    expect(QA_SESSION_BOOT_TIMEOUT_MS).toBeGreaterThan(0)
  })

  it('stops the skeleton if questions hang after unlock so retry/PIN can appear', () => {
    const hungQuestions = {
      sessionPending: false,
      sessionTimedOut: false,
      unlocked: true,
      questionsPending: true,
      questionsTimedOut: true,
      questionCount: 0,
      loadError: 'Request failed',
    }
    expect(qaIsContentLoading(hungQuestions)).toBe(false)
    expect(qaIsGateOpen(hungQuestions)).toBe(false)
    expect(qaShouldShowQuestions(hungQuestions)).toBe(false)
  })

  it('treats a 401 as locked (PIN) instead of a dead-end retry that drops ?q=', () => {
    expect(qaUnlockAfterQuestionsError(401)).toBe(false)
    expect(qaUnlockAfterQuestionsError(500)).toBe(true)
    const expired = {
      sessionPending: false,
      sessionTimedOut: false,
      unlocked: false,
      questionsPending: false,
      questionCount: 0,
      loadError: 'Session expired. Enter the code again.',
    }
    expect(qaIsGateOpen(expired)).toBe(true)
    expect(qaShouldShowQuestions(expired)).toBe(false)
  })

  it('keeps ?q= across auth and retry, and focuses an existing id', () => {
    expect(requestedQuestionId({ query: 'monorepo-strategy' })).toBe(
      'monorepo-strategy',
    )
    expect(requestedQuestionId({ query: ['monorepo-strategy'] })).toBe(
      'monorepo-strategy',
    )
    expect(requestedQuestionId({ hash: '#legacy-id' })).toBe('legacy-id')
    expect(requestedQuestionId({ query: 'keep-me', hash: '#other' })).toBe(
      'keep-me',
    )
    expect(interviewPathForQuestion('monorepo-strategy')).toBe(
      '/interview?q=monorepo-strategy',
    )
    const query = withQuestionQuery({ tab: 'x' }, 'monorepo-strategy')
    expect(query.q).toBe('monorepo-strategy')
    expect(query.tab).toBe('x')
    const questions = [{ id: 'monorepo-strategy' }, { id: 'other' }]
    expect(questionExists(questions, 'monorepo-strategy')).toBe(true)
    expect(questionExists(questions, 'missing')).toBe(false)
  })

  it('resolves withTimeout to the fallback when the handler hangs', async () => {
    const hung = new Promise<string>(() => {})
    const value = await withTimeout(hung, 20, 'fallback')
    expect(value).toBe('fallback')
  })
})
