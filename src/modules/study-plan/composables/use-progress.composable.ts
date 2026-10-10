import { usePlanIndex } from '@/modules/study-plan/composables/use-plan-index.composable'
import {
  bitmaskToDoneMap,
  decodeShareToken,
  doneMapToBitmask,
  encodeShareToken,
  fromProgressJson,
  toExportJson,
} from '@/modules/study-plan/utils/progress-codec.util'
import {
  fetchCloudProgress,
  getWriteToken,
  publishCloudProgress,
  setWriteToken,
} from '@/modules/study-plan/services/progress.service'
import { useEditMode } from '@/modules/study-plan/composables/use-edit-mode.composable'

const STORAGE_KEY = 'senior-fe-30day-progress-v1'

function readStorage(): Record<number, boolean> {
  if (!import.meta.client) return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function parseShareFromLocation() {
  if (!import.meta.client) return null
  const fromQuery = new URLSearchParams(window.location.search).get('share')
  const token = fromQuery
  if (!token) return null
  const mask = decodeShareToken(token)
  if (mask === null) return null
  return bitmaskToDoneMap(mask)
}

const localDoneMap = ref<Record<number, boolean>>(readStorage())
const viewDoneMap = ref<Record<number, boolean> | null>(null)
const source = ref<'local' | 'share' | 'public' | 'cloud'>('local')
const publicMeta = ref<{
  owner: string | null
  updatedAt: string | null
  note: string | null
} | null>(null)
const statusMessage = ref('')

export function useProgress() {
  const { data: planIndex } = usePlanIndex()
  const days = computed(() => planIndex.value?.days ?? [])

  const {
    isEditMode,
    modeLabel,
    modalOpen,
    unlocking,
    unlockError,
    submitPasscode,
    enterViewMode,
    openUnlockModal,
    lockEditMode,
  } = useEditMode()

  watch(
    localDoneMap,
    (value) => {
      if (!import.meta.client) return
      if (source.value !== 'local' || !isEditMode.value) return
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    },
    { deep: true },
  )

  const activeDoneMap = computed(() =>
    source.value === 'local' ? localDoneMap.value : viewDoneMap.value || {},
  )

  const readOnly = computed(
    () => !isEditMode.value || source.value !== 'local',
  )

  function enterViewOnly(
    map: Record<number, boolean>,
    nextSource: 'share' | 'public' | 'cloud',
    meta: typeof publicMeta.value = null,
  ) {
    viewDoneMap.value = { ...map }
    source.value = nextSource
    publicMeta.value = meta
  }

  function useLocal() {
    source.value = 'local'
    viewDoneMap.value = null
    publicMeta.value = null
    if (import.meta.client) {
      const url = new URL(window.location.href)
      if (url.searchParams.has('share')) {
        url.searchParams.delete('share')
        history.replaceState(null, '', url.pathname + url.search + url.hash)
      }
    }
    statusMessage.value = 'Đang dùng tiến độ local trên máy này.'
  }

  function applyShareFromUrl() {
    const map = parseShareFromLocation()
    if (!map) return false
    enterViewOnly(map, 'share')
    statusMessage.value =
      'Đang xem tiến độ đã share (chỉ đọc — không ghi đè local).'
    return true
  }

  async function loadPublicProgress() {
    statusMessage.value = 'Đang tải progress.json…'
    try {
      const res = await fetch('/progress.json', { cache: 'no-store' })
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
    } catch (err: unknown) {
      statusMessage.value = `Không tải được progress.json: ${
        err instanceof Error ? err.message : err
      }`
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
        owner: (data.owner as string) || null,
        updatedAt: (data.updatedAt as string) || null,
        note: (data.note as string) || null,
      })
      statusMessage.value = data.owner
        ? `Đang xem tiến độ cloud của ${data.owner} (chỉ đọc).`
        : 'Đang xem tiến độ cloud (chỉ đọc).'
      return true
    } catch (err: unknown) {
      statusMessage.value = `Không tải được cloud progress: ${
        err instanceof Error ? err.message : err
      }`
      return false
    }
  }

  async function publishToCloud(tokenOverride?: string) {
    if (!isEditMode.value) {
      statusMessage.value = 'Cần mở khóa chỉnh sửa trước khi publish.'
      openUnlockModal()
      return false
    }
    if (source.value !== 'local') {
      statusMessage.value = 'Chỉ publish từ nguồn Local.'
      return false
    }

    const payload = {
      ...toExportJson(localDoneMap.value),
      owner: 'Parker',
    }

    const finishOk = (result: { progress?: object } | null) => {
      const published = (result?.progress || payload) as {
        updatedAt?: string
        completed?: number[]
      }
      statusMessage.value = `Đã publish cloud · cập nhật ${
        published.updatedAt || 'now'
      } (${published.completed?.length ?? 0} ngày).`
      return true
    }

    statusMessage.value = 'Đang publish lên cloud…'

    const forcedWriteToken = (tokenOverride || '').trim()
    if (forcedWriteToken) {
      setWriteToken(forcedWriteToken)
      try {
        return finishOk(
          await publishCloudProgress(payload, forcedWriteToken, 'write-token'),
        )
      } catch (err: unknown) {
        statusMessage.value = `Publish thất bại: ${
          err instanceof Error ? err.message : err
        }`
        return false
      }
    }

    try {
      return finishOk(await publishCloudProgress(payload, '', 'cookie'))
    } catch {
      /* cookie session missing or rejected — fall back to write token */
    }

    let token = (getWriteToken() || '').trim()
    if (!token && import.meta.client) {
      token = (
        window.prompt(
          'Nhập PROGRESS_WRITE_TOKEN (lưu tạm trong sessionStorage — không commit):',
          '',
        ) || ''
      ).trim()
    }
    if (!token) {
      statusMessage.value =
        'Đã hủy — cần phiên chỉnh sửa hoặc PROGRESS_WRITE_TOKEN để publish.'
      return false
    }

    setWriteToken(token)
    try {
      return finishOk(await publishCloudProgress(payload, token, 'write-token'))
    } catch (err: unknown) {
      statusMessage.value = `Publish thất bại: ${
        err instanceof Error ? err.message : err
      }`
      return false
    }
  }

  const completedCount = computed(
    () => days.value.filter((d) => !!activeDoneMap.value[d.day]).length,
  )
  const percent = computed(() =>
    Math.round(
      (completedCount.value / Math.max(days.value.length, 1)) * 100,
    ),
  )

  function isDone(day: number) {
    return !!activeDoneMap.value[day]
  }

  function toggleDone(day: number) {
    if (readOnly.value) return
    localDoneMap.value = {
      ...localDoneMap.value,
      [day]: !isDone(day),
    }
  }

  async function tryUnlock(passcode: string) {
    const ok = await submitPasscode(passcode)
    statusMessage.value = ok
      ? 'Đã mở chế độ Sửa cho phiên này.'
      : unlockError.value || 'Không mở được chế độ Sửa.'
    return ok
  }

  function skipUnlock() {
    enterViewMode()
    statusMessage.value =
      'Chế độ Xem — có thể Load cloud / share; không sửa tiến độ local hay publish.'
  }

  function weekStats(week: number) {
    const inWeek =
      week === 0 ? days.value : days.value.filter((d) => d.week === week)
    const done = inWeek.filter((d) => isDone(d.day)).length
    return { total: inWeek.length, done }
  }

  function buildShareUrl() {
    const mask = doneMapToBitmask(localDoneMap.value)
    const token = encodeShareToken(mask)
    const url = new URL(window.location.href)
    url.searchParams.set('share', token)
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

  function importJsonFile(file: File) {
    if (!isEditMode.value) {
      statusMessage.value = 'Cần mở khóa chỉnh sửa trước khi import.'
      openUnlockModal()
      return Promise.resolve(false)
    }
    return new Promise<boolean>((resolve) => {
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
        } catch (err: unknown) {
          statusMessage.value = `Import thất bại: ${
            err instanceof Error ? err.message : err
          }`
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

  if (import.meta.client) applyShareFromUrl()

  return {
    source,
    readOnly,
    isEditMode,
    modeLabel,
    modalOpen,
    unlocking,
    unlockError,
    publicMeta,
    statusMessage,
    completedCount,
    percent,
    isDone,
    toggleDone,
    weekStats,
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
    lockEditMode,
  }
}
