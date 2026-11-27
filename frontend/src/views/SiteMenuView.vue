<template>
  <SiteLayout surface="cream">
    <!-- 1. EDITORIAL MENU HERO -->
    <section class="pt-10 sm:pt-14 lg:pt-20 pb-8 sm:pb-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div class="max-w-3xl space-y-4">
            <p class="site-eyebrow text-[var(--site-terracotta)]">The SERVIO Kitchen</p>
            <h1 class="site-display-hero text-[var(--site-green)]">
              Good Things Are Cooking.
            </h1>
            <p class="site-body-lg text-[var(--site-muted)] max-w-[54ch]">
              Comforting Filipino home-style favorites, complete rice meals, celebratory platters,
              and cool desserts prepared warm for the table.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3 shrink-0">
            <router-link
              to="/order"
              class="min-h-[48px] px-6 rounded-full bg-[var(--site-green)] hover:bg-[var(--site-green-hover)] text-[var(--site-cream)] text-xs sm:text-sm font-bold uppercase tracking-[0.09em] inline-flex items-center gap-2 transition-colors"
            >
              <span>Order Online</span>
              <BaseIcon name="chevron-right" :size="15" />
            </router-link>
            <button
              v-if="cartStore.itemCount > 0"
              type="button"
              class="min-h-[48px] px-5 rounded-full border-[1.5px] border-[var(--site-green)] text-[var(--site-green)] hover:bg-[var(--site-green)] hover:text-[var(--site-cream)] text-xs sm:text-sm font-bold uppercase tracking-[0.08em] inline-flex items-center gap-2 transition-colors cursor-pointer"
              @click="cartStore.openDrawer()"
            >
              <BaseIcon name="cart" :size="16" />
              <span>View Bag ({{ cartStore.itemCount }})</span>
            </button>
          </div>
        </div>

        <!-- Transparent Demo Pricing & Sample Menu Notice -->
        <div class="rounded-[1.125rem] bg-[var(--site-sand)] border border-[var(--site-line)] px-4 sm:px-5 py-3.5 flex items-start gap-3 text-xs sm:text-sm text-[var(--site-charcoal)]">
          <BaseIcon name="alert" :size="18" custom-class="text-[var(--site-terracotta)] shrink-0 mt-0.5" />
          <p class="leading-relaxed">
            {{ PUBLIC_MENU_NOTICE }}
          </p>
        </div>
      </div>
    </section>

    <!-- 2. STICKY CATEGORY NAVIGATION BAR -->
    <nav
      class="sticky top-0 z-30 bg-[var(--site-cream)]/95 backdrop-blur-md border-y border-[var(--site-line)]"
      aria-label="Menu categories"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
          <button
            v-for="cat in PUBLIC_MENU_CATEGORIES"
            :key="cat.id"
            type="button"
            class="min-h-[40px] px-4 rounded-full text-xs font-bold uppercase tracking-[0.08em] whitespace-nowrap inline-flex items-center gap-2 transition-colors cursor-pointer shrink-0 border"
            :class="
              activeCategoryId === cat.id
                ? 'bg-[var(--site-green)] text-[var(--site-cream)] border-[var(--site-green)]'
                : 'bg-transparent text-[var(--site-charcoal)] border-[var(--site-line)] hover:border-[var(--site-green)] hover:text-[var(--site-green)]'
            "
            @click="scrollToCategory(cat.id)"
          >
            <span class="font-mono opacity-75">{{ cat.number }}</span>
            <span>{{ cat.name }}</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- 3. MENU SECTIONS (2-Column Editorial Menu Layout inspired by Cabalar) -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 sm:space-y-24">
      <section
        v-for="cat in PUBLIC_MENU_CATEGORIES"
        :id="cat.id"
        :key="cat.id"
        class="scroll-mt-36 space-y-8"
      >
        <!-- Category Header -->
        <div class="pb-5 border-b-[1.5px] border-[var(--site-green)]/30 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div class="space-y-1.5">
            <p class="site-eyebrow text-[var(--site-terracotta)]">
              Section {{ cat.number }}
            </p>
            <h2 class="site-display-lg text-[var(--site-green)]">
              {{ cat.name }}
            </h2>
            <p class="text-sm sm:text-base text-[var(--site-muted)] max-w-[60ch]">
              {{ cat.subtitle }}
            </p>
          </div>
          <p
            v-if="cat.servingNote"
            class="text-xs font-semibold text-[var(--site-muted)] bg-[var(--site-sand)] px-3.5 py-1.5 rounded-full self-start sm:self-end"
          >
            {{ cat.servingNote }}
          </p>
        </div>

        <!-- 2-Column Editorial Dish List -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-8">
          <article
            v-for="item in itemsByCategory(cat.id)"
            :key="item.id"
            class="flex items-start gap-4 pb-6 border-b border-[var(--site-line)]/80"
          >
            <!-- Dish Thumbnail (Clickable to View Details) -->
            <button
              type="button"
              class="w-20 h-20 sm:w-24 sm:h-24 rounded-[1rem] overflow-hidden bg-[var(--site-sand)] shrink-0 group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-green)]"
              :aria-label="`View details for ${item.name}`"
              @click="selectedItem = item"
            >
              <EditorialImage
                :image="item.image"
                img-class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </button>

            <!-- Editorial Dish Copy + Dotted Price Leader -->
            <div class="min-w-0 flex-1 space-y-2">
              <div class="flex items-baseline gap-1">
                <button
                  type="button"
                  class="font-display text-lg sm:text-xl font-bold text-[var(--site-charcoal)] hover:text-[var(--site-green)] text-left transition-colors cursor-pointer"
                  @click="selectedItem = item"
                >
                  {{ item.name }}
                </button>
                <span class="site-menu-leader" aria-hidden="true" />
                <span class="font-bold text-base sm:text-lg tabular-nums text-[var(--site-green)] shrink-0">
                  {{ formatCurrency(item.demoPrice) }}
                </span>
              </div>

              <p class="text-sm text-[var(--site-muted)] leading-relaxed">
                {{ item.shortDescription }}
              </p>

              <!-- Tags + Actions -->
              <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div class="flex flex-wrap items-center gap-1.5">
                  <span
                    class="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-[0.06em]"
                    :class="
                      item.available
                        ? 'bg-[var(--site-green-soft)] text-[var(--site-green)]'
                        : 'bg-[var(--site-terracotta-soft)] text-[var(--site-terracotta)]'
                    "
                  >
                    {{ item.available ? 'Demo Price' : 'Unavailable' }}
                  </span>
                  <span
                    v-for="tag in item.dietaryTags || []"
                    :key="tag"
                    class="px-2 py-0.5 rounded-full bg-[var(--site-sand)] text-[11px] font-semibold text-[var(--site-charcoal)]"
                  >
                    {{ tag }}
                  </span>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="min-h-[36px] px-3 rounded-full text-xs font-bold uppercase tracking-[0.07em] text-[var(--site-green)] hover:bg-[var(--site-sand)] transition-colors cursor-pointer"
                    @click="selectedItem = item"
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    :disabled="!item.available"
                    class="min-h-[36px] px-3.5 rounded-full bg-[var(--site-green)] hover:bg-[var(--site-green-hover)] text-[var(--site-cream)] text-xs font-bold uppercase tracking-[0.07em] inline-flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-45"
                    @click="quickAdd(item)"
                  >
                    <BaseIcon name="plus" :size="13" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>

    <!-- 4. PROMINENT ORDER ONLINE CTA BAND -->
    <section class="py-14 sm:py-18 bg-[var(--site-sand)] border-y border-[var(--site-line)]">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 site-reveal">
        <p class="site-eyebrow text-[var(--site-terracotta)]">Ready to Gather?</p>
        <h2 class="site-display-xl text-[var(--site-green)]">
          Order Your SERVIO Favorites Online.
        </h2>
        <p class="site-body-lg text-[var(--site-muted)] max-w-[52ch] mx-auto">
          Customize sharing portions, rice upgrades, and special notes in our interactive ordering
          experience, or plan a larger feast with our catering team.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <router-link
            to="/order"
            class="min-h-[54px] px-8 rounded-full bg-[var(--site-green)] hover:bg-[var(--site-green-hover)] text-[var(--site-cream)] text-sm font-bold uppercase tracking-[0.1em] inline-flex items-center gap-2 transition-colors"
          >
            <span>Go to Online Ordering</span>
            <BaseIcon name="chevron-right" :size="16" />
          </router-link>
          <router-link
            to="/catering"
            class="min-h-[54px] px-8 rounded-full border-[1.5px] border-[var(--site-green)] text-[var(--site-green)] hover:bg-[var(--site-green)] hover:text-[var(--site-cream)] text-sm font-bold uppercase tracking-[0.1em] inline-flex items-center transition-colors"
          >
            Catering &amp; Trays
          </router-link>
        </div>
      </div>
    </section>

    <!-- 5. MENU FAQs -->
    <section class="py-16 sm:py-20 lg:py-24">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 site-reveal">
        <div class="text-center space-y-2.5">
          <p class="site-eyebrow text-[var(--site-terracotta)]">Good to Know</p>
          <h2 class="site-display-lg text-[var(--site-green)]">Menu &amp; Kitchen FAQs</h2>
        </div>

        <SiteAccordion :items="menuFaqItems" />

        <div class="text-center pt-2">
          <router-link
            to="/faqs"
            class="text-xs font-bold uppercase tracking-[0.1em] text-[var(--site-green)] hover:text-[var(--site-terracotta)] transition-colors"
          >
            See All Frequently Asked Questions →
          </router-link>
        </div>
      </div>
    </section>

    <!-- Dish Detail & Customization Modal -->
    <MenuItemDetailModal
      :item="selectedItem"
      @close="selectedItem = null"
      @add="handleModalAdd"
    />
  </SiteLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  PUBLIC_MENU_CATEGORIES,
  PUBLIC_MENU_ITEMS,
  PUBLIC_MENU_NOTICE,
  type PublicMenuItem,
} from '@/data/publicMenu'
import { FAQ_CATEGORIES } from '@/data/faqs'
import { usePublicCartStore } from '@/stores/publicCart'
import { useToastStore } from '@/stores/toast'
import { formatCurrency } from '@/utils/format'
import { useScrollReveal } from '@/composables/useScrollReveal'
import SiteLayout from '@/components/site/SiteLayout.vue'
import EditorialImage from '@/components/site/EditorialImage.vue'
import SiteAccordion from '@/components/site/SiteAccordion.vue'
import MenuItemDetailModal from '@/components/site/MenuItemDetailModal.vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'

useScrollReveal()

const cartStore = usePublicCartStore()
const toastStore = useToastStore()

const activeCategoryId = ref(PUBLIC_MENU_CATEGORIES[0]?.id ?? 'filipino-favorites')
const selectedItem = ref<PublicMenuItem | null>(null)

const menuFaqItems = FAQ_CATEGORIES.find((c) => c.id === 'menu-food')?.items ?? []

const itemsByCategory = (categoryId: string) =>
  PUBLIC_MENU_ITEMS.filter((item) => item.categoryId === categoryId)

const scrollToCategory = (categoryId: string) => {
  activeCategoryId.value = categoryId
  const el = document.getElementById(categoryId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const quickAdd = (item: PublicMenuItem) => {
  const defaultOpts: Record<string, string> = {}
  if (item.customizations) {
    for (const g of item.customizations) {
      if (g.options[0]) defaultOpts[g.name] = g.options[0].label
    }
  }
  cartStore.addItem(item, 1, defaultOpts, '')
  toastStore.add({
    title: `Added ${item.name}`,
    message: `${formatCurrency(item.demoPrice)} (Demo price) added to your bag.`,
    type: 'success',
    actionLabel: 'View Bag',
    onAction: () => cartStore.openDrawer(),
  })
}

const handleModalAdd = (payload: {
  item: PublicMenuItem
  quantity: number
  selectedOptions: Record<string, string>
  specialInstructions: string
}) => {
  cartStore.addItem(
    payload.item,
    payload.quantity,
    payload.selectedOptions,
    payload.specialInstructions,
  )
  selectedItem.value = null
  toastStore.add({
    title: `Added ${payload.quantity}× ${payload.item.name}`,
    message: 'Your SERVIO bag has been updated.',
    type: 'success',
    actionLabel: 'View Bag',
    onAction: () => cartStore.openDrawer(),
  })
}

let categoryObserver: IntersectionObserver | null = null

onMounted(() => {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return
  categoryObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.target.id) {
          activeCategoryId.value = entry.target.id
        }
      }
    },
    { rootMargin: '-140px 0px -65% 0px', threshold: 0.05 },
  )

  for (const cat of PUBLIC_MENU_CATEGORIES) {
    const el = document.getElementById(cat.id)
    if (el) categoryObserver.observe(el)
  }
})

onUnmounted(() => {
  categoryObserver?.disconnect()
  categoryObserver = null
})
</script>
