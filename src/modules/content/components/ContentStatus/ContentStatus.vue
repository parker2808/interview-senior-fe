<script setup lang="ts">
defineProps<{
  kind: 'empty' | 'error'
  message: string
  retrying?: boolean
}>()

defineEmits<{
  retry: []
}>()
</script>

<template>
  <div
    class="rounded-2xl border border-line bg-surface-elevated px-4 py-10 text-center"
    :role="kind === 'error' ? 'alert' : 'status'"
  >
    <p class="text-sm text-ink-muted sm:text-base">{{ message }}</p>
    <button
      v-if="kind === 'error'"
      type="button"
      class="mt-4 inline-flex min-h-11 items-center rounded-lg border border-line bg-surface px-4 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent-ink disabled:opacity-60"
      :disabled="retrying"
      @click="$emit('retry')"
    >
      {{ retrying ? $t('common.retrying') : $t('common.retry') }}
    </button>
  </div>
</template>
