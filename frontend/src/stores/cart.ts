import { defineStore } from 'pinia'
import type { MenuItem, OrderItem } from '@/types'
import { useTablesStore } from './tables'
import { useToastStore } from './toast'

interface CartState {
  selectedTableId: number | null
  activeOrderId: number | null
  activeOrderRef: string | null
  items: OrderItem[]
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    selectedTableId: 1, // Default Table T-01
    activeOrderId: null,
    activeOrderRef: null,
    items: [],
  }),

  getters: {
    selectedTable: (state) => {
      if (!state.selectedTableId) return null
      const tablesStore = useTablesStore()
      return tablesStore.getTableById(state.selectedTableId) ?? null
    },
    itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    // Client-side display hint only; authoritative total is always computed by the server
    estimatedSubtotal: (state) =>
      state.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0),
    isAddonMode: (state) => state.activeOrderId !== null,
  },

  actions: {
    setTable(tableId: number, orderId: number | null = null, orderRef: string | null = null) {
      this.selectedTableId = tableId
      this.activeOrderId = orderId
      this.activeOrderRef = orderRef
    },

    addItem(menuItem: MenuItem, quantity: number = 1, notes: string = '') {
      if (!menuItem.is_available || quantity <= 0) return

      const cleanNote = notes.trim()
      const existing = this.items.find(
        (i) => i.menu_item_id === menuItem.id && (i.notes || '') === cleanNote,
      )
      if (existing) {
        existing.quantity += quantity
      } else {
        this.items.push({
          menu_item_id: menuItem.id,
          name: menuItem.name,
          unit_price: menuItem.price,
          quantity,
          notes: cleanNote,
          image: menuItem.image,
          artwork: menuItem.artwork,
          menu_item: menuItem,
        })
      }
    },

    updateQuantity(index: number, delta: number) {
      const item = this.items[index]
      if (!item) return
      const nextQty = item.quantity + delta
      if (nextQty <= 0) {
        this.removeItemAt(index)
      } else {
        item.quantity = nextQty
      }
    },

    updateNotes(index: number, notes: string) {
      const item = this.items[index]
      if (item) {
        item.notes = notes
      }
    },

    removeItemAt(index: number) {
      if (index < 0 || index >= this.items.length) return
      const removed = this.items[index]
      this.items.splice(index, 1)
      if (removed) {
        const toastStore = useToastStore()
        toastStore.undo(
          `Removed ${removed.name}`,
          'Tap Undo to restore this line item.',
          () => {
            this.items.splice(Math.min(index, this.items.length), 0, removed)
          },
        )
      }
    },

    // Term 6: Optimistic "Clear All" with an Undo toast instead of a confirm dialog
    clearCartWithUndo() {
      if (this.items.length === 0) return
      const snapshot = this.items.map((item) => ({ ...item }))
      const count = this.itemCount
      this.items = []

      const toastStore = useToastStore()
      toastStore.undo(
        'Order tray cleared',
        `${count} ${count === 1 ? 'item' : 'items'} removed from draft.`,
        () => {
          this.items = snapshot
        },
      )
    },

    clearCart() {
      this.items = []
      this.activeOrderId = null
      this.activeOrderRef = null
    },

    loadForAddon(tableId: number, orderId: number, orderRef: string) {
      this.selectedTableId = tableId
      this.activeOrderId = orderId
      this.activeOrderRef = orderRef
      this.items = []
    },
  },
})
