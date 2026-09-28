export type DocGroupId = 'core' | 'vue' | 'practices' | 'infra' | 'pro'

export type DocTopic = {
  slug: string
  title: { vi: string; en: string }
  group: DocGroupId
}

export type DocGroup = {
  id: DocGroupId
  order: number
  topics: DocTopic[]
}

export const DOC_CATALOG: DocGroup[] = [
  {
    id: 'core',
    order: 1,
    topics: [
      { slug: 'javascript', title: { vi: 'JavaScript', en: 'JavaScript' }, group: 'core' },
      { slug: 'typescript', title: { vi: 'TypeScript', en: 'TypeScript' }, group: 'core' },
      { slug: 'css-layout', title: { vi: 'CSS Layout', en: 'CSS Layout' }, group: 'core' },
      { slug: 'web-apis', title: { vi: 'Browser & Web APIs', en: 'Browser & Web APIs' }, group: 'core' },
    ],
  },
  {
    id: 'vue',
    order: 2,
    topics: [
      { slug: 'vue3', title: { vi: 'Vue 3', en: 'Vue 3' }, group: 'vue' },
      { slug: 'nuxt', title: { vi: 'Nuxt.js', en: 'Nuxt.js' }, group: 'vue' },
      {
        slug: 'state-management',
        title: { vi: 'State Management', en: 'State Management' },
        group: 'vue',
      },
    ],
  },
  {
    id: 'practices',
    order: 3,
    topics: [
      { slug: 'testing', title: { vi: 'Testing', en: 'Testing' }, group: 'practices' },
      { slug: 'performance', title: { vi: 'Performance', en: 'Performance' }, group: 'practices' },
      { slug: 'security', title: { vi: 'Security', en: 'Security' }, group: 'practices' },
      {
        slug: 'accessibility',
        title: { vi: 'Accessibility', en: 'Accessibility' },
        group: 'practices',
      },
    ],
  },
  {
    id: 'infra',
    order: 4,
    topics: [
      { slug: 'build-tools', title: { vi: 'Build Tools', en: 'Build Tools' }, group: 'infra' },
      { slug: 'networking', title: { vi: 'Networking', en: 'Networking' }, group: 'infra' },
      { slug: 'devops', title: { vi: 'DevOps', en: 'DevOps' }, group: 'infra' },
    ],
  },
  {
    id: 'pro',
    order: 5,
    topics: [
      { slug: 'architecture', title: { vi: 'Architecture', en: 'Architecture' }, group: 'pro' },
      { slug: 'system-design', title: { vi: 'System Design', en: 'System Design' }, group: 'pro' },
      { slug: 'leadership', title: { vi: 'Leadership', en: 'Leadership' }, group: 'pro' },
      {
        slug: 'practical-questions',
        title: { vi: 'Practical Questions', en: 'Practical Questions' },
        group: 'pro',
      },
      { slug: 'monitoring', title: { vi: 'Monitoring', en: 'Monitoring' }, group: 'pro' },
    ],
  },
]

export const FLAT_TOPICS: DocTopic[] = DOC_CATALOG.flatMap((g) => g.topics)

export const DEFAULT_DOC_SLUG = FLAT_TOPICS[0]?.slug ?? 'javascript'

export function getTopic(slug: string): DocTopic | undefined {
  return FLAT_TOPICS.find((t) => t.slug === slug)
}

export function getTopicIndex(slug: string): number {
  return FLAT_TOPICS.findIndex((t) => t.slug === slug)
}

export function getAdjacentTopics(slug: string) {
  const i = getTopicIndex(slug)
  return {
    prev: i > 0 ? FLAT_TOPICS[i - 1] : null,
    next: i >= 0 && i < FLAT_TOPICS.length - 1 ? FLAT_TOPICS[i + 1] : null,
  }
}
