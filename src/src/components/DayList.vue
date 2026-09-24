<script setup>
defineProps({
  days: { type: Array, required: true },
  weekFilter: { type: Number, required: true },
  weekLabels: { type: Object, required: true },
  weekProgress: { type: Object, required: true },
  isDone: { type: Function, required: true },
})

defineEmits(['update:weekFilter', 'open', 'toggle'])
</script>

<template>
  <section class="list-view">
    <div class="toolbar">
      <label class="week-label">
        Lọc tuần
        <select
          :value="weekFilter"
          @change="$emit('update:weekFilter', Number($event.target.value))"
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
      <p class="week-stat">
        Tuần này: <strong>{{ weekProgress.done }}/{{ weekProgress.total }}</strong>
      </p>
    </div>

    <ul class="day-rows">
      <li
        v-for="d in days"
        :key="d.day"
        class="day-row"
        :class="{ done: isDone(d.day) }"
      >
        <label class="check">
          <input
            type="checkbox"
            :checked="isDone(d.day)"
            :aria-label="`Đánh dấu Day ${d.day} hoàn thành`"
            @click.stop
            @change="$emit('toggle', d.day)"
          />
          <span class="box" aria-hidden="true"></span>
        </label>

        <button type="button" class="open" @click="$emit('open', d.day)">
          <span class="day-num">Day {{ String(d.day).padStart(2, '0') }}</span>
          <span class="meta">
            <span class="date">{{ d.date }}</span>
            <span class="theme">{{ d.theme }}</span>
          </span>
          <span class="chev" aria-hidden="true">›</span>
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.85rem;
}

.week-label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: var(--ink-muted);
  font-weight: 500;
}

select {
  min-width: 220px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--bg-elevated);
  padding: 0.45rem 0.65rem;
  color: var(--ink);
}

.week-stat {
  margin: 0;
  color: var(--ink-muted);
  font-size: 0.9rem;
}

.day-rows {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--bg-elevated);
  overflow: hidden;
}

.day-row {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: stretch;
  border-bottom: 1px solid var(--line);
  transition: background 0.2s var(--ease);
}

.day-row:last-child {
  border-bottom: none;
}

.day-row:hover {
  background: #f7faf9;
}

.day-row.done .theme {
  color: var(--ink-muted);
}

.day-row.done .day-num {
  color: var(--done);
}

.check {
  display: grid;
  place-items: center;
  padding: 0 0.35rem 0 0.85rem;
  cursor: pointer;
}

.check input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}

.box {
  width: 1.15rem;
  height: 1.15rem;
  border: 2px solid #9bb0a8;
  border-radius: 4px;
  display: grid;
  place-items: center;
  transition: border-color 0.2s var(--ease), background 0.2s var(--ease), transform 0.25s var(--ease);
}

.check input:checked + .box {
  background: var(--done);
  border-color: var(--done);
  animation: pulse-check 0.35s var(--ease);
}

.check input:checked + .box::after {
  content: '';
  width: 0.35rem;
  height: 0.6rem;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) translate(-1px, -1px);
}

.open {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.75rem;
  align-items: center;
  width: 100%;
  text-align: left;
  border: 0;
  background: transparent;
  padding: 0.85rem 1rem 0.85rem 0.5rem;
  color: inherit;
}

.day-num {
  font-family: var(--mono);
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--accent-ink);
  min-width: 4.5rem;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.date {
  font-size: 0.78rem;
  color: var(--ink-faint);
  font-variant-numeric: tabular-nums;
}

.theme {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chev {
  color: var(--ink-faint);
  font-size: 1.25rem;
  line-height: 1;
}

@media (max-width: 520px) {
  .open {
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
  }

  .day-num {
    grid-column: 1;
  }

  .meta {
    grid-column: 1 / -1;
  }

  .chev {
    grid-row: 1;
    grid-column: 2;
  }
}
</style>
