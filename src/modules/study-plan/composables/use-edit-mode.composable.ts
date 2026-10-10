export function useEditMode() {
  const { t } = useI18n()
  const route = useRoute()
  const { loggedIn, ready } = useUserSession()

  const isEditMode = computed(() => Boolean(loggedIn.value))
  const modeLabel = computed(() =>
    isEditMode.value ? t('plan.modeEdit') : t('plan.modeView'),
  )

  function requestEditAccess() {
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
