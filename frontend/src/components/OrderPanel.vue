<template>
  <div class="flex flex-col h-full">
    <!-- Panel Header -->
    <div
      v-if="!hideHeader"
      class="px-5 pt-5 pb-4 border-b border-[var(--color-line)] flex items-center justify-between gap-2 shrink-0"
    >
      <div class="flex items-center gap-2 min-w-0">
        <h2 class="font-display text-xl font-bold text-[var(--color-ink)] truncate">
          Your Order
        </h2>
        <span
          v-if="tableNumber"
          class="px-2.5 py-0.5 rounded-[var(--radius-pill)] bg-[var(--color-surface-alt)] border border-[var(--color-line)] text-xs font-bold text-[var(--color-ink)] tabular-nums shrink-0"
        >
          {{ friendlyTableName }}
        </span>
      </div>

      <button
        v-if="cartStore.items.length > 0"
        type="button"
        class="touch-extend-44 px-2 py-1 rounded-[var(--radius-input)] text-sm font-semibold text-[var(--color-muted)] hover:text-[var(--color-berry-ink)] transition-ui cursor-pointer shrink-0"
        @click="cartStore.clearCartWithUndo()"
      >
        Clear list
      </button>
    </div>

    <!-- Add-on Mode Context Strip -->
    <div
      v-if="cartStore.isAddonMode"
      class="mx-5 mt-3 px-3.5 py-2.5 rounded-[var(--radius-input)] bg-[var(--color-honey-bg)] border border-[var(--color-honey)]/50 flex items-center justify-between gap-2 text-sm text-[var(--color-honey-ink)]"
    >
      <span class="font-semibold truncate">
        Adding extra dishes to {{ friendlyTableName }}
      </span>
      <button
        type="button"
        class="touch-extend-44 text-xs font-bold underline cursor-pointer shrink-0"
        @click="cartStore.clearCart()"
      >
        Cancel
      </button>
    </div>

    <!-- Order Items List -->
    <div class="flex-1 overflow-y-auto px-5 py-4">
      <div
        v-if="cartStore.items.length === 0"
        class="h-full min-h-[200px] flex flex-col items-center justify-center text-center px-4 py-8"
      >
        <div class="w-12 h-12 rounded-[var(--radius-pill)] bg-[var(--color-surface-alt)] border border-[var(--color-line)] flex items-center justify-center text-[var(--color-muted)] mb-3">
          <BaseIcon name="cloche" :size="22" custom-class="optical-cloche" />
        </div>
        <p class="font-display text-lg font-bold text-[var(--color-ink)]">
          Kain na!
        </p>
        <p class="mt-1 text-sm text-[var(--color-muted)] text-pretty max-w-[26ch]">
          Tap dishes on the left to add them to {{ friendlyTableName || 'this table' }}.
        </p>
      </div>

      <ul v-else class="divide-y divide-[var(--color-line)]">
        <li
          v-for="(item, index) in cartStore.items"
          :key="`${item.menu_item_id}-${index}`"
          class="py-3.5 first:pt-0 last:pb-0 space-y-2.5"
        >
          <div class="flex items-start gap-3">
            <DishArtwork
              :name="item.name"
              :image="item.image"
              :artwork="item.artwork"
              compact
            />

            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-2">
                <p class="text-base font-bold text-[var(--color-ink)] leading-order-line truncate">
                  {{ item.name }}
                </p>

                <button
                  type="button"
                  class="touch-extend-44 w-7 h-7 -mt-0.5 -mr-1 rounded-[var(--radius-pill)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-berry-ink)] hover:bg-[var(--color-berry-bg)] transition-ui cursor-pointer shrink-0"
                  :aria-label="`Remove ${item.name}`"
                  @click="cartStore.removeItemAt(index)"
                >
                  <BaseIcon name="x" :size="15" />
                </button>
              </div>

              <div class="mt-2 flex items-center justify-between gap-2">
                <!-- Quantity Stepper -->
                <div class="inline-flex items-center gap-2">
                  <button
                    type="button"
                    class="touch-extend-44 w-8 h-8 rounded-[var(--radius-input)] bg-[var(--color-surface-alt)] border border-[var(--color-line)] hover:border-[var(--color-line-strong)] flex items-center justify-center text-[var(--color-ink)] active:translate-y-px transition-ui cursor-pointer"
                    :aria-label="`Decrease quantity of ${item.name}`"
                    @click="cartStore.updateQuantity(index, -1)"
                  >
                    <BaseIcon name="minus" :size="14" />
                  </button>

                  <span
                    class="min-w-[2.25ch] text-center text-base font-bold tabular-nums text-[var(--color-ink)] select-none"
                    aria-live="polite"
                  >
                    {{ item.quantity }}
                  </span>

                  <button
                    type="button"
                    class="touch-extend-44 w-8 h-8 rounded-[var(--radius-input)] bg-[var(--color-surface-alt)] border border-[var(--color-line)] hover:border-[var(--color-line-strong)] flex items-center justify-center text-[var(--color-ink)] active:translate-y-px transition-ui cursor-pointer"
                    :aria-label="`Increase quantity of ${item.name}`"
                    @click="cartStore.updateQuantity(index, 1)"
                  >
                    <BaseIcon name="plus" :size="14" custom-class="optical-plus" />
                  </button>
                </div>

                <span class="text-base font-bold tabular-nums text-[var(--color-ink)] text-right">
                  {{ formatCurrency(item.unit_price * item.quantity) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Optional Kitchen Note (Progressive Disclosure) -->
          <div>
            <button
              v-if="!openNotes[index] && !item.notes"
              type="button"
              class="touch-extend-44 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-ui cursor-pointer"
              @click="openNotes[index] = true"
            >
              <BaseIcon name="note" :size="13" />
              <span>Add kitchen note</span>
            </button>

            <div v-else class="flex items-center gap-2">
              <input
                type="text"
                :value="item.notes"
                placeholder="e.g. No garlic, less ice, extra rice"
                :aria-label="`Kitchen note for ${item.name}`"
                class="flex-1 min-h-[40px] px-3 py-1.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)] text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none transition-ui"
                @input="onNoteInput(index, $event)"
              />
              <button
                v-if="!item.notes"
                type="button"
                class="touch-extend-44 w-8 h-8 rounded-[var(--radius-input)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-ink)] cursor-pointer"
                aria-label="Hide note input"
                @click="openNotes[index] = false"
              >
                <BaseIcon name="x" :size="14" />
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Footer Totals & Send CTA -->
    <div class="px-5 pt-4 safe-pb bg-[var(--color-bg)] border-t border-[var(--color-line)] space-y-3 shrink-0">
      <div class="space-y-1.5">
        <div class="flex items-center justify-between text-sm text-[var(--color-muted)]">
          <span>Subtotal ({{ cartStore.itemCount }} {{ cartStore.itemCount === 1 ? 'item' : 'items' }})</span>
          <span class="tabular-nums font-semibold text-[var(--color-ink)] text-right">
            {{ formatCurrency(cartStore.estimatedSubtotal) }}
          </span>
        </div>

        <div
          v-if="serviceCharge !== null && serviceCharge !== undefined && serviceCharge > 0"
          class="flex items-center justify-between text-sm text-[var(--color-muted)]"
        >
          <span>Service charge</span>
          <span class="tabular-nums font-semibold text-[var(--color-ink)] text-right">
            {{ formatCurrency(serviceCharge) }}
          </span>
        </div>

        <div class="pt-2 border-t border-[var(--color-line)] flex items-baseline justify-between gap-2">
          <span class="text-base font-bold text-[var(--color-ink)]">
            Total to Pay
          </span>
          <span class="servio-total-numeral text-xl font-bold text-[var(--color-accent)] text-right">
            {{ formatCurrency(cartStore.estimatedSubtotal + (serviceCharge ?? 0)) }}
          </span>
        </div>

        <p class="text-xs text-[var(--color-muted)] text-pretty">
          Pay first, dine after — order goes to the kitchen once paid.
        </p>
      </div>

      <BaseButton
        variant="primary"
        size="lg"
        trailing-icon="chevron-right"
        :disabled="cartStore.items.length === 0 || !cartStore.selectedTableId || ordersStore.isSubmitting"
        :loading="ordersStore.isSubmitting"
        custom-class="w-full"
        @click="$emit('place-order')"
      >
        {{
          ordersStore.isSubmitting
            ? 'Opening payment...'
            : cartStore.isAddonMode
              ? 'Pay for Extra Items'
              : 'Proceed to Payment'
        }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'
import { formatCurrency } from '@/utils/format'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'
import DishArtwork from '@/components/base/DishArtwork.vue'

const props = withDefaults(
  defineProps<{
    tableNumber?: string
    serviceCharge?: number | null
    hideHeader?: boolean
  }>(),
  {
    tableNumber: '',
    serviceCharge: null,
    hideHeader: false,
  },
)

defineEmits<{
  (e: 'place-order'): void
}>()

const cartStore = useCartStore()
const ordersStore = useOrdersStore()
const openNotes = reactive<Record<number, boolean>>({})

const friendlyTableName = computed(() => {
  const num = Number((props.tableNumber || '').replace(/\D/g, ''))
  return Number.isFinite(num) && num > 0 ? `Table ${num}` : props.tableNumber
})

const onNoteInput = (index: number, event: Event) => {
  cartStore.updateNotes(index, (event.target as HTMLInputElement).value)
}
</script>
