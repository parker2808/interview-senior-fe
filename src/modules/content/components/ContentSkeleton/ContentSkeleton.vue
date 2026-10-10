<script setup lang="ts">
const props = defineProps<{
  variant:
    | 'doc'
    | 'sidebar'
    | 'plan-home'
    | 'plan-day'
    | 'plan-resource'
    | 'qa'
}>()

const label = computed(() => {
  switch (props.variant) {
    case 'sidebar':
      return 'docs'
    case 'doc':
      return 'docs'
    case 'qa':
      return 'interview'
    default:
      return 'plan'
  }
})
</script>

<template>
  <div
    class="content-skeleton"
    role="status"
    aria-live="polite"
    aria-busy="true"
    :aria-label="$t(`${label}.loading`)"
  >
    <template v-if="variant === 'sidebar'">
      <div v-for="group in 4" :key="group" class="space-y-2">
        <div class="skeleton-bar h-3 w-24" />
        <div v-for="row in 3" :key="row" class="skeleton-bar h-9 w-full" />
      </div>
    </template>

    <template v-else-if="variant === 'doc'">
      <div class="skeleton-bar h-8 w-2/3 sm:h-10" />
      <div class="mt-6 space-y-3">
        <div class="skeleton-bar h-4 w-full" />
        <div class="skeleton-bar h-4 w-11/12" />
        <div class="skeleton-bar h-4 w-10/12" />
        <div class="skeleton-bar h-4 w-full" />
        <div class="skeleton-bar mt-6 h-24 w-full" />
        <div class="skeleton-bar h-4 w-9/12" />
        <div class="skeleton-bar h-4 w-full" />
      </div>
    </template>

    <template v-else-if="variant === 'plan-home'">
      <div class="skeleton-bar h-4 w-40" />
      <div class="mt-4 skeleton-bar h-16 w-full" />
      <div class="mt-6 space-y-4">
        <div
          v-for="card in 3"
          :key="card"
          class="rounded-2xl border border-line p-4 sm:p-5"
        >
          <div class="skeleton-bar h-4 w-28" />
          <div class="mt-3 skeleton-bar h-6 w-1/2" />
          <div class="mt-4 space-y-2">
            <div class="skeleton-bar h-16 w-full" />
            <div class="skeleton-bar h-16 w-full" />
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="variant === 'plan-day'">
      <div class="rounded-2xl border border-line bg-surface-elevated p-4 sm:p-6">
        <div class="skeleton-bar h-4 w-24" />
        <div class="mt-3 skeleton-bar h-8 w-2/3" />
        <div class="mt-6 flex gap-2">
          <div class="skeleton-bar h-10 w-20" />
          <div class="skeleton-bar h-10 w-20" />
        </div>
        <div class="mt-6 space-y-3">
          <div class="skeleton-bar h-4 w-full" />
          <div class="skeleton-bar h-4 w-10/12" />
          <div class="skeleton-bar h-20 w-full" />
          <div class="skeleton-bar h-4 w-8/12" />
        </div>
      </div>
    </template>

    <template v-else-if="variant === 'plan-resource'">
      <div class="rounded-2xl border border-line bg-surface-elevated p-4 sm:p-6">
        <div class="skeleton-bar h-3 w-28" />
        <div class="mt-3 skeleton-bar h-7 w-1/2" />
        <div class="mt-6 space-y-3">
          <div class="skeleton-bar h-4 w-full" />
          <div class="skeleton-bar h-4 w-11/12" />
          <div class="skeleton-bar h-4 w-9/12" />
          <div class="skeleton-bar h-24 w-full" />
        </div>
      </div>
    </template>

    <template v-else>
      <div class="space-y-3">
        <div class="skeleton-bar h-4 w-40" />
        <div class="skeleton-bar h-8 w-2/3" />
        <div class="skeleton-bar h-4 w-full" />
      </div>
      <div class="mt-6 overflow-hidden rounded-2xl border border-line">
        <div
          v-for="row in 6"
          :key="row"
          class="border-b border-line px-3 py-4 last:border-b-0 sm:px-5"
        >
          <div class="skeleton-bar h-5 w-10/12" />
          <div class="mt-2 skeleton-bar h-3 w-1/3" />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.content-skeleton {
  min-width: 0;
}

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
