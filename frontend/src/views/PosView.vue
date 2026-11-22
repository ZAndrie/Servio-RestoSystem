<template>
  <div class="relative flex-1 flex min-h-[100dvh] bg-[var(--color-bg)]">
    <!-- Subtle warm leaf accent in one corner -->
    <svg
      class="pointer-events-none select-none fixed top-0 right-[340px] w-[320px] h-[320px] text-[var(--color-leaf)] opacity-[0.06] blur-[2px] hidden lg:block"
      viewBox="0 0 240 240"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M210 24C122 36 58 92 38 196c98-18 158-76 172-172Z" />
    </svg>

    <!-- Main Ordering Area -->
    <main class="relative flex-1 min-w-0 flex flex-col px-4 sm:px-6 lg:px-8 pt-6 pb-28 md:pb-6 gap-5">
      <!-- Top Flow Bar: Step 1 (Back to Tables) -> Step 2 (Take Order) + Quick Table Switcher -->
      <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-2 min-w-0">
          <div class="flex flex-wrap items-center gap-2 text-sm font-semibold">
            <button
              type="button"
              class="min-h-[44px] px-3.5 rounded-[var(--radius-pill)] bg-[var(--color-surface)] border border-[var(--color-line)] hover:border-[var(--color-line-strong)] text-[var(--color-ink)] inline-flex items-center gap-1.5 transition-ui cursor-pointer"
              @click="backToTables"
            >
              <BaseIcon name="arrow-left" :size="15" />
              <span>1. Tables</span>
            </button>

            <BaseIcon name="chevron-right" :size="14" custom-class="text-[var(--color-muted)]" />

            <span class="px-3.5 py-2 rounded-[var(--radius-pill)] bg-[var(--color-accent)] text-[var(--color-surface)] font-bold">
              2. Take Order · {{ friendlyTableName(selectedTable?.table_number || 'T-01') }}
            </span>

            <BaseIcon name="chevron-right" :size="14" custom-class="text-[var(--color-muted)]" />

            <span class="px-3 py-2 rounded-[var(--radius-pill)] bg-[var(--color-surface)] border border-[var(--color-line)] text-[var(--color-muted)]">
              3. Pay Bill
            </span>
          </div>

          <h1 class="font-display text-2xl font-bold text-[var(--color-ink)]">
            {{ greeting }}
          </h1>
          <p class="text-base text-[var(--color-muted)] text-pretty">
            Tap any dish below to add it straight to {{ friendlyTableName(selectedTable?.table_number || 'T-01') }}.
          </p>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <!-- Quick Table Switcher Combobox (also supports typing "07" -> T-07) -->
          <BaseCombobox
            :model-value="cartStore.selectedTableId"
            :options="tableOptions"
            variant="pill"
            icon="table"
            :allow-clear="false"
            placeholder="Switch table..."
            aria-label="Select dining table"
            view-transition-name="table-selector-pill"
            input-class="tabular-nums font-semibold"
            @select="onSelectTable"
          />

          <div
            class="w-11 h-11 rounded-[var(--radius-pill)] bg-[var(--color-sidebar)] text-[var(--color-sidebar-ink)] font-bold text-sm flex items-center justify-center shrink-0 select-none border border-[var(--color-line)]"
            :title="authStore.user?.name || 'Staff'"
            :aria-label="`Signed in as ${authStore.user?.name || 'Staff'}`"
          >
            {{ authStore.initials }}
          </div>
        </div>
      </header>

      <!-- Search Bar + Category Filter Pills -->
      <section aria-label="Menu search and filters" class="space-y-3.5">
        <BaseCombobox
          v-model="searchQuery"
          :options="dishSearchOptions"
          variant="search"
          icon="search"
          filter-only
          placeholder="Find a dish, dessert, or drink..."
          aria-label="Search menu items"
          empty-text="No matching dishes found."
          @select="onSelectSearchDish"
        />

        <div
          class="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1"
          role="tablist"
          aria-label="Menu categories"
        >
          <button
            type="button"
            role="tab"
            :aria-selected="menuStore.activeCategoryId === null"
            class="min-h-[44px] px-5 rounded-[var(--radius-pill)] text-base font-semibold transition-ui whitespace-nowrap cursor-pointer shrink-0"
            :class="
              menuStore.activeCategoryId === null
                ? 'bg-[var(--color-ink)] text-[var(--color-surface)]'
                : 'bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-line)] hover:border-[var(--color-line-strong)]'
            "
            @click="menuStore.setCategory(null)"
          >
            All Menu
          </button>

          <button
            v-for="cat in menuStore.categories"
            :key="cat.id"
            type="button"
            role="tab"
            :aria-selected="menuStore.activeCategoryId === cat.id"
            class="min-h-[44px] px-5 rounded-[var(--radius-pill)] text-base font-semibold transition-ui whitespace-nowrap cursor-pointer shrink-0"
            :class="
              menuStore.activeCategoryId === cat.id
                ? 'bg-[var(--color-ink)] text-[var(--color-surface)]'
                : 'bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-line)] hover:border-[var(--color-line-strong)]'
            "
            @click="menuStore.setCategory(cat.id)"
          >
            {{ cat.name }}
          </button>
        </div>
      </section>

      <!-- Menu Catalog Grid (One-tap add — zero popups) -->
      <section aria-label="Menu items" class="flex-1 min-h-[680px]">
        <div
          v-if="menuStore.isLoading && menuStore.items.length === 0"
          class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          aria-busy="true"
        >
          <div
            v-for="n in 6"
            :key="n"
            class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] overflow-hidden"
          >
            <div class="aspect-[4/3] bg-[var(--color-surface-alt)]" />
            <div class="p-4 space-y-3">
              <div class="h-5 w-2/3 rounded bg-[var(--color-surface-alt)]" />
              <div class="flex items-center justify-between">
                <div class="h-5 w-20 rounded bg-[var(--color-surface-alt)]" />
                <div class="w-9 h-9 rounded-full bg-[var(--color-surface-alt)]" />
              </div>
            </div>
          </div>
        </div>

        <div
          v-else-if="menuStore.error"
          role="alert"
          class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-berry)]/35 p-6 text-center space-y-3"
        >
          <p class="font-display text-lg font-bold text-[var(--color-ink)]">
            Could not load the menu
          </p>
          <p class="text-sm text-[var(--color-muted)] prose-measure mx-auto">
            {{ menuStore.error }}
          </p>
          <BaseButton variant="primary" size="md" @click="menuStore.fetchMenu()">
            Try again
          </BaseButton>
        </div>

        <div
          v-else-if="displayedItems.length === 0"
          class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] p-8 text-center space-y-2"
        >
          <p class="font-display text-lg font-bold text-[var(--color-ink)]">
            No dishes found
          </p>
          <p class="text-sm text-[var(--color-muted)] prose-measure mx-auto">
            Try searching another name or show the full menu.
          </p>
          <div class="pt-2">
            <BaseButton variant="secondary" size="sm" @click="resetFilters">
              Show all menu
            </BaseButton>
          </div>
        </div>

        <div
          v-else
          :key="menuStore.staggerKey"
          class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <MenuCard
            v-for="(item, idx) in displayedItems"
            :key="item.id"
            :item="item"
            :index="idx"
            :cart-qty="getCartQty(item.id)"
            @add="handleQuickAdd"
          />
        </div>
      </section>

      <!-- Bottom Live Status Strip for Selected Table -->
      <TableStatusStrip
        :table-number="selectedTable?.table_number || 'T-01'"
        :active-order="selectedTableActiveOrder"
      />
    </main>

    <!-- Desktop Right Order Panel -->
    <aside
      ref="orderPanelRef"
      aria-label="Current order draft"
      class="hidden lg:flex flex-col w-[320px] xl:w-[348px] shrink-0 bg-[var(--color-surface)] border-l border-[var(--color-line)] sticky top-0 h-[100dvh]"
    >
      <OrderPanel
        :table-number="selectedTable?.table_number"
        :service-charge="selectedTableActiveOrder?.service_charge"
        @place-order="handlePlaceOrder"
      />
    </aside>

    <!-- Phone & Compact Tablet Sticky Order Bar -->
    <div
      class="lg:hidden fixed inset-x-0 md:left-[76px] bottom-[66px] md:bottom-0 z-30 px-4 pb-3 md:pb-4 safe-pb-bar pointer-events-none"
    >
      <button
        ref="mobileSummaryRef"
        type="button"
        class="pointer-events-auto w-full max-w-xl mx-auto min-h-[56px] px-5 py-3 rounded-[var(--radius-pill)] bg-[var(--color-sidebar)] text-[var(--color-sidebar-ink)] shadow-[var(--shadow-float)] flex items-center justify-between gap-3 active:translate-y-px transition-ui cursor-pointer"
        @click="isMobileSheetOpen = true"
      >
        <span class="flex items-center gap-2.5 text-base font-semibold min-w-0">
          <span class="min-w-[26px] h-[26px] px-2 rounded-[var(--radius-pill)] bg-[var(--color-accent)] text-[var(--color-surface)] text-sm font-bold tabular-nums inline-flex items-center justify-center">
            {{ cartStore.itemCount }}
          </span>
          <span class="truncate">
            {{ cartStore.itemCount === 1 ? '1 item' : `${cartStore.itemCount} items` }}
            · <strong class="tabular-nums">{{ formatCurrency(cartStore.estimatedSubtotal) }}</strong>
          </span>
        </span>
        <span class="text-sm font-bold text-[var(--color-accent-soft)] shrink-0">
          View order
        </span>
      </button>
    </div>

    <!-- Mobile Order Sheet -->
    <BaseSheet
      v-model="isMobileSheetOpen"
      title="Your Order"
      :subtitle="selectedTable ? friendlyTableName(selectedTable.table_number) : ''"
      side="bottom"
    >
      <template #header-action>
        <button
          v-if="cartStore.items.length > 0"
          type="button"
          class="touch-extend-44 px-2 py-1 text-sm font-semibold text-[var(--color-muted)] hover:text-[var(--color-berry-ink)] cursor-pointer"
          @click="cartStore.clearCartWithUndo()"
        >
          Clear list
        </button>
      </template>

      <OrderPanel
        hide-header
        :table-number="selectedTable?.table_number"
        :service-charge="selectedTableActiveOrder?.service_charge"
        @place-order="handlePlaceOrder"
      />
    </BaseSheet>

    <!-- Subtle Flying Add Indicator -->
    <div
      v-for="dot in flyingDots"
      :key="dot.id"
      class="fixed z-[1100] w-5 h-5 -ml-2.5 -mt-2.5 rounded-[var(--radius-pill)] bg-[var(--color-accent)] text-[var(--color-surface)] flex items-center justify-center pointer-events-none transition-all duration-300 ease-out"
      :style="dot.style"
      aria-hidden="true"
    >
      <BaseIcon name="plus" :size="12" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMenuStore } from '@/stores/menu'
import { useTablesStore } from '@/stores/tables'
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'
import type { MenuItem } from '@/types'
import { formatCurrency, getManilaGreeting } from '@/utils/format'
import { executeViewTransition } from '@/utils/transition'
import BaseCombobox from '@/components/base/BaseCombobox.vue'
import type { ComboboxOption } from '@/components/base/BaseCombobox.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseSheet from '@/components/base/BaseSheet.vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'
import MenuCard from '@/components/MenuCard.vue'
import OrderPanel from '@/components/OrderPanel.vue'
import TableStatusStrip from '@/components/TableStatusStrip.vue'

interface FlyingDot {
  id: number
  style: Record<string, string>
}

const router = useRouter()
const authStore = useAuthStore()
const menuStore = useMenuStore()
const tablesStore = useTablesStore()
const cartStore = useCartStore()
const ordersStore = useOrdersStore()

const searchQuery = ref<string | number | null>('')
const isMobileSheetOpen = ref(false)
const orderPanelRef = ref<HTMLElement | null>(null)
const mobileSummaryRef = ref<HTMLElement | null>(null)
const flyingDots = ref<FlyingDot[]>([])
let dotSeq = 0

onMounted(async () => {
  await Promise.all([menuStore.fetchMenu(), tablesStore.fetchTables()])
  ordersStore.startPolling(3500)
})

onUnmounted(() => {
  ordersStore.stopPolling()
})

const greeting = computed(() => getManilaGreeting(authStore.user?.name))

const selectedTable = computed(() => cartStore.selectedTable)

const selectedTableActiveOrder = computed(() => {
  if (!cartStore.selectedTableId) return null
  return ordersStore.getOrderByTableId(cartStore.selectedTableId) ?? null
})

const friendlyTableName = (tableNumber: string) => {
  const num = Number(tableNumber.replace(/\D/g, ''))
  return Number.isFinite(num) && num > 0 ? `Table ${num}` : tableNumber
}

const tableOptions = computed<ComboboxOption[]>(() =>
  tablesStore.tables.map((t) => {
    const active = ordersStore.getOrderByTableId(t.id)
    const numericPart = t.table_number.replace(/\D/g, '')
    return {
      label: friendlyTableName(t.table_number),
      value: t.id,
      sublabel: active
        ? `Occupied · ${formatCurrency(active.total)}`
        : `Available · ${t.capacity} seats`,
      keywords: `${t.table_number} ${numericPart} table ${Number(numericPart)}`,
      dotClass: active ? 'bg-[var(--color-pot)]' : 'bg-[var(--color-leaf)]',
    }
  }),
)

const dishSearchOptions = computed<ComboboxOption[]>(() =>
  menuStore.items.map((item) => ({
    label: item.name,
    value: item.id,
    sublabel: item.is_available
      ? menuStore.getCategoryName(item.category_id)
      : 'Sold out',
    meta: formatCurrency(item.price),
    keywords: `${item.description ?? ''} ${menuStore.getCategoryName(item.category_id)}`,
    disabled: !item.is_available,
  })),
)

const displayedItems = computed(() => {
  const q = String(searchQuery.value ?? '').trim().toLowerCase()
  return menuStore.filteredItems.filter((item) => {
    if (!q) return true
    return (
      item.name.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
    )
  })
})

const getCartQty = (menuItemId: number) =>
  cartStore.items
    .filter((i) => i.menu_item_id === menuItemId)
    .reduce((sum, i) => sum + i.quantity, 0)

const backToTables = () => {
  executeViewTransition(() => {
    router.push('/tables')
  })
}

const onSelectTable = (opt: ComboboxOption) => {
  const tableId = Number(opt.value)
  const existing = ordersStore.getOrderByTableId(tableId)
  executeViewTransition(() => {
    if (existing) {
      cartStore.setTable(tableId, existing.id, existing.order_ref)
    } else {
      cartStore.setTable(tableId, null, null)
    }
  })
}

const onSelectSearchDish = (opt: ComboboxOption) => {
  const dish = menuStore.getItemById(Number(opt.value))
  if (dish && dish.is_available) {
    cartStore.addItem(dish)
    searchQuery.value = ''
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  menuStore.setCategory(null)
}

const triggerOriginFly = (originX: number, originY: number) => {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

  const targetEl =
    window.innerWidth >= 1024 ? orderPanelRef.value : mobileSummaryRef.value
  const targetRect = targetEl?.getBoundingClientRect()
  const destX = targetRect ? targetRect.left + Math.min(80, targetRect.width / 2) : window.innerWidth - 120
  const destY = targetRect ? targetRect.top + 48 : window.innerHeight - 60

  const id = ++dotSeq
  const dot: FlyingDot = {
    id,
    style: {
      left: `${originX}px`,
      top: `${originY}px`,
      transform: 'scale(1)',
      opacity: '1',
    },
  }
  flyingDots.value.push(dot)

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const active = flyingDots.value.find((d) => d.id === id)
      if (!active) return
      active.style = {
        left: `${destX}px`,
        top: `${destY}px`,
        transform: 'scale(0.55)',
        opacity: '0',
      }
    })
  })

  window.setTimeout(() => {
    flyingDots.value = flyingDots.value.filter((d) => d.id !== id)
  }, 320)
}

const handleQuickAdd = (payload: { item: MenuItem; originX: number; originY: number }) => {
  cartStore.addItem(payload.item)
  triggerOriginFly(payload.originX, payload.originY)
}

// Pay-First, Dine-After: Finished picking dishes -> create unpaid ticket & go straight to Payment!
const handlePlaceOrder = async () => {
  if (!cartStore.selectedTableId || cartStore.items.length === 0) return
  const table = selectedTable.value
  if (!table) return

  try {
    const created = await ordersStore.createOrderForPayment(
      table.id,
      table.table_number,
      cartStore.items,
      authStore.user?.name || 'Waiter',
      authStore.user?.id || 2,
    )
    cartStore.clearCart()
    cartStore.setTable(table.id, created.id, created.order_ref)
    isMobileSheetOpen.value = false

    executeViewTransition(() => {
      router.push(`/payment/${created.id}`)
    })
  } catch {
    // Error toast already shown by store
  }
}
</script>
