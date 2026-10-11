<template>
  <div
    class="space-y-3"
    role="status"
    aria-live="polite"
    aria-busy="true"
    :aria-label="$t('access.loading')"
  >
    <div class="skeleton-bar h-10 w-full" />
    <div
      v-for="row in 5"
      :key="row"
      class="rounded-xl border border-line bg-surface-elevated p-4"
    >
      <div class="skeleton-bar h-4 w-1/3" />
      <div class="mt-3 skeleton-bar h-4 w-2/3" />
      <div class="mt-3 skeleton-bar h-8 w-24" />
    </div>
  </div>
</template>

<style scoped>
.skeleton-bar {
  border-radius: 0.5rem;
  background: var(--line);
  animation: skeleton-pulse 1.2s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0%,
  100% {
    opacity: 0.55;
  }
  50% {
    opacity: 1;
  }
}
</style>
