import api, { USE_MOCK } from './api'
import { MOCK_ORDERS } from './mockData'
import type { Order, OrderItem, OrderStatus, PaymentMethod } from '@/types'

let memoryOrders: Order[] = JSON.parse(JSON.stringify(MOCK_ORDERS))

export const orderService = {
  async getOrders(): Promise<Order[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 60))
      return JSON.parse(JSON.stringify(memoryOrders))
    }
    const res = await api.get('/orders')
    return res.data
  },

  // Pay-First, Dine-After: Order is created as 'unpaid' first; kitchen receives it once payment is confirmed
  async createOrder(
    tableId: number,
    tableNumber: string,
    items: OrderItem[],
    serverName: string,
    userId: number,
  ): Promise<Order> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 260))
      const orderId = Math.max(...memoryOrders.map((o) => o.id), 200) + 1
      const orderRef = `ORD-${1000 + orderId}`
      const serverComputedTotal = items.reduce(
        (sum, item) => sum + item.unit_price * item.quantity,
        0,
      )

      const newOrder: Order = {
        id: orderId,
        order_ref: orderRef,
        table_id: tableId,
        table_number: tableNumber,
        user_id: userId,
        server_name: serverName,
        status: 'pending',
        payment_status: 'unpaid',
        total: serverComputedTotal,
        created_at: new Date().toISOString(),
        items: JSON.parse(JSON.stringify(items)),
      }

      memoryOrders.unshift(newOrder)
      return JSON.parse(JSON.stringify(newOrder))
    }

    const res = await api.post('/orders', {
      table_id: tableId,
      items: items.map((i) => ({
        menu_item_id: i.menu_item_id,
        quantity: i.quantity,
        notes: i.notes || undefined,
      })),
    })
    return res.data
  },

  async appendAddonItems(orderId: number, additionalItems: OrderItem[]): Promise<Order> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 240))
      const order = memoryOrders.find((o) => o.id === orderId)
      if (!order) throw new Error('Order not found')

      for (const item of additionalItems) {
        const existing = order.items.find(
          (i) => i.menu_item_id === item.menu_item_id && (i.notes || '') === (item.notes || ''),
        )
        if (existing) {
          existing.quantity += item.quantity
        } else {
          order.items.push(JSON.parse(JSON.stringify(item)))
        }
      }

      order.total = order.items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0)
      order.updated_at = new Date().toISOString()
      return JSON.parse(JSON.stringify(order))
    }

    const res = await api.post(`/orders/${orderId}/add-items`, {
      items: additionalItems.map((i) => ({
        menu_item_id: i.menu_item_id,
        quantity: i.quantity,
        notes: i.notes || undefined,
      })),
    })
    return res.data
  },

  async updateStatus(orderId: number, status: OrderStatus): Promise<Order> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 80))
      const order = memoryOrders.find((o) => o.id === orderId)
      if (!order) throw new Error('Order not found')
      order.status = status
      order.updated_at = new Date().toISOString()
      return JSON.parse(JSON.stringify(order))
    }

    const res = await api.patch(`/orders/${orderId}/status`, { status })
    return res.data
  },

  async cancelOrder(orderId: number, reason: string, cancelledByUserId: number): Promise<Order> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 150))
      const order = memoryOrders.find((o) => o.id === orderId)
      if (!order) throw new Error('Order not found')
      order.status = 'cancelled'
      order.cancellation_reason = reason
      order.cancelled_by = cancelledByUserId
      order.updated_at = new Date().toISOString()
      return JSON.parse(JSON.stringify(order))
    }

    const res = await api.post(`/orders/${orderId}/cancel`, {
      reason,
      cancelled_by: cancelledByUserId,
    })
    return res.data
  },

  // Pay-First, Dine-After: Confirming payment marks payment_status='paid' and sends order into Kitchen queue (status='pending')
  async settlePayment(orderId: number, method: PaymentMethod, tenderAmount: number): Promise<Order> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 440))
      const order = memoryOrders.find((o) => o.id === orderId)
      if (!order) throw new Error('Order not found')
      if (tenderAmount < order.total) throw new Error('Amount received is less than the order total.')

      order.payment_status = 'paid'
      order.status = 'pending' // Now released to Kitchen Board to cook!
      order.payment_method = method
      order.amount_paid = tenderAmount
      order.change_amount = Math.max(0, Number((tenderAmount - order.total).toFixed(2)))
      order.paid_at = new Date().toISOString()
      order.created_at = new Date().toISOString() // Start kitchen prep timer right when paid!
      return JSON.parse(JSON.stringify(order))
    }

    const res = await api.post(`/orders/${orderId}/pay`, {
      payment_method: method,
      amount_paid: tenderAmount,
    })
    return res.data
  },

  // Called once guests finish dining and leave the table
  async completeDining(orderId: number): Promise<Order> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 120))
      const order = memoryOrders.find((o) => o.id === orderId)
      if (!order) throw new Error('Order not found')
      order.status = 'paid'
      order.payment_status = 'paid'
      order.updated_at = new Date().toISOString()
      return JSON.parse(JSON.stringify(order))
    }
    const res = await api.patch(`/orders/${orderId}/status`, { status: 'paid' })
    return res.data
  },
}
