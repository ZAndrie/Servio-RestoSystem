<template>
  <header
    class="fixed top-0 inset-x-0 z-50 transition-transform duration-300 ease-out"
    :class="isHiddenOnScroll && !isExploreOpen && !isMobileOpen ? '-translate-y-full' : 'translate-y-0'"
  >
    <!-- Top Header Bar (fixes Cabalar's transparent contrast bug with warm frosted backdrop) -->
    <div
      class="relative z-20 transition-colors duration-200 border-b"
      :class="headerBarClasses"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between gap-3">
        <!-- Typographic SERVIO Wordmark -->
        <router-link
          to="/"
          class="site-wordmark text-[1.6rem] sm:text-[1.85rem] tracking-[0.11em] py-1.5 rounded-[8px] focus-visible:outline-2 focus-visible:outline-offset-2 shrink-0 transition-colors"
          :class="useLightInk ? 'text-[var(--site-cream)] focus-visible:outline-[var(--site-gold)]' : 'text-[var(--site-green)] focus-visible:outline-[var(--site-green)]'"
          aria-label="SERVIO Home"
          @click="closeMenus"
        >
          SERVIO
        </router-link>

        <!-- Primary Navigation (Desktop >= 1280px inline + compact >= 1024px) -->
        <nav class="hidden xl:flex items-center gap-0.5 text-sm font-semibold" aria-label="Main navigation">
          <router-link
            v-for="link in desktopLinks"
            :key="link.to"
            :to="link.to"
            class="site-nav-link min-h-[44px] px-3 inline-flex items-center rounded-full transition-colors whitespace-nowrap"
            :class="[
              isActive(link.to) ? 'is-active' : '',
              useLightInk
                ? 'text-[var(--site-cream)]/90 hover:text-[var(--site-cream)]'
                : 'text-[var(--site-charcoal)] hover:text-[var(--site-green)]',
            ]"
            @click="closeMenus"
          >
            {{ link.label }}
          </router-link>
        </nav>

        <!-- Right Pill Controls (Cabalar Signature: EXPLORE + ORDER ONLINE + Cart) -->
        <div class="flex items-center gap-2 shrink-0">
          <!-- Cabalar-style Explore Mega-Drawer Trigger (Desktop >= 1024px) -->
          <button
            type="button"
            class="hidden lg:inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full text-xs font-bold uppercase tracking-[0.1em] border-[1.5px] transition-colors cursor-pointer"
            :class="exploreButtonClasses"
            :aria-expanded="isExploreOpen"
            aria-controls="servio-explore-drawer"
            @click="toggleExplore"
          >
            <span>{{ isExploreOpen ? 'Close' : 'Explore' }}</span>
            <BaseIcon
              :name="isExploreOpen ? 'x' : 'chevron-down'"
              :size="14"
              :custom-class="isExploreOpen ? '' : 'optical-chevron'"
            />
          </button>

          <!-- Prominent Order Online CTA -->
          <router-link
            to="/order"
            class="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 sm:px-5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-[0.08em] transition-colors whitespace-nowrap"
            :class="orderButtonClasses"
            @click="closeMenus"
          >
            <span>Order Online</span>
            <span
              v-if="cartStore.itemCount > 0"
              class="min-w-[22px] h-[22px] px-1.5 rounded-full text-xs font-bold tabular-nums inline-flex items-center justify-center"
              :class="useLightInk ? 'bg-[var(--site-green)] text-[var(--site-cream)]' : 'bg-[var(--site-cream)] text-[var(--site-green)]'"
            >
              {{ cartStore.itemCount }}
            </span>
          </router-link>

          <!-- Quick Cart Drawer Trigger when items are in bag -->
          <button
            v-if="cartStore.itemCount > 0"
            type="button"
            class="hidden sm:inline-flex items-center justify-center w-[44px] h-[44px] rounded-full border-[1.5px] transition-colors cursor-pointer"
            :class="
              useLightInk
                ? 'border-[var(--site-cream)]/60 text-[var(--site-cream)] hover:bg-[var(--site-cream)]/10'
                : 'border-[var(--site-green)] text-[var(--site-green)] hover:bg-[var(--site-green)] hover:text-[var(--site-cream)]'
            "
            aria-label="Open order bag"
            @click="cartStore.openDrawer()"
          >
            <BaseIcon name="cart" :size="18" />
          </button>

          <!-- Mobile Navigation Toggle (< 1024px) -->
          <button
            type="button"
            class="lg:hidden inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 rounded-full border-[1.5px] text-xs font-bold uppercase tracking-[0.08em] transition-colors cursor-pointer"
            :class="
              useLightInk
                ? 'border-[var(--site-cream)]/70 text-[var(--site-cream)]'
                : 'border-[var(--site-green)] text-[var(--site-green)]'
            "
            :aria-expanded="isMobileOpen"
            aria-controls="servio-mobile-nav"
            aria-label="Toggle navigation menu"
            @click="toggleMobile"
          >
            <span>{{ isMobileOpen ? 'Close' : 'Menu' }}</span>
            <BaseIcon :name="isMobileOpen ? 'x' : 'chevron-down'" :size="15" />
          </button>
        </div>
      </div>
    </div>

    <!-- Cabalar-Inspired Desktop 6-Card Illustrated EXPLORE Mega-Drawer -->
    <div
      id="servio-explore-drawer"
      class="hidden lg:block absolute inset-x-0 top-[76px] z-10 transition-all duration-250 ease-out origin-top"
      :class="
        isExploreOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto visible'
          : 'opacity-0 -translate-y-3 pointer-events-none invisible'
      "
      :aria-hidden="!isExploreOpen"
    >
      <div class="bg-[var(--site-green)] text-[var(--site-cream)] rounded-b-[1.75rem] shadow-[var(--shadow-float)] border-b border-[var(--site-cream)]/15">
        <div class="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-6">
          <div class="grid grid-cols-6 gap-4">
            <router-link
              v-for="card in EXPLORE_DRAWER_CARDS"
              :key="card.to"
              :to="card.to"
              class="group rounded-[1.125rem] bg-[var(--site-cream)] text-[var(--site-green)] p-5 flex flex-col justify-between gap-4 min-h-[196px] border border-transparent hover:border-[var(--site-gold)] hover:-translate-y-1 transition-all duration-200"
              @click="closeMenus"
            >
              <div class="flex items-start justify-between gap-2">
                <SiteIllustration
                  v-if="card.illustration"
                  :kind="card.illustration"
                  :size="48"
                  custom-class="text-[var(--site-green)] group-hover:scale-105 transition-transform duration-200"
                />
                <BaseIcon
                  name="chevron-right"
                  :size="16"
                  custom-class="text-[var(--site-muted)] group-hover:text-[var(--site-terracotta)] group-hover:translate-x-0.5 transition-all"
                />
              </div>
              <div class="space-y-1">
                <p class="font-display text-lg font-bold text-[var(--site-green)] leading-tight">
                  {{ card.label }}
                </p>
                <p class="text-xs text-[var(--site-muted)] leading-snug">
                  {{ card.description }}
                </p>
              </div>
            </router-link>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-[var(--site-cream)]/15 text-xs">
            <span class="text-[var(--site-cream)]/80 font-medium">
              {{ RESTAURANT_CONFIG.taglinePrimary }}
            </span>
            <div class="flex items-center gap-4">
              <router-link
                to="/contact"
                class="font-bold uppercase tracking-[0.08em] text-[var(--site-cream)] hover:text-[var(--site-gold)] transition-colors"
                @click="closeMenus"
              >
                Contact Us →
              </router-link>
              <router-link
                to="/login"
                class="font-semibold text-[var(--site-cream)]/75 hover:text-[var(--site-cream)] transition-colors"
                @click="closeMenus"
              >
                Staff POS Portal
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Backdrop for Desktop Explore Drawer -->
    <div
      v-if="isExploreOpen"
      class="hidden lg:block fixed inset-0 top-[76px] z-0 bg-[var(--site-charcoal)]/35"
      aria-hidden="true"
      @click="isExploreOpen = false"
    />

    <!-- Responsive Mobile Navigation Drawer (< 1024px) -->
    <div
      id="servio-mobile-nav"
      class="lg:hidden fixed inset-x-0 top-[76px] bottom-0 z-10 bg-[var(--site-green)] text-[var(--site-cream)] overflow-y-auto transition-all duration-200"
      :class="
        isMobileOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto visible'
          : 'opacity-0 -translate-y-2 pointer-events-none invisible'
      "
      :aria-hidden="!isMobileOpen"
    >
      <div class="px-5 py-6 space-y-3 max-w-lg mx-auto">
        <router-link
          v-for="link in PRIMARY_NAV_LINKS"
          :key="link.to"
          :to="link.to"
          class="w-full min-h-[52px] px-5 rounded-[14px] flex items-center justify-between font-display text-lg font-bold transition-colors"
          :class="
            isActive(link.to)
              ? 'bg-[var(--site-gold)] text-[var(--site-charcoal)]'
              : 'bg-[var(--site-cream)] text-[var(--site-green)] hover:bg-[var(--site-sand)]'
          "
          @click="closeMenus"
        >
          <span>{{ link.label }}</span>
          <BaseIcon name="chevron-right" :size="18" />
        </router-link>

        <div class="pt-3 grid grid-cols-1 gap-2.5">
          <router-link
            to="/order"
            class="w-full min-h-[52px] px-5 rounded-full border-[1.5px] border-[var(--site-cream)] text-[var(--site-cream)] font-bold uppercase tracking-[0.08em] text-sm inline-flex items-center justify-center gap-2 hover:bg-[var(--site-cream)] hover:text-[var(--site-green)] transition-colors"
            @click="closeMenus"
          >
            <span>Order Online</span>
            <span v-if="cartStore.itemCount > 0" class="tabular-nums">({{ cartStore.itemCount }})</span>
          </router-link>

          <router-link
            to="/login"
            class="w-full min-h-[44px] px-4 rounded-full text-center text-xs font-semibold text-[var(--site-cream)]/80 hover:text-[var(--site-cream)] inline-flex items-center justify-center"
            @click="closeMenus"
          >
            Staff POS &amp; Kitchen Sign In
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { PRIMARY_NAV_LINKS, EXPLORE_DRAWER_CARDS } from '@/data/navigation'
import { RESTAURANT_CONFIG } from '@/data/restaurant'
import { usePublicCartStore } from '@/stores/publicCart'
import BaseIcon from '@/components/icons/BaseIcon.vue'
import SiteIllustration from './SiteIllustration.vue'

const props = withDefaults(
  defineProps<{
    inverted?: boolean
  }>(),
  {
    inverted: false,
  },
)

const route = useRoute()
const cartStore = usePublicCartStore()

const isExploreOpen = ref(false)
const isMobileOpen = ref(false)
const isHiddenOnScroll = ref(false)
let lastScrollY = 0

const desktopLinks = PRIMARY_NAV_LINKS.filter((l) => l.to !== '/')

const useLightInk = computed(() => props.inverted || isExploreOpen.value || isMobileOpen.value)

const headerBarClasses = computed(() => {
  if (isExploreOpen.value || isMobileOpen.value) {
    return 'bg-[var(--site-green)] border-[var(--site-cream)]/15'
  }
  if (props.inverted) {
    return 'bg-[var(--site-green)]/95 backdrop-blur-md border-[var(--site-cream)]/15'
  }
  return 'bg-[var(--site-cream)]/95 backdrop-blur-md border-[var(--site-line)]/80'
})

const exploreButtonClasses = computed(() => {
  if (isExploreOpen.value) {
    return 'bg-[var(--site-cream)] text-[var(--site-green)] border-[var(--site-cream)]'
  }
  if (props.inverted) {
    return 'bg-transparent text-[var(--site-cream)] border-[var(--site-cream)]/75 hover:bg-[var(--site-cream)] hover:text-[var(--site-green)]'
  }
  return 'bg-transparent text-[var(--site-green)] border-[var(--site-green)] hover:bg-[var(--site-green)] hover:text-[var(--site-cream)]'
})

const orderButtonClasses = computed(() => {
  if (useLightInk.value) {
    return 'bg-[var(--site-cream)] text-[var(--site-green)] hover:bg-[var(--site-sand)]'
  }
  return 'bg-[var(--site-green)] text-[var(--site-cream)] hover:bg-[var(--site-green-hover)]'
})

const isActive = (path: string) => route.path === path

const toggleExplore = () => {
  isExploreOpen.value = !isExploreOpen.value
  isMobileOpen.value = false
}

const toggleMobile = () => {
  isMobileOpen.value = !isMobileOpen.value
  isExploreOpen.value = false
}

const closeMenus = () => {
  isExploreOpen.value = false
  isMobileOpen.value = false
}

watch(
  () => route.fullPath,
  () => {
    closeMenus()
    isHiddenOnScroll.value = false
  },
)

watch(isMobileOpen, (open) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})

const onScroll = () => {
  const currentY = window.scrollY
  if (currentY < 90) {
    isHiddenOnScroll.value = false
  } else if (currentY > lastScrollY + 12) {
    isHiddenOnScroll.value = true
  } else if (currentY < lastScrollY - 8) {
    isHiddenOnScroll.value = false
  }
  lastScrollY = currentY
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeMenus()
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeyDown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>
