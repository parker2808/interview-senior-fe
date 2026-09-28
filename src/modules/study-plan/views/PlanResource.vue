<script setup lang="ts">
import BackLink from '@/modules/core/components/BackLink/BackLink.vue'
import ResourceDoc from '@/modules/study-plan/components/ResourceDoc/ResourceDoc.vue'

const props = defineProps<{
  path: string
}>()

const router = useRouter()

function openDoc(path: string) {
  if (path.startsWith('documents/')) {
    const m = path.match(/^documents\/(vi|en)\/([^/]+)\.md$/)
    if (m) {
      router.push(`/docs/${m[1]}/${m[2]}`)
      return
    }
  }
  router.push(`/plan/doc/${encodeURIComponent(path)}`)
}

function openDocs(payload: { lang: string; slug: string; hash?: string }) {
  router.push(
    `/docs/${payload.lang}/${payload.slug}${payload.hash ? `#${payload.hash}` : ''}`,
  )
}
</script>

<template>
  <div class="mx-auto min-h-screen max-w-hub px-4 py-5 sm:px-6 sm:py-8">
    <div class="mb-4">
      <BackLink to="/plan" label="Danh sách ngày" />
    </div>
    <ResourceDoc
      :path="path"
      @open-doc="openDoc"
      @open-docs="openDocs"
    />
  </div>
</template>
