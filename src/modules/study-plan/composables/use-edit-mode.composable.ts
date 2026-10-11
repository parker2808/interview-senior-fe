export function useEditMode() {
  const { t } = useI18n()
  const route = useRoute()
  const { loggedIn, user, ready } = useUserSession()

  const isEditMode = computed(() => user.value?.role === 'owner')
  const modeLabel = computed(() =>
    isEditMode.value ? t('plan.modeEdit') : t('plan.modeView'),
  )

  function requestEditAccess() {
    if (loggedIn.value) return
    return navigateTo({
      path: '/login',
      query: { redirect: route.fullPath },
    })
  }

  return {
    isEditMode,
    modeLabel,
    sessionPending: computed(() => !ready.value),
    requestEditAccess,
  }
}
