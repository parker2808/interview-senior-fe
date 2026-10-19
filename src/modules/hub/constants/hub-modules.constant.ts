export type HubModuleCard = {
  id: string
  to: string
  titleKey: string
  descKey: string
  ctaKey: string
  /** When set, the hub card is hidden until that content tree exists. */
  requires?: 'practice'
}

export const HUB_MODULES: HubModuleCard[] = [
  {
    id: 'knowledge-base',
    to: '/docs',
    titleKey: 'hub.docsTitle',
    descKey: 'hub.docsDesc',
    ctaKey: 'hub.docsCta',
  },
  {
    id: 'study-plan',
    to: '/plan',
    titleKey: 'hub.planTitle',
    descKey: 'hub.planDesc',
    ctaKey: 'hub.planCta',
  },
  {
    id: 'practice',
    to: '/practice',
    titleKey: 'hub.practiceTitle',
    descKey: 'hub.practiceDesc',
    ctaKey: 'hub.practiceCta',
    requires: 'practice',
  },
  {
    id: 'interview-qa',
    to: '/interview',
    titleKey: 'hub.interviewTitle',
    descKey: 'hub.interviewDesc',
    ctaKey: 'hub.interviewCta',
  },
]
