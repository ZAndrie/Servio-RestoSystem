<template>
  <div class="relative flex-1 flex min-h-[100dvh] bg-[var(--color-bg)]">
    <!-- Main Ordering Area -->
    <main class="relative flex-1 min-w-0 flex flex-col px-4 sm:px-6 lg:px-8 pt-6 pb-28 md:pb-6 gap-5">
      <!-- Top Flow Bar: Clean Typographic Step Rail + Quick Table Switcher -->
      <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-2 min-w-0">
          <div class="flex flex-wrap items-center gap-1.5 text-sm">
            <button
              type="button"
              class="min-h-[44px] -ml-2 px-2.5 rounded-[var(--radius-input)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)] font-semibold inline-flex items-center gap-1.5 transition-ui cursor-pointer"
              @click="backToTables"
            >
              <BaseIcon name="arrow-left" :size="14" />
              <span>1. Tables</span>
            </button>

            <span class="text-[var(--color-line-strong)] font-mono" aria-hidden="true">/</span>

            <span class="px-2.5 py-1 rounded-[var(--radius-input)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-bold">
              2. Take Order · {{ friendlyTableName(selectedTable?.table_number || 'T-01') }}
            </span>

            <span class="text-[var(--color-line-strong)] font-mono" aria-hidden="true">/</span>

            <span class="px-1 text-[var(--color-muted)] font-medium">
              3. Pay &amp; Send to Kitchen
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
            class="w-11 h-11 rounded-[var(--radius-input)] bg-[var(--color-sidebar)] text-[var(--color-sidebar-ink)] font-mono font-bold text-sm flex items-center justify-center shrink-0 select-none border border-[var(--color-line)]"
            :title="authStore.user?.name || 'Staff'"
            :aria-label="`Signed in as ${authStore.user?.name || 'Staff'}`"
          >
            {{ authStore.initials }}
          </div>
        </div>
      </header>

      <!-- Search Bar + Crisp Rectangular Category Tabs -->
      <section aria-label="Menu search and filters" class="space-y-3">
        <BaseCombobox
          v-model="searchQuery"
          :options="dishSearchOptions"
          variant="search"
          icon="search"
          filter-only
          clear-on-select
          placeholder="Find a dish, dessert, or drink..."
          aria-label="Search menu items"
          empty-text="No matching dishes found."
          @select="onSelectSearchDish"
        />

        <div
          class="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1"
          role="group"
          aria-label="Menu categories"
        >
          <button
            type="button"
            :aria-pressed="menuStore.activeCategoryId === null"
            class="min-h-[44px] px-4 rounded-[var(--radius-input)] text-sm font-semibold transition-ui whitespace-nowrap cursor-pointer shrink-0 border"
            :class="
              menuStore.activeCategoryId === null
                ? 'bg-[var(--color-ink)] text-[var(--color-surface)] border-[var(--color-ink)]'
                : 'bg-[var(--color-surface)] text-[var(--color-ink)] border-[var(--color-line)] hover:border-[var(--color-line-strong)]'
            "
            @click="menuStore.setCategory(null)"
          >
            All Menu
          </button>

          <button
            v-for="cat in menuStore.categories"
            :key="cat.id"
            type="button"
            :aria-pressed="menuStore.activeCategoryId === cat.id"
            class="min-h-[44px] px-4 rounded-[var(--radius-input)] text-sm font-semibold transition-ui whitespace-nowrap cursor-pointer shrink-0 border"
            :class="
              menuStore.activeCategoryId === cat.id
                ? 'bg-[var(--color-ink)] text-[var(--color-surface)] border-[var(--color-ink)]'
                : 'bg-[var(--color-surface)] text-[var(--color-ink)] border-[var(--color-line)] hover:border-[var(--color-line-strong)]'
            "
            @click="menuStore.setCategory(cat.id)"
          >
            {{ cat.name }}
          </button>
        </div>
      </section>

      <!-- Menu Catalog Grid (One-tap add — zero popups) -->
      <section aria-labelledby="pos-menu-heading" class="flex-1 min-h-[680px]">
        <div class="flex items-baseline justify-between gap-2 mb-3">
          <h2 id="pos-menu-heading" class="label-tracked text-[var(--color-muted)]">
            Menu dishes
          </h2>
          <span class="text-xs text-[var(--color-muted)] tabular-nums">
            {{ displayedItems.length }} {{ displayedItems.length === 1 ? 'dish' : 'dishes' }}
          </span>
        </div>
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
        @cancel-edit="handleCancelEdit"
      />
    </aside>

    <!-- Phone & Compact Tablet Sticky Order Bar -->
    <div
      class="lg:hidden fixed inset-x-0 md:left-[76px] bottom-[66px] md:bottom-0 z-30 px-4 pb-3 md:pb-4 safe-pb-bar pointer-events-none"
    >
      <button
        type="button"
        class="pointer-events-auto w-full max-w-xl mx-auto min-h-[54px] px-4 py-3 rounded-[var(--radius-card)] bg-[var(--color-sidebar)] text-[var(--color-sidebar-ink)] shadow-[var(--shadow-float)] border border-[var(--color-sidebar-line)] flex items-center justify-between gap-3 active:translate-y-px transition-ui cursor-pointer"
        @click="isMobileSheetOpen = true"
      >
        <span class="flex items-center gap-2.5 text-base font-semibold min-w-0">
          <span class="min-w-[26px] h-[26px] px-2 rounded-[var(--radius-input)] bg-[var(--color-accent)] text-[var(--color-surface)] font-mono text-xs font-bold tabular-nums inline-flex items-center justify-center">
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
        @cancel-edit="handleCancelEdit"
      />
    </BaseSheet>
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
import { useToastStore } from '@/stores/toast'
import type { MenuItem } from '@/types'
import { formatCurrency, formatTableLabel, getManilaGreeting } from '@/utils/format'
import { executeViewTransition } from '@/utils/transition'
import BaseCombobox from '@/components/base/BaseCombobox.vue'
import type { ComboboxOption } from '@/components/base/BaseCombobox.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseSheet from '@/components/base/BaseSheet.vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'
import MenuCard from '@/components/MenuCard.vue'
import OrderPanel from '@/components/OrderPanel.vue'
import TableStatusStrip from '@/components/TableStatusStrip.vue'

const router = useRouter()
const authStore = useAuthStore()
const menuStore = useMenuStore()
const tablesStore = useTablesStore()
const cartStore = useCartStore()
const ordersStore = useOrdersStore()
const toastStore = useToastStore()

const searchQuery = ref<string | number | null>('')
const isMobileSheetOpen = ref(false)
const orderPanelRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  // Enforce Step 1 (Choose a Table) before taking an order — never silently default to Table 1
  if (!cartStore.selectedTableId) {
    toastStore.info('Choose a table first', 'Tap an available table to start taking an order.')
    router.replace('/tables')
    return
  }
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

const friendlyTableName = formatTableLabel

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
  if (tableId === cartStore.selectedTableId) return

  const hadItems = cartStore.items.length > 0
  const existing = ordersStore.getOrderByTableId(tableId)

  // Prevent dishes drafted for one table from accidentally leaking onto another table
  if (hadItems) {
    cartStore.clearCart()
    toastStore.info('Order tray reset', 'Started a fresh tray for the selected table.')
  }

  // If the chosen table already has an unpaid bill, take the waiter straight to payment
  if (existing && existing.payment_status === 'unpaid') {
    cartStore.setTable(tableId, existing.id, existing.order_ref)
    executeViewTransition(() => {
      router.push(`/payment/${existing.id}`)
    })
    return
  }

  executeViewTransition(() => {
    if (existing) {
      cartStore.loadForAddon(tableId, existing.id, existing.order_ref)
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

const handleQuickAdd = (payload: { item: MenuItem; originX: number; originY: number }) => {
  cartStore.addItem(payload.item)
}

const handleCancelEdit = () => {
  const editId = cartStore.editingOrderId
  cartStore.clearCart()
  isMobileSheetOpen.value = false
  executeViewTransition(() => {
    router.push(editId ? `/payment/${editId}` : '/payment')
  })
}

// Pay-First, Dine-After: handles (1) editing an unpaid order, (2) Extra Food pay-first add-on, (3) new table order
const handlePlaceOrder = async () => {
  if (!cartStore.selectedTableId || cartStore.items.length === 0 || cartStore.hasSoldOutItems) return
  const table = selectedTable.value
  if (!table) return
  const currentUser = authStore.user
  if (!currentUser) {
    toastStore.error('Session expired', 'Please sign in again before placing an order.')
    router.push('/login')
    return
  }

  try {
    let targetOrderId: number

    if (cartStore.isEditingUnpaid && cartStore.editingOrderId) {
      const updated = await ordersStore.updateUnpaidOrderItems(
        cartStore.editingOrderId,
        cartStore.items,
      )
      targetOrderId = updated.id
      cartStore.clearCart()
      cartStore.setTable(table.id, updated.id, updated.order_ref)
    } else {
      const isAddon = cartStore.isAddonMode
      const created = await ordersStore.createOrderForPayment(
        table.id,
        table.table_number,
        cartStore.items,
        currentUser.name,
        currentUser.id,
        isAddon,
      )
      targetOrderId = created.id
      cartStore.clearCart()
      cartStore.setTable(table.id, created.id, created.order_ref)
    }

    isMobileSheetOpen.value = false
    executeViewTransition(() => {
      router.push(`/payment/${targetOrderId}`)
    })
  } catch {
    // Error toast already shown by store
  }
}
</script>
