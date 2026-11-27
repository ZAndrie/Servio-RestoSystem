import { defineStore } from 'pinia'
import type { User, Role } from '@/types'
import api, { USE_MOCK } from '@/services/api'
import { MOCK_USERS } from '@/services/mockData'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  sessionVerified: boolean
}

const VALID_ROLES: ReadonlySet<Role> = new Set(['admin', 'waiter', 'kitchen'])

// Dev/offline mock credentials (tree-shaken in production builds when USE_MOCK is false)
const DEV_MOCK_PASSWORDS: Record<string, string> = USE_MOCK
  ? {
      admin: 'admin123',
      waiter: 'waiter123',
      kitchen: 'kitchen123',
      waiter_paolo: 'waiter123',
      kitchen_liza: 'kitchen123',
    }
  : {}

function loadStoredUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem('servio_user')
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<User> | null
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof parsed.id !== 'number' ||
      typeof parsed.username !== 'string' ||
      !VALID_ROLES.has(parsed.role as Role)
    ) {
      window.localStorage.removeItem('servio_user')
      window.localStorage.removeItem('servio_token')
      return null
    }
    return parsed as User
  } catch {
    window.localStorage.removeItem('servio_user')
    window.localStorage.removeItem('servio_token')
    return null
  }
}

function loadStoredToken(hasValidUser: boolean): string | null {
  if (typeof window === 'undefined' || !hasValidUser) return null
  return window.localStorage.getItem('servio_token') || null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    const user = loadStoredUser()
    const token = loadStoredToken(Boolean(user))
    return {
      user: token ? user : null,
      token,
      isLoading: false,
      error: null,
      sessionVerified: false,
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    role: (state): Role | null => state.user?.role || null,
    isAdmin: (state) => state.user?.role === 'admin',
    isWaiter: (state) => state.user?.role === 'waiter',
    isKitchen: (state) => state.user?.role === 'kitchen',
    mustChangePassword: (state) => !!state.user?.must_change_password,
    initials: (state) => {
      if (!state.user?.name) return 'SV'
      return state.user.name
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? '')
        .join('')
    },
  },

  actions: {
    clearLocalSession() {
      this.user = null
      this.token = null
      this.error = null
      this.sessionVerified = true
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('servio_token')
        window.localStorage.removeItem('servio_user')
      }
    },

    // Re-validate persisted session on startup against server /me (or canonical mock directory)
    async verifySession(): Promise<boolean> {
      if (!this.token || !this.user) {
        this.clearLocalSession()
        return false
      }

      if (USE_MOCK) {
        const canonical = MOCK_USERS.find(
          (u) => u.id === this.user?.id && u.username === this.user?.username,
        )
        if (!canonical || !canonical.is_active) {
          this.clearLocalSession()
          return false
        }
        // Always enforce authoritative role & active status from canonical mock record
        this.user = {
          ...canonical,
          must_change_password: this.user.must_change_password,
        }
        window.localStorage.setItem('servio_user', JSON.stringify(this.user))
        this.sessionVerified = true
        return true
      }

      try {
        const response = await api.get('/me')
        const serverUser = response.data?.user ?? response.data
        if (!serverUser || serverUser.is_active === false) {
          this.clearLocalSession()
          return false
        }
        this.user = serverUser
        window.localStorage.setItem('servio_user', JSON.stringify(this.user))
        this.sessionVerified = true
        return true
      } catch {
        this.clearLocalSession()
        return false
      }
    },

    async login(username: string, password: string = ''): Promise<{ success: boolean; message?: string }> {
      this.isLoading = true
      this.error = null

      try {
        if (!USE_MOCK) {
          const response = await api.post('/login', { username: username.trim(), password })
          this.token = response.data.token
          this.user = response.data.user
          this.sessionVerified = true
          localStorage.setItem('servio_token', this.token as string)
          localStorage.setItem('servio_user', JSON.stringify(this.user))
          return { success: true }
        }

        // Offline/dev mock authentication — enforces password match and active status
        await new Promise((r) => setTimeout(r, 200))
        const normalized = username.toLowerCase().trim()
        const matched = MOCK_USERS.find((u) => u.username.toLowerCase() === normalized)

        if (!matched) {
          this.error = 'Invalid username or password.'
          return { success: false, message: this.error }
        }

        const expectedPassword = DEV_MOCK_PASSWORDS[normalized]
        if (!password || (expectedPassword && password !== expectedPassword)) {
          this.error = 'Invalid username or password.'
          return { success: false, message: this.error }
        }

        if (!matched.is_active) {
          this.error = 'This staff account is inactive. Please ask your administrator.'
          return { success: false, message: this.error }
        }

        this.token = `mock_token_${normalized}_${Date.now()}`
        this.user = { ...matched }
        this.sessionVerified = true
        localStorage.setItem('servio_token', this.token)
        localStorage.setItem('servio_user', JSON.stringify(this.user))
        return { success: true }
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Sign-in failed. Check your credentials and try again.'
        this.error = msg
        return { success: false, message: msg }
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        if (!USE_MOCK && this.token && !this.token.startsWith('mock_token_')) {
          await api.post('/logout')
        }
      } catch {
        // Proceed with local cleanup even if LAN server is unreachable
      } finally {
        this.clearLocalSession()
      }
    },

    async changePassword(newPassword: string): Promise<boolean> {
      this.isLoading = true
      try {
        if (!USE_MOCK && this.token && !this.token.startsWith('mock_token_')) {
          await api.post('/change-password', { password: newPassword })
        } else {
          await new Promise((r) => setTimeout(r, 200))
          if (this.user) {
            DEV_MOCK_PASSWORDS[this.user.username.toLowerCase()] = newPassword
          }
        }
        if (this.user) {
          this.user.must_change_password = false
          localStorage.setItem('servio_user', JSON.stringify(this.user))
        }
        return true
      } catch {
        return false
      } finally {
        this.isLoading = false
      }
    },
  },
})
