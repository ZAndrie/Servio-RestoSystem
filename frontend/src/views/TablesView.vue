<template>
  <main class="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-6xl w-full mx-auto space-y-6">
    <!-- Friendly 2-Step Guide + Greeting -->
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div class="space-y-2">
        <!-- Simple visual 3-step Pay-First flow indicator -->
        <div class="flex flex-wrap items-center gap-2 text-sm font-semibold">
          <span class="px-3.5 py-1.5 rounded-[var(--radius-pill)] bg-[var(--color-accent)] text-[var(--color-surface)] font-bold">
            1. Choose a Table
          </span>
          <BaseIcon name="chevron-right" :size="14" custom-class="text-[var(--color-muted)]" />
          <span class="px-3.5 py-1.5 rounded-[var(--radius-pill)] bg-[var(--color-surface)] border border-[var(--color-line)] text-[var(--color-muted)]">
            2. Take Order
          </span>
          <BaseIcon name="chevron-right" :size="14" custom-class="text-[var(--color-muted)]" />
          <span class="px-3.5 py-1.5 rounded-[var(--radius-pill)] bg-[var(--color-surface)] border border-[var(--color-line)] text-[var(--color-muted)]">
            3. Pay & Send to Kitchen
          </span>
        </div>

        <h1 class="font-display text-2xl font-bold text-[var(--color-ink)]">
          {{ greeting }}
        </h1>
        <p class="text-base text-[var(--color-muted)] text-pretty prose-measure">
          Tap an available table to take their order and collect payment, or tap an occupied table to add extra food or clear the table once guests leave.
        </p>
      </div>

      <!-- At-a-Glance Floor Legend -->
      <div class="flex flex-wrap items-center gap-2.5 shrink-0">
        <div class="px-4 py-2.5 rounded-[var(--radius-card)] bg-[var(--color-leaf-bg)] border border-[var(--color-leaf)]/45 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-[var(--color-leaf)]" aria-hidden="true" />
          <span class="text-base font-bold tabular-nums text-[var(--color-leaf-ink)]">
            {{ availableCount }} Available
          </span>
        </div>
        <div class="px-4 py-2.5 rounded-[var(--radius-card)] bg-[var(--color-pot-bg)] border border-[var(--color-pot)]/45 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-[var(--color-pot)]" aria-hidden="true" />
          <span class="text-base font-bold tabular-nums text-[var(--color-pot-ink)]">
            {{ occupiedCount }} Occupied
          </span>
        </div>
      </div>
    </header>

    <!-- Ready Pickup Reminder (only shown when a table's food is ready at the counter) -->
    <section
      v-if="readyOrders.length > 0"
      aria-label="Food ready for pickup"
      class="rounded-[var(--radius-card)] bg-[var(--color-leaf-bg)] border border-[var(--color-leaf)]/50 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <div class="flex items-center gap-3">
        <span class="w-10 h-10 rounded-[var(--radius-pill)] bg-[var(--color-surface)] text-[var(--color-leaf-ink)] flex items-center justify-center shrink-0">
          <BaseIcon name="cloche" :size="20" custom-class="optical-cloche" />
        </span>
        <div>
          <p class="font-display text-lg font-bold text-[var(--color-leaf-ink)]">
            {{ readyBannerText }}
          </p>
          <p class="text-sm text-[var(--color-leaf-ink)]/90">
            Food is ready at the kitchen counter to bring out.
          </p>
        </div>
      </div>

      <BaseButton variant="dark" size="sm" @click="router.push('/orders')">
        View ready orders
      </BaseButton>
    </section>

    <!-- Quick Filter Chips -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter tables">
      <button
        v-for="tab in filterTabs"
        :key="tab.value"
        type="button"
        role="tab"
        :aria-selected="statusFilter === tab.value"
        class="min-h-[44px] px-5 rounded-[var(--radius-pill)] text-base font-semibold transition-ui whitespace-nowrap cursor-pointer shrink-0"
        :class="
          statusFilter === tab.value
            ? 'bg-[var(--color-ink)] text-[var(--color-surface)]'
            : 'bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-line)] hover:border-[var(--color-line-strong)]'
        "
        @click="statusFilter = tab.value"
      >
        {{ tab.label }} ({{ tab.count }})
      </button>
    </div>

    <!-- Loading Skeleton -->
    <div
      v-if="tablesStore.isLoading && tablesStore.tables.length === 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <div
        v-for="n in 8"
        :key="n"
        class="h-56 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)]"
      />
    </div>

    <!-- Error State -->
    <div
      v-else-if="tablesStore.error"
      role="alert"
      class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-berry)]/40 p-6 text-center space-y-3"
    >
      <p class="font-display text-lg font-bold text-[var(--color-ink)]">
        Could not load the dining room
      </p>
      <p class="text-sm text-[var(--color-muted)]">{{ tablesStore.error }}</p>
      <BaseButton variant="primary" size="md" @click="tablesStore.fetchTables()">
        Try again
      </BaseButton>
    </div>

    <!-- Visual Dining Room Floor Map -->
    <section
      v-else
      aria-label="Dining room floor plan"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <button
        v-for="entry in filteredTables"
        :key="entry.table.id"
        type="button"
        class="group text-left rounded-[var(--radius-card)] border p-5 flex flex-col justify-between gap-4 transition-ui active:translate-y-px cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        :class="tableCardClasses(entry)"
        @click="handleTableTap(entry)"
      >
        <!-- Top: Table Name + Status Pill -->
        <div class="flex items-start justify-between gap-2 w-full">
          <div class="shrink-0">
            <h2 class="font-display text-lg font-bold text-[var(--color-ink)] whitespace-nowrap">
              {{ friendlyTableName(entry.table.table_number) }}
            </h2>
            <p class="text-sm text-[var(--color-muted)]">
              {{ entry.table.capacity }} seats
            </p>
          </div>

          <span
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-[var(--radius-pill)] label-tracked border whitespace-nowrap shrink-0"
            :class="tableBadgeClasses(entry)"
          >
            <BaseIcon :name="tableBadgeIcon(entry)" :size="13" custom-class="optical-dot" />
            <span>{{ tableBadgeText(entry) }}</span>
          </span>
        </div>

        <!-- Center: Tactile Visual Tabletop & Chairs Diagram -->
        <div class="py-2 flex items-center justify-center" aria-hidden="true">
          <!-- 2-Seat Round Table -->
          <div v-if="entry.table.capacity <= 2" class="flex items-center gap-2.5">
            <span class="w-2.5 h-8 rounded-[var(--radius-pill)]" :class="chairColor(entry)" />
            <div
              class="w-20 h-20 rounded-[var(--radius-pill)] border-2 flex flex-col items-center justify-center"
              :class="tabletopClasses(entry)"
            >
              <span class="text-base font-bold tabular-nums">{{ entry.table.table_number }}</span>
            </div>
            <span class="w-2.5 h-8 rounded-[var(--radius-pill)]" :class="chairColor(entry)" />
          </div>

          <!-- 4-Seat Square Table -->
          <div v-else-if="entry.table.capacity <= 4" class="flex flex-col items-center gap-1.5">
            <div class="flex items-center gap-4">
              <span class="w-7 h-2.5 rounded-[var(--radius-pill)]" :class="chairColor(entry)" />
              <span class="w-7 h-2.5 rounded-[var(--radius-pill)]" :class="chairColor(entry)" />
            </div>
            <div
              class="w-28 h-16 rounded-[var(--radius-input)] border-2 flex flex-col items-center justify-center"
              :class="tabletopClasses(entry)"
            >
              <span class="text-base font-bold tabular-nums">{{ entry.table.table_number }}</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="w-7 h-2.5 rounded-[var(--radius-pill)]" :class="chairColor(entry)" />
              <span class="w-7 h-2.5 rounded-[var(--radius-pill)]" :class="chairColor(entry)" />
            </div>
          </div>

          <!-- 6- or 8-Seat Family Table -->
          <div v-else class="flex flex-col items-center gap-1.5">
            <div class="flex items-center gap-2.5">
              <span
                v-for="c in Math.ceil(entry.table.capacity / 2)"
                :key="`top-${c}`"
                class="w-6 h-2.5 rounded-[var(--radius-pill)]"
                :class="chairColor(entry)"
              />
            </div>
            <div
              class="w-36 h-16 rounded-[var(--radius-input)] border-2 flex flex-col items-center justify-center"
              :class="tabletopClasses(entry)"
            >
              <span class="text-base font-bold tabular-nums">{{ entry.table.table_number }}</span>
            </div>
            <div class="flex items-center gap-2.5">
              <span
                v-for="c in Math.floor(entry.table.capacity / 2)"
                :key="`bot-${c}`"
                class="w-6 h-2.5 rounded-[var(--radius-pill)]"
                :class="chairColor(entry)"
              />
            </div>
          </div>
        </div>

        <!-- Bottom: Clear Action Prompt or Live Bill Info -->
        <div class="pt-3 border-t border-[var(--color-line)]/80 w-full flex items-center justify-between gap-2">
          <template v-if="entry.order">
            <div class="min-w-0">
              <p class="text-sm font-semibold text-[var(--color-ink)] truncate">
                {{ friendlyOrderStatus(entry.order) }}
              </p>
              <p class="text-sm text-[var(--color-muted)] tabular-nums">
                {{ entry.order.items.reduce((s, i) => s + i.quantity, 0) }} items · {{ formatCurrency(entry.order.total) }}
              </p>
            </div>
            <span class="text-sm font-bold text-[var(--color-accent)] shrink-0">
              {{ entry.order.payment_status === 'unpaid' ? 'Pay Now →' : 'Manage →' }}
            </span>
          </template>

          <template v-else>
            <span class="text-sm font-semibold text-[var(--color-leaf-ink)]">
              Open for guests
            </span>
            <span class="text-sm font-bold text-[var(--color-accent)] group-hover:translate-x-0.5 transition-ui shrink-0">
              Seat & Order →
            </span>
          </template>
        </div>
      </button>
    </section>

    <!-- Occupied Table Quick Action Modal (Pay-First, Dine-After choices) -->
    <BaseDialog
      :model-value="Boolean(selectedOccupied)"
      :title="selectedOccupied ? `${friendlyTableName(selectedOccupied.table.table_number)} · ${selectedOccupied.order?.payment_status === 'unpaid' ? 'Awaiting Payment' : 'Dining'}` : ''"
      :subtitle="selectedOccupied?.order ? `${friendlyOrderStatus(selectedOccupied.order)} · ${selectedTableOrders.reduce((s, o) => s + o.items.reduce((q, i) => q + i.quantity, 0), 0)} items · ${formatCurrency(selectedTableOrders.reduce((s, o) => s + o.total, 0))}` : ''"
      max-width="sm"
      @update:model-value="(open) => { if (!open) closeOccupiedModal() }"
    >
      <div v-if="selectedOccupied?.order" class="space-y-4">
        <div
          v-for="ord in selectedTableOrders"
          :key="ord.id"
          class="rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)] p-3.5 space-y-1.5"
        >
          <div class="flex items-center justify-between gap-2">
            <p class="label-tracked text-[var(--color-muted)]">
              Order #{{ ord.order_ref.replace(/^#?ORD-?/i, '') }}
            </p>
            <span
              class="px-2.5 py-0.5 rounded-[var(--radius-pill)] label-tracked"
              :class="
                ord.payment_status === 'unpaid'
                  ? 'bg-[var(--color-honey-bg)] text-[var(--color-honey-ink)]'
                  : 'bg-[var(--color-leaf-bg)] text-[var(--color-leaf-ink)]'
              "
            >
              {{ ord.payment_status === 'unpaid' ? 'Unpaid' : friendlyOrderStatus(ord) }}
            </span>
          </div>
          <ul class="space-y-1 text-base text-[var(--color-ink)]">
            <li
              v-for="(item, idx) in ord.items"
              :key="`${item.menu_item_id}-${idx}`"
              class="flex justify-between gap-2"
            >
              <span class="truncate">{{ item.quantity }}× {{ item.name }}</span>
              <span class="tabular-nums font-semibold shrink-0">{{ formatCurrency(item.unit_price * item.quantity) }}</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2.5">
          <!-- If unpaid, primary CTA is Collect Payment -->
          <BaseButton
            v-if="selectedOccupied.order.payment_status === 'unpaid'"
            variant="primary"
            size="lg"
            icon="receipt"
            custom-class="w-full"
            @click="payOccupiedBill"
          >
            Collect Payment & Send to Kitchen
          </BaseButton>

          <!-- If already paid, guests are dining: can order extra food or clear table when done -->
          <template v-else>
            <BaseButton
              variant="primary"
              size="lg"
              icon="plus"
              custom-class="w-full"
              @click="addFoodToOccupied"
            >
              Order Extra Food (Pay First)
            </BaseButton>

            <!-- Guard: Prevent accidentally clearing a table while food is still cooking or waiting at counter -->
            <template v-if="selectedHasUnservedFood">
              <div
                v-if="!confirmForceClear"
                class="rounded-[var(--radius-input)] bg-[var(--color-honey-bg)] border border-[var(--color-honey)]/50 p-3 space-y-2"
              >
                <p class="text-sm font-semibold text-[var(--color-honey-ink)]">
                  Food is still active in the kitchen or at the pickup counter.
                </p>
                <BaseButton
                  variant="ghost"
                  size="sm"
                  custom-class="w-full"
                  @click="confirmForceClear = true"
                >
                  Guests already left? Clear table anyway...
                </BaseButton>
              </div>

              <div
                v-else
                class="rounded-[var(--radius-input)] bg-[var(--color-berry-bg)] border border-[var(--color-berry)]/45 p-3 space-y-2.5"
              >
                <p class="text-sm font-bold text-[var(--color-berry-ink)]">
                  Confirm clearing {{ friendlyTableName(selectedOccupied.table.table_number) }}? Active kitchen tickets will be closed.
                </p>
                <div class="flex items-center gap-2">
                  <BaseButton
                    variant="ghost"
                    size="sm"
                    custom-class="flex-1"
                    @click="confirmForceClear = false"
                  >
                    Keep open
                  </BaseButton>
                  <BaseButton
                    variant="danger"
                    size="sm"
                    :loading="ordersStore.isSubmitting"
                    custom-class="flex-1"
                    @click="clearOccupiedTable(true)"
                  >
                    Yes, clear table
                  </BaseButton>
                </div>
              </div>
            </template>

            <BaseButton
              v-else
              variant="dark"
              size="lg"
              icon="check"
              :loading="ordersStore.isSubmitting"
              custom-class="w-full"
              @click="clearOccupiedTable(false)"
            >
              Clear Table (Guests Left)
            </BaseButton>
          </template>

          <BaseButton
            variant="outline"
            size="lg"
            icon="clock"
            custom-class="w-full"
            @click="viewOccupiedOrder"
          >
            View Kitchen Progress
          </BaseButton>
        </div>
      </div>
    </BaseDialog>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import type { DiningTable, Order } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { useTablesStore } from '@/stores/tables'
import { useOrdersStore } from '@/stores/orders'
import { useCartStore } from '@/stores/cart'
import { formatCurrency, getManilaGreeting } from '@/utils/format'
import { executeViewTransition } from '@/utils/transition'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseDialog from '@/components/base/BaseDialog.vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'

interface TableEntry {
  table: DiningTable
  order: Order | null
  isOccupied: boolean
}

const router = useRouter()
const authStore = useAuthStore()
const tablesStore = useTablesStore()
const ordersStore = useOrdersStore()
const cartStore = useCartStore()

const statusFilter = ref<'all' | 'available' | 'occupied'>('all')
const selectedOccupied = ref<TableEntry | null>(null)
const confirmForceClear = ref(false)

const selectedTableOrders = computed(() =>
  selectedOccupied.value ? ordersStore.getActiveOrdersForTable(selectedOccupied.value.table.id) : [],
)

const selectedHasUnservedFood = computed(() =>
  selectedOccupied.value
    ? ordersStore.hasUnservedKitchenOrdersForTable(selectedOccupied.value.table.id)
    : false,
)

const closeOccupiedModal = () => {
  selectedOccupied.value = null
  confirmForceClear.value = false
}

onMounted(async () => {
  await tablesStore.fetchTables()
  ordersStore.startPolling(3500)
})

onUnmounted(() => {
  ordersStore.stopPolling()
})

const greeting = computed(() => getManilaGreeting(authStore.user?.name))

const tableEntries = computed<TableEntry[]>(() =>
  tablesStore.tables.map((table) => {
    const order = ordersStore.getOrderByTableId(table.id) ?? null
    return {
      table,
      order,
      isOccupied: Boolean(order) || table.status === 'occupied',
    }
  }),
)

const availableCount = computed(() => tableEntries.value.filter((e) => !e.isOccupied).length)
const occupiedCount = computed(() => tableEntries.value.filter((e) => e.isOccupied).length)

const filterTabs = computed(() => [
  { label: 'All Tables', value: 'all' as const, count: tableEntries.value.length },
  { label: 'Available', value: 'available' as const, count: availableCount.value },
  { label: 'Occupied', value: 'occupied' as const, count: occupiedCount.value },
])

const filteredTables = computed(() => {
  if (statusFilter.value === 'available') return tableEntries.value.filter((e) => !e.isOccupied)
  if (statusFilter.value === 'occupied') return tableEntries.value.filter((e) => e.isOccupied)
  return tableEntries.value
})

const readyOrders = computed(() => ordersStore.kdsReadyOrders)

const friendlyTableName = (tableNumber: string) => {
  const num = Number(tableNumber.replace(/\D/g, ''))
  return Number.isFinite(num) && num > 0 ? `Table ${num}` : tableNumber
}

const readyBannerText = computed(() => {
  if (readyOrders.value.length === 1) {
    return `${friendlyTableName(readyOrders.value[0].table_number)} food is ready!`
  }
  return `${readyOrders.value.length} tables have food ready!`
})

const friendlyOrderStatus = (order: Order) => {
  if (order.payment_status === 'unpaid') return 'Waiting for payment'
  switch (order.status) {
    case 'pending':
      return 'Paid · Sent to kitchen'
    case 'preparing':
      return 'Paid · Cooking now'
    case 'ready':
      return 'Paid · Food ready!'
    case 'served':
      return 'Paid · Dining now'
    default:
      return order.status
  }
}

const tableCardClasses = (entry: TableEntry) => {
  if (entry.order?.payment_status === 'unpaid') {
    return 'bg-[var(--color-surface)] border-[var(--color-honey)] hover:border-[var(--color-accent)]'
  }
  if (entry.order?.status === 'ready') {
    return 'bg-[var(--color-surface)] border-[var(--color-leaf)] hover:bg-[var(--color-leaf-bg)]/35'
  }
  if (entry.isOccupied) {
    return 'bg-[var(--color-surface)] border-[var(--color-pot)]/55 hover:border-[var(--color-pot)]'
  }
  return 'bg-[var(--color-surface)] border-[var(--color-line)] hover:border-[var(--color-leaf)] hover:bg-[var(--color-leaf-bg)]/20'
}

const tableBadgeClasses = (entry: TableEntry) => {
  if (entry.order?.payment_status === 'unpaid') {
    return 'bg-[var(--color-honey-bg)] text-[var(--color-honey-ink)] border-[var(--color-honey)]/55'
  }
  if (entry.order?.status === 'ready') {
    return 'bg-[var(--color-leaf-bg)] text-[var(--color-leaf-ink)] border-[var(--color-leaf)]/50'
  }
  if (entry.isOccupied) {
    return 'bg-[var(--color-pot-bg)] text-[var(--color-pot-ink)] border-[var(--color-pot)]/45'
  }
  return 'bg-[var(--color-leaf-bg)] text-[var(--color-leaf-ink)] border-[var(--color-leaf)]/40'
}

const tableBadgeIcon = (entry: TableEntry) => {
  if (entry.order?.payment_status === 'unpaid') return 'receipt'
  if (entry.order?.status === 'ready') return 'cloche'
  if (entry.isOccupied) return 'users'
  return 'check'
}

const tableBadgeText = (entry: TableEntry) => {
  if (entry.order?.payment_status === 'unpaid') return 'Unpaid'
  if (entry.order?.status === 'ready') return 'Food Ready'
  if (entry.isOccupied) return 'Occupied'
  return 'Available'
}

const tabletopClasses = (entry: TableEntry) => {
  if (entry.order?.status === 'ready') {
    return 'bg-[var(--color-leaf-bg)] border-[var(--color-leaf)] text-[var(--color-leaf-ink)]'
  }
  if (entry.isOccupied) {
    return 'bg-[var(--color-pot-bg)] border-[var(--color-pot)]/60 text-[var(--color-pot-ink)]'
  }
  return 'bg-[var(--color-bg)] border-[var(--color-leaf)]/50 text-[var(--color-ink)] group-hover:bg-[var(--color-leaf-bg)]/60'
}

const chairColor = (entry: TableEntry) => {
  if (entry.order?.status === 'ready') return 'bg-[var(--color-leaf)]/60'
  if (entry.isOccupied) return 'bg-[var(--color-pot)]/55'
  return 'bg-[var(--color-line-strong)] group-hover:bg-[var(--color-leaf)]/60'
}

// Step 1 -> Step 2 flow: Available table jumps straight to Take Order; Unpaid jumps to Pay; Paid Occupied opens management
const handleTableTap = (entry: TableEntry) => {
  if (!entry.isOccupied) {
    cartStore.clearCart()
    cartStore.setTable(entry.table.id, null, null)
    executeViewTransition(() => {
      router.push('/pos')
    })
  } else if (entry.order?.payment_status === 'unpaid') {
    executeViewTransition(() => {
      router.push(`/payment/${entry.order!.id}`)
    })
  } else {
    confirmForceClear.value = false
    selectedOccupied.value = entry
  }
}

const addFoodToOccupied = () => {
  if (!selectedOccupied.value?.order) return
  const { table, order } = selectedOccupied.value
  cartStore.loadForAddon(table.id, order.id, order.order_ref)
  closeOccupiedModal()
  executeViewTransition(() => {
    router.push('/pos')
  })
}

const payOccupiedBill = () => {
  if (!selectedOccupied.value?.order) return
  const id = selectedOccupied.value.order.id
  closeOccupiedModal()
  executeViewTransition(() => {
    router.push(`/payment/${id}`)
  })
}

const clearOccupiedTable = async (force: boolean = false) => {
  if (!selectedOccupied.value) return
  const clearedTableId = selectedOccupied.value.table.id
  const ok = await ordersStore.clearTableAfterDining(clearedTableId, force)
  if (ok) {
    if (cartStore.selectedTableId === clearedTableId) {
      cartStore.resetAll()
    }
    closeOccupiedModal()
  }
}

const viewOccupiedOrder = () => {
  closeOccupiedModal()
  executeViewTransition(() => {
    router.push('/orders')
  })
}
</script>
