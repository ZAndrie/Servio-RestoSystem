import api, { USE_MOCK } from './api'
import { MOCK_TABLES } from './mockData'
import type { DiningTable } from '@/types'

let memoryTables: DiningTable[] = JSON.parse(JSON.stringify(MOCK_TABLES))

export const tableService = {
  async getTables(): Promise<DiningTable[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 60))
      return JSON.parse(JSON.stringify(memoryTables))
    }
    const res = await api.get('/tables')
    return res.data
  },

  async occupyTable(tableId: number, orderId: number, orderRef: string): Promise<DiningTable> {
    const table = memoryTables.find((t) => t.id === tableId)
    if (table) {
      table.status = 'occupied'
      table.active_order_id = orderId
      table.active_order_ref = orderRef
    }
    if (!USE_MOCK) {
      await api.patch(`/tables/${tableId}/occupy`, { order_id: orderId, order_ref: orderRef })
    }
    return JSON.parse(JSON.stringify(table))
  },

  async releaseTable(tableId: number): Promise<DiningTable> {
    const table = memoryTables.find((t) => t.id === tableId)
    if (table) {
      table.status = 'available'
      table.active_order_id = null
      table.active_order_ref = null
    }
    if (!USE_MOCK) {
      await api.patch(`/tables/${tableId}/release`)
    }
    return JSON.parse(JSON.stringify(table))
  },
}
