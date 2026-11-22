import api, { USE_MOCK } from './api'
import { MOCK_USERS } from './mockData'
import type { Role, User } from '@/types'

let memoryUsers: User[] = JSON.parse(JSON.stringify(MOCK_USERS))

export interface CreateUserPayload {
  name: string
  username: string
  role: Role
  password: string
}

export const userService = {
  async getUsers(): Promise<User[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 70))
      return JSON.parse(JSON.stringify(memoryUsers))
    }
    const res = await api.get('/users')
    return res.data
  },

  async createUser(payload: CreateUserPayload): Promise<User> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 120))
      const normalized = payload.username.toLowerCase().trim()
      if (memoryUsers.some((u) => u.username.toLowerCase() === normalized)) {
        throw new Error('Username is already assigned to another staff member.')
      }
      const nextId = Math.max(...memoryUsers.map((u) => u.id), 0) + 1
      const created: User = {
        id: nextId,
        name: payload.name.trim(),
        username: normalized,
        role: payload.role,
        is_active: true,
        must_change_password: true,
        created_at: new Date().toISOString().slice(0, 10),
      }
      memoryUsers.unshift(created)
      return JSON.parse(JSON.stringify(created))
    }
    const res = await api.post('/users', payload)
    return res.data
  },

  async toggleActive(userId: number): Promise<User> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 90))
      const user = memoryUsers.find((u) => u.id === userId)
      if (!user) throw new Error('Staff account not found.')
      user.is_active = !user.is_active
      return JSON.parse(JSON.stringify(user))
    }
    const res = await api.patch(`/users/${userId}/toggle-active`)
    return res.data
  },

  async resetPassword(userId: number, temporaryPassword: string): Promise<void> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 120))
      const user = memoryUsers.find((u) => u.id === userId)
      if (!user) throw new Error('Staff account not found.')
      user.must_change_password = true
      return
    }
    await api.post(`/users/${userId}/reset-password`, { password: temporaryPassword })
  },
}
