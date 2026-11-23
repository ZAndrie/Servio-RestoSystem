import api, { USE_MOCK } from './api'
import { MOCK_TABLES } from './mockData'
import type { DiningTable } from '@/types'

let memoryTables: DiningTable[] = JSON.parse(JSON.stringify(MOCK_TABLES))

const DEFAULT_CAPACITIES = [2, 2, 4, 4, 6, 4, 4, 2, 6, 8]

const normalizeTable = (raw: Record<string, unknown>, idx: number): DiningTable => {
  const activeOrder = raw.active_order as Record<string, unknown> | null | undefined
  const id = Number(raw.id)
  return {
    id,
    table_number: String(raw.table_number ?? `T-${String(id).padStart(2, '0')}`),
    capacity: Number(raw.capacity ?? DEFAULT_CAPACITIES[idx % DEFAULT_CAPACITIES.length] ?? 4),
    status: raw.status === 'occupied' ? 'occupied' : 'available',
    active_order_id:
      raw.active_order_id != null
        ? Number(raw.active_order_id)
        : activeOrder?.id != null
          ? Number(activeOrder.id)
          : null,
    active_order_ref:
      raw.active_order_ref != null
        ? String(raw.active_order_ref)
        : activeOrder?.order_ref != null
          ? String(activeOrder.order_ref)
          : null,
  }
}

export const tableService = {
  async getTables(): Promise<DiningTable[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 60))
      return JSON.parse(JSON.stringify(memoryTables))
    }
    const res = await api.get('/tables')
    return Array.isArray(res.data) ? res.data.map(normalizeTable) : []
  },

  async occupyTable(tableId: number, orderId: number, orderRef: string): Promise<DiningTable | null> {
    if (USE_MOCK) {
      const table = memoryTables.find((t) => t.id === tableId)
      if (table) {
        table.status = 'occupied'
        table.active_order_id = orderId
        table.active_order_ref = orderRef
        return JSON.parse(JSON.stringify(table))
      }
      return null
    }
    const res = await api.patch(`/tables/${tableId}/occupy`, {
      order_id: orderId,
      order_ref: orderRef,
    })
    return normalizeTable(res.data, tableId - 1)
  },

  async releaseTable(tableId: number, force: boolean = false): Promise<DiningTable | null> {
    if (USE_MOCK) {
      const table = memoryTables.find((t) => t.id === tableId)
      if (table) {
        table.status = 'available'
        table.active_order_id = null
        table.active_order_ref = null
        return JSON.parse(JSON.stringify(table))
      }
      return null
    }
    const res = await api.patch(`/tables/${tableId}/release`, { force })
    const rawTable = res.data?.table ?? res.data
    return normalizeTable(rawTable, tableId - 1)
  },
}
