import type {
  PracticeDesignPayload,
  PracticeIndex,
  PracticeStep,
} from '@/modules/content/types'

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

export function usePracticeDesign() {
  return useAsyncData('practice-design', async () => {
    try {
      return await $fetch<PracticeDesignPayload>('/api/practice/design')
    } catch (err: unknown) {
      const status = Number(
        (err as { statusCode?: number; status?: number })?.statusCode ||
          (err as { status?: number })?.status ||
          0,
      )
      if (status === 404) return null
      throw err
    }
  })
}

export function usePracticeDesignAvailable() {
  return useAsyncData('practice-design-available', async () => {
    try {
      const res = await $fetch<{ available: boolean }>('/api/practice/design/available')
      return Boolean(res?.available)
    } catch {
      return false
    }
  })
}
