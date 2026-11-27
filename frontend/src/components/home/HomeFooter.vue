<template>
  <!-- Quiet Architectural Espresso Colophon (Unified with Sidebar & KDS, zero novelty strips) -->
  <footer class="bg-[var(--color-sidebar)] text-[var(--color-sidebar-ink)] border-t border-[var(--color-sidebar-line)]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 space-y-10">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        <!-- Brand & Operational Purpose -->
        <div class="md:col-span-5 space-y-4">
          <div class="flex items-center gap-2.5">
            <img
              src="/servio-logo-icon.jpg"
              alt="Servio"
              width="32"
              height="32"
              class="w-8 h-8 rounded-[var(--radius-input)] object-cover border border-[var(--color-sidebar-line)]"
            />
            <span class="servio-wordmark text-xl text-[var(--color-sidebar-ink)]">
              Servio
            </span>
          </div>

          <p class="text-sm sm:text-base text-[var(--color-sidebar-muted)] leading-relaxed max-w-[40ch]">
            A calm, offline-ready restaurant order management system connecting dining tables,
            pay-first cashiering, kitchen display, and daily owner reports.
          </p>

          <div class="pt-1 flex flex-wrap items-center gap-3">
            <router-link
              :to="authStore.isAuthenticated ? workspacePath : '/login'"
              class="min-h-[44px] px-4 rounded-[var(--radius-input)] bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-surface)] text-sm font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <span>{{ authStore.isAuthenticated ? `Open ${workspaceLabel}` : 'Owner & staff sign in' }}</span>
              <BaseIcon name="chevron-right" :size="15" />
            </router-link>
            <a
              href="#workflow"
              class="min-h-[44px] px-4 rounded-[var(--radius-input)] border border-[var(--color-sidebar-line)] text-[var(--color-sidebar-ink)] hover:bg-[var(--color-sidebar-surface)] text-sm font-semibold inline-flex items-center transition-colors"
            >
              Read workflow
            </a>
          </div>
        </div>

        <!-- Page Sections -->
        <div class="md:col-span-3 space-y-2">
          <p class="site-mono-index text-[var(--color-sidebar-muted)] pb-1">
            Sections
          </p>
          <ul class="text-sm font-semibold">
            <li v-for="link in sectionLinks" :key="link.href">
              <a
                :href="link.href"
                class="min-h-[44px] inline-flex items-center text-[var(--color-sidebar-ink)]/85 hover:text-[var(--color-surface)] transition-colors"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Role-Aware Staff Terminals -->
        <div class="md:col-span-4 space-y-2">
          <p class="site-mono-index text-[var(--color-sidebar-muted)] pb-1">
            Staff Terminals
          </p>
          <ul class="text-sm font-semibold">
            <li v-for="term in visibleTerminalLinks" :key="term.label">
              <router-link
                :to="term.to"
                class="min-h-[44px] inline-flex items-center text-[var(--color-sidebar-ink)]/85 hover:text-[var(--color-surface)] transition-colors"
              >
                {{ term.label }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <!-- Quiet Bottom Colophon -->
      <div class="pt-6 border-t border-[var(--color-sidebar-line)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[var(--color-sidebar-muted)]">
        <p>© {{ currentYear }} Servio Restaurant Order Management System.</p>
        <p class="font-mono">Pay First, Dine After · Offline LAN Ready</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import BaseIcon from '@/components/icons/BaseIcon.vue'
import type { HomeSectionLink } from './HomeHeader.vue'

defineProps<{
  sectionLinks: HomeSectionLink[]
}>()

const authStore = useAuthStore()
const currentYear = new Date().getFullYear()

const workspaceLabel = computed(() => {
  if (authStore.isAdmin) return 'Owner Dashboard'
  if (authStore.isKitchen) return 'Kitchen Board'
  return 'Dining Room'
})

const workspacePath = computed(() => {
  if (authStore.isAdmin) return '/admin/dashboard'
  if (authStore.isKitchen) return '/kitchen'
  return '/tables'
})

const visibleTerminalLinks = computed(() => {
  if (!authStore.isAuthenticated) {
    return [
      { label: 'Staff Sign In', to: '/login' },
      { label: 'Visual Table Map', to: '/tables' },
      { label: 'Kitchen Display (KDS)', to: '/kitchen' },
      { label: 'Owner Dashboard', to: '/admin/dashboard' },
    ]
  }
  if (authStore.isAdmin) {
    return [
      { label: 'Owner Dashboard', to: '/admin/dashboard' },
      { label: 'Visual Table Map', to: '/tables' },
      { label: 'Kitchen Display (KDS)', to: '/kitchen' },
      { label: 'Menu & Staff Admin', to: '/admin/menu' },
    ]
  }
  if (authStore.isKitchen) {
    return [{ label: 'Kitchen Display (KDS)', to: '/kitchen' }]
  }
  return [
    { label: 'Visual Table Map', to: '/tables' },
    { label: 'Pay Bill & Receipts', to: '/payment' },
    { label: 'Active Orders', to: '/orders' },
  ]
})
</script>
