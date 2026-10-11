declare module '#auth-utils' {
  interface User {
    login: string
    id: number
    name: string
    avatarUrl: string
    role?: 'owner' | 'viewer'
    sessionVersion?: number
  }

  interface UserSession {
    loggedInAt?: number
    share?: {
      id: string
      label: string
      scope:
        | { type: 'qa-all' }
        | { type: 'qa-categories'; categoryIds: string[] }
        | { type: 'qa-questions'; questionIds: string[] }
      expiresAt: number
    }
  }
}

export {}
