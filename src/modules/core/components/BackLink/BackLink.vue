<script setup lang="ts">
defineProps<{
  to?: string
  label?: string
}>()
</script>

<template>
  <NuxtLink
    :to="to || '/'"
    class="inline-flex min-h-10 items-center gap-1 rounded-lg border border-line bg-surface-elevated px-3 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent-ink"
  >
    ← {{ label || $t('docs.backHub') }}
  </NuxtLink>
</template>
