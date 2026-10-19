import { toAuthApiError } from '@/modules/core/utils/api-error.util'
import {
  getWriteToken,
  setWriteToken,
} from '@/modules/study-plan/services/progress.service'

export { getWriteToken, setWriteToken }

export function practiceProgressApiUrl() {
  return '/api/practice/progress'
}

export async function fetchCloudPracticeProgress() {
  try {
    return await $fetch<Record<string, unknown>>(practiceProgressApiUrl(), {
      credentials: 'include',
      cache: 'no-store',
    })
  } catch (err) {
    throw toAuthApiError(err)
  }
}

export async function publishCloudPracticeProgress(
  payload: object,
  token = '',
  kind: 'write-token' | 'edit-token' | 'cookie' = 'cookie',
) {
  const headers: Record<string, string> = {}
  if (kind === 'edit-token' && token) headers['x-edit-token'] = token
  else if (kind === 'write-token' && token) headers['x-progress-token'] = token

  try {
    return await $fetch<{ progress?: object }>(practiceProgressApiUrl(), {
      method: 'PUT',
      credentials: 'include',
      headers,
      body: payload,
    })
  } catch (err) {
    throw toAuthApiError(err)
  }
}
