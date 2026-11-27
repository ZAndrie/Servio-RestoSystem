<template>
  <main class="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-6xl w-full mx-auto space-y-6">
    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div class="space-y-1">
        <h1 class="font-display text-2xl font-bold text-[var(--color-ink)]">
          Orders
        </h1>
        <p class="text-base text-[var(--color-muted)] text-pretty">
          See what the kitchen is cooking and which tables are ready to serve.
        </p>
      </div>

      <BaseButton variant="primary" size="md" icon="table" @click="router.push('/tables')">
        Choose a table
      </BaseButton>
    </header>

    <!-- Ready-for-Pickup Callout Banner (calm, high signal, one dominant alert) -->
    <section
      v-if="ordersStore.kdsReadyOrders.length > 0"
      aria-label="Ready for pickup"
      class="rounded-[var(--radius-card)] bg-[var(--color-leaf-bg)] border border-[var(--color-leaf)]/50 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <div class="flex items-center gap-3">
        <span class="w-10 h-10 rounded-[var(--radius-pill)] bg-[var(--color-surface)] text-[var(--color-leaf-ink)] flex items-center justify-center shrink-0">
          <BaseIcon name="cloche" :size="20" custom-class="optical-cloche" />
        </span>
        <div>
          <p class="font-display text-lg font-bold text-[var(--color-leaf-ink)]">
            {{ readyBannerTitle }}
          </p>
          <p class="text-sm text-[var(--color-leaf-ink)]/90">
            Pick up at the kitchen counter and tap Served to Table once delivered.
          </p>
        </div>
      </div>

      <button
        type="button"
        class="min-h-[44px] px-4 rounded-[var(--radius-input)] bg-[var(--color-leaf-ink)] text-[var(--color-surface)] text-sm font-semibold transition-ui hover:opacity-90 cursor-pointer shrink-0"
        @click="activeFilter = 'ready'"
      >
        Show ready ({{ ordersStore.kdsReadyOrders.length }})
      </button>
    </section>

    <!-- Filter Tabs (Crisp 6px architectural controls) -->
    <div class="flex items-center gap-1.5 overflow-x-auto pb-1" role="group" aria-label="Filter active orders">
      <button
        v-for="tab in filterTabs"
        :key="tab.value"
        type="button"
        :aria-pressed="activeFilter === tab.value"
        class="min-h-[44px] px-4 rounded-[var(--radius-input)] text-sm font-semibold transition-ui inline-flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 border"
        :class="
          activeFilter === tab.value
            ? 'bg-[var(--color-ink)] text-[var(--color-surface)] border-[var(--color-ink)]'
            : 'bg-[var(--color-surface)] text-[var(--color-ink)] border-[var(--color-line)] hover:border-[var(--color-line-strong)]'
        "
        @click="activeFilter = tab.value"
      >
        <span>{{ tab.label }}</span>
        <span
          class="text-xs font-mono tabular-nums px-1.5 py-0.5 rounded-[var(--radius-input)]"
          :class="
            activeFilter === tab.value
              ? 'bg-[var(--color-surface)]/20 text-[var(--color-surface)]'
              : 'bg-[var(--color-surface-alt)] text-[var(--color-muted)]'
          "
        >
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="ordersStore.isLoading && ordersStore.orders.length === 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="n in 4"
        :key="n"
        class="h-60 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)]"
      />
    </div>

    <!-- Error State -->
    <div
      v-else-if="ordersStore.error"
      role="alert"
      class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-berry)]/40 p-6 text-center space-y-3"
    >
      <p class="font-display text-lg font-semibold text-[var(--color-ink)]">
        Could not sync active orders
      </p>
      <p class="text-sm text-[var(--color-muted)] prose-measure mx-auto">
        {{ ordersStore.error }}
      </p>
      <BaseButton variant="primary" size="md" @click="ordersStore.fetchOrders()">
        Retry
      </BaseButton>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredOrders.length === 0"
      class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] px-6 py-12 text-center space-y-2"
    >
      <div class="w-12 h-12 mx-auto rounded-[var(--radius-pill)] bg-[var(--color-surface-alt)] text-[var(--color-muted)] flex items-center justify-center mb-3">
        <BaseIcon name="cloche" :size="22" custom-class="optical-cloche" />
      </div>
      <p class="font-display text-xl font-semibold text-[var(--color-ink)]">
        Nothing cooking yet
      </p>
      <p class="text-base text-[var(--color-muted)] prose-measure mx-auto text-pretty">
        When waiters place a table order, tickets appear here in real time.
      </p>
    </div>

    <!-- Active Orders Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <OrderCard v-for="order in filteredOrders" :key="order.id" :order="order">
        <template #actions>
          <!-- Unpaid order: must pay first before kitchen starts -->
          <template v-if="order.payment_status === 'unpaid'">
            <BaseButton
              variant="primary"
              size="md"
              icon="receipt"
              custom-class="flex-1"
              @click="goToCheckout(order.id)"
            >
              Collect Payment
            </BaseButton>
            <BaseButton
              variant="ghost"
              size="md"
              @click="orderToCancel = order"
            >
              Cancel
            </BaseButton>
          </template>

          <!-- Paid order: dining lifecycle (Cooking -> Ready -> Served -> Clear Table) -->
          <template v-else>
            <BaseButton
              v-if="order.status === 'ready'"
              variant="primary"
              size="md"
              icon="check"
              custom-class="flex-1"
              @click="ordersStore.updateStatus(order.id, 'served')"
            >
              Served to Table
            </BaseButton>

            <BaseButton
              v-if="order.status === 'served' && !ordersStore.hasUnservedKitchenOrdersForTable(order.table_id)"
              variant="dark"
              size="md"
              icon="check"
              :loading="ordersStore.isSubmitting"
              custom-class="flex-1"
              @click="ordersStore.clearTableAfterDining(order.table_id)"
            >
              Clear Table (Guests Left)
            </BaseButton>

            <BaseButton
              v-if="['pending', 'preparing', 'ready', 'served'].includes(order.status)"
              variant="secondary"
              size="md"
              icon="plus"
              @click="addMoreItems(order)"
            >
              Extra Food
            </BaseButton>

            <BaseButton
              v-if="['pending', 'preparing'].includes(order.status)"
              variant="ghost"
              size="md"
              @click="orderToCancel = order"
            >
              Cancel
            </BaseButton>
          </template>
        </template>
      </OrderCard>
    </div>

    <CancelOrderModal
      :order="orderToCancel"
      @close="orderToCancel = null"
      @confirm="handleCancelOrder"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Order } from '@/types'
import { useOrdersStore } from '@/stores/orders'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { executeViewTransition } from '@/utils/transition'
import OrderCard from '@/components/OrderCard.vue'
import CancelOrderModal from '@/components/CancelOrderModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'

type FilterKey = 'all' | 'unpaid' | 'ready' | 'preparing' | 'pending' | 'served'

const router = useRouter()
const ordersStore = useOrdersStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

const activeFilter = ref<FilterKey>('all')
const orderToCancel = ref<Order | null>(null)

onMounted(() => {
  ordersStore.startPolling(3500)
})

onUnmounted(() => {
  ordersStore.stopPolling()
})

const readyBannerTitle = computed(() => {
  const ready = ordersStore.kdsReadyOrders
  if (ready.length === 1) {
    const num = Number(ready[0].table_number.replace(/\D/g, ''))
    return `Table ${num || ready[0].table_number} food is ready!`
  }
  return `${ready.length} tables have food ready!`
})

const filterTabs = computed<{ label: string; value: FilterKey; count: number }[]>(() => [
  { label: 'All Orders', value: 'all', count: ordersStore.activeOrders.length },
  { label: 'Unpaid', value: 'unpaid', count: ordersStore.unpaidOrders.length },
  { label: 'Ready', value: 'ready', count: ordersStore.kdsReadyOrders.length },
  { label: 'Cooking', value: 'preparing', count: ordersStore.kdsPreparingOrders.length },
  { label: 'Waiting', value: 'pending', count: ordersStore.kdsPendingOrders.length },
  { label: 'Served', value: 'served', count: ordersStore.servedOrders.length },
])

const filteredOrders = computed(() => {
  if (activeFilter.value === 'unpaid') return ordersStore.unpaidOrders
  if (activeFilter.value === 'ready') return ordersStore.kdsReadyOrders
  if (activeFilter.value === 'preparing') return ordersStore.kdsPreparingOrders
  if (activeFilter.value === 'pending') return ordersStore.kdsPendingOrders
  if (activeFilter.value === 'served') return ordersStore.servedOrders

  // Prioritize Ready (food at counter) and Unpaid (waiting at register) at the top
  const rank = (o: Order) => {
    if (o.payment_status === 'unpaid') return 1
    if (o.status === 'ready') return 0
    if (o.status === 'preparing') return 2
    if (o.status === 'pending') return 3
    if (o.status === 'served') return 4
    return 9
  }
  return [...ordersStore.activeOrders].sort((a, b) => rank(a) - rank(b))
})

const addMoreItems = (order: Order) => {
  cartStore.loadForAddon(order.table_id, order.id, order.order_ref)
  executeViewTransition(() => {
    router.push('/pos')
  })
}

const goToCheckout = (orderId: number) => {
  executeViewTransition(() => {
    router.push(`/payment/${orderId}`)
  })
}

const handleCancelOrder = async (reason: string) => {
  if (!orderToCancel.value) return
  if (!authStore.user) {
    router.push('/login')
    return
  }
  const ok = await ordersStore.cancelOrder(
    orderToCancel.value.id,
    reason,
    authStore.user.id,
  )
  if (ok) orderToCancel.value = null
}
</script>
