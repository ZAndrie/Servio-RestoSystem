import { defineStore } from 'pinia'
import type { MenuItem, Order, OrderItem } from '@/types'
import { useTablesStore } from './tables'
import { useMenuStore } from './menu'
import { useToastStore } from './toast'

interface CartState {
  selectedTableId: number | null
  activeOrderId: number | null
  activeOrderRef: string | null
  editingOrderId: number | null
  items: OrderItem[]
}

const CART_STORAGE_KEY = 'servio_cart_draft'
let clientKeySeq = 0
const nextClientKey = (menuItemId: number) => `ci-${menuItemId}-${++clientKeySeq}`

const loadPersistedCart = (): CartState => {
  const empty: CartState = {
    selectedTableId: null,
    activeOrderId: null,
    activeOrderRef: null,
    editingOrderId: null,
    items: [],
  }
  if (typeof window === 'undefined') return empty
  try {
    const raw = window.sessionStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return empty
    const parsed = JSON.parse(raw) as Partial<CartState>
    const items = Array.isArray(parsed.items)
      ? parsed.items.map((it) => ({
          ...it,
          client_key: it.client_key || nextClientKey(Number(it.menu_item_id || 0)),
          unit_price: Number(it.unit_price || 0),
          quantity: Number(it.quantity || 1),
        }))
      : []
    return {
      selectedTableId: parsed.selectedTableId != null ? Number(parsed.selectedTableId) : null,
      activeOrderId: parsed.activeOrderId != null ? Number(parsed.activeOrderId) : null,
      activeOrderRef: parsed.activeOrderRef ? String(parsed.activeOrderRef) : null,
      editingOrderId: parsed.editingOrderId != null ? Number(parsed.editingOrderId) : null,
      items,
    }
  } catch {
    return empty
  }
}

const persistCart = (state: CartState) => {
  if (typeof window === 'undefined') return
  try {
    if (
      state.selectedTableId === null &&
      state.items.length === 0 &&
      state.activeOrderId === null &&
      state.editingOrderId === null
    ) {
      window.sessionStorage.removeItem(CART_STORAGE_KEY)
      return
    }
    window.sessionStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        selectedTableId: state.selectedTableId,
        activeOrderId: state.activeOrderId,
        activeOrderRef: state.activeOrderRef,
        editingOrderId: state.editingOrderId,
        items: state.items,
      }),
    )
  } catch {
    // Ignore storage quota / private mode failures gracefully
  }
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => loadPersistedCart(),

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
    isAddonMode: (state) => state.activeOrderId !== null && state.editingOrderId === null,
    isEditingUnpaid: (state) => state.editingOrderId !== null,
    isItemSoldOut: () => (menuItemId: number) => {
      const menuStore = useMenuStore()
      if (menuStore.items.length === 0) return false
      const live = menuStore.getItemById(menuItemId)
      return live ? !live.is_available : false
    },
    hasSoldOutItems(state): boolean {
      const menuStore = useMenuStore()
      if (menuStore.items.length === 0) return false
      return state.items.some((i) => {
        const live = menuStore.getItemById(i.menu_item_id)
        return live ? !live.is_available : false
      })
    },
  },

  actions: {
    setTable(
      tableId: number | null,
      orderId: number | null = null,
      orderRef: string | null = null,
    ) {
      this.selectedTableId = tableId
      this.activeOrderId = orderId
      this.activeOrderRef = orderRef
      this.editingOrderId = null
      persistCart(this.$state)
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
          client_key: nextClientKey(menuItem.id),
          menu_item_id: menuItem.id,
          name: menuItem.name,
          unit_price: Number(menuItem.price),
          quantity,
          notes: cleanNote,
          image: menuItem.image,
          artwork: menuItem.artwork,
          menu_item: menuItem,
        })
      }
      persistCart(this.$state)
    },

    updateQuantity(index: number, delta: number) {
      const item = this.items[index]
      if (!item) return
      if (delta > 0 && this.isItemSoldOut(item.menu_item_id)) {
        const toastStore = useToastStore()
        toastStore.error('Dish sold out', `${item.name} is no longer available.`)
        return
      }
      const nextQty = item.quantity + delta
      if (nextQty <= 0) {
        this.removeItemAt(index)
      } else {
        item.quantity = nextQty
        persistCart(this.$state)
      }
    },

    updateNotes(index: number, notes: string) {
      const item = this.items[index]
      if (item) {
        item.notes = notes
        persistCart(this.$state)
      }
    },

    removeItemAt(index: number) {
      if (index < 0 || index >= this.items.length) return
      const removed = this.items[index]
      this.items.splice(index, 1)
      persistCart(this.$state)
      if (removed) {
        const toastStore = useToastStore()
        toastStore.undo(
          `Removed ${removed.name}`,
          'Tap Undo to restore this line item.',
          () => {
            this.items.splice(Math.min(index, this.items.length), 0, removed)
            persistCart(this.$state)
          },
        )
      }
    },

    // Optimistic "Clear All" with an Undo toast instead of a confirm dialog
    clearCartWithUndo() {
      if (this.items.length === 0) return
      const snapshot = this.items.map((item) => ({ ...item }))
      const count = this.itemCount
      this.items = []
      persistCart(this.$state)

      const toastStore = useToastStore()
      toastStore.undo(
        'Order tray cleared',
        `${count} ${count === 1 ? 'item' : 'items'} removed from draft.`,
        () => {
          this.items = snapshot
          persistCart(this.$state)
        },
      )
    },

    clearCart() {
      this.items = []
      this.activeOrderId = null
      this.activeOrderRef = null
      this.editingOrderId = null
      persistCart(this.$state)
    },

    resetAll() {
      this.selectedTableId = null
      this.clearCart()
    },

    loadForAddon(tableId: number, orderId: number, orderRef: string) {
      this.selectedTableId = tableId
      this.activeOrderId = orderId
      this.activeOrderRef = orderRef
      this.editingOrderId = null
      this.items = []
      persistCart(this.$state)
    },

    // Allows stepping back from Step 3 (Pay Bill) to Step 2 (Take Order) to adjust an unpaid ticket
    loadUnpaidForEdit(order: Order) {
      this.selectedTableId = order.table_id
      this.activeOrderId = null
      this.activeOrderRef = order.order_ref
      this.editingOrderId = order.id
      this.items = order.items.map((item) => ({
        ...item,
        client_key: item.client_key || nextClientKey(item.menu_item_id),
        unit_price: Number(item.unit_price),
      }))
      persistCart(this.$state)
    },
  },
})
