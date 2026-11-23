<template>
  <div class="min-h-[100dvh] flex bg-[var(--color-bg)] text-[var(--color-ink)]">
    <!-- Desktop (228px) & Tablet (76px icon rail) Dark Charcoal-Brown Sidebar -->
    <aside
      v-if="showNavigation"
      aria-label="Primary navigation"
      class="hidden md:flex flex-col justify-between shrink-0 w-[76px] xl:w-[228px] bg-[var(--color-sidebar)] text-[var(--color-sidebar-ink)] border-r border-[var(--color-sidebar-line)] sticky top-0 h-[100dvh] py-6 px-3 xl:px-3.5 no-print transition-ui"
    >
      <div class="space-y-8">
        <router-link
          :to="homeRoute"
          class="flex items-center justify-center xl:justify-start gap-2.5 min-h-[44px] px-1.5 py-1 rounded-[var(--radius-input)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent-soft)]"
          aria-label="Servio home"
        >
          <img
            src="/servio-logo-icon.jpg"
            alt=""
            width="34"
            height="34"
            class="w-[34px] h-[34px] rounded-[var(--radius-input)] object-cover shrink-0 border border-[var(--color-sidebar-line)]"
          />
          <span class="hidden xl:inline servio-wordmark text-xl text-[var(--color-sidebar-ink)]">
            Servio
          </span>
        </router-link>

        <nav class="flex flex-col gap-2" aria-label="Workspace screens">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :title="item.label"
            class="group relative flex items-center justify-center xl:justify-start gap-2.5 min-h-[44px] px-3 xl:px-3.5 rounded-[var(--radius-pill)] text-base font-semibold transition-ui"
            :class="
              isNavActive(item)
                ? 'bg-[var(--color-accent)] text-[var(--color-surface)]'
                : 'text-[var(--color-sidebar-muted)] hover:text-[var(--color-sidebar-ink)] hover:bg-[var(--color-sidebar-surface)]'
            "
            :aria-current="isNavActive(item) ? 'page' : undefined"
          >
            <span class="inline-flex items-center justify-center optical-nav-icon shrink-0">
              <BaseIcon :name="item.icon" :size="19" />
            </span>
            <span class="hidden xl:inline truncate">{{ item.label }}</span>
            <span
              v-if="item.badge && item.badge > 0"
              class="hidden xl:inline-flex ml-auto min-w-[22px] h-[22px] px-1.5 items-center justify-center rounded-[var(--radius-pill)] text-xs font-bold tabular-nums"
              :class="
                isNavActive(item)
                  ? 'bg-[var(--color-surface)]/20 text-[var(--color-surface)]'
                  : 'bg-[var(--color-leaf)]/25 text-[var(--color-kds-leaf)]'
              "
            >
              {{ item.badge }}
            </span>
            <span
              v-if="item.badge && item.badge > 0"
              class="xl:hidden absolute top-1 right-1 min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center rounded-[var(--radius-pill)] text-[10px] font-bold tabular-nums bg-[var(--color-leaf)] text-[var(--color-kds-bg)]"
            >
              {{ item.badge }}
            </span>
          </router-link>
        </nav>
      </div>

      <!-- Bottom Warm Tagline + Sign Out -->
      <div class="space-y-4">
        <div
          class="hidden xl:flex flex-col items-center text-center px-3 py-4 rounded-[var(--radius-card)] bg-[var(--color-sidebar-surface)] border border-[var(--color-sidebar-line)]"
        >
          <div
            class="w-11 h-11 rounded-[var(--radius-pill)] bg-[var(--color-sidebar)] border border-[var(--color-sidebar-line)] flex items-center justify-center text-[var(--color-accent-soft)] mb-2.5"
            aria-hidden="true"
          >
            <BaseIcon name="cloche" :size="22" custom-class="optical-cloche" />
          </div>
          <p class="font-display text-sm text-[var(--color-sidebar-ink)] leading-snug text-balance">
            Cooked to order, served warm.
          </p>
        </div>

        <button
          type="button"
          class="w-full min-h-[44px] px-3 xl:px-4 rounded-[var(--radius-pill)] flex items-center justify-center xl:justify-start gap-3 text-sm font-semibold text-[var(--color-sidebar-muted)] hover:text-[var(--color-sidebar-ink)] hover:bg-[var(--color-sidebar-surface)] transition-ui cursor-pointer"
          aria-label="Sign out"
          title="Sign out"
          @click="handleLogout"
        >
          <BaseIcon name="logout" :size="18" custom-class="optical-nav-icon shrink-0" />
          <span class="hidden xl:inline">Sign out</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Outlet -->
    <div
      class="flex-1 min-w-0 flex flex-col"
      :class="showNavigation ? 'pb-[72px] md:pb-0' : ''"
    >
      <slot />
    </div>

    <!-- Phone (< 768px): Bottom Tab Bar -->
    <nav
      v-if="showNavigation"
      aria-label="Mobile navigation"
      class="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--color-sidebar)] text-[var(--color-sidebar-ink)] border-t border-[var(--color-sidebar-line)] safe-pb-bar px-2 pt-1.5 no-print"
    >
      <div class="flex items-center justify-around gap-1">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="relative flex-1 min-h-[48px] px-1.5 py-1.5 rounded-[var(--radius-pill)] flex flex-col items-center justify-center gap-0.5 text-xs font-semibold transition-ui"
          :class="
            isNavActive(item)
              ? 'bg-[var(--color-accent)] text-[var(--color-surface)]'
              : 'text-[var(--color-sidebar-muted)] hover:text-[var(--color-sidebar-ink)]'
          "
          :aria-current="isNavActive(item) ? 'page' : undefined"
        >
          <BaseIcon :name="item.icon" :size="18" custom-class="optical-nav-icon" />
          <span class="truncate max-w-full">{{ item.shortLabel || item.label }}</span>
          <span
            v-if="item.badge && item.badge > 0"
            class="absolute top-1 right-1.5 min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center rounded-[var(--radius-pill)] text-[10px] font-bold tabular-nums bg-[var(--color-leaf)] text-[var(--color-kds-bg)]"
          >
            {{ item.badge }}
          </span>
        </router-link>

        <button
          type="button"
          class="min-w-[48px] min-h-[48px] px-1.5 py-1.5 rounded-[var(--radius-pill)] flex flex-col items-center justify-center gap-0.5 text-xs font-semibold text-[var(--color-sidebar-muted)] hover:text-[var(--color-sidebar-ink)] transition-ui cursor-pointer"
          aria-label="Sign out"
          @click="handleLogout"
        >
          <BaseIcon name="logout" :size="18" custom-class="optical-nav-icon" />
          <span>Exit</span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useOrdersStore } from '@/stores/orders'
import { useCartStore } from '@/stores/cart'
import BaseIcon from '@/components/icons/BaseIcon.vue'

interface NavItem {
  label: string
  shortLabel?: string
  to: string
  matchPrefix: string
  icon: string
  badge?: number
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()
const cartStore = useCartStore()

const showNavigation = computed(() => {
  if (!authStore.isAuthenticated) return false
  if (authStore.isKitchen) return false
  if (route.meta.fullScreen) return false
  return true
})

const homeRoute = computed(() => {
  if (authStore.isAdmin) return '/admin/dashboard'
  if (authStore.isKitchen) return '/kitchen'
  return '/tables'
})

const navItems = computed<NavItem[]>(() => {
  if (authStore.isAdmin) {
    return [
      { label: 'Overview', shortLabel: 'Home', to: '/admin/dashboard', matchPrefix: '/admin/dashboard', icon: 'bar-chart' },
      { label: 'Tables', to: '/tables', matchPrefix: '/tables', icon: 'table' },
      { label: 'Menu', to: '/admin/menu', matchPrefix: '/admin/menu', icon: 'book-open' },
      { label: 'Staff', to: '/admin/users', matchPrefix: '/admin/users', icon: 'users' },
      { label: 'Sales', to: '/admin/reports', matchPrefix: '/admin/reports', icon: 'file-text' },
    ]
  }

  // Waiter flow: 1. Tables -> 2. Take Order -> 3. Pay Bill -> 4. Orders
  const readyCount = ordersStore.kdsReadyOrders.length
  const unpaidCount = ordersStore.unpaidOrders.length
  return [
    { label: 'Tables', to: '/tables', matchPrefix: '/tables', icon: 'table' },
    { label: 'Take Order', shortLabel: 'Order', to: '/pos', matchPrefix: '/pos', icon: 'dish' },
    {
      label: 'Pay Bill',
      shortLabel: 'Pay',
      to: '/payment',
      matchPrefix: '/payment',
      icon: 'receipt',
      badge: unpaidCount,
    },
    {
      label: 'Orders',
      to: '/orders',
      matchPrefix: '/orders',
      icon: 'clock',
      badge: readyCount,
    },
  ]
})

const isNavActive = (item: NavItem) => {
  if (item.matchPrefix === '/payment') {
    return route.path.startsWith('/payment')
  }
  if (authStore.isAdmin && item.matchPrefix === '/tables') {
    return ['/tables', '/pos', '/payment', '/orders'].some((p) => route.path.startsWith(p))
  }
  return route.path === item.to
}

const handleLogout = async () => {
  ordersStore.stopPolling()
  cartStore.resetAll()
  await authStore.logout()
  router.push('/login')
}
</script>
