<script setup lang="ts">
import PlanDay from '@/modules/study-plan/views/PlanDay.vue'
import { PlanRoute } from '@/modules/study-plan/enums/plan-routes.enum'
import { getDay } from '@/modules/study-plan/constants/days.constant'

definePageMeta({
  name: PlanRoute.Day,
})

const route = useRoute()
const dayNumber = Number(route.params.n)

if (!getDay(dayNumber)) {
  await navigateTo('/plan', { replace: true })
}
</script>

<template>
  <PlanDay :day-number="dayNumber" />
</template>
