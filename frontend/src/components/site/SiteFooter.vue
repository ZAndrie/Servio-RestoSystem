<template>
  <!-- Woven Banig-Inspired Transition Strip (Echoes Cabalar's checkered footer divider) -->
  <div class="site-banig-strip w-full" aria-hidden="true" />

  <footer class="bg-[var(--site-green)] text-[var(--site-cream)]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 space-y-12">
      <!-- Top Conversion Pills (Cabalar Signature: ORDER ONLINE + DIRECTIONS) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <router-link
          to="/order"
          class="min-h-[56px] px-6 rounded-full border-[1.5px] border-[var(--site-cream)] text-[var(--site-cream)] hover:bg-[var(--site-cream)] hover:text-[var(--site-green)] font-bold uppercase tracking-[0.12em] text-sm inline-flex items-center justify-center gap-2 transition-colors"
        >
          <span>Order Online</span>
          <BaseIcon name="chevron-right" :size="16" />
        </router-link>

        <a
          v-if="RESTAURANT_CONFIG.contact.directionsUrl"
          :href="RESTAURANT_CONFIG.contact.directionsUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="min-h-[56px] px-6 rounded-full border-[1.5px] border-[var(--site-cream)] text-[var(--site-cream)] hover:bg-[var(--site-cream)] hover:text-[var(--site-green)] font-bold uppercase tracking-[0.12em] text-sm inline-flex items-center justify-center gap-2 transition-colors"
        >
          <span>Directions</span>
          <BaseIcon name="chevron-right" :size="16" />
        </a>
        <router-link
          v-else
          to="/contact#directions"
          class="min-h-[56px] px-6 rounded-full border-[1.5px] border-[var(--site-cream)] text-[var(--site-cream)] hover:bg-[var(--site-cream)] hover:text-[var(--site-green)] font-bold uppercase tracking-[0.12em] text-sm inline-flex items-center justify-center gap-2 transition-colors"
        >
          <span>Directions &amp; Visit</span>
          <BaseIcon name="chevron-right" :size="16" />
        </router-link>
      </div>

      <!-- Structured Editorial Columns -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10 pt-2">
        <!-- Brand Story Summary -->
        <div class="md:col-span-4 space-y-3">
          <p class="site-eyebrow text-[var(--site-gold)]">
            {{ RESTAURANT_CONFIG.taglinePrimary }}
          </p>
          <p class="text-base text-[var(--site-cream)]/90 leading-relaxed max-w-[36ch]">
            {{ RESTAURANT_CONFIG.taglineSupporting }}
          </p>
          <p class="text-xs text-[var(--site-cream)]/65">
            {{ RESTAURANT_CONFIG.taglineSecondary }}
          </p>
        </div>

        <!-- Quick Navigation -->
        <div class="md:col-span-3 space-y-3">
          <h2 class="site-eyebrow text-[var(--site-gold)]">Explore</h2>
          <ul class="grid grid-cols-2 md:grid-cols-1 gap-2 text-sm font-semibold">
            <li v-for="link in FOOTER_QUICK_LINKS" :key="link.to">
              <router-link
                :to="link.to"
                class="inline-flex items-center min-h-[36px] text-[var(--site-cream)]/90 hover:text-[var(--site-gold)] transition-colors"
              >
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Menu Highlights -->
        <div class="md:col-span-2 space-y-3">
          <h2 class="site-eyebrow text-[var(--site-gold)]">Menu</h2>
          <ul class="space-y-2 text-sm font-semibold">
            <li v-for="cat in PUBLIC_MENU_CATEGORIES" :key="cat.id">
              <router-link
                :to="`/menu#${cat.id}`"
                class="inline-flex items-center min-h-[36px] text-[var(--site-cream)]/85 hover:text-[var(--site-gold)] transition-colors"
              >
                {{ cat.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Editable Contact & Operating Hours -->
        <div class="md:col-span-3 space-y-4 text-sm">
          <div class="space-y-1.5">
            <h2 class="site-eyebrow text-[var(--site-gold)]">Visit &amp; Contact</h2>
            <p class="text-[var(--site-cream)]/90">{{ RESTAURANT_CONFIG.contact.addressLine1 }}</p>
            <p class="text-[var(--site-cream)]/75">{{ RESTAURANT_CONFIG.contact.addressLine2 }}</p>
            <p class="text-[var(--site-cream)]/85 pt-1">{{ RESTAURANT_CONFIG.contact.phone }}</p>
            <p class="text-[var(--site-cream)]/85">{{ RESTAURANT_CONFIG.contact.email }}</p>
          </div>

          <div class="space-y-1">
            <h3 class="site-eyebrow text-[var(--site-gold)]">Hours (Sample)</h3>
            <p
              v-for="row in RESTAURANT_CONFIG.operatingHours"
              :key="row.days"
              class="text-xs text-[var(--site-cream)]/80"
            >
              <strong class="text-[var(--site-cream)]">{{ row.days }}:</strong> {{ row.hours }}
            </p>
          </div>

          <div class="flex flex-wrap gap-2 pt-1">
            <span
              v-for="soc in RESTAURANT_CONFIG.social"
              :key="soc.platform"
              class="px-3 py-1 rounded-full border border-[var(--site-cream)]/30 text-xs text-[var(--site-cream)]/85"
              :title="soc.placeholderNote"
            >
              {{ soc.platform }}: {{ soc.handle }}
            </span>
          </div>
        </div>
      </div>

      <!-- Giant Full-Width Editorial Wordmark (Echoes Cabalar's bold footer brand finish) -->
      <div class="pt-6 border-t border-[var(--site-cream)]/15 text-center select-none overflow-hidden">
        <p class="site-wordmark site-footer-wordmark text-[var(--site-cream)] tracking-[0.14em] leading-none">
          SERVIO
        </p>
      </div>

      <!-- Legal & Staff Portal Row -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--site-cream)]/15 text-xs text-[var(--site-cream)]/75">
        <p>© {{ currentYear }} {{ RESTAURANT_CONFIG.name }} Restaurant. All rights reserved.</p>

        <div class="flex flex-wrap items-center gap-5">
          <button
            type="button"
            class="min-h-[36px] uppercase tracking-[0.08em] font-semibold hover:text-[var(--site-cream)] transition-colors cursor-pointer"
            @click="isPrivacyOpen = true"
          >
            Privacy Policy
          </button>
          <router-link
            to="/login"
            class="min-h-[36px] inline-flex items-center uppercase tracking-[0.08em] font-semibold text-[var(--site-gold)] hover:text-[var(--site-cream)] transition-colors"
          >
            Staff POS Login
          </router-link>
        </div>
      </div>
    </div>

    <!-- Privacy Policy Dialog -->
    <BaseDialog
      v-model="isPrivacyOpen"
      title="Privacy Policy (Placeholder)"
      subtitle="Editable legal summary — replace with your official policy prior to launch."
      max-width="md"
    >
      <div class="space-y-3 text-sm text-[var(--color-muted)] leading-relaxed">
        <p v-for="(paragraph, idx) in RESTAURANT_CONFIG.privacySummary" :key="idx">
          {{ paragraph }}
        </p>
      </div>
      <template #footer>
        <BaseButton variant="primary" size="md" @click="isPrivacyOpen = false">
          Close
        </BaseButton>
      </template>
    </BaseDialog>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RESTAURANT_CONFIG } from '@/data/restaurant'
import { FOOTER_QUICK_LINKS } from '@/data/navigation'
import { PUBLIC_MENU_CATEGORIES } from '@/data/publicMenu'
import BaseIcon from '@/components/icons/BaseIcon.vue'
import BaseDialog from '@/components/base/BaseDialog.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const currentYear = new Date().getFullYear()
const isPrivacyOpen = ref(false)
</script>
