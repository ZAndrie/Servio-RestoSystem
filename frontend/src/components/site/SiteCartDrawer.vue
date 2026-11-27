<template>
  <BaseSheet
    :model-value="cartStore.isDrawerOpen"
    title="Your SERVIO Order"
    :subtitle="cartStore.itemCount === 0 ? 'Your bag is currently empty' : `${cartStore.itemCount} ${cartStore.itemCount === 1 ? 'item' : 'items'} · Demo ordering mode`"
    side="right"
    @update:model-value="(open) => { if (!open) cartStore.closeDrawer() }"
  >
    <template #header-action>
      <button
        v-if="cartStore.items.length > 0"
        type="button"
        class="touch-extend-44 text-xs font-bold uppercase tracking-[0.08em] text-[var(--site-muted)] hover:text-[var(--site-terracotta)] cursor-pointer"
        @click="cartStore.clearCart()"
      >
        Clear
      </button>
    </template>

    <!-- Empty Bag -->
    <div v-if="cartStore.items.length === 0" class="py-12 text-center space-y-4">
      <SiteIllustration kind="menu" :size="60" custom-class="mx-auto text-[var(--site-green)]" />
      <div class="space-y-1">
        <p class="font-display text-xl font-bold text-[var(--site-charcoal)]">
          Nothing in your bag yet
        </p>
        <p class="text-sm text-[var(--site-muted)] max-w-[30ch] mx-auto">
          Browse our Filipino classics, platters, and refreshments to start an order.
        </p>
      </div>
      <router-link
        to="/menu"
        class="inline-flex items-center justify-center min-h-[44px] px-5 rounded-full bg-[var(--site-green)] text-[var(--site-cream)] text-sm font-bold uppercase tracking-[0.08em]"
        @click="cartStore.closeDrawer()"
      >
        Explore Menu
      </router-link>
    </div>

    <!-- Cart Lines -->
    <ul v-else class="divide-y divide-[var(--site-line)]">
      <li
        v-for="line in cartStore.items"
        :key="line.lineId"
        class="py-4 first:pt-0 space-y-2.5"
      >
        <div class="flex items-start gap-3">
          <img
            :src="line.image"
            :alt="line.name"
            class="w-16 h-14 rounded-[10px] object-cover bg-[var(--site-sand)] shrink-0"
            @error="(e) => { const img = e.target as HTMLImageElement; if (img.src !== line.imageFallback) img.src = line.imageFallback }"
          />

          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-2">
              <p class="font-display text-base font-bold text-[var(--site-charcoal)] leading-snug">
                {{ line.name }}
              </p>
              <button
                type="button"
                class="touch-extend-44 w-7 h-7 rounded-full flex items-center justify-center text-[var(--site-muted)] hover:text-[var(--site-terracotta)] cursor-pointer shrink-0"
                :aria-label="`Remove ${line.name}`"
                @click="cartStore.removeItem(line.lineId)"
              >
                <BaseIcon name="x" :size="15" />
              </button>
            </div>

            <div
              v-if="Object.keys(line.selectedOptions).length > 0"
              class="mt-1 flex flex-wrap gap-1"
            >
              <span
                v-for="(val, key) in line.selectedOptions"
                :key="key"
                class="px-2 py-0.5 rounded-full bg-[var(--site-sand)] text-[11px] font-semibold text-[var(--site-charcoal)]"
              >
                {{ val }}
              </span>
            </div>

            <div class="mt-2.5 flex items-center justify-between gap-2">
              <div class="inline-flex items-center gap-2">
                <button
                  type="button"
                  class="touch-extend-44 w-8 h-8 rounded-full border border-[var(--site-line)] bg-[var(--site-cream)] flex items-center justify-center text-[var(--site-charcoal)] cursor-pointer"
                  :aria-label="`Decrease quantity of ${line.name}`"
                  @click="cartStore.updateQuantity(line.lineId, -1)"
                >
                  <BaseIcon name="minus" :size="13" />
                </button>
                <span class="min-w-[2ch] text-center text-sm font-bold tabular-nums">
                  {{ line.quantity }}
                </span>
                <button
                  type="button"
                  class="touch-extend-44 w-8 h-8 rounded-full border border-[var(--site-line)] bg-[var(--site-cream)] flex items-center justify-center text-[var(--site-charcoal)] cursor-pointer"
                  :aria-label="`Increase quantity of ${line.name}`"
                  @click="cartStore.updateQuantity(line.lineId, 1)"
                >
                  <BaseIcon name="plus" :size="13" />
                </button>
              </div>

              <span class="font-bold tabular-nums text-sm text-[var(--site-green)]">
                {{ formatCurrency(line.unitPrice * line.quantity) }}
              </span>
            </div>
          </div>
        </div>

        <input
          type="text"
          :value="line.specialInstructions"
          placeholder="Special instructions (optional)..."
          :aria-label="`Special instructions for ${line.name}`"
          class="w-full min-h-[38px] px-3 rounded-[10px] bg-[var(--site-cream)] border border-[var(--site-line)] text-xs text-[var(--site-charcoal)] focus:border-[var(--site-green)] focus:outline-none"
          @input="(e) => cartStore.updateLineInstructions(line.lineId, (e.target as HTMLInputElement).value)"
        />
      </li>
    </ul>

    <template v-if="cartStore.items.length > 0" #footer>
      <div class="space-y-3">
        <div class="flex items-baseline justify-between">
          <span class="text-sm font-semibold text-[var(--site-muted)]">Demo Subtotal</span>
          <span class="font-display text-xl font-bold tabular-nums text-[var(--site-green)]">
            {{ formatCurrency(cartStore.subtotal) }}
          </span>
        </div>
        <p class="text-xs text-[var(--site-muted)]">
          Demo prices shown. No live payment is charged in preview mode.
        </p>
        <router-link
          to="/order?step=checkout"
          class="w-full min-h-[48px] px-5 rounded-full bg-[var(--site-green)] hover:bg-[var(--site-green-hover)] text-[var(--site-cream)] text-sm font-bold uppercase tracking-[0.08em] inline-flex items-center justify-center gap-2 transition-colors"
          @click="cartStore.closeDrawer()"
        >
          <span>Review &amp; Checkout</span>
          <BaseIcon name="chevron-right" :size="16" />
        </router-link>
      </div>
    </template>
  </BaseSheet>
</template>

<script setup lang="ts">
import { usePublicCartStore } from '@/stores/publicCart'
import { formatCurrency } from '@/utils/format'
import BaseSheet from '@/components/base/BaseSheet.vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'
import SiteIllustration from './SiteIllustration.vue'

const cartStore = usePublicCartStore()
</script>
