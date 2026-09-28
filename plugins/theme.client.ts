import { useTheme } from '@/modules/core/composables/use-theme.composable'

export default defineNuxtPlugin(() => {
  const { init } = useTheme()
  init()
})
