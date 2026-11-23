import api, { USE_MOCK } from './api'
import { MOCK_ORDERS } from './mockData'
import type { Order, OrderItem, OrderStatus, PaymentMethod } from '@/types'

let memoryOrders: Order[] = JSON.parse(JSON.stringify(MOCK_ORDERS))

const normalizeOrderItem = (raw: Record<string, unknown>): OrderItem => {
  const menuItem = raw.menu_item as Record<string, unknown> | undefined
  const unitPrice = Number(raw.unit_price ?? menuItem?.price ?? 0)
  return {
    id: raw.id !== undefined ? Number(raw.id) : undefined,
    order_id: raw.order_id !== undefined ? Number(raw.order_id) : undefined,
    menu_item_id: Number(raw.menu_item_id),
    name: String(raw.name ?? menuItem?.name ?? 'Dish'),
    unit_price: Number.isFinite(unitPrice) ? unitPrice : 0,
    quantity: Number(raw.quantity ?? 1),
    notes: raw.notes ? String(raw.notes) : '',
    image: (raw.image ?? menuItem?.image) ? String(raw.image ?? menuItem?.image) : undefined,
    artwork: (raw.artwork ?? menuItem?.artwork) as OrderItem['artwork'],
  }
}

const normalizeOrder = (payload: unknown): Order => {
  const container = payload as Record<string, unknown>
  const raw = (container?.order && typeof container.order === 'object'
    ? container.order
    : container) as Record<string, unknown>

  const table = raw.table as Record<string, unknown> | undefined
  const user = raw.user as Record<string, unknown> | undefined
  const rawItems = Array.isArray(raw.items) ? (raw.items as Record<string, unknown>[]) : []
  const status = (raw.status as OrderStatus) || 'pending'
  const paymentStatus =
    raw.payment_status === 'paid' || status === 'paid' ? 'paid' : 'unpaid'

  const id = Number(raw.id)
  const changeRaw = raw.change_amount ?? raw.change ?? container?.change
  return {
    id,
    order_ref: String(raw.order_ref || `ORD-${1000 + id}`),
    table_id: Number(raw.table_id ?? table?.id ?? 0),
    table_number: String(raw.table_number ?? table?.table_number ?? `T-${raw.table_id ?? ''}`),
    user_id: Number(raw.user_id ?? user?.id ?? 0),
    server_name: String(raw.server_name ?? user?.name ?? 'Staff'),
    status,
    payment_status: paymentStatus,
    subtotal: raw.subtotal != null ? Number(raw.subtotal) : undefined,
    service_charge: raw.service_charge != null ? Number(raw.service_charge) : null,
    total: Number(raw.total ?? 0),
    payment_method: (raw.payment_method as PaymentMethod | null | undefined) ?? null,
    amount_paid: raw.amount_paid != null ? Number(raw.amount_paid) : null,
    change_amount: changeRaw != null ? Number(changeRaw) : null,
    cancellation_reason: raw.cancellation_reason ? String(raw.cancellation_reason) : null,
    cancelled_by: raw.cancelled_by != null ? Number(raw.cancelled_by) : null,
    paid_at: raw.paid_at ? String(raw.paid_at) : null,
    created_at: String(raw.created_at || new Date().toISOString()),
    updated_at: raw.updated_at ? String(raw.updated_at) : undefined,
    items: rawItems.map(normalizeOrderItem),
  }
}

export const orderService = {
  async getOrders(): Promise<Order[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 60))
      return JSON.parse(JSON.stringify(memoryOrders))
    }
    const res = await api.get('/orders')
    return Array.isArray(res.data) ? res.data.map(normalizeOrder) : []
  },

  // Pay-First, Dine-After: Order starts as 'unpaid'; Kitchen receives it once payment is confirmed
  async createOrder(
    tableId: number,
    tableNumber: string,
    items: OrderItem[],
    serverName: string,
    userId: number,
    allowOccupied: boolean = false,
  ): Promise<Order> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 240))
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
      allow_occupied: allowOccupied,
      items: items.map((i) => ({
        menu_item_id: i.menu_item_id,
        quantity: i.quantity,
        notes: i.notes || undefined,
      })),
    })
    return normalizeOrder(res.data)
  },

  // Edit an unpaid order's line items when stepping back from Step 3 (Pay Bill) to Step 2 (Take Order)
  async updateUnpaidOrderItems(orderId: number, items: OrderItem[]): Promise<Order> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 180))
      const order = memoryOrders.find((o) => o.id === orderId)
      if (!order) throw new Error('Order not found')
      if (order.payment_status === 'paid') {
        throw new Error('Paid orders cannot be edited. Use Extra Food instead.')
      }
      order.items = JSON.parse(JSON.stringify(items))
      order.total = order.items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0)
      order.updated_at = new Date().toISOString()
      return JSON.parse(JSON.stringify(order))
    }

    const res = await api.put(`/orders/${orderId}/items`, {
      items: items.map((i) => ({
        menu_item_id: i.menu_item_id,
        quantity: i.quantity,
        notes: i.notes || undefined,
      })),
    })
    return normalizeOrder(res.data)
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
    return normalizeOrder(res.data)
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
    return normalizeOrder(res.data)
  },

  // Pay-First, Dine-After: Confirming payment marks payment_status='paid' and sends order into Kitchen queue
  async settlePayment(orderId: number, method: PaymentMethod, tenderAmount: number): Promise<Order> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400))
      const order = memoryOrders.find((o) => o.id === orderId)
      if (!order) throw new Error('Order not found')
      if (tenderAmount < order.total) {
        throw new Error('Amount received is less than the order total.')
      }

      order.payment_status = 'paid'
      order.status = 'pending' // Released to Kitchen Board to cook!
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
    return normalizeOrder(res.data)
  },

  // Called once guests finish dining and leave the table
  async completeDiningForTable(tableId: number, force: boolean = false): Promise<Order[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 120))
      const updated: Order[] = []
      for (const order of memoryOrders) {
        if (
          order.table_id === tableId &&
          order.payment_status === 'paid' &&
          ['pending', 'preparing', 'ready', 'served'].includes(order.status)
        ) {
          order.status = 'paid'
          order.updated_at = new Date().toISOString()
          updated.push(JSON.parse(JSON.stringify(order)))
        }
      }
      return updated
    }

    const res = await api.patch(`/tables/${tableId}/release`, { force })
    const rawOrders = Array.isArray(res.data?.orders) ? res.data.orders : []
    return rawOrders.map(normalizeOrder)
  },
}
