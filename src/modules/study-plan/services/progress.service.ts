import { toAuthApiError } from '@/modules/core/utils/api-error.util'

export function progressApiUrl() {
  return '/api/progress'
}

export async function fetchCloudProgress() {
  try {
    return await $fetch<Record<string, unknown>>(progressApiUrl(), {
      credentials: 'include',
      cache: 'no-store',
    })
  } catch (err) {
    throw toAuthApiError(err)
  }
}

export async function publishCloudProgress(payload: object) {
  try {
    return await $fetch<{ progress?: object }>(progressApiUrl(), {
      method: 'PUT',
      credentials: 'include',
      body: payload,
    })
  } catch (err) {
    throw toAuthApiError(err)
  }
}
