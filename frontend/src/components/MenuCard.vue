<template>
  <!-- Entire available card adds 1 directly to the order on tap — crisp, instant response -->
  <button
    type="button"
    :disabled="!item.is_available"
    :aria-label="item.is_available ? `Add ${item.name} to order` : `${item.name} is sold out`"
    class="group text-left flex flex-col rounded-[var(--radius-card)] bg-[var(--color-surface)] border overflow-hidden transition-ui focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
    :class="[
      !item.is_available
        ? 'border-[var(--color-line)] opacity-65 cursor-not-allowed'
        : cartQty > 0
          ? 'border-[var(--color-accent)] cursor-pointer active:translate-y-px'
          : 'border-[var(--color-line)] hover:border-[var(--color-line-strong)] cursor-pointer active:translate-y-px',
    ]"
    @click="onTapAdd"
  >
    <div class="relative w-full overflow-hidden">
      <DishArtwork
        :name="item.name"
        :image="item.image"
        :artwork="item.artwork"
        :desaturated="!item.is_available"
      />

      <!-- Clean Architectural Tag (No bubbly capsule badges floating over food) -->
      <span
        v-if="!item.is_available"
        class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-[var(--radius-input)] bg-[var(--color-ink)] text-[var(--color-surface)] font-mono text-[11px] font-semibold uppercase tracking-[0.04em]"
      >
        Sold out
      </span>
      <span
        v-else-if="item.is_popular"
        class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-[var(--radius-input)] bg-[var(--color-surface)] border border-[var(--color-line)] text-[var(--color-ink)] font-mono text-[11px] font-semibold tracking-[0.02em]"
      >
        House favorite
      </span>

      <!-- Live Quantity in Order Counter -->
      <span
        v-if="cartQty > 0"
        class="absolute top-2.5 right-2.5 min-w-[26px] h-[26px] px-2 rounded-[var(--radius-input)] bg-[var(--color-accent)] text-[var(--color-surface)] font-mono text-xs font-bold tabular-nums inline-flex items-center justify-center"
      >
        {{ cartQty }}
      </span>
    </div>

    <!-- Clean, Scannable Footer: Dish Name + Price + Crisp Tactile "+" -->
    <div class="p-3.5 flex-1 flex flex-col justify-between gap-3 w-full">
      <h3
        class="font-display text-base font-bold text-[var(--color-ink)] leading-heading"
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
          class="w-9 h-9 rounded-[var(--radius-input)] flex items-center justify-center transition-ui shrink-0 border"
          :class="
            item.is_available
              ? cartQty > 0
                ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-[var(--color-surface)]'
                : 'bg-[var(--color-surface-alt)] border-[var(--color-line)] text-[var(--color-ink)] group-hover:bg-[var(--color-accent)] group-hover:border-[var(--color-accent)] group-hover:text-[var(--color-surface)]'
              : 'bg-[var(--color-surface-alt)] text-[var(--color-muted)] border-[var(--color-line)]'
          "
          aria-hidden="true"
        >
          <BaseIcon name="plus" :size="17" custom-class="optical-plus" />
        </span>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
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
