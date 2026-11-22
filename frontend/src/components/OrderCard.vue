<template>
  <article
    class="rounded-[var(--radius-card)] border flex flex-col justify-between transition-ui overflow-hidden"
    :class="cardClasses"
  >
    <div>
      <!-- Ticket Header -->
      <header
        class="px-5 py-4 border-b flex items-start justify-between gap-3"
        :class="kds ? 'border-[var(--color-kds-line)]' : 'border-[var(--color-line)]'"
      >
        <div class="space-y-1 min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="font-display font-bold tabular-nums"
              :class="kds ? 'text-xl text-[var(--color-kds-ink)]' : 'text-lg text-[var(--color-ink)]'"
            >
              {{ friendlyTable }}
            </span>
            <span
              class="text-sm tabular-nums"
              :class="kds ? 'text-[var(--color-kds-muted)]' : 'text-[var(--color-muted)]'"
            >
              #{{ order.order_ref.replace(/^#?ORD-?/i, '') }}
            </span>
          </div>
          <p
            class="text-sm truncate"
            :class="kds ? 'text-[var(--color-kds-muted)]' : 'text-[var(--color-muted)]'"
          >
            Taken by {{ order.server_name }}
          </p>
        </div>

        <div class="flex flex-col items-end gap-1.5 shrink-0">
          <div class="flex items-center gap-1.5">
            <span
              v-if="!kds && order.payment_status === 'unpaid'"
              class="inline-flex items-center px-2.5 py-1 rounded-[var(--radius-pill)] bg-[var(--color-honey-bg)] text-[var(--color-honey-ink)] border border-[var(--color-honey)]/50 label-tracked"
            >
              Unpaid
            </span>
            <span
              v-else-if="!kds && order.payment_status === 'paid'"
              class="inline-flex items-center px-2.5 py-1 rounded-[var(--radius-pill)] bg-[var(--color-leaf-bg)] text-[var(--color-leaf-ink)] border border-[var(--color-leaf)]/40 label-tracked"
            >
              Paid
            </span>
            <StatusBadge :status="order.status" :dark="kds" compact />
          </div>

          <span
            class="inline-flex items-center gap-1 tabular-nums px-2.5 py-0.5 rounded-[var(--radius-pill)]"
            :class="timerClasses"
          >
            <BaseIcon name="clock" :size="kds ? 15 : 13" />
            <span>{{ elapsedClock }}</span>
            <span v-if="isOverdue" class="label-tracked ml-0.5">· Running late</span>
          </span>
        </div>
      </header>

      <!-- Ticket Line Items (KDS >= 20px, leading 1.3) -->
      <ul
        class="px-5 py-4 divide-y"
        :class="kds ? 'divide-[var(--color-kds-line)]/70' : 'divide-[var(--color-line)]/80'"
      >
        <li
          v-for="(item, idx) in visibleItems"
          :key="`${item.menu_item_id}-${idx}`"
          class="py-2.5 first:pt-0 last:pb-0"
        >
          <div class="flex items-baseline justify-between gap-3">
            <div class="flex items-baseline gap-2.5 min-w-0">
              <span
                class="font-bold tabular-nums shrink-0"
                :class="
                  kds
                    ? 'text-xl text-[var(--color-kds-honey)]'
                    : 'text-base text-[var(--color-accent)]'
                "
              >
                {{ item.quantity }}×
              </span>
              <span
                class="font-bold leading-ticket text-pretty"
                :class="
                  kds
                    ? 'text-xl text-[var(--color-kds-ink)]'
                    : 'text-base text-[var(--color-ink)]'
                "
              >
                {{ item.name }}
              </span>
            </div>

            <span
              v-if="!kds"
              class="text-sm font-semibold tabular-nums text-right text-[var(--color-muted)] shrink-0"
            >
              {{ formatCurrency(item.unit_price * item.quantity) }}
            </span>
          </div>

          <p
            v-if="item.notes"
            class="mt-1.5 ml-8 px-3 py-1.5 rounded-[var(--radius-input)] text-pretty prose-measure"
            :class="
              kds
                ? 'bg-[var(--color-kds-honey)]/15 text-[var(--color-kds-honey)] text-base font-semibold leading-ticket'
                : 'bg-[var(--color-honey-bg)] text-[var(--color-honey-ink)] text-sm leading-snug'
            "
          >
            Note: {{ item.notes }}
          </p>
        </li>
      </ul>

      <div v-if="!kds && hiddenCount > 0" class="px-5 pb-3">
        <button
          type="button"
          class="touch-extend-44 text-sm font-bold text-[var(--color-accent)] hover:underline cursor-pointer"
          @click="showAllItems = !showAllItems"
        >
          {{ showAllItems ? 'Show fewer dishes' : `Show ${hiddenCount} more ${hiddenCount === 1 ? 'dish' : 'dishes'}` }}
        </button>
      </div>
    </div>

    <footer
      class="px-5 py-4 border-t space-y-3"
      :class="kds ? 'border-[var(--color-kds-line)] bg-[var(--color-kds-bg)]/40' : 'border-[var(--color-line)] bg-[var(--color-bg)]/60'"
    >
      <div v-if="!kds" class="flex items-baseline justify-between gap-2">
        <span class="text-sm text-[var(--color-muted)]">
          Order total ({{ totalUnits }} {{ totalUnits === 1 ? 'item' : 'items' }})
        </span>
        <span class="servio-total-numeral text-lg font-bold text-[var(--color-ink)] text-right">
          {{ formatCurrency(order.total) }}
        </span>
      </div>

      <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2">
        <slot name="actions" />
      </div>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Order } from '@/types'
import { useTicker } from '@/composables/useTicker'
import { formatCurrency, formatElapsedClock, getElapsedMinutes } from '@/utils/format'
import StatusBadge from '@/components/base/StatusBadge.vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'

const props = withDefaults(
  defineProps<{
    order: Order
    kds?: boolean
  }>(),
  {
    kds: false,
  },
)

const { now, start, stop } = useTicker()
const showAllItems = ref(false)

onMounted(start)
onUnmounted(stop)

const friendlyTable = computed(() => {
  const num = Number((props.order.table_number || '').replace(/\D/g, ''))
  return Number.isFinite(num) && num > 0 ? `Table ${num}` : props.order.table_number
})

const elapsedClock = computed(() => formatElapsedClock(props.order.created_at, now.value))

const isOverdue = computed(
  () =>
    ['pending', 'preparing'].includes(props.order.status) &&
    getElapsedMinutes(props.order.created_at, now.value) >= 10,
)

const totalUnits = computed(() =>
  props.order.items.reduce((sum, item) => sum + item.quantity, 0),
)

const visibleItems = computed(() => {
  if (props.kds || showAllItems.value || props.order.items.length <= 4) {
    return props.order.items
  }
  return props.order.items.slice(0, 4)
})

const hiddenCount = computed(() => Math.max(0, props.order.items.length - 4))

const cardClasses = computed(() => {
  if (props.kds) {
    return isOverdue.value
      ? 'bg-[var(--color-kds-surface)] border-[var(--color-kds-berry)]'
      : 'bg-[var(--color-kds-surface)] border-[var(--color-kds-line)]'
  }
  if (props.order.status === 'ready') {
    return 'bg-[var(--color-surface)] border-[var(--color-leaf)]'
  }
  if (isOverdue.value) {
    return 'bg-[var(--color-surface)] border-[var(--color-berry)]/70'
  }
  return 'bg-[var(--color-surface)] border-[var(--color-line)]'
})

const timerClasses = computed(() => {
  if (props.kds) {
    return isOverdue.value
      ? 'text-base font-bold bg-[var(--color-kds-berry)]/20 text-[var(--color-kds-berry)]'
      : 'text-base font-bold bg-[var(--color-kds-bg)] text-[var(--color-kds-ink)]'
  }
  return isOverdue.value
    ? 'text-sm font-bold bg-[var(--color-berry-bg)] text-[var(--color-berry-ink)]'
    : 'text-sm font-semibold bg-[var(--color-surface-alt)] text-[var(--color-muted)]'
})
</script>
