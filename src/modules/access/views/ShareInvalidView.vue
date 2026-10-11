<script setup lang="ts">
import LocaleToggle from '@/modules/core/components/LocaleToggle/LocaleToggle.vue'
import ThemeToggle from '@/modules/core/components/ThemeToggle/ThemeToggle.vue'

const route = useRoute()
const reason = computed(() => {
  const raw = route.query.reason
  if (raw === 'revoked') return 'revoked'
  if (raw === 'max_uses') return 'max_uses'
  return 'expired'
})
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
        {{ $t('access.shareInvalidTitle') }}
      </h1>
      <p class="mt-3 text-sm leading-6 text-ink-muted">
        <template v-if="reason === 'revoked'">
          {{ $t('access.shareInvalidRevoked') }}
        </template>
        <template v-else-if="reason === 'max_uses'">
          {{ $t('access.shareInvalidMaxUses') }}
        </template>
        <template v-else>
          {{ $t('access.shareInvalidExpired') }}
        </template>
      </p>
      <div class="mt-6 flex flex-col gap-2 sm:flex-row">
        <NuxtLink
          to="/"
          class="inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-white"
        >
          {{ $t('auth.notAllowedBack') }}
        </NuxtLink>
        <NuxtLink
          to="/docs"
          class="inline-flex min-h-11 items-center justify-center rounded-lg border border-line px-4 text-sm font-semibold text-ink"
        >
          {{ $t('hub.docsTitle') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
