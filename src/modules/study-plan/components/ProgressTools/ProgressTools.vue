<script setup lang="ts">
const props = defineProps<{
  source: string
  readOnly: boolean
  isEditMode: boolean
  statusMessage: string
  publicMeta: { owner: string | null; updatedAt: string | null } | null
}>()

const emit = defineEmits<{
  'use-local': []
  'load-public': []
  'load-cloud': []
  'publish-cloud': []
  'copy-share': []
  export: []
  'import-file': [file: File]
  'request-unlock': []
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const toolsOpen = ref(false)

const sourceLabel: Record<string, string> = {
  local: 'Local (máy này)',
  share: 'Share link (chỉ đọc)',
  public: 'Public file (chỉ đọc)',
  cloud: 'Cloud Blob (chỉ đọc)',
}

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) emit('import-file', file)
  ;(e.target as HTMLInputElement).value = ''
}

function onImportClick() {
  if (!props.isEditMode) {
    emit('request-unlock')
    return
  }
  fileInput.value?.click()
}
</script>

<template>
  <section class="rounded-xl border border-line bg-surface-elevated/80 p-3 sm:p-4">
    <div
      v-if="!isEditMode"
      class="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-950"
      role="status"
    >
      <strong>Chế độ Xem</strong> — check-off và publish bị khóa.
      <button
        type="button"
        class="ml-1 font-semibold text-accent-ink underline"
        @click="emit('request-unlock')"
      >
        Mở khóa chỉnh sửa
      </button>
    </div>
    <div
      v-else-if="readOnly"
      class="mb-3 rounded-lg bg-sky-50 px-3 py-2 text-sm"
      role="status"
    >
      <strong>Đang xem tiến độ chỉ đọc</strong>
      <span v-if="publicMeta?.owner"> · {{ publicMeta.owner }}</span>
      <button
        type="button"
        class="ml-1 font-semibold text-accent-ink underline"
        @click="emit('use-local')"
      >
        Quay về local
      </button>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-2">
      <p class="text-sm text-ink-muted">
        Nguồn: <strong class="text-ink">{{ sourceLabel[source] || source }}</strong>
      </p>
      <button
        type="button"
        class="min-h-10 rounded-lg border border-line bg-white px-3 text-sm font-semibold md:hidden"
        @click="toolsOpen = !toolsOpen"
      >
        {{ toolsOpen ? 'Ẩn công cụ' : 'Công cụ tiến độ' }}
      </button>
    </div>

    <div
      class="mt-3 flex flex-wrap gap-2"
      :class="toolsOpen ? 'flex' : 'hidden md:flex'"
    >
      <button type="button" class="btn" @click="emit('use-local')">Local</button>
      <button type="button" class="btn" @click="emit('load-cloud')">Load cloud</button>
      <button type="button" class="btn" @click="emit('load-public')">Load public</button>
      <button type="button" class="btn" @click="emit('publish-cloud')">Publish</button>
      <button type="button" class="btn" @click="emit('copy-share')">Share</button>
      <button type="button" class="btn" @click="emit('export')">Export</button>
      <button type="button" class="btn" @click="onImportClick">Import</button>
      <input
        ref="fileInput"
        type="file"
        accept="application/json,.json"
        class="hidden"
        @change="onFileChange"
      />
    </div>

    <p v-if="statusMessage" class="mt-2 text-xs text-ink-muted" aria-live="polite">
      {{ statusMessage }}
    </p>
  </section>
</template>

<style scoped>
.btn {
  @apply min-h-10 rounded-lg border border-line bg-white px-3 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent-ink;
}
</style>
