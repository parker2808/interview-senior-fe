<script setup lang="ts">
import PlanResource from '@/modules/study-plan/views/PlanResource.vue'
import { PlanRoute } from '@/modules/study-plan/enums/plan-routes.enum'
import { isBundledPath } from '@/modules/study-plan/utils/load-markdown.util'

definePageMeta({
  name: PlanRoute.Resource,
})

const route = useRoute()
const path = decodeURIComponent(String(route.params.path || ''))

if (!path || !isBundledPath(path)) {
  await navigateTo('/plan', { replace: true })
}
</script>

<template>
  <PlanResource :path="path" />
</template>
