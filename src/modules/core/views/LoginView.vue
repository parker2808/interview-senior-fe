<script setup lang="ts">
import GitHubSignInButton from '@/modules/core/components/GitHubSignInButton/GitHubSignInButton.vue'
import LocaleToggle from '@/modules/core/components/LocaleToggle/LocaleToggle.vue'
import ThemeToggle from '@/modules/core/components/ThemeToggle/ThemeToggle.vue'
import { sanitizeRedirectPath } from '@/modules/core/utils/safe-redirect.util'

const route = useRoute()
const { loggedIn } = useUserSession()

const redirect = computed(() =>
  sanitizeRedirectPath(route.query.redirect, '/'),
)

const oauthError = computed(() => route.query.error === 'oauth')

watch(
  loggedIn,
  (value) => {
    if (value) void navigateTo(redirect.value)
  },
  { immediate: true },
)
</script>

<template>
  <div class="mx-auto min-h-screen max-w-hub px-4 py-8 sm:px-6 sm:py-12">
    <div class="mb-8 flex items-center justify-end gap-2">
      <LocaleToggle />
      <ThemeToggle />
    </div>

    <div class="mx-auto max-w-md rounded-2xl border border-line bg-surface-elevated p-5 shadow-sm sm:p-8">
      <p class="text-sm font-semibold uppercase tracking-[0.14em] text-accent-ink">
        {{ $t('hub.brand') }}
      </p>
      <h1 class="mt-3 text-2xl font-bold tracking-tight text-ink">
        {{ $t('auth.loginTitle') }}
      </h1>
      <p class="mt-3 text-sm leading-6 text-ink-muted">
        {{ $t('auth.loginHint') }}
      </p>
      <p
        v-if="oauthError"
        class="mt-4 rounded-lg border border-line bg-accent-soft px-3 py-2 text-sm text-ink"
        role="alert"
      >
        {{ $t('auth.oauthError') }}
      </p>
      <div class="mt-6">
        <GitHubSignInButton :redirect="redirect" />
      </div>
      <NuxtLink
        :to="redirect === '/login' ? '/' : redirect"
        class="mt-4 inline-flex min-h-10 items-center text-sm font-semibold text-accent-ink"
      >
        ← {{ $t('auth.loginBack') }}
      </NuxtLink>
    </div>
  </div>
</template>
