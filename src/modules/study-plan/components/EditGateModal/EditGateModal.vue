<script setup lang="ts">
const props = defineProps<{
  open: boolean
  unlocking: boolean
  error: string
}>()

const emit = defineEmits<{
  submit: [passcode: string]
  skip: []
}>()

const digits = ref('')

watch(
  () => props.open,
  (open) => {
    if (open) digits.value = ''
    if (import.meta.client) {
      document.documentElement.classList.toggle('overflow-hidden', open)
      document.body.classList.toggle('overflow-hidden', open)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.documentElement.classList.remove('overflow-hidden')
    document.body.classList.remove('overflow-hidden')
  }
})

function onInput(e: Event) {
  digits.value = String((e.target as HTMLInputElement).value || '')
    .replace(/\D/g, '')
    .slice(0, 6)
}

function onSubmit(e: Event) {
  e.preventDefault()
  if (props.unlocking) return
  emit('submit', digits.value)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-gate-title"
    >
      <form
        class="w-full max-w-md rounded-2xl border border-line bg-surface-elevated p-5 shadow-xl sm:p-6"
        @submit="onSubmit"
      >
        <h2 id="edit-gate-title" class="text-xl font-bold">Mã chỉnh sửa</h2>
        <p class="mt-2 text-sm text-ink-muted">
          Nhập mã 6 số để mở <strong>chế độ Sửa</strong>. Bỏ qua để dùng
          <strong>chế độ Xem</strong>.
        </p>
        <label class="mt-4 block">
          <span class="mb-1 block text-sm font-medium">Mã 6 số</span>
          <input
            type="password"
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength="6"
            class="min-h-12 w-full rounded-lg border border-line px-3 text-lg tracking-widest"
            placeholder="••••••"
            :value="digits"
            :disabled="unlocking"
            autofocus
            @input="onInput"
          />
        </label>
        <p v-if="error" class="mt-2 text-sm text-red-700" role="alert">
          {{ error }}
        </p>
        <div class="mt-5 flex flex-col gap-2 sm:flex-row-reverse">
          <button
            type="submit"
            class="min-h-11 flex-1 rounded-lg bg-accent px-4 text-sm font-semibold text-white disabled:opacity-50"
            :disabled="unlocking || digits.length !== 6"
          >
            {{ unlocking ? 'Đang mở…' : 'Mở khóa' }}
          </button>
          <button
            type="button"
            class="min-h-11 flex-1 rounded-lg border border-line bg-white px-4 text-sm font-semibold"
            :disabled="unlocking"
            @click="emit('skip')"
          >
            Chỉ xem
          </button>
        </div>
      </form>
    </div>
  </Teleport>
</template>
