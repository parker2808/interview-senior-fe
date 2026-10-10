declare module '#auth-utils' {
  interface User {
    login: string
    id: number
    name: string
    avatarUrl: string
  }

  interface UserSession {
    loggedInAt?: number
  }
}

export {}
