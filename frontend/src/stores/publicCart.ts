import { defineStore } from 'pinia'
import type { PublicMenuItem } from '@/data/publicMenu'

export interface PublicCartLine {
  lineId: string
  itemId: string
  name: string
  image: string
  imageFallback: string
  basePrice: number
  unitPrice: number
  quantity: number
  selectedOptions: Record<string, string>
  specialInstructions: string
}

export interface DemoOrderSnapshot {
  demoRef: string
  createdAt: string
  orderType: 'pickup' | 'delivery'
  customerName: string
  contactNumber: string
  deliveryAddress: string
  paymentMethod: string
  orderNotes: string
  items: PublicCartLine[]
  subtotal: number
}

const STORAGE_KEY = 'servio_public_cart_v1'

const loadLines = (): PublicCartLine[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const saveLines = (lines: PublicCartLine[]) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  } catch {
    // Ignore storage quota errors cleanly
  }
}

let seq = 0

export const usePublicCartStore = defineStore('publicCart', {
  state: () => ({
    items: loadLines(),
    isDrawerOpen: false,
    lastDemoOrder: null as DemoOrderSnapshot | null,
  }),

  getters: {
    itemCount: (state) => state.items.reduce((sum, line) => sum + line.quantity, 0),
    subtotal: (state) =>
      state.items.reduce((sum, line) => sum + Number((line.unitPrice * line.quantity).toFixed(2)), 0),
  },

  actions: {
    openDrawer() {
      this.isDrawerOpen = true
    },

    closeDrawer() {
      this.isDrawerOpen = false
    },

    addItem(
      item: PublicMenuItem,
      quantity: number = 1,
      selectedOptions: Record<string, string> = {},
      specialInstructions: string = '',
    ) {
      if (!item.available || quantity <= 0) return

      // Compute authoritative line unit price from base demo price + selected option deltas
      let deltaSum = 0
      if (item.customizations) {
        for (const group of item.customizations) {
          const pickedLabel = selectedOptions[group.name]
          const opt = group.options.find((o) => o.label === pickedLabel)
          if (opt) deltaSum += opt.delta
        }
      }

      const unitPrice = Number((item.demoPrice + deltaSum).toFixed(2))
      const cleanNote = specialInstructions.trim()
      const optionKey = JSON.stringify(selectedOptions)

      const existing = this.items.find(
        (l) =>
          l.itemId === item.id &&
          JSON.stringify(l.selectedOptions) === optionKey &&
          l.specialInstructions === cleanNote,
      )

      if (existing) {
        existing.quantity += quantity
      } else {
        this.items.push({
          lineId: `pub-${item.id}-${Date.now()}-${++seq}`,
          itemId: item.id,
          name: item.name,
          image: item.image.src,
          imageFallback: item.image.fallback,
          basePrice: item.demoPrice,
          unitPrice,
          quantity,
          selectedOptions: { ...selectedOptions },
          specialInstructions: cleanNote,
        })
      }

      saveLines(this.items)
    },

    updateQuantity(lineId: string, delta: number) {
      const idx = this.items.findIndex((l) => l.lineId === lineId)
      if (idx === -1) return
      const next = this.items[idx].quantity + delta
      if (next <= 0) {
        this.items.splice(idx, 1)
      } else {
        this.items[idx].quantity = next
      }
      saveLines(this.items)
    },

    updateLineInstructions(lineId: string, notes: string) {
      const target = this.items.find((l) => l.lineId === lineId)
      if (target) {
        target.specialInstructions = notes
        saveLines(this.items)
      }
    },

    updateLineCustomizations(
      lineId: string,
      item: PublicMenuItem,
      selectedOptions: Record<string, string>,
      specialInstructions: string,
    ) {
      const target = this.items.find((l) => l.lineId === lineId)
      if (!target) return
      let deltaSum = 0
      if (item.customizations) {
        for (const group of item.customizations) {
          const opt = group.options.find((o) => o.label === selectedOptions[group.name])
          if (opt) deltaSum += opt.delta
        }
      }
      target.selectedOptions = { ...selectedOptions }
      target.unitPrice = Number((item.demoPrice + deltaSum).toFixed(2))
      target.specialInstructions = specialInstructions.trim()
      saveLines(this.items)
    },

    removeItem(lineId: string) {
      this.items = this.items.filter((l) => l.lineId !== lineId)
      saveLines(this.items)
    },

    clearCart() {
      this.items = []
      saveLines(this.items)
    },

    // Explicitly marked Demo Order Preview — never pretends a live order or payment was processed
    recordDemoOrder(payload: Omit<DemoOrderSnapshot, 'demoRef' | 'createdAt' | 'items' | 'subtotal'>) {
      const snapshot: DemoOrderSnapshot = {
        ...payload,
        demoRef: `DEMO-${Math.floor(10000 + Math.random() * 90000)}`,
        createdAt: new Date().toISOString(),
        items: this.items.map((l) => ({ ...l, selectedOptions: { ...l.selectedOptions } })),
        subtotal: this.subtotal,
      }
      this.lastDemoOrder = snapshot
      this.clearCart()
      return snapshot
    },
  },
})
