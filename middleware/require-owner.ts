export default defineNuxtRouteMiddleware(async () => {
  const { user, loggedIn } = useUserSession()
  if (loggedIn.value && user.value?.role === 'owner') return

  try {
    const session = await $fetch<{ role?: string | null }>('/api/auth/session', {
      credentials: 'include',
      cache: 'no-store',
    })
    if (session.role === 'owner') return
  } catch {
    /* hide the module */
  }

  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
})
