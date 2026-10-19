<script setup lang="ts">
import PracticeStep from '@/modules/practice/views/PracticeStep.vue'
import { PracticeRoute } from '@/modules/practice/enums/practice-routes.enum'
import { isPracticeStepId } from '@/modules/practice/utils/practice-id.util'

definePageMeta({
  name: PracticeRoute.Step,
})

const route = useRoute()
const stepId = String(route.params.id || '')

if (!isPracticeStepId(stepId)) {
  await navigateTo('/practice', { replace: true })
}
</script>

<template>
  <PracticeStep :step-id="stepId" />
</template>
