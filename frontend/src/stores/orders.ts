import { defineStore } from 'pinia'
import type { Order, OrderStatus, PaymentMethod, OrderItem } from '@/types'
import { orderService } from '@/services/orderService'
import { useTablesStore } from './tables'
import { useToastStore } from './toast'

interface OrdersState {
  orders: Order[]
  isPolling: boolean
  pollingTimer: number | null
  isLoading: boolean
  isSubmitting: boolean
  error: string | null
  lastPolledAt: string | null
}

const isOrderPaid = (o: Order) => o.payment_status === 'paid' || o.status === 'paid'

let visibilityHandler: (() => void) | null = null

export const useOrdersStore = defineStore('orders', {
  state: (): OrdersState => ({
    orders: [],
    isPolling: false,
    pollingTimer: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
    lastPolledAt: null,
  }),

  getters: {
    // Unpaid orders awaiting upfront payment (Pay-First rule)
    unpaidOrders: (state) =>
      state.orders.filter((o) => !isOrderPaid(o) && o.status !== 'cancelled'),

    // Active orders currently in dining/kitchen workflow (includes both unpaid awaiting payment & paid dining)
    activeOrders: (state) =>
      state.orders.filter((o) => ['pending', 'preparing', 'ready', 'served'].includes(o.status)),

    // Kitchen Display ONLY sees paid orders (Pay-First, Dine-After!)
    kdsPendingOrders: (state) =>
      state.orders.filter((o) => isOrderPaid(o) && o.status === 'pending'),
    kdsPreparingOrders: (state) =>
      state.orders.filter((o) => isOrderPaid(o) && o.status === 'preparing'),
    kdsReadyOrders: (state) =>
      state.orders.filter((o) => isOrderPaid(o) && o.status === 'ready'),
    servedOrders: (state) =>
      state.orders.filter((o) => isOrderPaid(o) && o.status === 'served'),

    // All valid paid orders (excludes cancelled orders so revenue reports stay accurate!)
    paidOrders: (state) =>
      state.orders.filter((o) => isOrderPaid(o) && o.status !== 'cancelled'),

    cancelledOrders: (state) => state.orders.filter((o) => o.status === 'cancelled'),
    getOrderById: (state) => (id: number) => state.orders.find((o) => o.id === id),

    // Active dining/unpaid order for a specific table (prioritizes unpaid first, then latest active)
    getOrderByTableId: (state) => (tableId: number) => {
      const tableActive = state.orders.filter(
        (o) =>
          o.table_id === tableId &&
          ['pending', 'preparing', 'ready', 'served'].includes(o.status),
      )
      return tableActive.find((o) => !isOrderPaid(o)) ?? tableActive[0] ?? undefined
    },

    getActiveOrdersForTable: (state) => (tableId: number) =>
      state.orders.filter(
        (o) =>
          o.table_id === tableId &&
          ['pending', 'preparing', 'ready', 'served'].includes(o.status),
      ),

    // True when a table has paid orders still waiting/cooking/ready in the kitchen
    hasUnservedKitchenOrdersForTable: (state) => (tableId: number) =>
      state.orders.some(
        (o) =>
          o.table_id === tableId &&
          isOrderPaid(o) &&
          ['pending', 'preparing', 'ready'].includes(o.status),
      ),
  },

  actions: {
    // Polling patches existing order objects in place without reflowing lists
    async fetchOrders(silent: boolean = false) {
      if (!silent) {
        this.isLoading = true
        this.error = null
      }

      try {
        const incoming = await orderService.getOrders()

        if (this.orders.length === 0) {
          this.orders = incoming
        } else {
          const incomingIds = new Set(incoming.map((i) => i.id))
          for (const inc of incoming) {
            const existing = this.orders.find((o) => o.id === inc.id)
            if (existing) {
              if (existing.status !== inc.status) existing.status = inc.status
              if (existing.payment_status !== inc.payment_status) {
                existing.payment_status = inc.payment_status
              }
              if (existing.total !== inc.total) existing.total = inc.total
              if (existing.service_charge !== inc.service_charge) {
                existing.service_charge = inc.service_charge
              }
              if (existing.created_at !== inc.created_at) existing.created_at = inc.created_at
              if (existing.payment_method !== inc.payment_method) {
                existing.payment_method = inc.payment_method
              }
              if (existing.amount_paid !== inc.amount_paid) existing.amount_paid = inc.amount_paid
              if (existing.change_amount !== inc.change_amount) {
                existing.change_amount = inc.change_amount
              }
              if (existing.paid_at !== inc.paid_at) existing.paid_at = inc.paid_at
              if (existing.cancellation_reason !== inc.cancellation_reason) {
                existing.cancellation_reason = inc.cancellation_reason
              }
              if (
                existing.status !== 'paid' &&
                existing.status !== 'cancelled' &&
                JSON.stringify(existing.items) !== JSON.stringify(inc.items)
              ) {
                existing.items = inc.items
              }
            } else {
              this.orders.unshift(inc)
            }
          }
          // Drop any local rows removed on server
          if (this.orders.some((o) => !incomingIds.has(o.id))) {
            this.orders = this.orders.filter((o) => incomingIds.has(o.id))
          }
        }
        this.lastPolledAt = new Date().toISOString()
      } catch (err: unknown) {
        if (!silent) {
          this.error = (err as Error)?.message || 'Could not load orders.'
        }
      } finally {
        if (!silent) this.isLoading = false
      }
    },

    startPolling(intervalMs: number = 3500) {
      if (this.isPolling) return
      this.isPolling = true
      const tablesStore = useTablesStore()

      const pollOnce = () => {
        if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return
        this.fetchOrders(true)
        if (tablesStore.tables.length > 0) {
          tablesStore.fetchTables(true)
        }
      }

      this.fetchOrders(this.orders.length > 0)
      this.pollingTimer = window.setInterval(pollOnce, intervalMs)

      if (typeof document !== 'undefined') {
        visibilityHandler = () => {
          if (document.visibilityState === 'visible') {
            pollOnce()
          }
        }
        document.addEventListener('visibilitychange', visibilityHandler)
      }
    },

    stopPolling() {
      if (this.pollingTimer !== null) {
        clearInterval(this.pollingTimer)
        this.pollingTimer = null
      }
      if (typeof document !== 'undefined' && visibilityHandler) {
        document.removeEventListener('visibilitychange', visibilityHandler)
        visibilityHandler = null
      }
      this.isPolling = false
    },

    // Pay-First Step 2 -> Step 3: Creates unpaid order (or add-on ticket) and routes to Payment before Kitchen receives it
    async createOrderForPayment(
      tableId: number,
      tableNumber: string,
      items: OrderItem[],
      serverName: string,
      userId: number,
      allowOccupied: boolean = false,
    ): Promise<Order> {
      const toastStore = useToastStore()
      const tablesStore = useTablesStore()
      this.isSubmitting = true

      try {
        const newOrder = await orderService.createOrder(
          tableId,
          tableNumber,
          items,
          serverName,
          userId,
          allowOccupied,
        )
        this.orders.unshift(newOrder)
        tablesStore.occupyTable(tableId, newOrder.id, newOrder.order_ref)
        return newOrder
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          (err as Error)?.message ||
          'Could not prepare the bill.'
        toastStore.error('Order could not be created', msg)
        throw err
      } finally {
        this.isSubmitting = false
      }
    },

    // Update an existing unpaid order when waiter steps back from Payment -> Take Order
    async updateUnpaidOrderItems(orderId: number, items: OrderItem[]): Promise<Order> {
      const toastStore = useToastStore()
      this.isSubmitting = true

      try {
        const updated = await orderService.updateUnpaidOrderItems(orderId, items)
        const existing = this.orders.find((o) => o.id === orderId)
        if (existing) Object.assign(existing, updated)
        toastStore.info('Order updated', 'Ready to collect payment.')
        return updated
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          (err as Error)?.message ||
          'Could not update the unpaid order.'
        toastStore.error('Update failed', msg)
        throw err
      } finally {
        this.isSubmitting = false
      }
    },

    // Optimistic status progression with rollback on failure
    async updateStatus(
      orderId: number,
      nextStatus: OrderStatus,
      simulateFailure: boolean = false,
    ) {
      const order = this.orders.find((o) => o.id === orderId)
      if (!order) return

      const previousStatus = order.status
      order.status = nextStatus
      const toastStore = useToastStore()

      try {
        if (simulateFailure) throw new Error('Connection dropped while updating status.')
        const saved = await orderService.updateStatus(orderId, nextStatus)
        Object.assign(order, saved)
        if (nextStatus === 'ready') {
          const num = Number(order.table_number.replace(/\D/g, ''))
          toastStore.success(
            `Table ${num || order.table_number} food is ready!`,
            'Ready at the kitchen counter.',
          )
        }
      } catch (err: unknown) {
        order.status = previousStatus
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          (err as Error)?.message ||
          'Restored previous status.'
        toastStore.error('Status change could not be saved', msg)
      }
    },

    async cancelOrder(orderId: number, reason: string, cancelledByUserId: number): Promise<boolean> {
      const toastStore = useToastStore()
      const tablesStore = useTablesStore()
      this.isSubmitting = true

      try {
        const cancelled = await orderService.cancelOrder(orderId, reason, cancelledByUserId)
        const existing = this.orders.find((o) => o.id === orderId)
        if (existing) {
          Object.assign(existing, cancelled)
        }
        // Release table only if no other active orders remain on that table
        const stillActive = this.getActiveOrdersForTable(cancelled.table_id)
        if (stillActive.length === 0) {
          tablesStore.markTableAvailableLocally(cancelled.table_id)
          if (cancelled.payment_status === 'unpaid') {
            await tablesStore.releaseTable(cancelled.table_id)
          }
        }
        toastStore.info(
          'Order cancelled',
          `Table ${Number(cancelled.table_number.replace(/\D/g, '')) || cancelled.table_number} updated.`,
        )
        return true
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          (err as Error)?.message ||
          'Please try again.'
        toastStore.error('Could not cancel order', msg)
        return false
      } finally {
        this.isSubmitting = false
      }
    },

    // Pay-First, Dine-After: Money is NEVER optimistic. Once confirmed, order goes straight to Kitchen!
    async settlePayment(
      orderId: number,
      method: PaymentMethod,
      tenderAmount: number,
    ): Promise<Order | null> {
      const toastStore = useToastStore()
      const tablesStore = useTablesStore()
      this.isSubmitting = true

      try {
        const paidOrder = await orderService.settlePayment(orderId, method, tenderAmount)
        const existing = this.orders.find((o) => o.id === orderId)
        if (existing) {
          Object.assign(existing, paidOrder)
        } else {
          this.orders.unshift(paidOrder)
        }
        // Keep table occupied while guests wait for their food and dine!
        tablesStore.occupyTable(paidOrder.table_id, paidOrder.id, paidOrder.order_ref)
        const num = Number(paidOrder.table_number.replace(/\D/g, ''))
        toastStore.success(
          'Paid & sent to kitchen!',
          `Table ${num || paidOrder.table_number} order is now on the Kitchen Board.`,
        )
        return paidOrder
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          (err as Error)?.message ||
          'Please check the amount and try again.'
        toastStore.error('Payment not completed', msg)
        return null
      } finally {
        this.isSubmitting = false
      }
    },

    // After guests finish dining and leave, archive paid orders and release table back to Available
    async clearTableAfterDining(tableId: number, force: boolean = false): Promise<boolean> {
      const toastStore = useToastStore()
      const tablesStore = useTablesStore()
      this.isSubmitting = true

      try {
        const archived = await orderService.completeDiningForTable(tableId, force)
        for (const completed of archived) {
          const existing = this.orders.find((o) => o.id === completed.id)
          if (existing) Object.assign(existing, completed)
        }
        tablesStore.markTableAvailableLocally(tableId)
        const table = tablesStore.getTableById(tableId)
        const num = table ? Number(table.table_number.replace(/\D/g, '')) : tableId
        toastStore.success(`Table ${num} is now available`, 'Ready for the next guests.')
        return true
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          (err as Error)?.message ||
          'Please try again.'
        toastStore.error('Could not clear table', msg)
        return false
      } finally {
        this.isSubmitting = false
      }
    },
  },
})
