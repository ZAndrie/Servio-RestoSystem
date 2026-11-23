<template>
  <div class="min-h-[100dvh] bg-[var(--color-bg)] text-[var(--color-ink)] selection:bg-[var(--color-accent-soft)] selection:text-[var(--color-ink)] relative overflow-x-clip">
    <!-- Subtle organic leaf accents (calm, low-contrast, zero visual noise) -->
    <svg
      class="pointer-events-none select-none fixed -top-24 -right-24 w-[460px] h-[460px] text-[var(--color-leaf)] opacity-[0.06] blur-[3px] z-0"
      viewBox="0 0 240 240"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M210 30C125 35 60 85 40 190c95-15 160-72 170-160Z" />
    </svg>
    <svg
      class="pointer-events-none select-none fixed top-[48%] -left-32 w-[400px] h-[400px] text-[var(--color-pot)] opacity-[0.04] blur-[4px] z-0"
      viewBox="0 0 240 240"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M30 210c5-85 55-150 160-170-15 95-72 160-160 170Z" />
    </svg>

    <!-- Fixed Top Navigation Bar -->
    <header class="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-[var(--color-surface)]/95 border-b border-[var(--color-line)]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">
        <!-- Logo & Brand Name -->
        <router-link
          to="/"
          class="flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] rounded-[var(--radius-input)] p-1"
        >
          <img
            src="/servio-logo-icon.jpg"
            alt="Servio Logo"
            width="40"
            height="40"
            class="w-10 h-10 rounded-[var(--radius-input)] object-cover border border-[var(--color-line)] group-hover:border-[var(--color-accent)] transition-ui"
          />
          <div>
            <div class="flex items-center gap-2">
              <span class="servio-wordmark text-xl text-[var(--color-ink)] leading-none">
                Servio
              </span>
              <span class="hidden sm:inline-flex px-2.5 py-0.5 rounded-[var(--radius-pill)] label-tracked bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent-soft)]">
                Restaurant OS
              </span>
            </div>
            <p class="hidden sm:block text-xs text-[var(--color-muted)] font-medium leading-tight mt-0.5">
              Order Management System for Restaurant Owners
            </p>
          </div>
        </router-link>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-1 text-sm font-semibold" aria-label="Main Navigation">
          <a
            href="#modules"
            class="min-h-[44px] inline-flex items-center px-3.5 rounded-[var(--radius-pill)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)] transition-ui"
          >
            How It Works
          </a>
          <a
            href="#owner-controls"
            class="min-h-[44px] inline-flex items-center px-3.5 rounded-[var(--radius-pill)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)] transition-ui"
          >
            Owner Tools
          </a>
          <a
            href="#stations"
            class="min-h-[44px] inline-flex items-center px-3.5 rounded-[var(--radius-pill)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)] transition-ui"
          >
            Staff Stations
          </a>
          <a
            href="#architecture"
            class="min-h-[44px] inline-flex items-center px-3.5 rounded-[var(--radius-pill)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)] transition-ui"
          >
            Why Servio
          </a>
        </nav>

        <!-- Right Action: Workspace Switcher or Sign In + Mobile Menu Toggle -->
        <div class="flex items-center gap-2">
          <template v-if="authStore.isAuthenticated">
            <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-pill)] bg-[var(--color-surface-alt)] border border-[var(--color-line)] text-xs font-semibold text-[var(--color-ink)]">
              <span class="w-2 h-2 rounded-full bg-[var(--color-leaf)]" aria-hidden="true" />
              <span>{{ authStore.user?.name }}</span>
              <span class="text-[var(--color-muted)] capitalize">({{ authStore.role }})</span>
            </div>

            <BaseButton
              variant="primary"
              size="sm"
              trailing-icon="chevron-right"
              @click="goToWorkspace"
            >
              Open {{ workspaceLabel }}
            </BaseButton>

            <button
              type="button"
              class="min-w-[44px] min-h-[44px] px-2.5 rounded-[var(--radius-pill)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)] transition-ui cursor-pointer"
              title="Sign out"
              aria-label="Sign out"
              @click="handleLogout"
            >
              <BaseIcon name="logout" :size="18" />
            </button>
          </template>

          <template v-else>
            <router-link
              to="/login"
              class="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 sm:px-5 rounded-[var(--radius-pill)] bg-[var(--color-accent)] text-[var(--color-surface)] text-sm font-semibold hover:bg-[var(--color-accent-hover)] active:translate-y-px transition-ui"
            >
              <BaseIcon name="user" :size="16" />
              <span class="hidden sm:inline">Owner &amp; Staff Sign In</span>
              <span class="sm:hidden">Sign In</span>
            </router-link>
          </template>

          <!-- Mobile (< 768px) section menu toggle -->
          <button
            type="button"
            class="md:hidden min-w-[44px] min-h-[44px] rounded-[var(--radius-pill)] border border-[var(--color-line)] bg-[var(--color-bg)] flex items-center justify-center text-[var(--color-ink)] transition-ui cursor-pointer"
            :aria-expanded="isMobileNavOpen"
            aria-label="Toggle section menu"
            @click="isMobileNavOpen = !isMobileNavOpen"
          >
            <BaseIcon :name="isMobileNavOpen ? 'x' : 'chevron-down'" :size="18" />
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Navigation -->
      <nav
        v-if="isMobileNavOpen"
        aria-label="Mobile sections"
        class="md:hidden border-t border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 grid grid-cols-2 gap-2"
      >
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="min-h-[44px] px-3.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)] inline-flex items-center justify-center text-sm font-semibold text-[var(--color-ink)]"
          @click="isMobileNavOpen = false"
        >
          {{ link.label }}
        </a>
      </nav>
    </header>

    <!-- Fixed Header Offset -->
    <div class="h-[72px]" aria-hidden="true" />

    <main class="relative z-10">
      <!-- HERO SECTION -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 lg:pt-16 lg:pb-20">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div class="lg:col-span-7 space-y-6">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[var(--radius-pill)] bg-[var(--color-surface)] border border-[var(--color-line)] text-xs font-bold text-[var(--color-accent)] label-tracked">
              <BaseIcon name="cloche" :size="14" custom-class="optical-cloche" />
              <span>Pay First, Dine After · Offline LAN Ready</span>
            </div>

            <h1 class="font-display text-2xl sm:text-[38px] font-bold text-[var(--color-ink)] leading-[1.14] tracking-[-0.02em] text-balance">
              Run your dining room, cashier, and kitchen in calm sync.
            </h1>

            <p class="text-base sm:text-lg text-[var(--color-muted)] prose-measure text-pretty">
              Servio connects visual table seating, one-tap dish ordering, upfront cashiering with 80 mm receipts, and a high-contrast Kitchen Board — built for family-run Filipino restaurants on local Wi-Fi with zero internet dependency.
            </p>

            <div class="flex flex-wrap items-center gap-3 pt-1">
              <BaseButton
                v-if="authStore.isAuthenticated"
                variant="primary"
                size="lg"
                trailing-icon="chevron-right"
                @click="goToWorkspace"
              >
                Continue to {{ workspaceLabel }}
              </BaseButton>
              <router-link
                v-else
                to="/login"
                class="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-[var(--radius-pill)] bg-[var(--color-accent)] text-[var(--color-surface)] text-base font-semibold hover:bg-[var(--color-accent-hover)] active:translate-y-px transition-ui"
              >
                <span>Start Shift / Sign In</span>
                <BaseIcon name="chevron-right" :size="18" />
              </router-link>

              <a
                href="#modules"
                class="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-[var(--radius-pill)] bg-[var(--color-surface)] border border-[var(--color-line)] hover:border-[var(--color-line-strong)] text-[var(--color-ink)] text-base font-semibold transition-ui"
              >
                <span>See how it works</span>
              </a>
            </div>

            <!-- Quiet Operational Highlights -->
            <div class="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--color-line)] max-w-xl">
              <div>
                <p class="font-display text-xl font-bold text-[var(--color-ink)] tabular-nums">3 taps</p>
                <p class="text-xs text-[var(--color-muted)]">From open table to checkout</p>
              </div>
              <div>
                <p class="font-display text-xl font-bold text-[var(--color-ink)] tabular-nums">100% LAN</p>
                <p class="text-xs text-[var(--color-muted)]">Zero external CDN calls</p>
              </div>
              <div>
                <p class="font-display text-xl font-bold text-[var(--color-ink)] tabular-nums">80 mm</p>
                <p class="text-xs text-[var(--color-muted)]">Thermal receipt ready</p>
              </div>
            </div>
          </div>

          <!-- Warm Visual Preview Card -->
          <div class="lg:col-span-5">
            <div class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] shadow-[var(--shadow-float)] overflow-hidden">
              <div class="px-5 py-4 bg-[var(--color-sidebar)] text-[var(--color-sidebar-ink)] flex items-center justify-between gap-2">
                <div class="flex items-center gap-2.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-[var(--color-leaf)]" aria-hidden="true" />
                  <span class="font-display text-base font-bold">Live Dining Room Flow</span>
                </div>
                <span class="text-xs font-mono text-[var(--color-sidebar-muted)] tabular-nums">T-01 – T-10</span>
              </div>

              <div class="p-5 space-y-4">
                <!-- Featured Filipino Dishes Preview -->
                <div class="grid grid-cols-3 gap-2.5">
                  <div
                    v-for="dish in featuredDishes"
                    :key="dish.name"
                    class="rounded-[var(--radius-input)] border border-[var(--color-line)] overflow-hidden bg-[var(--color-bg)]"
                  >
                    <div class="aspect-[4/3] overflow-hidden bg-[var(--color-surface-alt)]">
                      <img
                        :src="dish.image"
                        :alt="dish.name"
                        class="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div class="p-2">
                      <p class="text-xs font-bold text-[var(--color-ink)] truncate">{{ dish.name }}</p>
                      <p class="text-xs font-semibold text-[var(--color-accent)] tabular-nums">{{ dish.price }}</p>
                    </div>
                  </div>
                </div>

                <!-- Sample Pay-First Ticket Status -->
                <div class="rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)] p-3.5 space-y-2.5">
                  <div class="flex items-center justify-between gap-2">
                    <span class="font-display text-base font-bold text-[var(--color-ink)]">Table 4 · #1204</span>
                    <span class="px-2.5 py-0.5 rounded-[var(--radius-pill)] bg-[var(--color-leaf-bg)] text-[var(--color-leaf-ink)] label-tracked">
                      Paid · Cooking
                    </span>
                  </div>
                  <div class="flex items-center justify-between text-sm text-[var(--color-muted)]">
                    <span>Sinigang na Baboy + Calamansi Juice</span>
                    <span class="font-bold text-[var(--color-ink)] tabular-nums">₱420.00</span>
                  </div>
                  <div class="grid grid-cols-3 gap-1.5 pt-1 text-xs font-semibold text-center">
                    <span class="py-1.5 rounded-[var(--radius-input)] bg-[var(--color-leaf-bg)] text-[var(--color-leaf-ink)]">1. Paid</span>
                    <span class="py-1.5 rounded-[var(--radius-input)] bg-[var(--color-pot-bg)] text-[var(--color-pot-ink)]">2. Cooking</span>
                    <span class="py-1.5 rounded-[var(--radius-input)] bg-[var(--color-surface)] border border-[var(--color-line)] text-[var(--color-muted)]">3. Serve</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 1: HOW IT WORKS (PAY FIRST, DINE AFTER) -->
      <section id="modules" class="border-t border-[var(--color-line)] bg-[var(--color-surface)]/70 py-14 lg:py-18">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div class="max-w-2xl space-y-2">
            <span class="label-tracked text-[var(--color-accent)]">Pay First, Dine After</span>
            <h2 class="font-display text-2xl font-bold text-[var(--color-ink)]">
              One clear order of service from table to kitchen.
            </h2>
            <p class="text-base text-[var(--color-muted)] text-pretty">
              Every station stays in sync automatically — cooks only start preparing tickets once payment is confirmed at the counter.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <article
              v-for="step in workflowSteps"
              :key="step.num"
              class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] p-5 space-y-3"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="w-10 h-10 rounded-[var(--radius-pill)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] flex items-center justify-center">
                  <BaseIcon :name="step.icon" :size="20" />
                </span>
                <span class="label-tracked text-[var(--color-muted)]">{{ step.num }}</span>
              </div>
              <h3 class="font-display text-lg font-bold text-[var(--color-ink)]">
                {{ step.title }}
              </h3>
              <p class="text-sm text-[var(--color-muted)] leading-relaxed">
                {{ step.desc }}
              </p>
            </article>
          </div>
        </div>
      </section>

      <!-- SECTION 2: OWNER TOOLS -->
      <section id="owner-controls" class="border-t border-[var(--color-line)] py-14 lg:py-18">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div class="max-w-2xl space-y-2">
            <span class="label-tracked text-[var(--color-accent)]">Owner Tools</span>
            <h2 class="font-display text-2xl font-bold text-[var(--color-ink)]">
              Clear daily numbers without accounting jargon.
            </h2>
            <p class="text-base text-[var(--color-muted)] text-pretty">
              Update dishes, upload photos, mark sold-out items, manage staff shifts, and check daily Cash, GCash, and Card sales in one calm dashboard.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <article
              v-for="tool in ownerTools"
              :key="tool.title"
              class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] p-6 space-y-3"
            >
              <span class="w-11 h-11 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)] text-[var(--color-accent)] flex items-center justify-center">
                <BaseIcon :name="tool.icon" :size="20" />
              </span>
              <h3 class="font-display text-lg font-bold text-[var(--color-ink)]">
                {{ tool.title }}
              </h3>
              <p class="text-sm text-[var(--color-muted)] leading-relaxed">
                {{ tool.desc }}
              </p>
            </article>
          </div>
        </div>
      </section>

      <!-- SECTION 3: STAFF STATIONS -->
      <section id="stations" class="border-t border-[var(--color-line)] bg-[var(--color-surface)]/70 py-14 lg:py-18">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div class="max-w-2xl space-y-2">
            <span class="label-tracked text-[var(--color-accent)]">Staff Stations</span>
            <h2 class="font-display text-2xl font-bold text-[var(--color-ink)]">
              Tailored screens for every role on the floor.
            </h2>
            <p class="text-base text-[var(--color-muted)] text-pretty">
              Each account signs in directly to its dedicated screen — keeping waiters fast, cooks focused, and owners informed.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <article
              v-for="station in staffStations"
              :key="station.role"
              class="rounded-[var(--radius-card)] border p-6 flex flex-col justify-between gap-5"
              :class="station.dark ? 'bg-[var(--color-kds-bg)] border-[var(--color-kds-line)] text-[var(--color-kds-ink)]' : 'bg-[var(--color-surface)] border-[var(--color-line)] text-[var(--color-ink)]'"
            >
              <div class="space-y-3">
                <div class="flex items-center justify-between gap-2">
                  <span
                    class="px-3 py-1 rounded-[var(--radius-pill)] label-tracked"
                    :class="station.dark ? 'bg-[var(--color-kds-honey)]/20 text-[var(--color-kds-honey)]' : 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'"
                  >
                    {{ station.badge }}
                  </span>
                  <BaseIcon
                    :name="station.icon"
                    :size="20"
                    :custom-class="station.dark ? 'text-[var(--color-kds-leaf)]' : 'text-[var(--color-accent)]'"
                  />
                </div>

                <h3
                  class="font-display text-xl font-bold"
                  :class="station.dark ? 'text-[var(--color-kds-ink)]' : 'text-[var(--color-ink)]'"
                >
                  {{ station.role }}
                </h3>

                <ul class="space-y-2 text-sm">
                  <li
                    v-for="point in station.points"
                    :key="point"
                    class="flex items-start gap-2"
                    :class="station.dark ? 'text-[var(--color-kds-muted)]' : 'text-[var(--color-muted)]'"
                  >
                    <BaseIcon
                      name="check"
                      :size="15"
                      :custom-class="station.dark ? 'text-[var(--color-kds-leaf)] mt-0.5 shrink-0' : 'text-[var(--color-leaf-ink)] mt-0.5 shrink-0'"
                    />
                    <span>{{ point }}</span>
                  </li>
                </ul>
              </div>

              <router-link
                to="/login"
                class="min-h-[44px] px-4 rounded-[var(--radius-pill)] inline-flex items-center justify-center gap-2 text-sm font-semibold transition-ui"
                :class="station.dark ? 'bg-[var(--color-kds-surface)] hover:bg-[var(--color-kds-surface-hover)] text-[var(--color-kds-ink)] border border-[var(--color-kds-line)]' : 'bg-[var(--color-bg)] hover:bg-[var(--color-surface-alt)] text-[var(--color-ink)] border border-[var(--color-line)]'"
              >
                <span>Sign in as {{ station.shortName }}</span>
                <BaseIcon name="chevron-right" :size="15" />
              </router-link>
            </article>
          </div>
        </div>
      </section>

      <!-- SECTION 4: WHY SERVIO -->
      <section id="architecture" class="border-t border-[var(--color-line)] py-14 lg:py-18">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="rounded-[var(--radius-card)] bg-[var(--color-sidebar)] text-[var(--color-sidebar-ink)] p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-7 space-y-3">
              <span class="label-tracked text-[var(--color-accent-soft)]">Built for Real Service</span>
              <h2 class="font-display text-2xl font-bold text-[var(--color-sidebar-ink)]">
                Keeps taking orders even when the internet goes down.
              </h2>
              <p class="text-base text-[var(--color-sidebar-muted)] prose-measure text-pretty">
                All fonts, dish photos, icons, and layouts run locally on your restaurant Wi-Fi. No cloud lag, no monthly subscription walls, and readable receipts formatted for standard 80 mm thermal printers.
              </p>
            </div>

            <div class="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
              <router-link
                to="/login"
                class="min-h-[48px] px-6 rounded-[var(--radius-pill)] bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-surface)] text-base font-semibold inline-flex items-center justify-center gap-2 transition-ui"
              >
                <span>Open Servio POS</span>
                <BaseIcon name="chevron-right" :size="18" />
              </router-link>
              <p class="text-xs text-center text-[var(--color-sidebar-muted)]">
                Supports phones (360px), tablets (768px), countertop POS, and wall KDS monitors.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="relative z-10 border-t border-[var(--color-line)] bg-[var(--color-surface)] py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2.5">
          <img
            src="/servio-logo-icon.jpg"
            alt="Servio"
            width="28"
            height="28"
            class="w-7 h-7 rounded-[var(--radius-input)] object-cover border border-[var(--color-line)]"
          />
          <span class="servio-wordmark text-base text-[var(--color-ink)]">Servio</span>
          <span class="text-sm text-[var(--color-muted)]">· Cooked to order, served warm.</span>
        </div>

        <router-link
          to="/login"
          class="text-sm font-semibold text-[var(--color-accent)] hover:underline"
        >
          Staff Sign In →
        </router-link>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useOrdersStore } from '@/stores/orders'
import { useCartStore } from '@/stores/cart'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'

const router = useRouter()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()
const cartStore = useCartStore()
const isMobileNavOpen = ref(false)

const navLinks = [
  { href: '#modules', label: 'How It Works' },
  { href: '#owner-controls', label: 'Owner Tools' },
  { href: '#stations', label: 'Staff Stations' },
  { href: '#architecture', label: 'Why Servio' },
]

const workspaceLabel = computed(() => {
  if (authStore.isAdmin) return 'Owner Dashboard'
  if (authStore.isKitchen) return 'Kitchen Board'
  return 'Dining Room'
})

const goToWorkspace = () => {
  if (authStore.isAdmin) router.push('/admin/dashboard')
  else if (authStore.isKitchen) router.push('/kitchen')
  else router.push('/tables')
}

const handleLogout = async () => {
  ordersStore.stopPolling()
  cartStore.resetAll()
  await authStore.logout()
}

const featuredDishes = [
  { name: 'Sinigang na Baboy', price: '₱345.00', image: '/Dishes/Sinigang na Baboy.jpg' },
  { name: 'Pork Belly Kare-Kare', price: '₱360.00', image: '/Dishes/Pork Belly Kare-Kare.jpg' },
  { name: 'Chicken Inasal', price: '₱235.00', image: '/Dishes/Chicken Inasal.jpg' },
]

const workflowSteps = [
  {
    num: 'Step 1',
    icon: 'table',
    title: 'Visual Table Map',
    desc: 'See open, occupied, and food-ready tables across the dining room and seat guests in one tap.',
  },
  {
    num: 'Step 2',
    icon: 'dish',
    title: 'One-Tap Ordering',
    desc: 'Tap Filipino dishes, desserts, and drinks straight into the tray with optional kitchen notes.',
  },
  {
    num: 'Step 3',
    icon: 'receipt',
    title: 'Pay First & Print',
    desc: 'Accept Cash, GCash, or Card upfront with automatic change math and an 80 mm thermal receipt.',
  },
  {
    num: 'Step 4',
    icon: 'cooking',
    title: 'Cook, Serve & Clear',
    desc: 'Paid tickets appear instantly on the Kitchen Board; clear the table once guests finish dining.',
  },
]

const ownerTools = [
  {
    icon: 'bar-chart',
    title: 'Daily Sales & Payment Split',
    desc: 'Track Manila-time daily revenue, average table bill, Cash/GCash/Card breakdown, and best-selling dishes.',
  },
  {
    icon: 'book-open',
    title: 'Menu & Dish Photo Upload',
    desc: 'Add or edit dishes with drag-and-drop photo upload, Popular badges, and instant Sold Out switches.',
  },
  {
    icon: 'users',
    title: 'Staff Access Governance',
    desc: 'Create Admin, Waiter, and Kitchen accounts, reset temporary passwords, and deactivate accounts safely.',
  },
]

const staffStations = [
  {
    role: 'Waiter & Cashier',
    shortName: 'Waiter',
    badge: 'Floor & Register',
    icon: 'table',
    dark: false,
    points: [
      'Visual 2/4/6/8-seat table map showing live status',
      'Instant dish cards with zero distracting popups',
      'Upfront Cash, GCash, and Card checkout + receipt print',
    ],
  },
  {
    role: 'Kitchen Staff',
    shortName: 'Kitchen',
    badge: 'Wall Display (KDS)',
    icon: 'cooking',
    dark: true,
    points: [
      'Full-screen dark board with large, high-contrast dish text',
      'Receives paid tickets only with automatic 3.5 s refresh',
      'Live elapsed timers and >10 min late ticket alerts',
    ],
  },
  {
    role: 'Owner & Admin',
    shortName: 'Owner',
    badge: 'Management',
    icon: 'bar-chart',
    dark: false,
    points: [
      'Date-filtered revenue reports and top-selling dishes',
      'Full menu catalog editor with live dish photo uploads',
      'Live floor monitor and staff account controls',
    ],
  },
]
</script>
