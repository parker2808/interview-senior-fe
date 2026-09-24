<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, required: true },
  unlocking: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

const emit = defineEmits(['submit', 'skip'])

const digits = ref('')

watch(
  () => props.open,
  (open) => {
    if (open) digits.value = ''
  },
)

function onInput(e) {
  digits.value = String(e.target.value || '')
    .replace(/\D/g, '')
    .slice(0, 6)
}

function onSubmit(e) {
  e.preventDefault()
  if (props.unlocking) return
  emit('submit', digits.value)
}
</script>

<template>
  <div
    v-if="open"
    class="overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="edit-gate-title"
  >
    <form class="panel" @submit="onSubmit">
      <h2 id="edit-gate-title">Mã chỉnh sửa</h2>
      <p class="hint">
        Nhập mã 6 số để mở <strong>chế độ Sửa</strong> (check-off, publish).
        Bỏ qua để xem tiến độ ở <strong>chế độ Xem</strong>.
      </p>

      <label class="field">
        <span class="label">Mã 6 số</span>
        <input
          type="password"
          inputmode="numeric"
          autocomplete="one-time-code"
          maxlength="6"
          pattern="[0-9]{6}"
          placeholder="••••••"
          :value="digits"
          :disabled="unlocking"
          autofocus
          @input="onInput"
        />
      </label>

      <p v-if="error" class="error" role="alert">{{ error }}</p>

      <div class="actions">
        <button type="submit" class="primary" :disabled="unlocking || digits.length !== 6">
          {{ unlocking ? 'Đang xác thực…' : 'Mở khóa chỉnh sửa' }}
        </button>
        <button type="button" class="ghost" :disabled="unlocking" @click="emit('skip')">
          Chỉ xem
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(15, 23, 20, 0.45);
  backdrop-filter: blur(2px);
  animation: gate-fade 0.25s ease both;
}

.panel {
  width: min(100%, 380px);
  background: var(--bg-elevated, #fff);
  border: 1px solid var(--line, #d5e0db);
  border-radius: var(--radius, 12px);
  box-shadow: 0 18px 40px rgba(15, 40, 30, 0.18);
  padding: 1.25rem 1.35rem 1.35rem;
  display: grid;
  gap: 0.85rem;
  animation: gate-up 0.3s ease both;
}

h2 {
  margin: 0;
  font-size: 1.2rem;
  letter-spacing: -0.02em;
}

.hint {
  margin: 0;
  font-size: 0.9rem;
  color: var(--ink-muted, #5c6f68);
  line-height: 1.45;
}

.field {
  display: grid;
  gap: 0.35rem;
}

.label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ink-muted, #5c6f68);
}

input {
  font-family: var(--mono, ui-monospace, monospace);
  font-size: 1.35rem;
  letter-spacing: 0.35em;
  text-align: center;
  border: 1px solid var(--line, #d5e0db);
  border-radius: 10px;
  padding: 0.65rem 0.75rem;
  background: #f7faf9;
  color: var(--ink, #12201b);
}

input:focus {
  outline: 2px solid #99f6e4;
  outline-offset: 1px;
}

.error {
  margin: 0;
  font-size: 0.85rem;
  color: #b91c1c;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.primary,
.ghost {
  border-radius: 8px;
  padding: 0.55rem 0.9rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.primary {
  border: 1px solid #0f766e;
  background: #0f766e;
  color: #fff;
  flex: 1 1 auto;
}

.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ghost {
  border: 1px solid var(--line, #d5e0db);
  background: transparent;
  color: var(--ink-muted, #5c6f68);
}

@keyframes gate-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes gate-up {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
