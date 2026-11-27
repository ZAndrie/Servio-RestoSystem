<template>
  <!-- WCAG 2.4.1 Skip to Main Content -->
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:px-4 focus:py-2.5 focus:rounded-[var(--radius-input)] focus:bg-[var(--color-accent)] focus:text-[var(--color-surface)] focus:font-bold focus:text-sm"
  >
    Skip to main content
  </a>

  <!-- Solid Crisp Linen Masthead (No glassmorphism, no hide-on-scroll gimmick) -->
  <header class="fixed top-0 inset-x-0 z-50 bg-[var(--color-surface)] border-b border-[var(--color-line)]">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-[68px] sm:h-[72px] flex items-center justify-between gap-2 sm:gap-4 min-w-0">
      <!-- Brand Lockup -->
      <router-link
        to="/"
        class="flex items-center gap-2.5 py-1 rounded-[var(--radius-input)] shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        @click="closeMenus"
      >
        <img
          src="/servio-logo-icon.jpg"
          alt="Servio"
          width="34"
          height="34"
          class="w-8 h-8 sm:w-[34px] sm:h-[34px] rounded-[var(--radius-input)] object-cover border border-[var(--color-line)] shrink-0"
        />
        <span class="servio-wordmark text-lg sm:text-[1.35rem] text-[var(--color-ink)]">
          Servio
        </span>
        <span
          class="hidden md:inline-block pl-2.5 ml-0.5 border-l border-[var(--color-line)] text-xs font-medium text-[var(--color-muted)]"
        >
          Order Management
        </span>
      </router-link>

      <!-- Desktop Section Links (Sentence case, quiet hairline hover; hidden when signed in so auth bar never crowds) -->
      <nav
        v-if="!authStore.isAuthenticated"
        class="hidden xl:flex items-center gap-1 text-sm font-semibold min-w-0"
        aria-label="Main navigation"
      >
        <a
          v-for="link in sectionLinks"
          :key="link.href"
          :href="link.href"
          class="site-nav-link min-h-[44px] px-3 inline-flex items-center text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors whitespace-nowrap"
          @click="closeMenus"
        >
          {{ link.label }}
        </a>
      </nav>

      <!-- Right Controls: Explore Drawer + Auth-Aware Actions -->
      <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <!-- Explore Terminals Trigger (Desktop >= 1024px) -->
        <button
          type="button"
          class="hidden lg:inline-flex items-center gap-1.5 min-h-[44px] px-3.5 rounded-[var(--radius-input)] text-sm font-semibold border transition-colors cursor-pointer shrink-0"
          :class="
            isExploreOpen
              ? 'bg-[var(--color-ink)] text-[var(--color-surface)] border-[var(--color-ink)]'
              : 'bg-[var(--color-surface)] text-[var(--color-ink)] border-[var(--color-line-strong)] hover:bg-[var(--color-surface-alt)]'
          "
          :aria-expanded="isExploreOpen"
          aria-controls="servio-modules-drawer"
          @click="toggleExplore"
        >
          <span>{{ isExploreOpen ? 'Close' : 'Explore' }}</span>
          <BaseIcon
            :name="isExploreOpen ? 'x' : 'chevron-down'"
            :size="14"
            :custom-class="isExploreOpen ? '' : 'optical-chevron'"
          />
        </button>

        <!-- Signed-In Staff Controls (Bounded width so Sign out never clips on 1024px–1680px) -->
        <template v-if="authStore.isAuthenticated">
          <div
            class="hidden xl:flex items-center gap-2 px-3 min-h-[44px] rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)] text-xs font-semibold text-[var(--color-ink)] max-w-[210px]"
          >
            <span class="w-2 h-2 rounded-full bg-[var(--color-leaf)] shrink-0" aria-hidden="true" />
            <span class="truncate">{{ authStore.user?.name }}</span>
            <span class="font-mono text-[11px] text-[var(--color-muted)] capitalize shrink-0">
              {{ authStore.role }}
            </span>
          </div>

          <button
            type="button"
            class="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 sm:px-4 rounded-[var(--radius-input)] bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-surface)] text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer shrink-0"
            @click="goToWorkspace"
          >
            <span class="hidden sm:inline">{{ workspaceLabel }}</span>
            <span class="sm:hidden">{{ workspaceShortLabel }}</span>
            <BaseIcon name="chevron-right" :size="15" />
          </button>

          <button
            type="button"
            class="w-11 h-11 rounded-[var(--radius-input)] inline-flex items-center justify-center border border-[var(--color-line-strong)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)] transition-colors cursor-pointer shrink-0"
            title="Sign out"
            aria-label="Sign out"
            @click="handleLogout"
          >
            <BaseIcon name="logout" :size="17" />
          </button>
        </template>

        <!-- Signed-Out Staff Sign In CTA (Fits cleanly at 320px) -->
        <template v-else>
          <router-link
            to="/login"
            class="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 sm:px-4 rounded-[var(--radius-input)] bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-surface)] text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
            @click="closeMenus"
          >
            <span class="hidden sm:inline">Staff sign in</span>
            <span class="sm:hidden">Sign In</span>
          </router-link>
        </template>

        <!-- Mobile & Tablet Drawer Toggle (< 1024px) -->
        <button
          type="button"
          class="lg:hidden inline-flex items-center justify-center gap-1 min-h-[44px] px-3 rounded-[var(--radius-input)] border text-sm font-semibold transition-colors cursor-pointer shrink-0"
          :class="
            isMobileOpen
              ? 'bg-[var(--color-ink)] text-[var(--color-surface)] border-[var(--color-ink)]'
              : 'bg-[var(--color-surface)] text-[var(--color-ink)] border-[var(--color-line-strong)]'
          "
          :aria-expanded="isMobileOpen"
          aria-controls="servio-mobile-menu"
          aria-label="Toggle navigation menu"
          @click="toggleMobile"
        >
          <span>{{ isMobileOpen ? 'Close' : 'Menu' }}</span>
          <BaseIcon :name="isMobileOpen ? 'x' : 'chevron-down'" :size="14" />
        </button>
      </div>
    </div>

    <!-- Desktop Architectural Explore Index Drawer (Hairline grid, no floating rounded cards) -->
    <div
      id="servio-modules-drawer"
      class="hidden lg:block absolute inset-x-0 top-[72px] z-20 bg-[var(--color-surface)] border-b border-[var(--color-line)] shadow-[var(--shadow-float)] transition-opacity duration-180"
      :class="
        isExploreOpen
          ? 'opacity-100 pointer-events-auto visible'
          : 'opacity-0 pointer-events-none invisible'
      "
      :inert="!isExploreOpen || undefined"
      :aria-hidden="!isExploreOpen"
    >
      <div class="max-w-7xl mx-auto px-6 lg:px-8 py-7 space-y-5">
        <div class="flex items-center justify-between">
          <p class="site-mono-index text-[var(--color-muted)]">
            Servio Terminals &amp; Modules
          </p>
          <router-link
            :to="authStore.isAuthenticated ? workspacePath : '/login'"
            class="min-h-[44px] inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
            @click="closeMenus"
          >
            <span>{{ authStore.isAuthenticated ? `Open ${workspaceLabel}` : 'Sign in to staff portal' }}</span>
            <BaseIcon name="chevron-right" :size="15" />
          </router-link>
        </div>

        <div class="grid grid-cols-3 border-t border-l border-[var(--color-line)]">
          <button
            v-for="(mod, idx) in modules"
            :key="mod.title"
            type="button"
            class="group text-left p-5 border-r border-b border-[var(--color-line)] bg-[var(--color-surface)] hover:bg-[var(--color-bg)] transition-colors flex flex-col justify-between gap-3 cursor-pointer"
            @click="handleModuleNavigate(mod)"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="site-mono-index text-[var(--color-muted)] tabular-nums">
                {{ String(idx + 1).padStart(2, '0') }}
              </span>
              <span
                v-if="authStore.isAuthenticated && !canAccessModule(mod)"
                class="px-2 py-0.5 rounded-[var(--radius-input)] bg-[var(--color-surface-alt)] border border-[var(--color-line)] font-mono text-[11px] font-semibold text-[var(--color-muted)]"
              >
                {{ mod.roleTag }}
              </span>
              <BaseIcon
                v-else
                name="chevron-right"
                :size="15"
                custom-class="text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition-colors"
              />
            </div>

            <div class="space-y-1">
              <p class="font-display text-base font-bold text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors">
                {{ mod.title }}
              </p>
              <p class="text-sm text-[var(--color-muted)] leading-snug">
                {{ mod.desc }}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Desktop Drawer Backdrop (Sibling of <header>) -->
  <div
    v-if="isExploreOpen"
    class="hidden lg:block fixed inset-0 top-[72px] z-40 bg-[var(--color-ink)]/30"
    aria-hidden="true"
    @click="isExploreOpen = false"
  />

  <!-- Mobile & Tablet Drawer (< 1024px) — Sibling of <header> for guaranteed full viewport height -->
  <div
    id="servio-mobile-menu"
    class="lg:hidden fixed inset-x-0 top-[68px] sm:top-[72px] bottom-0 z-40 bg-[var(--color-surface)] text-[var(--color-ink)] overflow-y-auto transition-opacity duration-180"
    :class="
      isMobileOpen
        ? 'opacity-100 pointer-events-auto visible'
        : 'opacity-0 pointer-events-none invisible'
    "
    :inert="!isMobileOpen || undefined"
    :aria-hidden="!isMobileOpen"
  >
    <div class="px-4 sm:px-6 py-6 space-y-7 max-w-lg mx-auto">
      <div>
        <p class="site-mono-index text-[var(--color-muted)] pb-2 border-b border-[var(--color-line)]">
          Sections
        </p>
        <div class="divide-y divide-[var(--color-line)] border-b border-[var(--color-line)]">
          <a
            v-for="link in sectionLinks"
            :key="link.href"
            :href="link.href"
            class="w-full min-h-[48px] py-2.5 flex items-center justify-between font-display text-base font-bold text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors"
            @click="closeMenus"
          >
            <span>{{ link.label }}</span>
            <BaseIcon name="chevron-right" :size="16" custom-class="text-[var(--color-muted)]" />
          </a>
        </div>
      </div>

      <!-- Role-Aware Servio Terminals -->
      <div>
        <p class="site-mono-index text-[var(--color-muted)] pb-2 border-b border-[var(--color-line)]">
          Servio Terminals
        </p>
        <div class="divide-y divide-[var(--color-line)] border-b border-[var(--color-line)]">
          <button
            v-for="mod in modules"
            :key="mod.title"
            type="button"
            class="w-full min-h-[56px] py-3 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-[var(--color-bg)] transition-colors"
            @click="handleModuleNavigate(mod)"
          >
            <div class="min-w-0">
              <p class="font-display text-sm font-bold text-[var(--color-ink)] truncate">
                {{ mod.title }}
              </p>
              <p class="text-xs text-[var(--color-muted)] truncate mt-0.5">
                {{ mod.desc }}
              </p>
            </div>
            <span
              v-if="authStore.isAuthenticated && !canAccessModule(mod)"
              class="px-2 py-0.5 rounded-[var(--radius-input)] bg-[var(--color-surface-alt)] border border-[var(--color-line)] font-mono text-[11px] font-semibold text-[var(--color-muted)] shrink-0"
            >
              {{ mod.roleTag }}
            </span>
            <BaseIcon
              v-else
              name="chevron-right"
              :size="16"
              custom-class="text-[var(--color-muted)] shrink-0"
            />
          </button>
        </div>
      </div>

      <div class="space-y-2.5 pt-1">
        <template v-if="authStore.isAuthenticated">
          <button
            type="button"
            class="w-full min-h-[48px] px-5 rounded-[var(--radius-input)] bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-surface)] font-semibold text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
            @click="goToWorkspace"
          >
            <span>Open {{ workspaceLabel }}</span>
            <BaseIcon name="chevron-right" :size="16" />
          </button>
          <button
            type="button"
            class="w-full min-h-[44px] px-5 rounded-[var(--radius-input)] border border-[var(--color-line-strong)] text-[var(--color-ink)] font-semibold text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
            @click="handleLogout"
          >
            <BaseIcon name="logout" :size="15" />
            <span>Sign out ({{ authStore.user?.name }})</span>
          </button>
        </template>
        <router-link
          v-else
          to="/login"
          class="w-full min-h-[48px] px-5 rounded-[var(--radius-input)] bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-surface)] font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
          @click="closeMenus"
        >
          <span>Owner &amp; staff sign in</span>
          <BaseIcon name="chevron-right" :size="16" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Role } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { useOrdersStore } from '@/stores/orders'
import { useCartStore } from '@/stores/cart'
import BaseIcon from '@/components/icons/BaseIcon.vue'

export interface HomeSectionLink {
  href: string
  label: string
}

export interface SystemExploreModule {
  title: string
  desc: string
  sectionHref: string
  authRoute: string
  allowedRoles: Role[]
  roleTag: string
}

defineProps<{
  sectionLinks: HomeSectionLink[]
  modules: SystemExploreModule[]
}>()

const router = useRouter()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()
const cartStore = useCartStore()

const isExploreOpen = ref(false)
const isMobileOpen = ref(false)

const workspaceLabel = computed(() => {
  if (authStore.isAdmin) return 'Owner Dashboard'
  if (authStore.isKitchen) return 'Kitchen Board'
  return 'Dining Room'
})

const workspaceShortLabel = computed(() => {
  if (authStore.isAdmin) return 'Dashboard'
  if (authStore.isKitchen) return 'Kitchen'
  return 'Tables'
})

const workspacePath = computed(() => {
  if (authStore.isAdmin) return '/admin/dashboard'
  if (authStore.isKitchen) return '/kitchen'
  return '/tables'
})

const canAccessModule = (mod: SystemExploreModule) =>
  Boolean(authStore.role && mod.allowedRoles.includes(authStore.role))

const closeMenus = () => {
  isExploreOpen.value = false
  isMobileOpen.value = false
}

const toggleExplore = () => {
  isExploreOpen.value = !isExploreOpen.value
  isMobileOpen.value = false
}

const toggleMobile = () => {
  isMobileOpen.value = !isMobileOpen.value
  isExploreOpen.value = false
}

const goToWorkspace = () => {
  closeMenus()
  router.push(workspacePath.value)
}

const handleLogout = async () => {
  closeMenus()
  ordersStore.stopPolling()
  cartStore.resetAll()
  await authStore.logout()
}

const handleModuleNavigate = (mod: SystemExploreModule) => {
  closeMenus()
  if (authStore.isAuthenticated && canAccessModule(mod)) {
    router.push(mod.authRoute)
    return
  }
  const el = document.querySelector(mod.sectionHref)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

watch(isMobileOpen, (open) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeMenus()
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>
