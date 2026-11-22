import { defineStore } from 'pinia'
import type { User, Role } from '@/types'
import api, { USE_MOCK } from '@/services/api'
import { MOCK_USERS } from '@/services/mockData'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem('servio_user') || 'null'),
    token: localStorage.getItem('servio_token') || null,
    isLoading: false,
    error: null,
  }),

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
    async login(username: string, password?: string): Promise<{ success: boolean; message?: string }> {
      this.isLoading = true
      this.error = null

      try {
        if (!USE_MOCK) {
          const response = await api.post('/login', { username, password })
          this.token = response.data.token
          this.user = response.data.user
          localStorage.setItem('servio_token', this.token as string)
          localStorage.setItem('servio_user', JSON.stringify(this.user))
          return { success: true }
        }

        // Mock LAN authentication (respects active status and realistic delay)
        await new Promise((r) => setTimeout(r, 220))
        const normalized = username.toLowerCase().trim()
        const matched = MOCK_USERS.find((u) => u.username.toLowerCase() === normalized)

        if (!matched) {
          this.error = 'Username not recognized. Try waiter, admin, or kitchen.'
          return { success: false, message: this.error }
        }

        if (!matched.is_active) {
          this.error = 'This staff account is inactive. Please ask your administrator.'
          return { success: false, message: this.error }
        }

        this.token = `mock_token_${normalized}_${Date.now()}`
        this.user = { ...matched }
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
        this.user = null
        this.token = null
        this.error = null
        localStorage.removeItem('servio_token')
        localStorage.removeItem('servio_user')
      }
    },

    async changePassword(newPassword: string): Promise<boolean> {
      this.isLoading = true
      try {
        if (!USE_MOCK && this.token && !this.token.startsWith('mock_token_')) {
          await api.post('/change-password', { password: newPassword })
        } else {
          await new Promise((r) => setTimeout(r, 240))
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
