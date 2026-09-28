import { useTheme } from '@/modules/core/composables/use-theme.composable'

export default defineNuxtPlugin((nuxtApp) => {
  const { init } = useTheme()
  // Apply after mount to avoid SSR/client hydration mismatches.
  nuxtApp.hook('app:mounted', () => {
    init()
  })
})
