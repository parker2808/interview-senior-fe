<script setup lang="ts">
import type { DayMeta } from '@/modules/study-plan/constants/days.constant'

defineProps<{
  days: DayMeta[]
  weekFilter: number
  weekLabels: Record<number, string>
  weekProgress: { total: number; done: number }
  isDone: (day: number) => boolean
  readOnly: boolean
}>()

defineEmits<{
  'update:weekFilter': [value: number]
  open: [day: number]
  toggle: [day: number]
}>()
</script>

<template>
  <section>
    <div
      class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <label class="flex flex-col gap-1 text-sm font-medium text-ink-muted sm:flex-row sm:items-center sm:gap-2">
        Lọc tuần
        <select
          class="min-h-11 rounded-lg border border-line bg-white px-3 text-ink"
          :value="weekFilter"
          @change="
            $emit('update:weekFilter', Number(($event.target as HTMLSelectElement).value))
          "
        >
          <option
            v-for="(label, key) in weekLabels"
            :key="key"
            :value="Number(key)"
          >
            {{ label }}
          </option>
        </select>
      </label>
      <p class="text-sm text-ink-muted">
        Tuần này:
        <strong class="text-ink">{{ weekProgress.done }}/{{ weekProgress.total }}</strong>
      </p>
    </div>

    <ul class="space-y-2">
      <li
        v-for="d in days"
        :key="d.day"
        class="flex items-stretch gap-2 rounded-xl border border-line bg-surface-elevated transition"
        :class="isDone(d.day) ? 'border-done/40 bg-done-soft/40' : ''"
      >
        <label class="flex min-h-14 min-w-12 cursor-pointer items-center justify-center px-2">
          <input
            type="checkbox"
            class="h-5 w-5 accent-accent"
            :checked="isDone(d.day)"
            :disabled="readOnly"
            :aria-label="`Đánh dấu Day ${d.day} hoàn thành`"
            @click.stop
            @change="$emit('toggle', d.day)"
          />
        </label>
        <button
          type="button"
          class="flex min-h-14 flex-1 items-center gap-3 px-2 py-3 text-left sm:px-3"
          @click="$emit('open', d.day)"
        >
          <span class="shrink-0 font-mono text-sm font-semibold text-accent-ink">
            Day {{ String(d.day).padStart(2, '0') }}
          </span>
          <span class="min-w-0 flex-1">
            <span class="block text-xs text-ink-faint">{{ d.date }}</span>
            <span class="block truncate text-sm font-medium text-ink sm:text-base">
              {{ d.theme }}
            </span>
          </span>
          <span class="text-ink-faint" aria-hidden="true">›</span>
        </button>
      </li>
    </ul>
  </section>
</template>
