import { sanitizeRedirectPath } from '@/modules/core/utils/safe-redirect.util'

export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, session } = useUserSession()
  if (loggedIn.value || session.value.share) return

  return navigateTo({
    path: '/login',
    query: { redirect: sanitizeRedirectPath(to.fullPath) },
  })
})
