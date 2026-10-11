<script setup lang="ts">
import { useAuthSession } from '@/modules/core/composables/use-auth-session.composable'
import { sanitizeRedirectPath } from '@/modules/core/utils/safe-redirect.util'

const route = useRoute()
const { loggedIn, user, share, isOwner, logout } = useAuthSession()
const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const hasSession = computed(() => loggedIn.value || Boolean(share.value))

const loginTo = computed(() => ({
  path: '/login',
  query: { redirect: sanitizeRedirectPath(route.fullPath) },
}))

async function onLogout() {
  open.value = false
  await logout()
  if (route.path.startsWith('/interview') || route.path.startsWith('/admin')) {
    await navigateTo({
      path: '/login',
      query: { redirect: route.path.startsWith('/admin') ? '/' : '/interview' },
    })
  }
}

function onDocClick(event: MouseEvent) {
  if (!rootRef.value?.contains(event.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <div ref="rootRef" class="relative flex shrink-0 items-center">
    <NuxtLink
      v-if="!hasSession"
      :to="loginTo"
      class="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-line bg-surface-elevated px-2.5 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent-ink sm:px-3"
    >
      <svg
        class="h-4 w-4"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.21.7.82.58C20.56 22.3 24 17.8 24 12.5 24 5.87 18.63.5 12 .5z"
        />
      </svg>
      <span class="hidden sm:inline">{{ $t('auth.signIn') }}</span>
    </NuxtLink>

    <template v-else>
      <button
        type="button"
        class="inline-flex h-10 items-center gap-1.5 rounded-lg border border-line bg-surface-elevated px-2 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent-ink"
        :aria-expanded="open"
        :aria-haspopup="true"
        @click="open = !open"
      >
        <img
          v-if="user?.avatarUrl"
          :src="user.avatarUrl"
          :alt="user.login"
          class="h-7 w-7 rounded-full border border-line"
          width="28"
          height="28"
        />
        <span
          v-else
          class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-xs text-accent-ink"
        >
          {{ share ? 'S' : '?' }}
        </span>
        <span class="hidden max-w-[7rem] truncate sm:inline">
          {{ user?.login || $t('access.sharedView') }}
        </span>
        <svg class="h-4 w-4 text-ink-muted" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <div
        v-if="open"
        class="absolute right-0 top-full z-40 mt-2 w-56 rounded-xl border border-line bg-surface-elevated p-2 shadow-lg"
        role="menu"
      >
        <p class="px-2 py-1.5 text-xs text-ink-muted">
          <template v-if="user">
            {{ $t('auth.signedInAs', { login: user.login }) }}
          </template>
          <template v-else>
            {{ $t('access.sharedView') }}
          </template>
        </p>
        <NuxtLink
          v-if="isOwner"
          to="/admin/access"
          class="flex min-h-10 items-center rounded-lg px-2 text-sm font-semibold text-ink hover:bg-accent-soft"
          role="menuitem"
          @click="open = false"
        >
          {{ $t('access.menuAccess') }}
        </NuxtLink>
        <button
          type="button"
          class="flex min-h-10 w-full items-center rounded-lg px-2 text-left text-sm font-semibold text-ink hover:bg-accent-soft"
          role="menuitem"
          @click="onLogout"
        >
          {{ $t('auth.signOut') }}
        </button>
      </div>
    </template>
  </div>
</template>
