export type HubModuleCard = {
  id: string
  to: string
  titleKey: string
  descKey: string
  ctaKey: string
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
    id: 'interview-qa',
    to: '/interview',
    titleKey: 'hub.interviewTitle',
    descKey: 'hub.interviewDesc',
    ctaKey: 'hub.interviewCta',
  },
]
