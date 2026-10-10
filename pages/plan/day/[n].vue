<script setup lang="ts">
import PlanDay from '@/modules/study-plan/views/PlanDay.vue'
import { PlanRoute } from '@/modules/study-plan/enums/plan-routes.enum'

definePageMeta({
  name: PlanRoute.Day,
})

const route = useRoute()
const dayNumber = Number(route.params.n)

if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 30) {
  await navigateTo('/plan', { replace: true })
}
</script>

<template>
  <PlanDay :day-number="dayNumber" />
</template>
