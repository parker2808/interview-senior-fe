<script setup lang="ts">
import type { DocGroup } from '@/modules/knowledge-base/constants/doc-catalog.constant'
import type { DocLang } from '@/modules/core/constants/locale.constant'

defineProps<{
  catalog: DocGroup[]
  lang: DocLang
  activeSlug: string
}>()

defineEmits<{
  select: [slug: string]
}>()
</script>

<template>
  <nav class="flex h-full flex-col gap-5 overflow-y-auto p-4" aria-label="Topics">
    <div v-for="group in catalog" :key="group.id" class="space-y-2">
      <p class="text-xs font-semibold uppercase tracking-wider text-ink-faint">
        {{ $t(`docs.groups.${group.id}`) }}
      </p>
      <ul class="space-y-1">
        <li v-for="topic in group.topics" :key="topic.slug">
          <button
            type="button"
            class="flex min-h-10 w-full items-center rounded-lg border-l-2 px-2.5 text-left text-sm transition"
            :class="
              topic.slug === activeSlug
                ? 'border-accent bg-accent-soft font-semibold text-accent-ink'
                : 'border-transparent text-ink-muted hover:bg-white hover:text-ink'
            "
            @click="$emit('select', topic.slug)"
          >
            {{ topic.title[lang] }}
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>
