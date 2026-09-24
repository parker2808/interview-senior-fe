import { computed, ref, watch } from 'vue'
import { DAYS } from '../data/days.js'
import {
  bitmaskToDoneMap,
  decodeShareToken,
  doneMapToBitmask,
  encodeShareToken,
  fromProgressJson,
  toExportJson,
} from '../utils/progressCodec.js'
import {
  fetchCloudProgress,
  getWriteToken,
  publishCloudProgress,
  setWriteToken,
} from '../utils/progressApi.js'

const STORAGE_KEY = 'senior-fe-30day-progress-v1'

function publicProgressUrl() {
  return new URL('progress.json', document.baseURI).href
}

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

/** Prefer ?share=TOKEN; also accept #share=TOKEN on first load. */
function parseShareFromLocation() {
  const fromQuery = new URLSearchParams(window.location.search).get('share')
  const hash = window.location.hash.slice(1)
  const fromHash = hash.match(/(?:^|[&#/;])share[=/]([0-9a-z]+)/i)?.[1]
  const token = fromQuery || fromHash
  if (!token) return null
  const mask = decodeShareToken(token)
  if (mask === null) return null
  return bitmaskToDoneMap(mask)
}

const localDoneMap = ref(readStorage())
const viewDoneMap = ref(null)
/** @type {import('vue').Ref<'local' | 'share' | 'public' | 'cloud'>} */
const source = ref('local')
const publicMeta = ref(null)
const statusMessage = ref('')

watch(
  localDoneMap,
  (value) => {
    if (source.value !== 'local') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  },
  { deep: true },
)

const activeDoneMap = computed(() =>
  source.value === 'local' ? localDoneMap.value : viewDoneMap.value || {},
)

const readOnly = computed(() => source.value !== 'local')

function enterViewOnly(map, nextSource, meta = null) {
  viewDoneMap.value = { ...map }
  source.value = nextSource
  publicMeta.value = meta
}

function useLocal() {
  source.value = 'local'
  viewDoneMap.value = null
  publicMeta.value = null
  // Drop share query so refresh stays local
  const url = new URL(window.location.href)
  if (url.searchParams.has('share')) {
    url.searchParams.delete('share')
    history.replaceState(null, '', url.pathname + url.search + url.hash)
  }
  statusMessage.value = 'Đang dùng tiến độ local trên máy này.'
}

function applyShareFromUrl() {
  const map = parseShareFromLocation()
  if (!map) return false
  enterViewOnly(map, 'share')
  statusMessage.value =
    'Đang xem tiến độ đã share (chỉ đọc — không ghi đè local).'
  // Normalize to ?share= so hash can stay for #day / #doc
  const tokenMatch =
    new URLSearchParams(window.location.search).get('share') ||
    window.location.hash.slice(1).match(/(?:^|[&#/;])share[=/]([0-9a-z]+)/i)?.[1]
  if (tokenMatch) {
    const url = new URL(window.location.href)
    url.searchParams.set('share', tokenMatch)
    // Strip share from hash if present, keep day/doc
    let hash = url.hash.slice(1)
    hash = hash
      .replace(/(?:^|[&#/;])share[=/][0-9a-z]+/gi, '')
      .replace(/^[&;/]+/, '')
    url.hash = hash
    history.replaceState(null, '', url.pathname + url.search + url.hash)
  }
  return true
}

async function loadPublicProgress() {
  statusMessage.value = 'Đang tải progress.json…'
  try {
    const res = await fetch(publicProgressUrl(), { cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const map = fromProgressJson(data)
    if (!map) throw new Error('Schema không hợp lệ (cần completed: number[])')
    enterViewOnly(map, 'public', {
      owner: data.owner || null,
      updatedAt: data.updatedAt || null,
      note: data.note || null,
    })
    statusMessage.value = data.owner
      ? `Đang xem tiến độ public của ${data.owner} (chỉ đọc).`
      : 'Đang xem tiến độ public từ repo (chỉ đọc).'
    return true
  } catch (err) {
    statusMessage.value = `Không tải được progress.json: ${err.message || err}`
    return false
  }
}

async function loadCloudProgress() {
  statusMessage.value = 'Đang tải tiến độ cloud…'
  try {
    const data = await fetchCloudProgress()
    const map = fromProgressJson(data)
    if (!map) throw new Error('Schema không hợp lệ (cần completed: number[])')
    enterViewOnly(map, 'cloud', {
      owner: data.owner || null,
      updatedAt: data.updatedAt || null,
      note: data.note || null,
    })
    statusMessage.value = data.owner
      ? `Đang xem tiến độ cloud của ${data.owner} (chỉ đọc).`
      : 'Đang xem tiến độ cloud (chỉ đọc).'
    return true
  } catch (err) {
    statusMessage.value = `Không tải được cloud progress: ${err.message || err}`
    return false
  }
}

/**
 * Publish local progress to Netlify Blobs.
 * @param {string} [tokenOverride] — if empty, uses sessionStorage or prompts
 */
async function publishToCloud(tokenOverride) {
  if (source.value !== 'local') {
    statusMessage.value = 'Chỉ publish từ nguồn Local.'
    return false
  }

  let token = (tokenOverride || getWriteToken() || '').trim()
  if (!token && typeof window !== 'undefined') {
    token = (
      window.prompt(
        'Nhập PROGRESS_WRITE_TOKEN (lưu tạm trong sessionStorage — không commit):',
        '',
      ) || ''
    ).trim()
  }
  if (!token) {
    statusMessage.value = 'Đã hủy — cần token để publish.'
    return false
  }

  setWriteToken(token)
  statusMessage.value = 'Đang publish lên cloud…'
  try {
    const payload = {
      ...toExportJson(localDoneMap.value),
      owner: 'Parker',
    }
    const result = await publishCloudProgress(payload, token)
    const published = result?.progress || payload
    statusMessage.value = `Đã publish cloud · cập nhật ${published.updatedAt || 'now'} (${published.completed?.length ?? 0} ngày).`
    return true
  } catch (err) {
    statusMessage.value = `Publish thất bại: ${err.message || err}`
    return false
  }
}

export function useProgress() {
  const completedCount = computed(
    () => DAYS.filter((d) => !!activeDoneMap.value[d.day]).length,
  )

  const percent = computed(() =>
    Math.round((completedCount.value / DAYS.length) * 100),
  )

  function isDone(day) {
    return !!activeDoneMap.value[day]
  }

  function setDone(day, value) {
    if (readOnly.value) return
    localDoneMap.value = { ...localDoneMap.value, [day]: !!value }
  }

  function toggleDone(day) {
    if (readOnly.value) return
    setDone(day, !isDone(day))
  }

  function weekStats(week) {
    const inWeek = week === 0 ? DAYS : DAYS.filter((d) => d.week === week)
    const done = inWeek.filter((d) => isDone(d.day)).length
    return { total: inWeek.length, done }
  }

  function buildShareUrl() {
    const mask = doneMapToBitmask(localDoneMap.value)
    const token = encodeShareToken(mask)
    const url = new URL(window.location.href)
    url.searchParams.set('share', token)
    // Keep current day/doc hash if any
    return url.toString()
  }

  async function copyShareLink() {
    const link = buildShareUrl()
    try {
      await navigator.clipboard.writeText(link)
      statusMessage.value =
        'Đã copy share link (người mở sẽ xem chế độ chỉ đọc).'
      return true
    } catch {
      statusMessage.value = `Copy thủ công: ${link}`
      return false
    }
  }

  function exportJson() {
    const payload = toExportJson(localDoneMap.value)
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `study-plan-progress-${payload.updatedAt || 'export'}.json`
    a.click()
    URL.revokeObjectURL(a.href)
    statusMessage.value = 'Đã tải file JSON tiến độ local.'
  }

  function importJsonFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const data = JSON.parse(String(reader.result))
          const map = fromProgressJson(data)
          if (!map) throw new Error('Thiếu mảng completed')
          localDoneMap.value = map
          useLocal()
          statusMessage.value = `Đã import ${Object.keys(map).length} ngày vào local.`
          resolve(true)
        } catch (err) {
          statusMessage.value = `Import thất bại: ${err.message || err}`
          resolve(false)
        }
      }
      reader.onerror = () => {
        statusMessage.value = 'Không đọc được file.'
        resolve(false)
      }
      reader.readAsText(file)
    })
  }

  applyShareFromUrl()

  return {
    doneMap: activeDoneMap,
    localDoneMap,
    source,
    readOnly,
    publicMeta,
    statusMessage,
    completedCount,
    percent,
    isDone,
    setDone,
    toggleDone,
    weekStats,
    useLocal,
    loadPublicProgress,
    loadCloudProgress,
    publishToCloud,
    copyShareLink,
    buildShareUrl,
    exportJson,
    importJsonFile,
    applyShareFromUrl,
  }
}
