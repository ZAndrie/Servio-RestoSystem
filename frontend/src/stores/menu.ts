import { defineStore } from 'pinia'
import type { Category, MenuItem } from '@/types'
import { menuService } from '@/services/menuService'
import { useToastStore } from './toast'

interface MenuState {
  categories: Category[]
  items: MenuItem[]
  activeCategoryId: number | null
  isLoading: boolean
  error: string | null
  staggerKey: number
}

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    categories: [],
    items: [],
    activeCategoryId: null,
    isLoading: false,
    error: null,
    staggerKey: 0,
  }),

  getters: {
    filteredItems: (state) => {
      if (!state.activeCategoryId) return state.items
      return state.items.filter((item) => item.category_id === state.activeCategoryId)
    },
    availableItems: (state) => state.items.filter((item) => item.is_available),
    getItemById: (state) => (id: number) => state.items.find((item) => item.id === id),
    getCategoryName: (state) => (categoryId: number) =>
      state.categories.find((c) => c.id === categoryId)?.name ?? 'Menu',
  },

  actions: {
    async fetchMenu() {
      this.isLoading = true
      this.error = null
      try {
        const [cats, items] = await Promise.all([
          menuService.getCategories(),
          menuService.getMenuItems(),
        ])
        this.categories = cats
        this.items = items
        this.staggerKey += 1
      } catch (err: unknown) {
        this.error = (err as Error)?.message || 'Unable to load menu catalog.'
      } finally {
        this.isLoading = false
      }
    },

    // Term 6: Optimistic sold-out toggle with rollback and clear toast on failure
    async toggleAvailability(itemId: number, simulateFailure: boolean = false) {
      const item = this.items.find((i) => i.id === itemId)
      if (!item) return

      const toastStore = useToastStore()
      const previousState = item.is_available
      item.is_available = !previousState

      try {
        await menuService.toggleAvailability(itemId, item.is_available, simulateFailure)
        toastStore.success(
          item.name,
          item.is_available ? 'Back on the menu for waiters.' : 'Marked sold out across POS screens.',
        )
      } catch (err: unknown) {
        item.is_available = previousState
        toastStore.error(
          `Could not update ${item.name}`,
          (err as Error)?.message || 'Availability was restored to its previous state.',
        )
      }
    },

    setCategory(categoryId: number | null) {
      if (this.activeCategoryId === categoryId) return
      this.activeCategoryId = categoryId
      // Term 14: Trigger stagger only on category switch (never on polling refresh)
      this.staggerKey += 1
    },

    async saveItem(item: Partial<MenuItem>, imageFile?: File | null): Promise<boolean> {
      const toastStore = useToastStore()
      try {
        const saved = await menuService.saveMenuItem(item, imageFile)
        const idx = this.items.findIndex((i) => i.id === saved.id)
        if (idx !== -1) {
          this.items[idx] = saved
        } else {
          this.items.unshift(saved)
        }
        toastStore.success('Dish saved', `${saved.name} is now on the menu.`)
        return true
      } catch (err: unknown) {
        toastStore.error('Save failed', (err as Error)?.message || 'Unable to save dish.')
        return false
      }
    },
  },
})
