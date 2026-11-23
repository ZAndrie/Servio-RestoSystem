import api, { USE_MOCK } from './api'
import { MOCK_CATEGORIES, MOCK_MENU_ITEMS } from './mockData'
import type { Category, MenuItem } from '@/types'

let memoryCategories: Category[] = JSON.parse(JSON.stringify(MOCK_CATEGORIES))
let memoryItems: MenuItem[] = JSON.parse(JSON.stringify(MOCK_MENU_ITEMS))

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Could not read the selected image file.'))
    reader.readAsDataURL(file)
  })

const normalizeMenuItem = (raw: Record<string, unknown>): MenuItem => {
  const categoryId = Number(raw.category_id ?? 1)
  const defaultArtwork = categoryId === 3 ? 'glass' : categoryId === 2 ? 'dessert' : 'bowl'
  return {
    id: Number(raw.id),
    category_id: categoryId,
    name: String(raw.name ?? ''),
    description: raw.description ? String(raw.description) : '',
    price: Number(raw.price ?? 0),
    is_available: Boolean(raw.is_available),
    is_popular: Boolean(raw.is_popular),
    image: raw.image ? String(raw.image) : undefined,
    artwork: (raw.artwork as MenuItem['artwork']) || defaultArtwork,
  }
}

export const menuService = {
  async getCategories(): Promise<Category[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 40))
      return JSON.parse(JSON.stringify(memoryCategories))
    }
    const res = await api.get('/categories')
    return Array.isArray(res.data) ? res.data : []
  },

  async getMenuItems(): Promise<MenuItem[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 60))
      return JSON.parse(JSON.stringify(memoryItems))
    }
    const res = await api.get('/menu-items')
    return Array.isArray(res.data) ? res.data.map(normalizeMenuItem) : []
  },

  async toggleAvailability(
    itemId: number,
    nextAvailable: boolean,
    shouldFail: boolean = false,
  ): Promise<boolean> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 110))
      if (shouldFail) {
        throw new Error('Could not reach the kitchen server. Availability was restored.')
      }
      const item = memoryItems.find((i) => i.id === itemId)
      if (item) {
        item.is_available = nextAvailable
        return item.is_available
      }
      return false
    }

    const res = await api.patch(`/menu-items/${itemId}/availability`, {
      is_available: nextAvailable,
    })
    return Boolean(res.data.is_available)
  },

  async saveMenuItem(item: Partial<MenuItem>, imageFile?: File | null): Promise<MenuItem> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 120))
      let resolvedImage = item.image
      if (imageFile) {
        resolvedImage = await readFileAsDataUrl(imageFile)
      }

      if (item.id) {
        const idx = memoryItems.findIndex((i) => i.id === item.id)
        if (idx !== -1) {
          memoryItems[idx] = {
            ...memoryItems[idx],
            ...item,
            price: Number(item.price ?? memoryItems[idx].price),
            image: resolvedImage,
          } as MenuItem
          return JSON.parse(JSON.stringify(memoryItems[idx]))
        }
      }

      const id = Math.max(...memoryItems.map((i) => i.id), 0) + 1
      const categoryId = item.category_id || 1
      const defaultArtwork = categoryId === 3 ? 'glass' : categoryId === 2 ? 'dessert' : 'bowl'
      const created: MenuItem = {
        id,
        category_id: categoryId,
        name: item.name?.trim() || 'Untitled Dish',
        description: item.description?.trim() || '',
        price: Number(item.price) || 0,
        is_available: item.is_available ?? true,
        is_popular: item.is_popular ?? false,
        image: resolvedImage || undefined,
        artwork: item.artwork || defaultArtwork,
      }
      memoryItems.unshift(created)
      return JSON.parse(JSON.stringify(created))
    }

    // Live Laravel API: send multipart/form-data whenever a real image file is uploaded
    if (imageFile) {
      const formData = new FormData()
      if (item.name) formData.append('name', item.name.trim())
      if (item.category_id !== undefined) formData.append('category_id', String(item.category_id))
      if (item.price !== undefined) formData.append('price', String(item.price))
      if (item.description !== undefined) formData.append('description', item.description)
      if (item.is_popular !== undefined) formData.append('is_popular', item.is_popular ? '1' : '0')
      formData.append('image', imageFile)

      if (item.id) {
        formData.append('_method', 'PUT')
        const res = await api.post(`/menu-items/${item.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        return normalizeMenuItem(res.data)
      }

      const res = await api.post('/menu-items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return normalizeMenuItem(res.data)
    }

    if (item.id) {
      const res = await api.put(`/menu-items/${item.id}`, {
        ...item,
        remove_image: item.image === undefined,
      })
      return normalizeMenuItem(res.data)
    }
    const res = await api.post('/menu-items', item)
    return normalizeMenuItem(res.data)
  },
}
