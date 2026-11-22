<template>
  <!-- Entire available card adds 1 directly to the order on tap — zero annoying detail popup -->
  <button
    type="button"
    :disabled="!item.is_available"
    :aria-label="item.is_available ? `Add ${item.name} to order` : `${item.name} is sold out`"
    class="menu-card-stagger group text-left flex flex-col rounded-[var(--radius-card)] bg-[var(--color-surface)] border overflow-hidden transition-ui focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
    :class="[
      !item.is_available
        ? 'border-[var(--color-line)] opacity-70 cursor-not-allowed'
        : cartQty > 0
          ? 'border-[var(--color-accent)] cursor-pointer active:translate-y-px'
          : 'border-[var(--color-line)] hover:border-[var(--color-line-strong)] cursor-pointer active:translate-y-px',
    ]"
    :style="{ '--stagger-delay': `${staggerDelayMs}ms` }"
    @click="onTapAdd"
  >
    <div class="relative w-full overflow-hidden">
      <DishArtwork
        :name="item.name"
        :image="item.image"
        :artwork="item.artwork"
        :desaturated="!item.is_available"
      />

      <!-- Popular Badge -->
      <span
        v-if="item.is_popular && item.is_available"
        class="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-[var(--radius-pill)] bg-[var(--color-surface)]/95 border border-[var(--color-accent-soft)] text-[var(--color-accent)] label-tracked"
      >
        <BaseIcon name="star" :size="12" custom-class="optical-dot" />
        <span>Popular</span>
      </span>

      <!-- Sold Out Badge -->
      <span
        v-if="!item.is_available"
        class="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-pill)] bg-[var(--color-surface)]/95 border border-[var(--color-line-strong)] text-[var(--color-muted)] label-tracked"
      >
        Sold out
      </span>

      <!-- Live Quantity in Order Badge -->
      <span
        v-if="cartQty > 0"
        class="absolute top-3 right-3 min-w-[28px] h-[28px] px-2 rounded-[var(--radius-pill)] bg-[var(--color-accent)] text-[var(--color-surface)] text-sm font-bold tabular-nums inline-flex items-center justify-center"
      >
        {{ cartQty }}
      </span>
    </div>

    <!-- Clean, Scannable Footer: Dish Name + Price + Tactile "+" Indicator -->
    <div class="p-4 flex-1 flex flex-col justify-between gap-3 w-full">
      <h3
        class="font-display text-lg font-bold text-[var(--color-ink)] leading-heading"
        :class="{ 'text-[var(--color-muted)]': !item.is_available }"
      >
        {{ item.name }}
      </h3>

      <div class="flex items-center justify-between gap-2 w-full">
        <span
          class="text-base font-bold tabular-nums"
          :class="item.is_available ? 'text-[var(--color-ink)]' : 'text-[var(--color-muted)] line-through'"
        >
          {{ formatCurrency(item.price) }}
        </span>

        <span
          class="w-9 h-9 rounded-[var(--radius-pill)] flex items-center justify-center transition-ui shrink-0"
          :class="
            item.is_available
              ? 'bg-[var(--color-accent)] group-hover:bg-[var(--color-accent-hover)] text-[var(--color-surface)]'
              : 'bg-[var(--color-surface-alt)] text-[var(--color-muted)] border border-[var(--color-line)]'
          "
          aria-hidden="true"
        >
          <BaseIcon name="plus" :size="18" custom-class="optical-plus" />
        </span>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MenuItem } from '@/types'
import { formatCurrency } from '@/utils/format'
import DishArtwork from '@/components/base/DishArtwork.vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'

const props = withDefaults(
  defineProps<{
    item: MenuItem
    index?: number
    cartQty?: number
  }>(),
  {
    index: 0,
    cartQty: 0,
  },
)

const emit = defineEmits<{
  (e: 'add', payload: { item: MenuItem; originX: number; originY: number }): void
}>()

const staggerDelayMs = computed(() => Math.min(props.index * 30, 260))

const onTapAdd = (event: MouseEvent) => {
  if (!props.item.is_available) return
  const target = event.currentTarget as HTMLElement | null
  const rect = target?.getBoundingClientRect()
  emit('add', {
    item: props.item,
    originX: rect ? rect.right - 34 : event.clientX,
    originY: rect ? rect.bottom - 34 : event.clientY,
  })
}
</script>
