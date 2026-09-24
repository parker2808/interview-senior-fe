import { computed, ref, watch } from 'vue'
import { DAYS } from '../data/days.js'

const STORAGE_KEY = 'senior-fe-30day-progress-v1'

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

const doneMap = ref(readStorage())

watch(
  doneMap,
  (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  },
  { deep: true },
)

export function useProgress() {
  const completedCount = computed(
    () => DAYS.filter((d) => !!doneMap.value[d.day]).length,
  )

  const percent = computed(() =>
    Math.round((completedCount.value / DAYS.length) * 100),
  )

  function isDone(day) {
    return !!doneMap.value[day]
  }

  function setDone(day, value) {
    doneMap.value = { ...doneMap.value, [day]: !!value }
  }

  function toggleDone(day) {
    setDone(day, !isDone(day))
  }

  function weekStats(week) {
    const inWeek = week === 0 ? DAYS : DAYS.filter((d) => d.week === week)
    const done = inWeek.filter((d) => isDone(d.day)).length
    return { total: inWeek.length, done }
  }

  return {
    doneMap,
    completedCount,
    percent,
    isDone,
    setDone,
    toggleDone,
    weekStats,
  }
}
