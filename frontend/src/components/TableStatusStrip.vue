<template>
  <section
    aria-label="Current table order status"
    class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] overflow-hidden transition-ui"
    style="view-transition-name: status-strip-card"
  >
    <button
      type="button"
      class="w-full min-h-[60px] px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-[var(--color-surface-alt)]/60 transition-ui cursor-pointer"
      :aria-expanded="isExpanded"
      @click="toggleExpand"
    >
      <div class="flex items-center gap-3 min-w-0">
        <span
          class="w-9 h-9 rounded-[var(--radius-pill)] flex items-center justify-center shrink-0"
          :class="iconWrapClass"
        >
          <BaseIcon :name="statusIcon" :size="18" custom-class="optical-cloche" />
        </span>

        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span class="text-base font-bold text-[var(--color-ink)] truncate">
              {{ headline }}
            </span>
            <StatusBadge v-if="activeOrder" :status="activeOrder.status" compact />
          </div>
          <p class="text-sm text-[var(--color-muted)] truncate tabular-nums">
            {{ subline }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <span
          v-if="activeOrder"
          class="text-sm font-bold tabular-nums px-3 py-1 rounded-[var(--radius-pill)]"
          :class="
            isOverdue
              ? 'bg-[var(--color-berry-bg)] text-[var(--color-berry-ink)]'
              : 'bg-[var(--color-surface-alt)] text-[var(--color-ink)]'
          "
        >
          {{ elapsedClock }}
        </span>
        <BaseIcon
          name="chevron-down"
          :size="17"
          :custom-class="[
            'text-[var(--color-muted)] optical-chevron transition-transform duration-150',
            isExpanded ? 'rotate-180' : '',
          ].join(' ')"
        />
      </div>
    </button>

    <div
      v-if="isExpanded"
      class="px-4 pb-4 pt-3 border-t border-[var(--color-line)] bg-[var(--color-bg)]/60 space-y-3"
    >
      <template v-if="activeOrder">
        <ol class="grid grid-cols-3 gap-2" aria-label="Kitchen progress">
          <li
            v-for="step in timelineSteps"
            :key="step.key"
            class="px-3 py-2 rounded-[var(--radius-input)] border text-sm flex items-center gap-2"
            :class="
              step.reached
                ? 'bg-[var(--color-surface)] border-[var(--color-accent)]/40 text-[var(--color-ink)] font-bold'
                : 'bg-[var(--color-surface-alt)]/50 border-[var(--color-line)] text-[var(--color-muted)]'
            "
          >
            <BaseIcon
              :name="step.reached ? 'check' : step.icon"
              :size="14"
              :custom-class="step.reached ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)]'"
            />
            <span class="truncate">{{ step.label }}</span>
          </li>
        </ol>

        <div class="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span class="text-[var(--color-muted)] tabular-nums">
            <strong class="text-[var(--color-ink)]">{{ activeOrder.items.length }} {{ activeOrder.items.length === 1 ? 'dish' : 'dishes' }}</strong>
            · {{ formatCurrency(activeOrder.total) }}
          </span>

          <div class="flex items-center gap-2">
            <BaseButton
              v-if="activeOrder.payment_status === 'unpaid'"
              variant="primary"
              size="sm"
              @click="goToPayment"
            >
              Collect Payment
            </BaseButton>
            <BaseButton variant="outline" size="sm" @click="goToOrders">
              View Orders
            </BaseButton>
          </div>
        </div>
      </template>

      <p v-else class="text-sm text-[var(--color-muted)] prose-measure">
        No active order on <strong class="text-[var(--color-ink)]">{{ friendlyTable }}</strong> yet. Tap dishes above and press Send to Kitchen.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Order } from '@/types'
import { useTicker } from '@/composables/useTicker'
import { formatCurrency, formatElapsedClock, getElapsedMinutes } from '@/utils/format'
import { executeViewTransition } from '@/utils/transition'
import BaseIcon from '@/components/icons/BaseIcon.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import StatusBadge from '@/components/base/StatusBadge.vue'

const props = defineProps<{
  tableNumber: string
  activeOrder: Order | null
}>()

const router = useRouter()
const { now, start, stop } = useTicker()
const isExpanded = ref(false)

onMounted(start)
onUnmounted(stop)

const friendlyTable = computed(() => {
  const num = Number((props.tableNumber || '').replace(/\D/g, ''))
  return Number.isFinite(num) && num > 0 ? `Table ${num}` : props.tableNumber
})

const elapsedClock = computed(() =>
  props.activeOrder ? formatElapsedClock(props.activeOrder.created_at, now.value) : '00:00',
)

const isOverdue = computed(() =>
  props.activeOrder
    ? ['pending', 'preparing'].includes(props.activeOrder.status) &&
      getElapsedMinutes(props.activeOrder.created_at, now.value) >= 10
    : false,
)

const statusIcon = computed(() => {
  if (!props.activeOrder) return 'cloche'
  if (props.activeOrder.status === 'ready') return 'check'
  if (props.activeOrder.status === 'preparing') return 'cooking'
  return 'clock'
})

const iconWrapClass = computed(() => {
  if (!props.activeOrder) return 'bg-[var(--color-surface-alt)] text-[var(--color-muted)]'
  if (props.activeOrder.status === 'ready') return 'bg-[var(--color-leaf-bg)] text-[var(--color-leaf-ink)]'
  if (props.activeOrder.status === 'preparing') return 'bg-[var(--color-pot-bg)] text-[var(--color-pot-ink)]'
  return 'bg-[var(--color-honey-bg)] text-[var(--color-honey-ink)]'
})

const headline = computed(() => {
  if (!props.activeOrder) return `Nothing cooking yet for ${friendlyTable.value}`
  if (props.activeOrder.payment_status === 'unpaid') {
    return `${friendlyTable.value} is waiting for payment`
  }
  if (props.activeOrder.status === 'ready') return `${friendlyTable.value} food is ready!`
  if (props.activeOrder.status === 'preparing') return `${friendlyTable.value} is cooking now`
  if (props.activeOrder.status === 'served') return `${friendlyTable.value} is dining (paid)`
  return `${friendlyTable.value} paid & sent to kitchen`
})

const subline = computed(() => {
  if (!props.activeOrder) return 'Kitchen progress appears here once an order is sent'
  return `${activeOrderItemsLabel.value} · Tap to see kitchen progress`
})

const activeOrderItemsLabel = computed(() => {
  if (!props.activeOrder) return ''
  const qty = props.activeOrder.items.reduce((s, i) => s + i.quantity, 0)
  return `${qty} ${qty === 1 ? 'item' : 'items'} · ${formatCurrency(props.activeOrder.total)}`
})

const stepOrder = ['pending', 'preparing', 'ready', 'served', 'paid']

const timelineSteps = computed(() => {
  const currentIdx = props.activeOrder ? stepOrder.indexOf(props.activeOrder.status) : -1
  return [
    { key: 'pending', label: 'Ordered', icon: 'clock', reached: currentIdx >= 0 },
    { key: 'preparing', label: 'Cooking', icon: 'cooking', reached: currentIdx >= 1 },
    { key: 'ready', label: 'Ready', icon: 'check', reached: currentIdx >= 2 },
  ]
})

const toggleExpand = () => {
  executeViewTransition(() => {
    isExpanded.value = !isExpanded.value
  })
}

const goToOrders = () => {
  executeViewTransition(() => {
    router.push('/orders')
  })
}

const goToPayment = () => {
  if (!props.activeOrder) return
  executeViewTransition(() => {
    router.push(`/payment/${props.activeOrder!.id}`)
  })
}
</script>
