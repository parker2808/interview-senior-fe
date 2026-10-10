import { SECURITY_HEADERS } from '@/modules/core/utils/security-headers.util'

export default defineEventHandler((event) => {
  const headers =
    import.meta.dev
      ? Object.fromEntries(
          Object.entries(SECURITY_HEADERS).filter(
            ([key]) => key !== 'Content-Security-Policy',
          ),
        )
      : SECURITY_HEADERS

  setResponseHeaders(event, headers)
})
