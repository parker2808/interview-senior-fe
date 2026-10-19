import type { KnowledgeDoc } from '@/modules/content/types'
import type { InterviewQuestion } from '@/modules/interview-qa/types/interview.type'

export const sampleKnowledgeDoc: KnowledgeDoc = {
  kind: 'knowledge-doc',
  slug: 'javascript',
  title: { en: 'JavaScript runtime', vi: 'JavaScript runtime' },
  summary: {
    en: 'Hoisting, event loop, and performance for senior interviews.',
    vi: 'Hoisting, event loop và hiệu năng cho phỏng vấn senior.',
  },
  category: 'core',
  order: 1,
  tags: ['js', 'runtime'],
  sections: [
    {
      id: { en: 'hoisting', vi: 'hoisting' },
      title: { en: 'Hoisting', vi: 'Hoisting' },
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: { en: 'Hoisting and TDZ', vi: 'Hoisting và TDZ' },
          id: { en: 'hoisting-tdz', vi: 'hoisting-tdz' },
        },
        {
          type: 'paragraph',
          text: {
            en: 'Function declarations hoist; `let` stays in the temporal dead zone.',
            vi: 'Function declaration được hoist; `let` nằm trong temporal dead zone.',
          },
        },
        {
          type: 'senior-answer',
          label: {
            en: 'How a senior answers',
            vi: 'Cách senior trả lời',
          },
          text: {
            en: 'I explain temporal dead zone before quoting spec trivia.',
            vi: 'Tôi giải thích temporal dead zone trước khi trích spec.',
          },
          example: {
            en: 'Walk through a const banner that throws before init.',
            vi: 'Kể case const banner throw trước khi init.',
          },
          followUps: [
            {
              en: 'What changes with var versus let on a banner flag?',
              vi: 'Khác gì giữa var và let trên cờ banner?',
            },
          ],
        },
        {
          type: 'example',
          text: {
            en: 'A unique fixture token: eventloopmicrotask',
            vi: 'Token fixture duy nhất: vonglapmicrotask',
          },
        },
        {
          type: 'follow-ups',
          items: [
            {
              en: 'How would you measure long tasks on CI?',
              vi: 'Bạn đo long task trên CI thế nào?',
            },
          ],
        },
        {
          type: 'key-takeaways',
          items: [
            {
              en: 'Prefer const, then let; avoid var.',
              vi: 'Ưu tiên const, rồi let; tránh var.',
            },
          ],
        },
      ],
    },
    {
      id: { en: 'perf', vi: 'perf' },
      title: { en: 'Performance', vi: 'Hiệu năng' },
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: {
            en: 'Build performance on CI',
            vi: 'Hiệu năng build trên CI',
          },
          id: { en: 'build-perf', vi: 'hieu-nang-build' },
        },
        {
          type: 'paragraph',
          text: {
            en: 'Cache node_modules and optimize webpack splitChunks.',
            vi: 'Cache node_modules và tối ưu webpack splitChunks.',
          },
        },
      ],
    },
  ],
}

export const sampleQuestions: InterviewQuestion[] = [
  {
    id: 'q-tdz',
    category: 'technical',
    tags: ['javascript', 'hoisting'],
    question: {
      en: 'What is the temporal dead zone?',
      vi: 'Temporal dead zone là gì?',
    },
    answer: {
      en: 'The window where let/const exist but cannot be read.',
      vi: 'Khoảng thời gian let/const đã tồn tại nhưng chưa đọc được.',
    },
    example: {
      en: 'Logging a banner const before the line that initializes it throws.',
      vi: 'Log const banner trước dòng khởi tạo sẽ throw.',
    },
    followUps: [
      {
        en: 'Does var exhibit the same throw?',
        vi: 'Var có throw giống vậy không?',
      },
    ],
  },
  {
    id: 'q-soft',
    category: 'soft',
    tags: ['leadership'],
    question: {
      en: 'How do you disagree with a staff engineer?',
      vi: 'Bạn bất đồng với staff engineer thế nào?',
    },
    answer: {
      en: 'Lead with user impact, not ego.',
      vi: 'Bắt đầu từ tác động người dùng, không phải cái tôi.',
    },
  },
]
