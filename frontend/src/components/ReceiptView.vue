<template>
  <div class="space-y-4">
    <!-- 80mm Thermal Receipt Paper Preview (72mm printable content, 42-column Geist Mono) -->
    <div
      class="receipt-print-area mx-auto w-full max-w-[42ch] bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[var(--radius-input)] p-5 font-mono text-xs leading-[1.45] text-[var(--color-ink)] tabular-nums"
    >
      <!-- Header -->
      <div class="text-center space-y-0.5 pb-3 border-b border-dashed border-[var(--color-line-strong)]">
        <p class="text-base font-semibold tracking-wide uppercase">SERVIO KITCHEN</p>
        <p class="text-[var(--color-muted)]">Home-Style Filipino Dining</p>
        <p class="text-[var(--color-muted)]">Official Order Receipt</p>
      </div>

      <!-- Ticket Meta -->
      <div class="py-3 space-y-1 border-b border-dashed border-[var(--color-line-strong)]">
        <div class="flex justify-between gap-2">
          <span class="text-[var(--color-muted)]">Order</span>
          <span class="font-semibold">{{ order.order_ref }}</span>
        </div>
        <div class="flex justify-between gap-2">
          <span class="text-[var(--color-muted)]">Table</span>
          <span class="font-semibold">{{ order.table_number }}</span>
        </div>
        <div class="flex justify-between gap-2">
          <span class="text-[var(--color-muted)]">Server</span>
          <span>{{ order.server_name }}</span>
        </div>
        <div class="flex justify-between gap-2">
          <span class="text-[var(--color-muted)]">Date</span>
          <span>{{ formatDateTimePH(order.paid_at || order.created_at) }}</span>
        </div>
      </div>

      <!-- Snapshotted Line Items -->
      <div class="py-3 space-y-2 border-b border-dashed border-[var(--color-line-strong)]">
        <div class="flex justify-between text-[var(--color-muted)] uppercase">
          <span>Qty Item</span>
          <span>Amount</span>
        </div>
        <div
          v-for="(item, idx) in order.items"
          :key="`${item.menu_item_id}-${idx}`"
          class="space-y-0.5"
        >
          <div class="flex justify-between gap-2">
            <span class="truncate">{{ item.quantity }}x {{ item.name }}</span>
            <span class="text-right shrink-0">{{ formatCurrency(item.unit_price * item.quantity) }}</span>
          </div>
          <div v-if="item.quantity > 1" class="text-[var(--color-muted)] pl-3">
            @ {{ formatCurrency(item.unit_price) }} each
          </div>
        </div>
      </div>

      <!-- Totals & Tender Breakdown -->
      <div class="py-3 space-y-1 border-b border-dashed border-[var(--color-line-strong)]">
        <div
          v-if="order.service_charge && order.service_charge > 0"
          class="flex justify-between gap-2"
        >
          <span class="text-[var(--color-muted)]">Service Charge</span>
          <span class="text-right">{{ formatCurrency(order.service_charge) }}</span>
        </div>

        <div class="flex justify-between gap-2 text-sm font-semibold pt-1">
          <span>TOTAL DUE</span>
          <span class="text-right">{{ formatCurrency(order.total) }}</span>
        </div>

        <div v-if="order.payment_method" class="flex justify-between gap-2 pt-1.5">
          <span class="text-[var(--color-muted)]">Method</span>
          <span class="uppercase font-semibold">{{ order.payment_method }}</span>
        </div>

        <div v-if="order.amount_paid != null" class="flex justify-between gap-2">
          <span class="text-[var(--color-muted)]">Tendered</span>
          <span class="text-right">{{ formatCurrency(order.amount_paid) }}</span>
        </div>

        <div v-if="order.change_amount != null" class="flex justify-between gap-2 font-semibold">
          <span>Change</span>
          <span class="text-right">{{ formatCurrency(order.change_amount) }}</span>
        </div>
      </div>

      <!-- Warm Footer Copy -->
      <div class="pt-3 text-center space-y-1">
        <p class="font-semibold text-sm">Salamat po!</p>
        <p class="text-[var(--color-muted)]">Thank you for dining with us.</p>
      </div>
    </div>

    <!-- Print Actions (Hidden during @media print) -->
    <div class="flex flex-wrap items-center justify-end gap-2 no-print">
      <BaseButton variant="outline" size="md" @click="$emit('close')">
        Done
      </BaseButton>
      <BaseButton variant="primary" size="md" icon="printer" @click="printReceipt">
        Print 80mm receipt
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '@/types'
import { formatCurrency, formatDateTimePH } from '@/utils/format'
import BaseButton from '@/components/base/BaseButton.vue'

defineProps<{
  order: Order
}>()

defineEmits<{
  (e: 'close'): void
}>()

const printReceipt = () => {
  window.print()
}
</script>
