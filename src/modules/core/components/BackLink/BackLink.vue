<script setup lang="ts">
withDefaults(
  defineProps<{
    to?: string
    label?: string
    /** Icon-only control for compact sticky bars */
    iconOnly?: boolean
  }>(),
  {
    iconOnly: false,
  },
)
</script>

<template>
  <NuxtLink
    :to="to || '/'"
    :aria-label="label || $t('docs.backHub')"
    :title="label || $t('docs.backHub')"
    class="inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-elevated text-sm font-semibold text-ink transition hover:border-accent hover:text-accent-ink"
    :class="iconOnly ? 'w-10' : 'gap-1 px-3'"
  >
    <svg
      class="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
    <span v-if="!iconOnly">{{ label || $t('docs.backHub') }}</span>
  </NuxtLink>
</template>
