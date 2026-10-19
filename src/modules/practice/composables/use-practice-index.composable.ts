import type { PracticeIndex, PracticeStep } from '@/modules/content/types'

export function usePracticeIndex() {
  return useAsyncData('practice-index', () =>
    $fetch<PracticeIndex>('/api/practice'),
  )
}

export function usePracticeSteps() {
  return useAsyncData('practice-steps', () =>
    $fetch<PracticeStep[]>('/api/practice/steps'),
  )
}

export function usePracticeStep(id: Ref<string> | ComputedRef<string>) {
  return useAsyncData(
    () => `practice-step-${id.value}`,
    () => $fetch<PracticeStep>(`/api/practice/step/${encodeURIComponent(id.value)}`),
    { watch: [id] },
  )
}

export function usePracticeAvailable() {
  return useAsyncData('practice-available', async () => {
    try {
      await $fetch('/api/practice')
      return true
    } catch {
      return false
    }
  })
}

export function practiceStepHref(id: string) {
  return `/practice/step/${encodeURIComponent(id)}`
}
