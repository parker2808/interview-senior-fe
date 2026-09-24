<script setup>
import { computed, ref, watch } from 'vue'
import { DAYS, RESOURCES, WEEK_LABELS, getDay } from './data/days.js'
import { loadMarkdown } from './data/markdown.js'
import { useProgress } from './composables/useProgress.js'
import DayList from './components/DayList.vue'
import DayDetail from './components/DayDetail.vue'
import ResourceDoc from './components/ResourceDoc.vue'
import ProgressTools from './components/ProgressTools.vue'
import EditGateModal from './components/EditGateModal.vue'

const NAV_COLLAPSE_KEY = 'senior-fe-nav-collapsed-v1'

const {
  completedCount,
  percent,
  isDone,
  toggleDone,
  weekStats,
  source,
  readOnly,
  isEditMode,
  modeLabel,
  modalOpen,
  unlocking,
  unlockError,
  publicMeta,
  statusMessage,
  useLocal,
  loadPublicProgress,
  loadCloudProgress,
  publishToCloud,
  copyShareLink,
  exportJson,
  importJsonFile,
  tryUnlock,
  skipUnlock,
  openUnlockModal,
} = useProgress()

const view = ref('list') // list | day | resource
const selectedDay = ref(null)
const weekFilter = ref(0)
const celebrate = ref(false)
const navExpanded = ref(true)

try {
  if (localStorage.getItem(NAV_COLLAPSE_KEY) === '1') {
    navExpanded.value = false
  }
} catch {
  /* ignore */
}

function toggleNav() {
  navExpanded.value = !navExpanded.value
  try {
    localStorage.setItem(NAV_COLLAPSE_KEY, navExpanded.value ? '0' : '1')
  } catch {
    /* ignore */
  }
}

const filteredDays = computed(() =>
  weekFilter.value === 0
    ? DAYS
    : DAYS.filter((d) => d.week === weekFilter.value),
)

const weekProgress = computed(() => weekStats(weekFilter.value))

function openDay(day) {
  selectedDay.value = day
  view.value = 'day'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function openResource(path) {
  selectedDay.value = null
  view.value = 'resource'
  resourcePath.value = path
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const resourcePath = ref(RESOURCES[0].path)

function backToList() {
  view.value = 'list'
  selectedDay.value = null
}

function onToggle(day) {
  if (readOnly.value) return
  const wasDone = isDone(day)
  toggleDone(day)
  if (!wasDone) {
    celebrate.value = true
    window.setTimeout(() => {
      celebrate.value = false
    }, 450)
  }
}

function goPrev() {
  if (!selectedDay.value || selectedDay.value <= 1) return
  openDay(selectedDay.value - 1)
}

function goNext() {
  if (!selectedDay.value || selectedDay.value >= 30) return
  openDay(selectedDay.value + 1)
}

const currentMeta = computed(() =>
  selectedDay.value ? getDay(selectedDay.value) : null,
)

const navTitle = computed(() => {
  if (view.value === 'resource') {
    const match = RESOURCES.find((r) => r.path === resourcePath.value)
    return match?.label ?? 'Tài liệu'
  }
  if (view.value === 'day' && currentMeta.value) {
    return `Ngày ${currentMeta.value.day}`
  }
  return 'Điều hướng'
})

const hashSync = () => {
  const hash = window.location.hash.slice(1)
  if (!hash) {
    view.value = 'list'
    return
  }
  const dayMatch = hash.match(/^day\/(\d+)$/)
  if (dayMatch) {
    const n = Number(dayMatch[1])
    if (getDay(n)) {
      selectedDay.value = n
      view.value = 'day'
      return
    }
  }
  if (hash.startsWith('doc/')) {
    const path = decodeURIComponent(hash.slice(4))
    if (loadMarkdown(path).ok || RESOURCES.some((r) => r.path === path)) {
      resourcePath.value = path
      view.value = 'resource'
    }
  }
}

watch([view, selectedDay, resourcePath], () => {
  const url = new URL(window.location.href)
  if (view.value === 'day' && selectedDay.value) {
    url.hash = `day/${selectedDay.value}`
  } else if (view.value === 'resource') {
    url.hash = `doc/${encodeURIComponent(resourcePath.value)}`
  } else {
    url.hash = ''
  }
  history.replaceState(null, '', url.pathname + url.search + url.hash)
})

hashSync()
window.addEventListener('hashchange', hashSync)
</script>

<template>
  <div class="shell" :class="{ celebrate }">
    <EditGateModal
      :open="modalOpen"
      :unlocking="unlocking"
      :error="unlockError"
      @submit="tryUnlock"
      @skip="skipUnlock"
    />

    <header class="top">
      <div class="brand-row">
        <button
          v-if="view !== 'list'"
          type="button"
          class="back"
          @click="backToList"
        >
          ← Danh sách
        </button>
        <div class="brand">
          <p class="eyebrow">Senior FE · 03/10 → 01/11/2026</p>
          <h1>Kế hoạch ôn 30 ngày</h1>
          <div class="mode-row">
            <span
              class="mode-badge"
              :class="isEditMode ? 'mode-edit' : 'mode-view'"
              :title="isEditMode ? 'Đã mở khóa chỉnh sửa (phiên này)' : 'Chỉ xem — không sửa / publish'"
            >
              {{ modeLabel }}
            </span>
            <button
              v-if="!isEditMode"
              type="button"
              class="unlock-link"
              @click="openUnlockModal"
            >
              Mở khóa
            </button>
          </div>
        </div>
      </div>

      <div class="progress-block" aria-live="polite">
        <div class="progress-meta">
          <span class="count">{{ completedCount }}/30</span>
          <span class="pct">{{ percent }}%</span>
        </div>
        <div class="bar" role="progressbar" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100">
          <div class="bar-fill" :style="{ width: percent + '%' }"></div>
        </div>
      </div>
    </header>

    <ProgressTools
      :source="source"
      :read-only="readOnly"
      :is-edit-mode="isEditMode"
      :status-message="statusMessage"
      :public-meta="publicMeta"
      @use-local="useLocal"
      @load-public="loadPublicProgress"
      @load-cloud="loadCloudProgress"
      @publish-cloud="publishToCloud"
      @copy-share="copyShareLink"
      @export="exportJson"
      @import-file="importJsonFile"
      @request-unlock="openUnlockModal"
    />

    <nav
      class="resources"
      :class="{ 'is-collapsed': !navExpanded }"
      aria-label="Tài liệu nhanh"
    >
      <button
        type="button"
        class="nav-toggle"
        :aria-expanded="navExpanded"
        :aria-controls="'resources-pills'"
        @click="toggleNav"
      >
        <span class="nav-toggle-text">{{ navExpanded ? 'Nav' : navTitle }}</span>
        <span class="nav-chevron" aria-hidden="true">{{ navExpanded ? '▴' : '▾' }}</span>
      </button>
      <div
        v-show="navExpanded"
        id="resources-pills"
        class="resources-pills"
      >
        <button
          v-for="r in RESOURCES"
          :key="r.id"
          type="button"
          class="chip"
          :class="{ active: view === 'resource' && resourcePath === r.path }"
          @click="openResource(r.path)"
        >
          {{ r.label }}
        </button>
      </div>
    </nav>

    <main class="main">
      <DayList
        v-if="view === 'list'"
        :days="filteredDays"
        :week-filter="weekFilter"
        :week-labels="WEEK_LABELS"
        :week-progress="weekProgress"
        :is-done="isDone"
        :read-only="readOnly"
        @update:week-filter="weekFilter = $event"
        @open="openDay"
        @toggle="onToggle"
      />

      <DayDetail
        v-else-if="view === 'day' && currentMeta"
        :day="currentMeta"
        :done="isDone(currentMeta.day)"
        :read-only="readOnly"
        @toggle="onToggle(currentMeta.day)"
        @prev="goPrev"
        @next="goNext"
        @open-doc="openResource"
      />

      <ResourceDoc
        v-else-if="view === 'resource'"
        :path="resourcePath"
        @back="backToList"
        @open-doc="openResource"
      />
    </main>
  </div>
</template>

<style scoped>
.shell {
  max-width: 920px;
  margin: 0 auto;
  padding: 1.25rem 1rem 3rem;
  /* Opacity-only: transform on this ancestor would break sticky nav + fixed modal */
  animation: shell-in 0.35s var(--ease) both;
}

@keyframes shell-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.top {
  display: grid;
  gap: 1rem;
  margin-bottom: 1rem;
}

.brand-row {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.back {
  align-self: flex-start;
  border: 1px solid var(--line);
  background: var(--bg-elevated);
  color: var(--ink);
  border-radius: 8px;
  padding: 0.35rem 0.7rem;
  font-size: 0.9rem;
}

.eyebrow {
  margin: 0;
  color: var(--ink-muted);
  font-size: 0.85rem;
  letter-spacing: 0.02em;
}

h1 {
  margin: 0.15rem 0 0;
  font-size: clamp(1.45rem, 3vw, 1.85rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.mode-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.45rem;
}

.mode-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  border-radius: 6px;
  padding: 0.2rem 0.55rem;
  border: 1px solid transparent;
}

.mode-edit {
  background: #ecfdf5;
  border-color: #6ee7b7;
  color: #047857;
}

.mode-view {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #475569;
}

.unlock-link {
  border: 0;
  background: transparent;
  color: var(--accent-ink, #0f766e);
  text-decoration: underline;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0;
}

.progress-block {
  background: var(--bg-elevated);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 0.85rem 1rem;
  box-shadow: var(--shadow);
}

.progress-meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.45rem;
  font-variant-numeric: tabular-nums;
}

.count {
  font-weight: 600;
}

.pct {
  color: var(--ink-muted);
  font-size: 0.9rem;
}

.bar {
  height: 8px;
  background: #e5eeea;
  border-radius: 999px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #0f766e, #0d9488);
  border-radius: inherit;
  transform-origin: left center;
  transition: width 0.45s var(--ease);
}

.celebrate .bar-fill {
  animation: fill-bar 0.45s var(--ease);
}

.resources {
  position: sticky;
  top: 0;
  z-index: 40;
  display: grid;
  gap: 0.45rem;
  margin: 0 -1rem 1.25rem;
  padding: 0.55rem 1rem;
  padding-top: max(0.55rem, env(safe-area-inset-top));
  background:
    linear-gradient(180deg, rgba(244, 247, 246, 0.97) 0%, rgba(244, 247, 246, 0.92) 100%);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.nav-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
  max-width: 100%;
  border: 1px solid var(--line);
  background: var(--bg-elevated);
  color: var(--ink);
  border-radius: 8px;
  padding: 0.4rem 0.7rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.nav-toggle-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.nav-chevron {
  flex-shrink: 0;
  color: var(--ink-muted);
  font-size: 0.75rem;
}

.resources-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.resources.is-collapsed {
  padding-bottom: 0.55rem;
}

.chip {
  border: 1px solid var(--line);
  background: var(--bg-elevated);
  color: var(--ink-muted);
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  font-size: 0.82rem;
  transition: background 0.2s var(--ease), color 0.2s var(--ease), border-color 0.2s var(--ease);
}

.chip:hover {
  border-color: #b7cbc3;
  color: var(--ink);
}

.chip.active {
  background: var(--accent-soft);
  border-color: #99f6e4;
  color: var(--accent-ink);
  font-weight: 600;
}

.main {
  animation: fade-up 0.3s var(--ease) both;
}

@media (min-width: 720px) {
  .shell {
    padding: 1.75rem 1.5rem 4rem;
  }

  .top {
    grid-template-columns: 1fr minmax(200px, 280px);
    align-items: end;
  }

  .resources {
    margin-left: -1.5rem;
    margin-right: -1.5rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  .nav-toggle {
    width: auto;
    min-width: 7.5rem;
  }
}
</style>
