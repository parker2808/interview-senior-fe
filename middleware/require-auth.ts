import { sanitizeRedirectPath } from '@/modules/core/utils/safe-redirect.util'

export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()
  if (loggedIn.value) return

  return navigateTo({
    path: '/login',
    query: { redirect: sanitizeRedirectPath(to.fullPath) },
  })
})
