<template>
  <main class="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-6xl w-full mx-auto space-y-6">
    <!-- Header with Clean Typographic Step Rail -->
    <header class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div class="space-y-2">
        <div class="flex flex-wrap items-center gap-1.5 text-sm">
          <button
            type="button"
            class="min-h-[44px] -ml-2 px-2.5 rounded-[var(--radius-input)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)] font-semibold inline-flex items-center transition-ui cursor-pointer"
            @click="router.push('/tables')"
          >
            <span>1. Tables</span>
          </button>
          <span class="text-[var(--color-line-strong)] font-mono" aria-hidden="true">/</span>
          <button
            type="button"
            class="min-h-[44px] px-2.5 rounded-[var(--radius-input)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)] font-semibold inline-flex items-center transition-ui cursor-pointer"
            @click="goBackToTakeOrder"
          >
            <span>2. Take Order</span>
          </button>
          <span class="text-[var(--color-line-strong)] font-mono" aria-hidden="true">/</span>
          <span class="px-2.5 py-1 rounded-[var(--radius-input)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-bold">
            3. Pay &amp; Send to Kitchen
          </span>
        </div>

        <h1 class="font-display text-2xl font-bold text-[var(--color-ink)]">
          Pay Bill & Receipts
        </h1>
        <p class="text-base text-[var(--color-muted)] text-pretty">
          Pay first, dine after — once payment is confirmed, the order goes straight to the kitchen.
        </p>
      </div>

      <BaseButton variant="outline" size="md" icon="table" @click="router.push('/tables')">
        Back to Tables
      </BaseButton>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left Column: Unpaid Orders Awaiting Payment + Recent Paid Receipts -->
      <section aria-label="Orders waiting for payment" class="lg:col-span-5 space-y-5">
        <div class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] overflow-hidden">
          <div class="px-5 py-4 border-b border-[var(--color-line)] flex items-center justify-between">
            <h2 class="font-display text-lg font-bold text-[var(--color-ink)]">
              Waiting for Payment
            </h2>
            <span
              class="px-2.5 py-0.5 rounded-[var(--radius-pill)] text-sm font-bold tabular-nums"
              :class="unpaidOrders.length > 0 ? 'bg-[var(--color-honey-bg)] text-[var(--color-honey-ink)]' : 'bg-[var(--color-surface-alt)] text-[var(--color-muted)]'"
            >
              {{ unpaidOrders.length }}
            </span>
          </div>

          <div
            v-if="unpaidOrders.length === 0"
            class="px-5 py-10 text-center space-y-2"
          >
            <p class="font-display text-lg font-bold text-[var(--color-ink)]">
              No unpaid orders
            </p>
            <p class="text-sm text-[var(--color-muted)] text-pretty">
              Every active order has been paid and sent to the kitchen. Pick a table to start a new order.
            </p>
            <div class="pt-2">
              <BaseButton variant="primary" size="sm" icon="table" @click="router.push('/tables')">
                Choose a Table
              </BaseButton>
            </div>
          </div>

          <ul v-else class="divide-y divide-[var(--color-line)]">
            <li v-for="order in unpaidOrders" :key="order.id">
              <button
                type="button"
                class="w-full min-h-[72px] px-5 py-3.5 text-left flex items-center justify-between gap-3 transition-ui cursor-pointer"
                :class="
                  selectedOrder?.id === order.id
                    ? 'bg-[var(--color-accent-subtle)]'
                    : 'hover:bg-[var(--color-surface-alt)]/70'
                "
                @click="selectOrder(order.id)"
              >
                <div class="min-w-0 space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="font-display font-bold text-base text-[var(--color-ink)]">
                      {{ friendlyTableName(order.table_number) }}
                    </span>
                    <span class="text-sm text-[var(--color-muted)] tabular-nums">
                      #{{ order.order_ref.replace(/^#?ORD-?/i, '') }}
                    </span>
                  </div>
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[var(--radius-pill)] bg-[var(--color-honey-bg)] text-[var(--color-honey-ink)] label-tracked">
                    <BaseIcon name="clock" :size="12" />
                    <span>Unpaid</span>
                  </span>
                </div>

                <div class="text-right shrink-0">
                  <p class="text-base font-bold tabular-nums text-[var(--color-ink)]">
                    {{ formatCurrency(order.total) }}
                  </p>
                  <p class="text-xs text-[var(--color-muted)] tabular-nums">
                    {{
                      order.items.reduce((s, i) => s + i.quantity, 0) === 1
                        ? '1 item'
                        : `${order.items.reduce((s, i) => s + i.quantity, 0)} items`
                    }}
                  </p>
                </div>
              </button>
            </li>
          </ul>
        </div>

        <!-- Recent Paid Receipts (Reprint anytime) -->
        <div
          v-if="ordersStore.paidOrders.length > 0"
          class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] overflow-hidden"
        >
          <div class="px-5 py-3.5 border-b border-[var(--color-line)]">
            <h2 class="label-tracked text-[var(--color-muted)]">
              Paid receipts (reprint)
            </h2>
          </div>
          <ul class="divide-y divide-[var(--color-line)]">
            <li
              v-for="paid in ordersStore.paidOrders.slice(0, 5)"
              :key="paid.id"
              class="px-5 py-3 flex items-center justify-between gap-3"
            >
              <div class="min-w-0">
                <p class="text-sm font-bold text-[var(--color-ink)] tabular-nums">
                  {{ friendlyTableName(paid.table_number) }} · #{{ paid.order_ref.replace(/^#?ORD-?/i, '') }}
                </p>
                <p class="text-xs text-[var(--color-muted)] uppercase tabular-nums">
                  {{ paid.payment_method || 'Paid' }} · {{ formatCurrency(paid.total) }}
                </p>
              </div>
              <BaseButton
                variant="outline"
                size="sm"
                icon="printer"
                @click="receiptOrder = paid"
              >
                Receipt
              </BaseButton>
            </li>
          </ul>
        </div>
      </section>

      <!-- Right Column: Checkout Desk -->
      <section aria-label="Checkout register" class="lg:col-span-7">
        <div
          v-if="!selectedOrder"
          class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] px-6 py-16 text-center space-y-2"
        >
          <div class="w-12 h-12 mx-auto rounded-[var(--radius-pill)] bg-[var(--color-surface-alt)] text-[var(--color-muted)] flex items-center justify-center mb-3">
            <BaseIcon name="receipt" :size="22" />
          </div>
          <p class="font-display text-xl font-bold text-[var(--color-ink)]">
            All orders are paid
          </p>
          <p class="text-base text-[var(--color-muted)] prose-measure mx-auto">
            Take a new order from Tables and you will come straight here to collect payment before cooking starts.
          </p>
        </div>

        <div
          v-else
          class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] overflow-hidden"
        >
          <!-- Dominant Amount Due Header -->
          <div class="px-6 py-5 bg-[var(--color-bg)] border-b border-[var(--color-line)] flex flex-wrap items-center justify-between gap-3">
            <div>
              <span class="label-tracked text-[var(--color-muted)]">
                Amount to pay · {{ friendlyTableName(selectedOrder.table_number) }}
              </span>
              <p class="mt-1 servio-total-numeral text-2xl font-bold text-[var(--color-accent)]">
                {{ formatCurrency(selectedOrder.total) }}
              </p>
            </div>

            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-pill)] bg-[var(--color-honey-bg)] border border-[var(--color-honey)]/50 text-[var(--color-honey-ink)] label-tracked">
              <BaseIcon name="clock" :size="14" />
              <span>Pay before cooking</span>
            </span>
          </div>

          <!-- Itemized Order Review -->
          <div class="px-6 py-4 border-b border-[var(--color-line)]">
            <div class="flex items-center justify-between gap-2 pb-2">
              <span class="label-tracked text-[var(--color-muted)]">Order items</span>
              <BaseButton
                variant="ghost"
                size="sm"
                icon="note"
                :disabled="ordersStore.isSubmitting"
                @click="editUnpaidOrder"
              >
                Edit items
              </BaseButton>
            </div>
            <ul class="divide-y divide-[var(--color-line)]/70">
              <li
                v-for="(item, idx) in selectedOrder.items"
                :key="`${item.menu_item_id}-${idx}`"
                class="py-2.5 space-y-1 text-base"
              >
                <div class="flex items-baseline justify-between gap-3">
                  <span class="min-w-0 truncate text-[var(--color-ink)]">
                    <strong class="tabular-nums text-[var(--color-accent)] mr-2">{{ item.quantity }}×</strong>
                    {{ item.name }}
                  </span>
                  <span class="tabular-nums font-semibold text-[var(--color-ink)] text-right shrink-0">
                    {{ formatCurrency(item.unit_price * item.quantity) }}
                  </span>
                </div>
                <p
                  v-if="item.notes"
                  class="ml-7 px-2.5 py-1 rounded-[var(--radius-input)] bg-[var(--color-honey-bg)] text-[var(--color-honey-ink)] text-xs font-semibold inline-block"
                >
                  Note: {{ item.notes }}
                </p>
              </li>
            </ul>

            <div
              v-if="selectedOrder.service_charge && selectedOrder.service_charge > 0"
              class="pt-2.5 mt-2 border-t border-[var(--color-line)] flex justify-between text-sm text-[var(--color-muted)]"
            >
              <span>Service charge</span>
              <span class="tabular-nums font-semibold text-[var(--color-ink)]">
                {{ formatCurrency(selectedOrder.service_charge) }}
              </span>
            </div>
          </div>

          <!-- Step 1: Payment Method Selection -->
          <div class="p-6 space-y-5">
            <div class="space-y-2.5">
              <span class="block label-tracked text-[var(--color-muted)]">
                1. How is the guest paying?
              </span>
              <div class="grid grid-cols-3 gap-3">
                <button
                  v-for="method in paymentMethods"
                  :key="method.value"
                  type="button"
                  class="min-h-[56px] px-3 py-3 rounded-[var(--radius-input)] border flex flex-col items-center justify-center gap-1.5 transition-ui cursor-pointer"
                  :class="
                    selectedMethod === method.value
                      ? 'bg-[var(--color-ink)] text-[var(--color-surface)] border-[var(--color-ink)] font-bold'
                      : 'bg-[var(--color-bg)] text-[var(--color-ink)] border-[var(--color-line)] hover:border-[var(--color-line-strong)] font-semibold'
                  "
                  @click="chooseMethod(method.value)"
                >
                  <BaseIcon :name="method.icon" :size="20" />
                  <span class="text-sm">{{ method.label }}</span>
                </button>
              </div>
            </div>

            <!-- Progressive Disclosure: Tender fields appear after method is chosen -->
            <div
              v-if="selectedMethod"
              class="pt-4 border-t border-[var(--color-line)] space-y-4"
            >
              <template v-if="selectedMethod === 'cash'">
                <div class="space-y-2.5">
                  <span class="block label-tracked text-[var(--color-muted)]">
                    2. Cash received
                  </span>

                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="preset in cashPresets"
                      :key="preset.label"
                      type="button"
                      class="min-h-[44px] px-4 rounded-[var(--radius-pill)] bg-[var(--color-bg)] border border-[var(--color-line)] hover:border-[var(--color-line-strong)] text-sm font-bold tabular-nums text-[var(--color-ink)] transition-ui cursor-pointer"
                      @click="cashTendered = preset.amount"
                    >
                      {{ preset.label }}
                    </button>
                  </div>

                  <div class="relative">
                    <label for="cash-input" class="sr-only">Cash received in PHP</label>
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-[var(--color-muted)]">
                      ₱
                    </span>
                    <input
                      id="cash-input"
                      v-model.number="cashTendered"
                      type="number"
                      min="0"
                      step="0.01"
                      inputmode="decimal"
                      placeholder="0.00"
                      class="w-full min-h-[48px] pl-10 pr-4 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)] text-lg font-bold tabular-nums text-right text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none"
                    />
                  </div>
                </div>

                <div
                  class="px-4 py-3.5 rounded-[var(--radius-input)] border flex items-baseline justify-between gap-2"
                  :class="
                    isCashSufficient
                      ? 'bg-[var(--color-leaf-bg)] border-[var(--color-leaf)]/45 text-[var(--color-leaf-ink)]'
                      : 'bg-[var(--color-berry-bg)] border-[var(--color-berry)]/40 text-[var(--color-berry-ink)]'
                  "
                >
                  <span class="text-base font-semibold">
                    {{ isCashSufficient ? 'Change to give back' : 'Amount still needed' }}
                  </span>
                  <span class="text-xl font-bold tabular-nums text-right">
                    {{ formatCurrency(Math.abs((cashTendered || 0) - selectedOrder.total)) }}
                  </span>
                </div>
              </template>

              <template v-else>
                <div class="px-4 py-3.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)] space-y-1">
                  <p class="text-base font-bold text-[var(--color-ink)]">
                    Exact {{ selectedMethod === 'gcash' ? 'GCash' : 'Card' }} payment
                  </p>
                  <p class="text-sm text-[var(--color-muted)] prose-measure">
                    Check the guest's {{ selectedMethod === 'gcash' ? 'GCash confirmation' : 'card slip' }} for
                    <strong class="tabular-nums text-[var(--color-ink)]">{{ formatCurrency(selectedOrder.total) }}</strong>
                    before confirming.
                  </p>
                </div>
              </template>

              <!-- Non-optimistic payment confirmation -> sends straight to Kitchen Board! -->
              <BaseButton
                variant="primary"
                size="lg"
                icon="check"
                :disabled="!canConfirmPayment || ordersStore.isSubmitting"
                :loading="ordersStore.isSubmitting"
                custom-class="w-full"
                @click="handleConfirmPayment"
              >
                {{
                  ordersStore.isSubmitting
                    ? 'Confirming payment...'
                    : `Confirm ${formatCurrency(selectedOrder.total)} & Send to Kitchen`
                }}
              </BaseButton>
            </div>

            <!-- Quiet Cancel Unpaid Order option if guest changes mind before paying -->
            <div class="pt-2 border-t border-[var(--color-line)] flex items-center justify-between gap-2">
              <span class="text-sm text-[var(--color-muted)]">
                Guest changed their mind?
              </span>
              <BaseButton
                variant="ghost"
                size="sm"
                :disabled="ordersStore.isSubmitting"
                @click="handleCancelUnpaid"
              >
                Cancel unpaid order
              </BaseButton>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 80mm Receipt Dialog -->
    <BaseDialog
      :model-value="Boolean(receiptOrder)"
      title="Paid & Sent to Kitchen"
      subtitle="Give this receipt to the guest — the kitchen is now preparing their order."
      max-width="sm"
      @update:model-value="(open) => { if (!open) closeReceipt() }"
    >
      <ReceiptView
        v-if="receiptOrder"
        :order="receiptOrder"
        @close="closeReceipt"
      />
    </BaseDialog>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Order, PaymentMethod } from '@/types'
import { useOrdersStore } from '@/stores/orders'
import { useTablesStore } from '@/stores/tables'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { formatCurrency, formatTableLabel } from '@/utils/format'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseDialog from '@/components/base/BaseDialog.vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'
import ReceiptView from '@/components/ReceiptView.vue'

const route = useRoute()
const router = useRouter()
const ordersStore = useOrdersStore()
const tablesStore = useTablesStore()
const authStore = useAuthStore()
const cartStore = useCartStore()

const selectedOrderId = ref<number | null>(null)
const selectedMethod = ref<PaymentMethod | null>(null)
const cashTendered = ref<number | null>(null)
const receiptOrder = ref<Order | null>(null)
const justCompletedPayment = ref(false)

const paymentMethods: { value: PaymentMethod; label: string; icon: string }[] = [
  { value: 'cash', label: 'Cash', icon: 'cash' },
  { value: 'gcash', label: 'GCash', icon: 'smartphone' },
  { value: 'card', label: 'Card', icon: 'credit-card' },
]

const friendlyTableName = formatTableLabel

const unpaidOrders = computed(() => ordersStore.unpaidOrders)

const syncSelectionFromRoute = () => {
  const paramId = Number(route.params.id)
  if (paramId && unpaidOrders.value.some((o) => o.id === paramId)) {
    selectedOrderId.value = paramId
  } else if (
    selectedOrderId.value &&
    unpaidOrders.value.some((o) => o.id === selectedOrderId.value)
  ) {
    // Preserve current selection while polling adds/updates other orders
  } else if (unpaidOrders.value.length > 0) {
    selectedOrderId.value = unpaidOrders.value[0].id
  } else {
    selectedOrderId.value = null
  }
}

onMounted(async () => {
  await Promise.all([ordersStore.fetchOrders(), tablesStore.fetchTables()])
  syncSelectionFromRoute()
  ordersStore.startPolling(3500)
})

onUnmounted(() => {
  ordersStore.stopPolling()
})

watch(() => route.params.id, syncSelectionFromRoute)
watch(() => unpaidOrders.value.length, syncSelectionFromRoute)

const selectedOrder = computed(() => {
  if (!selectedOrderId.value) return null
  return unpaidOrders.value.find((o) => o.id === selectedOrderId.value) ?? null
})

watch(selectedOrderId, () => {
  selectedMethod.value = null
  cashTendered.value = null
})

const selectOrder = (id: number) => {
  selectedOrderId.value = id
  router.replace(`/payment/${id}`)
}

const editUnpaidOrder = () => {
  if (!selectedOrder.value) return
  cartStore.loadUnpaidForEdit(selectedOrder.value)
  router.push('/pos')
}

const goBackToTakeOrder = () => {
  if (selectedOrder.value) {
    editUnpaidOrder()
  } else if (cartStore.selectedTableId) {
    router.push('/pos')
  } else {
    router.push('/tables')
  }
}

const chooseMethod = (method: PaymentMethod) => {
  selectedMethod.value = method
  // Require cashier to tap Exact, a bill preset, or type cash received so change is never skipped accidentally
  cashTendered.value = method === 'cash' ? null : (selectedOrder.value?.total ?? null)
}

const cashPresets = computed(() => {
  const total = selectedOrder.value?.total ?? 0
  const list = [{ label: 'Exact', amount: total }]
  for (const bill of [500, 1000, 2000]) {
    if (bill >= total) {
      list.push({ label: formatCurrency(bill), amount: bill })
    }
  }
  return list
})

const isCashSufficient = computed(() => {
  if (!selectedOrder.value || cashTendered.value === null || String(cashTendered.value) === '') {
    return false
  }
  return Number(cashTendered.value) >= selectedOrder.value.total
})

const canConfirmPayment = computed(() => {
  if (!selectedOrder.value || !selectedMethod.value) return false
  if (selectedMethod.value === 'cash') return isCashSufficient.value
  return true
})

const handleConfirmPayment = async () => {
  if (!selectedOrder.value || !selectedMethod.value || !canConfirmPayment.value) return
  const paidTableId = selectedOrder.value.table_id
  const tender =
    selectedMethod.value === 'cash' ? Number(cashTendered.value) : selectedOrder.value.total

  const settled = await ordersStore.settlePayment(
    selectedOrder.value.id,
    selectedMethod.value,
    tender,
  )
  if (settled) {
    if (cartStore.selectedTableId === paidTableId) {
      cartStore.resetAll()
    }
    receiptOrder.value = settled
    justCompletedPayment.value = true
    selectedMethod.value = null
    cashTendered.value = null
    selectedOrderId.value = unpaidOrders.value[0]?.id ?? null
  }
}

const handleCancelUnpaid = async () => {
  if (!selectedOrder.value) return
  if (!authStore.user) {
    router.push('/login')
    return
  }
  const cancelledTableId = selectedOrder.value.table_id
  const ok = await ordersStore.cancelOrder(
    selectedOrder.value.id,
    'Cancelled before payment',
    authStore.user.id,
  )
  if (ok) {
    if (cartStore.selectedTableId === cancelledTableId) {
      cartStore.resetAll()
    }
    selectedOrderId.value = unpaidOrders.value[0]?.id ?? null
    if (!selectedOrderId.value) {
      router.push('/tables')
    }
  }
}

const closeReceipt = () => {
  receiptOrder.value = null
  if (justCompletedPayment.value && unpaidOrders.value.length === 0) {
    justCompletedPayment.value = false
    router.push('/tables')
  }
}
</script>
