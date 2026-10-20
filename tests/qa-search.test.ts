import { describe, expect, it } from 'vitest'
import {
  filterInterviewQuestions,
  groupInterviewQuestions,
} from '@/modules/interview-qa/utils/qa-search.util'
import { sampleQuestions } from './fixtures/search-content'

describe('interview Q&A keyword search', () => {
  it('is diacritic-insensitive in Vietnamese', () => {
    const hits = filterInterviewQuestions(sampleQuestions, {
      query: 'bat dong staff',
      lang: 'vi',
    })
    expect(hits.map((item) => item.id)).toEqual(['q-soft'])
  })

  it('requires every keyword and searches English answers', () => {
    const hits = filterInterviewQuestions(sampleQuestions, {
      query: 'user impact ego',
      lang: 'en',
    })
    expect(hits.map((item) => item.id)).toEqual(['q-soft'])
    expect(
      filterInterviewQuestions(sampleQuestions, {
        query: 'user bananas',
        lang: 'en',
      }),
    ).toEqual([])
  })

  it('indexes example and follow-up text, not only question/answer', () => {
    const fromExample = filterInterviewQuestions(sampleQuestions, {
      query: 'banner const throw',
      lang: 'en',
    })
    const fromFollowUp = filterInterviewQuestions(sampleQuestions, {
      query: 'var throw',
      lang: 'vi',
    })
    expect(fromExample.map((item) => item.id)).toEqual(['q-tdz'])
    expect(fromFollowUp.map((item) => item.id)).toEqual(['q-tdz'])
  })

  it('ranks question matches above body matches', () => {
    const hits = filterInterviewQuestions(sampleQuestions, {
      query: 'temporal dead',
      lang: 'en',
    })
    expect(hits[0]?.id).toBe('q-tdz')
  })

  it('keeps category filtering and original order when the query is empty', () => {
    const all = filterInterviewQuestions(sampleQuestions, {
      query: '',
      lang: 'en',
    })
    expect(all.map((item) => item.id)).toEqual(['q-tdz', 'q-soft'])
    const tech = filterInterviewQuestions(sampleQuestions, {
      query: 'temporal',
      category: 'technical',
      lang: 'en',
    })
    expect(tech.map((item) => item.id)).toEqual(['q-tdz'])
    expect(
      filterInterviewQuestions(sampleQuestions, {
        query: 'temporal',
        category: 'soft',
        lang: 'en',
      }),
    ).toEqual([])
  })

  it('groups questions in category order for the two-pane list', () => {
    const groups = groupInterviewQuestions(sampleQuestions, [
      {
        id: 'soft',
        title: { en: 'Soft skills', vi: 'Kỹ năng mềm' },
        blurb: { en: '', vi: '' },
      },
      {
        id: 'technical',
        title: { en: 'Technical', vi: 'Kỹ thuật' },
        blurb: { en: '', vi: '' },
      },
    ])
    expect(groups.map((group) => group.category.id)).toEqual(['soft', 'technical'])
    expect(groups[0]?.questions.map((item) => item.id)).toEqual(['q-soft'])
    expect(groups[1]?.questions.map((item) => item.id)).toEqual(['q-tdz'])
  })
})
