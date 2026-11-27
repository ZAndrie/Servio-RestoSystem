<template>
  <main class="flex-1 px-4 sm:px-6 lg:px-8 py-5 max-w-6xl w-full mx-auto space-y-5">
    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div class="space-y-1">
        <h1 class="font-display text-2xl font-bold text-[var(--color-ink)]">
          {{ isReportRoute ? 'Sales Report' : greeting }}
        </h1>
        <p class="text-base text-[var(--color-muted)] text-pretty">
          {{ isReportRoute ? 'Daily sales, payment breakdown, and best-selling dishes.' : `Today’s restaurant summary (${todayLabel}).` }}
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <BaseButton variant="outline" size="sm" icon="table" @click="router.push('/tables')">
          Dining Room
        </BaseButton>
        <BaseButton variant="outline" size="sm" icon="cooking" @click="router.push('/kitchen')">
          Kitchen Board
        </BaseButton>
      </div>
    </header>

    <!-- Date Range Bar -->
    <section
      aria-label="Date range"
      class="px-4 py-3 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] space-y-2.5"
    >
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-3 text-sm">
          <span class="label-tracked text-[var(--color-muted)]">Date range</span>
          <div class="flex flex-wrap items-center gap-2.5">
            <div class="flex items-center gap-1.5">
              <label for="report-start" class="text-xs font-semibold text-[var(--color-muted)]">
                From
              </label>
              <input
                id="report-start"
                v-model="startDate"
                type="date"
                :aria-invalid="isInvalidRange ? 'true' : undefined"
                :aria-describedby="isInvalidRange ? 'date-range-error' : undefined"
                class="min-h-[44px] px-3 rounded-[var(--radius-input)] bg-[var(--color-bg)] border text-sm font-semibold tabular-nums text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none"
                :class="isInvalidRange ? 'border-[var(--color-berry)]' : 'border-[var(--color-line)]'"
              />
            </div>
            <div class="flex items-center gap-1.5">
              <label for="report-end" class="text-xs font-semibold text-[var(--color-muted)]">
                To
              </label>
              <input
                id="report-end"
                v-model="endDate"
                type="date"
                :aria-invalid="isInvalidRange ? 'true' : undefined"
                :aria-describedby="isInvalidRange ? 'date-range-error' : undefined"
                class="min-h-[44px] px-3 rounded-[var(--radius-input)] bg-[var(--color-bg)] border text-sm font-semibold tabular-nums text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none"
                :class="isInvalidRange ? 'border-[var(--color-berry)]' : 'border-[var(--color-line)]'"
              />
            </div>
          </div>
        </div>

        <span class="text-sm text-[var(--color-muted)]">
          Manila time
        </span>
      </div>

      <div
        v-if="isInvalidRange"
        id="date-range-error"
        role="alert"
        class="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-[var(--radius-input)] bg-[var(--color-berry-bg)] border border-[var(--color-berry)]/40 text-sm text-[var(--color-berry-ink)]"
      >
        <span class="font-semibold">
          Start date cannot be later than end date. Showing no orders until corrected.
        </span>
        <button
          type="button"
          class="min-h-[44px] px-3 rounded-[var(--radius-pill)] bg-[var(--color-surface)] border border-[var(--color-berry)]/40 text-xs font-bold text-[var(--color-berry-ink)] hover:bg-[var(--color-bg)] transition-ui cursor-pointer shrink-0"
          @click="resetDateRange"
        >
          Reset to today
        </button>
      </div>
    </section>

    <!-- Unified KPI Strip -->
    <section
      aria-label="Key business metrics"
      class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[var(--color-line)]"
    >
      <div class="md:col-span-5 p-6 bg-[var(--color-bg)]/50 space-y-1.5">
        <span class="label-tracked text-[var(--color-muted)]">{{ salesPeriodLabel }}</span>
        <p class="servio-total-numeral text-2xl font-bold text-[var(--color-accent)]">
          {{ formatCurrency(totalRevenue) }}
        </p>
        <p class="text-sm text-[var(--color-muted)] tabular-nums">
          From {{ paidOrders.length }} paid {{ paidOrders.length === 1 ? 'order' : 'orders' }}
        </p>
      </div>

      <div class="md:col-span-7 grid grid-cols-3 divide-x divide-[var(--color-line)]">
        <div class="p-5 flex flex-col justify-center space-y-1">
          <span class="label-tracked text-[var(--color-muted)]">Paid</span>
          <p class="text-xl font-bold text-[var(--color-ink)] tabular-nums">
            {{ paidOrders.length }}
          </p>
          <span class="text-xs text-[var(--color-muted)]">orders</span>
        </div>

        <div class="p-5 flex flex-col justify-center space-y-1">
          <span class="label-tracked text-[var(--color-muted)]">Tables</span>
          <p class="text-xl font-bold text-[var(--color-ink)] tabular-nums">
            {{ tablesStore.occupiedTables.length }}<span class="text-sm text-[var(--color-muted)]">/{{ tablesStore.tables.length || 10 }}</span>
          </p>
          <span class="text-xs text-[var(--color-muted)]">occupied</span>
        </div>

        <div class="p-5 flex flex-col justify-center space-y-1">
          <span class="label-tracked text-[var(--color-muted)]">Average bill</span>
          <p class="text-lg sm:text-xl font-bold text-[var(--color-ink)] tabular-nums">
            {{ formatCurrency(averageTicket) }}
          </p>
          <span class="text-xs text-[var(--color-muted)]">per table</span>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <section class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] overflow-hidden">
        <div class="px-5 py-4 border-b border-[var(--color-line)] flex items-center justify-between gap-2">
          <div>
            <h2 class="font-display text-lg font-bold text-[var(--color-ink)]">
              How guests paid
            </h2>
            <p class="text-sm text-[var(--color-muted)]">
              Cash, GCash, and Card breakdown
            </p>
          </div>
          <button
            type="button"
            class="min-h-[44px] inline-flex items-center px-3 rounded-[var(--radius-input)] text-sm font-semibold text-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] transition-ui cursor-pointer shrink-0"
            :aria-expanded="showPaymentDetail"
            @click="showPaymentDetail = !showPaymentDetail"
          >
            {{ showPaymentDetail ? 'Hide list' : 'Show orders' }}
          </button>
        </div>

        <div class="p-5 space-y-4">
          <div
            v-for="row in methodBreakdown"
            :key="row.key"
            class="space-y-1.5"
          >
            <div class="flex items-baseline justify-between text-base">
              <span class="font-medium text-[var(--color-ink)] flex items-center gap-2">
                <BaseIcon :name="row.icon" :size="16" custom-class="text-[var(--color-muted)]" />
                <span>{{ row.label }}</span>
              </span>
              <span class="tabular-nums font-semibold text-[var(--color-ink)] text-right">
                {{ formatCurrency(row.amount) }}
                <span class="text-xs text-[var(--color-muted)] ml-1">({{ row.percent }}%)</span>
              </span>
            </div>
            <div class="h-1.5 rounded-[2px] bg-[var(--color-line)]/75 overflow-hidden">
              <div
                class="h-full rounded-[2px] transition-ui"
                :class="row.barClass"
                :style="{ width: `${row.percent}%` }"
              />
            </div>
          </div>

          <!-- Progressive Disclosure: Expanded Paid Order Ledger -->
          <div
            v-if="showPaymentDetail"
            class="pt-4 border-t border-[var(--color-line)]"
          >
            <table class="w-full text-sm">
              <thead>
                <tr class="text-left text-[var(--color-muted)] border-b border-[var(--color-line)]">
                  <th class="pb-2 font-semibold">Order</th>
                  <th class="pb-2 font-semibold">Method</th>
                  <th class="pb-2 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[var(--color-line)]/70">
                <tr v-for="order in paidOrders" :key="order.id">
                  <td class="py-2.5 font-mono tabular-nums text-[var(--color-ink)]">
                    {{ order.order_ref }} · {{ formatTableLabel(order.table_number) }}
                  </td>
                  <td class="py-2.5 uppercase text-[var(--color-muted)]">
                    {{ order.payment_method }}
                  </td>
                  <td class="py-2.5 text-right font-semibold tabular-nums text-[var(--color-ink)]">
                    {{ formatCurrency(order.total) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Top-Selling Dishes Summary -> Expandable Full List -->
      <section class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] overflow-hidden">
        <div class="px-5 py-4 border-b border-[var(--color-line)] flex items-center justify-between gap-2">
          <div>
            <h2 class="font-display text-lg font-semibold text-[var(--color-ink)]">
              Top-selling dishes
            </h2>
            <p class="text-sm text-[var(--color-muted)]">
              Ranked by portions served
            </p>
          </div>
          <button
            v-if="topDishes.length > 3"
            type="button"
            class="min-h-[44px] inline-flex items-center px-3 rounded-[var(--radius-input)] text-sm font-semibold text-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] transition-ui cursor-pointer shrink-0"
            :aria-expanded="showAllDishes"
            @click="showAllDishes = !showAllDishes"
          >
            {{ showAllDishes ? 'Show top 3' : `Show all (${topDishes.length})` }}
          </button>
        </div>

        <div v-if="topDishes.length === 0" class="p-8 text-center text-sm text-[var(--color-muted)]">
          No settled dishes recorded yet for this range.
        </div>

        <ul v-else class="divide-y divide-[var(--color-line)] px-5 py-2">
          <li
            v-for="(dish, idx) in visibleTopDishes"
            :key="dish.name"
            class="py-3 flex items-center justify-between gap-3"
          >
            <div class="flex items-center gap-3 min-w-0">
              <span class="font-mono text-sm font-semibold text-[var(--color-muted)] w-5 tabular-nums shrink-0">
                {{ idx + 1 }}.
              </span>
              <div class="min-w-0">
                <p class="text-base font-semibold text-[var(--color-ink)] truncate">
                  {{ dish.name }}
                </p>
                <p class="text-xs text-[var(--color-muted)] tabular-nums">
                  {{ dish.quantity }} {{ dish.quantity === 1 ? 'portion' : 'portions' }} sold
                </p>
              </div>
            </div>
            <span class="text-base font-semibold tabular-nums text-[var(--color-ink)] text-right shrink-0">
              {{ formatCurrency(dish.revenue) }}
            </span>
          </li>
        </ul>
      </section>
    </div>

    <!-- Quiet Active Dining Room Monitor -->
    <section
      v-if="!isReportRoute"
      class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] overflow-hidden"
    >
      <div class="px-5 py-4 border-b border-[var(--color-line)] flex items-center justify-between gap-2">
        <h2 class="font-display text-lg font-semibold text-[var(--color-ink)]">
          Live floor monitor
        </h2>
        <span class="text-sm text-[var(--color-muted)] tabular-nums">
          {{ ordersStore.activeOrders.length }} active {{ ordersStore.activeOrders.length === 1 ? 'ticket' : 'tickets' }}
        </span>
      </div>

      <div
        v-if="ordersStore.activeOrders.length === 0"
        class="px-5 py-8 text-center text-base text-[var(--color-muted)]"
      >
        Nothing cooking yet — dining room is quiet.
      </div>

      <div v-else>
        <!-- Mobile (< 768px) stacked cards — zero horizontal table scrolling -->
        <ul class="md:hidden divide-y divide-[var(--color-line)]">
          <li
            v-for="order in ordersStore.activeOrders"
            :key="`mob-${order.id}`"
            class="p-4 space-y-2"
          >
            <div class="flex items-start justify-between gap-2">
              <div>
                <p class="font-semibold text-base text-[var(--color-ink)] tabular-nums">
                  {{ formatTableLabel(order.table_number) }}
                </p>
                <p class="font-mono text-xs tabular-nums text-[var(--color-muted)]">
                  {{ order.order_ref }} · {{ order.server_name }}
                </p>
              </div>
              <span
                v-if="order.payment_status === 'unpaid'"
                class="inline-flex items-center px-2.5 py-0.5 rounded-[var(--radius-input)] bg-[var(--color-honey-bg)] text-[var(--color-honey-ink)] border border-[var(--color-honey)]/50 label-tracked shrink-0"
              >
                Unpaid
              </span>
              <StatusBadge v-else :status="order.status" compact />
            </div>
            <div class="flex items-center justify-between text-sm pt-1 border-t border-[var(--color-line)]/60">
              <span class="text-[var(--color-muted)]">
                {{ order.items.reduce((sum, i) => sum + i.quantity, 0) }} items
              </span>
              <span class="font-semibold tabular-nums text-[var(--color-ink)]">
                {{ formatCurrency(order.total) }}
              </span>
            </div>
          </li>
        </ul>

        <!-- Tablet / Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-base text-left">
            <thead>
              <tr class="border-b border-[var(--color-line)] bg-[var(--color-bg)]/70 text-xs uppercase text-[var(--color-muted)]">
                <th class="py-3 px-5 font-semibold">Table</th>
                <th class="py-3 px-5 font-semibold">Order</th>
                <th class="py-3 px-5 font-semibold">Server</th>
                <th class="py-3 px-5 font-semibold">Status</th>
                <th class="py-3 px-5 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--color-line)]">
              <tr v-for="order in ordersStore.activeOrders" :key="order.id">
                <td class="py-3.5 px-5 font-semibold tabular-nums text-[var(--color-ink)]">
                  {{ formatTableLabel(order.table_number) }}
                </td>
                <td class="py-3.5 px-5 font-mono text-sm tabular-nums text-[var(--color-muted)]">
                  {{ order.order_ref }}
                </td>
                <td class="py-3.5 px-5 text-[var(--color-ink)]">
                  {{ order.server_name }}
                </td>
                <td class="py-3.5 px-5">
                  <span
                    v-if="order.payment_status === 'unpaid'"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-[var(--radius-input)] bg-[var(--color-honey-bg)] text-[var(--color-honey-ink)] border border-[var(--color-honey)]/50 label-tracked"
                  >
                    Unpaid
                  </span>
                  <StatusBadge v-else :status="order.status" compact />
                </td>
                <td class="py-3.5 px-5 text-right font-semibold tabular-nums text-[var(--color-ink)]">
                  {{ formatCurrency(order.total) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useOrdersStore } from '@/stores/orders'
import { useTablesStore } from '@/stores/tables'
import {
  formatCurrency,
  formatTableLabel,
  getManilaDateISO,
  getManilaGreeting,
} from '@/utils/format'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'
import StatusBadge from '@/components/base/StatusBadge.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()
const tablesStore = useTablesStore()

const todayIso = getManilaDateISO()
const startDate = ref(todayIso)
const endDate = ref(todayIso)

const isInvalidRange = computed(() =>
  Boolean(startDate.value && endDate.value && startDate.value > endDate.value),
)

const resetDateRange = () => {
  startDate.value = todayIso
  endDate.value = todayIso
}

const isReportRoute = computed(() => Boolean(route.meta.reportFocus))
const showPaymentDetail = ref(false)
const showAllDishes = ref(false)

watch(
  isReportRoute,
  (isRep) => {
    showPaymentDetail.value = isRep
    showAllDishes.value = isRep
  },
  { immediate: true },
)

onMounted(async () => {
  await Promise.all([ordersStore.fetchOrders(), tablesStore.fetchTables()])
  ordersStore.startPolling(3500)
})

onUnmounted(() => {
  ordersStore.stopPolling()
})

const greeting = computed(() => getManilaGreeting(authStore.user?.name))

const salesPeriodLabel = computed(() =>
  startDate.value === todayIso && endDate.value === todayIso
    ? "Today's sales"
    : 'Selected period sales',
)

const todayLabel = computed(() =>
  new Date().toLocaleDateString('en-PH', {
    timeZone: 'Asia/Manila',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }),
)

const paidOrders = computed(() => {
  if (isInvalidRange.value) return []
  const start = startDate.value
  const end = endDate.value
  return ordersStore.paidOrders.filter((order) => {
    const orderIso = getManilaDateISO(new Date(order.paid_at || order.created_at))
    if (start && orderIso < start) return false
    if (end && orderIso > end) return false
    return true
  })
})

const totalRevenue = computed(() =>
  paidOrders.value.reduce((sum, o) => sum + o.total, 0),
)

const averageTicket = computed(() =>
  paidOrders.value.length > 0 ? totalRevenue.value / paidOrders.value.length : 0,
)

const methodBreakdown = computed(() => {
  const sums = { cash: 0, gcash: 0, card: 0 }
  for (const o of paidOrders.value) {
    if (o.payment_method === 'cash') sums.cash += o.total
    else if (o.payment_method === 'gcash') sums.gcash += o.total
    else if (o.payment_method === 'card') sums.card += o.total
  }

  const baseRows = [
    {
      key: 'cash',
      label: 'Cash',
      icon: 'cash',
      amount: sums.cash,
      barClass: 'bg-[var(--color-leaf)]',
    },
    {
      key: 'gcash',
      label: 'GCash',
      icon: 'smartphone',
      amount: sums.gcash,
      barClass: 'bg-[var(--color-accent)]',
    },
    {
      key: 'card',
      label: 'Card',
      icon: 'credit-card',
      amount: sums.card,
      barClass: 'bg-[var(--color-pot)]',
    },
  ]

  const total = totalRevenue.value
  if (total <= 0) {
    return baseRows.map((row) => ({ ...row, percent: 0 }))
  }

  // Largest-remainder rounding guarantees Cash + GCash + Card always sum to 100%
  const raw = baseRows.map((row) => {
    const exact = (row.amount / total) * 100
    const floor = Math.floor(exact)
    return {
      ...row,
      percent: floor,
      remainder: exact - floor,
    }
  })

  let remainderPoints = 100 - raw.reduce((sum, row) => sum + row.percent, 0)
  const order = raw
    .map((row, index) => ({ index, remainder: row.remainder, amount: row.amount }))
    .sort((a, b) => b.remainder - a.remainder || b.amount - a.amount)

  for (const item of order) {
    if (remainderPoints <= 0) break
    const target = raw[item.index]
    if (target) {
      target.percent += 1
      remainderPoints -= 1
    }
  }

  return raw.map(({ remainder: _remainder, ...row }) => row)
})

const topDishes = computed(() => {
  const map = new Map<string, { name: string; quantity: number; revenue: number }>()
  for (const order of paidOrders.value) {
    for (const item of order.items) {
      const current = map.get(item.name) ?? { name: item.name, quantity: 0, revenue: 0 }
      current.quantity += item.quantity
      current.revenue += item.unit_price * item.quantity
      map.set(item.name, current)
    }
  }
  return Array.from(map.values()).sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue)
})

const visibleTopDishes = computed(() =>
  showAllDishes.value ? topDishes.value : topDishes.value.slice(0, 3),
)
</script>
