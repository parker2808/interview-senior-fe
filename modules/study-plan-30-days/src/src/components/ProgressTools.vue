<script setup>
import { ref } from 'vue'

const props = defineProps({
  source: { type: String, required: true },
  readOnly: { type: Boolean, required: true },
  isEditMode: { type: Boolean, default: false },
  statusMessage: { type: String, default: '' },
  publicMeta: { type: Object, default: null },
})

const emit = defineEmits([
  'use-local',
  'load-public',
  'load-cloud',
  'publish-cloud',
  'copy-share',
  'export',
  'import-file',
  'request-unlock',
])

const fileInput = ref(null)

const sourceLabel = {
  local: 'Local (máy này)',
  share: 'Share link (chỉ đọc)',
  public: 'Public file (chỉ đọc)',
  cloud: 'Cloud Blobs (chỉ đọc)',
}

const bannerTitle = {
  share: 'Đang xem tiến độ đã share',
  public: 'Đang xem tiến độ public từ repo',
  cloud: 'Đang xem tiến độ cloud (Netlify Blobs)',
}

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (file) emit('import-file', file)
  e.target.value = ''
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
  <section class="progress-tools" aria-label="Nguồn tiến độ">
    <div v-if="!isEditMode" class="banner banner-locked" role="status">
      <strong>Chế độ Xem</strong>
      <span> — check-off và publish bị khóa. Load cloud / share vẫn dùng được.</span>
      <button type="button" class="linkish" @click="emit('request-unlock')">
        Mở khóa chỉnh sửa
      </button>
    </div>
    <div v-else-if="readOnly" class="banner" role="status">
      <strong>{{ bannerTitle[source] || 'Đang xem tiến độ chỉ đọc' }}</strong>
      <span v-if="publicMeta?.owner"> · {{ publicMeta.owner }}</span>
      <span v-if="publicMeta?.updatedAt"> · cập nhật {{ publicMeta.updatedAt }}</span>
      <button type="button" class="linkish" @click="emit('use-local')">
        Quay về tiến độ local
      </button>
    </div>
    <div v-else class="banner banner-local" role="status">
      <strong>Chế độ Sửa · Local</strong>
      <span> — check-off ghi vào máy này; publish cloud khi muốn người khác theo dõi.</span>
    </div>

    <div class="row">
      <span class="source">
        Nguồn: <strong>{{ sourceLabel[source] || source }}</strong>
      </span>
      <div class="actions">
        <button type="button" :class="{ active: source === 'local' }" @click="emit('use-local')">
          Local
        </button>
        <button type="button" @click="emit('copy-share')" :disabled="source !== 'local'">
          Copy share link
        </button>
        <button
          type="button"
          :class="{ active: source === 'public' }"
          @click="emit('load-public')"
        >
          Public file
        </button>
        <button
          type="button"
          :class="{ active: source === 'cloud' }"
          @click="emit('load-cloud')"
        >
          Load cloud
        </button>
        <button
          type="button"
          @click="emit('publish-cloud')"
          :disabled="!isEditMode || source !== 'local'"
          :title="!isEditMode ? 'Cần mở khóa chỉnh sửa' : undefined"
        >
          Publish to cloud
        </button>
        <button type="button" @click="emit('export')" :disabled="source !== 'local'">
          Export JSON
        </button>
        <button
          type="button"
          @click="onImportClick"
          :disabled="source !== 'local'"
          :title="!isEditMode ? 'Cần mở khóa chỉnh sửa' : undefined"
        >
          Import JSON
        </button>
        <input
          ref="fileInput"
          type="file"
          accept="application/json,.json"
          class="sr-only"
          @change="onFileChange"
        />
      </div>
    </div>

    <p v-if="statusMessage" class="status">{{ statusMessage }}</p>
  </section>
</template>

<style scoped>
.progress-tools {
  margin-bottom: 1rem;
  display: grid;
  gap: 0.55rem;
}

.banner {
  background: #fff7ed;
  border: 1px solid #fdba74;
  color: #9a3412;
  border-radius: var(--radius);
  padding: 0.65rem 0.85rem;
  font-size: 0.9rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.75rem;
  align-items: center;
}

.banner-local {
  background: #f0fdf4;
  border-color: #86efac;
  color: #166534;
}

.banner-locked {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #334155;
}

.linkish {
  border: 0;
  background: transparent;
  color: #0f766e;
  text-decoration: underline;
  padding: 0;
  font-weight: 600;
}

.banner .linkish {
  color: inherit;
  text-decoration: underline;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem 0.85rem;
  align-items: center;
  justify-content: space-between;
}

.source {
  font-size: 0.88rem;
  color: var(--ink-muted);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.actions button {
  border: 1px solid var(--line);
  background: var(--bg-elevated);
  color: var(--ink-muted);
  border-radius: 8px;
  padding: 0.35rem 0.65rem;
  font-size: 0.8rem;
}

.actions button:hover:not(:disabled) {
  color: var(--ink);
  border-color: #b7cbc3;
}

.actions button.active {
  background: var(--accent-soft);
  border-color: #99f6e4;
  color: var(--accent-ink);
  font-weight: 600;
}

.actions button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.status {
  margin: 0;
  font-size: 0.82rem;
  color: var(--ink-muted);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
