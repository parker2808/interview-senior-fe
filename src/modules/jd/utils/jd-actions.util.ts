import type { JdActionHandoff } from '@/modules/jd/types/entities/jd-module.type'

export function canShowJdAction(slug: string, status: 'active' | 'archived', edit: boolean, action?: JdActionHandoff | null, requested: 'delete' | 'restore' = 'delete'): boolean {
  return edit && slug !== 'fde' && !!action &&
    (requested === 'delete' ? status === 'active' : status === 'archived') &&
    action.command === `/${requested === 'delete' ? 'jd_delete' : 'jd_restore'} ${slug}`
}
