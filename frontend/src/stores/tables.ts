import { defineStore } from 'pinia'
import type { DiningTable } from '@/types'
import { tableService } from '@/services/tableService'

interface TablesState {
  tables: DiningTable[]
  isLoading: boolean
  error: string | null
}

export const useTablesStore = defineStore('tables', {
  state: (): TablesState => ({
    tables: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    availableTables: (state) => state.tables.filter((t) => t.status === 'available'),
    occupiedTables: (state) => state.tables.filter((t) => t.status === 'occupied'),
    getTableById: (state) => (id: number) => state.tables.find((t) => t.id === id),
  },

  actions: {
    async fetchTables() {
      this.isLoading = true
      this.error = null
      try {
        this.tables = await tableService.getTables()
      } catch (err: unknown) {
        this.error = (err as Error)?.message || 'Unable to load dining tables.'
      } finally {
        this.isLoading = false
      }
    },

    occupyTable(tableId: number, orderId: number, orderRef: string) {
      const table = this.tables.find((t) => t.id === tableId)
      if (table) {
        table.status = 'occupied'
        table.active_order_id = orderId
        table.active_order_ref = orderRef
      }
      tableService.occupyTable(tableId, orderId, orderRef).catch(() => {})
    },

    releaseTable(tableId: number) {
      const table = this.tables.find((t) => t.id === tableId)
      if (table) {
        table.status = 'available'
        table.active_order_id = null
        table.active_order_ref = null
      }
      tableService.releaseTable(tableId).catch(() => {})
    },
  },
})
