<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    danger?: boolean
    busy?: boolean
  }>(),
  {
    confirmLabel: '',
    cancelLabel: '',
    danger: true,
    busy: false,
  },
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const { t } = useI18n()
const confirmText = computed(() => props.confirmLabel || t('access.confirm'))
const cancelText = computed(() => props.cancelLabel || t('access.cancel'))

function onKey(event: KeyboardEvent) {
  if (!props.open) return
  if (event.key === 'Escape') emit('cancel')
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="'confirm-title'"
      @click.self="emit('cancel')"
    >
      <div
        class="w-full max-w-md rounded-2xl border border-line bg-surface-elevated p-5 shadow-lg"
      >
        <h2 id="confirm-title" class="text-lg font-bold text-ink">
          {{ title }}
        </h2>
        <p class="mt-2 text-sm leading-6 text-ink-muted">
          {{ message }}
        </p>
        <div class="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            class="inline-flex min-h-11 items-center justify-center rounded-lg border border-line px-4 text-sm font-semibold text-ink"
            :disabled="busy"
            @click="emit('cancel')"
          >
            {{ cancelText }}
          </button>
          <button
            type="button"
            class="inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold text-white"
            :class="danger ? 'bg-red-700 hover:bg-red-800' : 'bg-accent hover:opacity-90'"
            :disabled="busy"
            @click="emit('confirm')"
          >
            {{ busy ? $t('access.saving') : confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
