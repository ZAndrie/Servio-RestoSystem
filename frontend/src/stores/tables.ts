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
    async fetchTables(silent: boolean = false) {
      if (!silent) {
        this.isLoading = true
        this.error = null
      }
      try {
        const incoming = await tableService.getTables()
        if (this.tables.length === 0) {
          this.tables = incoming
        } else {
          for (const inc of incoming) {
            const existing = this.tables.find((t) => t.id === inc.id)
            if (existing) {
              if (existing.status !== inc.status) existing.status = inc.status
              if (existing.capacity !== inc.capacity) existing.capacity = inc.capacity
              if (existing.active_order_id !== inc.active_order_id) {
                existing.active_order_id = inc.active_order_id
              }
              if (existing.active_order_ref !== inc.active_order_ref) {
                existing.active_order_ref = inc.active_order_ref
              }
            } else {
              this.tables.push(inc)
            }
          }
        }
      } catch (err: unknown) {
        if (!silent) {
          this.error = (err as Error)?.message || 'Unable to load dining tables.'
        }
      } finally {
        if (!silent) this.isLoading = false
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

    markTableAvailableLocally(tableId: number) {
      const table = this.tables.find((t) => t.id === tableId)
      if (table) {
        table.status = 'available'
        table.active_order_id = null
        table.active_order_ref = null
      }
    },

    async releaseTable(tableId: number, force: boolean = false) {
      this.markTableAvailableLocally(tableId)
      try {
        await tableService.releaseTable(tableId, force)
      } catch {
        // Error surfaced by caller or next poll
      }
    },
  },
})
