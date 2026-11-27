<template>
  <div class="servio-site min-h-[100dvh] flex flex-col bg-[var(--color-bg)] text-[var(--color-ink)]">
    <HomeHeader :section-links="sectionLinks" :modules="systemExploreCards" />

    <!-- Fixed Masthead Offset -->
    <div class="h-[68px] sm:h-[72px] shrink-0" aria-hidden="true" />

    <main id="main-content" tabindex="-1" class="flex-1 focus:outline-none">
      <!-- 1. ASYMMETRIC EDITORIAL HERO — REAL HOSPITALITY LEDGER, ZERO AI PILL BADGES -->
      <section class="pt-10 sm:pt-14 lg:pt-16 pb-14 sm:pb-18">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <!-- Left Editorial Column -->
          <div class="lg:col-span-7 space-y-6 lg:pt-3">
            <p class="site-mono-index text-[var(--color-accent)] border-l-2 border-[var(--color-accent)] pl-3">
              Pay First, Dine After · Local LAN Restaurant System
            </p>

            <h1 class="site-display-hero text-[var(--color-ink)]">
              Dining room, cashier, and kitchen — moving in one quiet rhythm.
            </h1>

            <p class="site-body-lg text-[var(--color-muted)] max-w-[52ch] text-pretty">
              Servio connects visual table seating, one-tap Filipino dish ordering, upfront
              cashiering with 80 mm thermal receipts, and a high-contrast Kitchen Display Board.
              Built for family-run dining rooms on local Wi-Fi with zero internet dependency.
            </p>

            <div class="flex flex-wrap items-center gap-3 pt-1">
              <router-link
                :to="authStore.isAuthenticated ? workspacePath : '/login'"
                class="min-h-[48px] px-6 rounded-[var(--radius-input)] bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-surface)] text-base font-semibold inline-flex items-center gap-2 transition-colors"
              >
                <span>{{ authStore.isAuthenticated ? `Continue to ${workspaceLabel}` : 'Start shift' }}</span>
                <BaseIcon name="chevron-right" :size="16" />
              </router-link>

              <a
                href="#workflow"
                class="min-h-[48px] px-5 rounded-[var(--radius-input)] border border-[var(--color-line-strong)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-alt)] text-[var(--color-ink)] text-base font-semibold inline-flex items-center transition-colors"
              >
                See how it works
              </a>
            </div>

            <!-- Quiet Operational Spec Line (No SaaS big-number KPI cards) -->
            <dl class="grid grid-cols-2 sm:grid-cols-4 gap-y-4 pt-7 border-t border-[var(--color-line)] text-sm">
              <div class="pr-4 sm:border-r sm:border-[var(--color-line)]">
                <dt class="font-mono text-xs text-[var(--color-muted)]">Checkout</dt>
                <dd class="font-semibold text-[var(--color-ink)] mt-0.5">3-tap pay first</dd>
              </div>
              <div class="sm:px-4 sm:border-r sm:border-[var(--color-line)]">
                <dt class="font-mono text-xs text-[var(--color-muted)]">Receipts</dt>
                <dd class="font-semibold text-[var(--color-ink)] mt-0.5">80 mm thermal</dd>
              </div>
              <div class="pr-4 sm:px-4 sm:border-r sm:border-[var(--color-line)]">
                <dt class="font-mono text-xs text-[var(--color-muted)]">Kitchen Board</dt>
                <dd class="font-semibold text-[var(--color-ink)] mt-0.5 tabular-nums">3.5 s LAN sync</dd>
              </div>
              <div class="sm:pl-4">
                <dt class="font-mono text-xs text-[var(--color-muted)]">Network</dt>
                <dd class="font-semibold text-[var(--color-ink)] mt-0.5">100% offline</dd>
              </div>
            </dl>
          </div>

          <!-- Right Column: Authentic Table Photograph + Attached Printed Order Chit -->
          <div class="lg:col-span-5 space-y-3">
            <div class="site-frame aspect-[4/3]">
              <img
                :src="heroLeadDish.image || '/Dishes/Sinigang na Baboy.jpg'"
                :alt="heroLeadDish.name"
                width="640"
                height="480"
                class="w-full h-full object-cover"
                loading="eager"
              />
            </div>

            <!-- Printed Counter Docket Strip (Honest sample when signed out, real order when signed in) -->
            <div class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] p-4 sm:p-5 space-y-3">
              <div class="flex items-center justify-between gap-2 pb-2.5 border-b border-dashed border-[var(--color-line-strong)]">
                <span class="site-mono-index text-[var(--color-accent)]">
                  {{ previewTicket.isLive ? 'Live Dining Room Ticket' : 'Sample Pay-First Flow' }}
                </span>
                <span class="font-mono text-xs text-[var(--color-muted)] tabular-nums">
                  T-01–T-10 · {{ catalogItems.length }} dishes
                </span>
              </div>

              <div class="flex items-baseline justify-between gap-3">
                <div class="min-w-0">
                  <p class="font-display text-base font-bold text-[var(--color-ink)]">
                    {{ previewTicket.heading }}
                  </p>
                  <p class="text-sm text-[var(--color-muted)] truncate mt-0.5">
                    {{ previewTicket.summary }}
                  </p>
                </div>
                <span class="font-mono text-base font-bold text-[var(--color-ink)] tabular-nums shrink-0">
                  {{ formatCurrency(previewTicket.total) }}
                </span>
              </div>

              <div class="flex items-center justify-between gap-2 pt-2 border-t border-[var(--color-line)] text-xs">
                <span class="font-mono text-[var(--color-leaf-ink)] font-semibold">
                  {{ previewTicket.badge }}
                </span>
                <router-link
                  :to="authStore.isAuthenticated ? workspacePath : '/login'"
                  class="min-h-[44px] px-2 -mr-2 inline-flex items-center font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
                >
                  {{ authStore.isAuthenticated ? `Open ${workspaceLabel} →` : 'Waiter · Kitchen · Admin →' }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. LIVE MENU CATALOG — EDITORIAL PLATE FEATURE + PRINTED FILIPINO MENU SHEET -->
      <section
        id="dishes"
        class="scroll-mt-24 py-14 sm:py-18 border-t border-[var(--color-line)] bg-[var(--color-surface)]"
        aria-label="Live Servio menu dish showcase"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <!-- Header Row -->
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div class="space-y-2 max-w-2xl">
              <p class="site-mono-index text-[var(--color-accent)]">
                01 / Live POS Menu Catalog
              </p>
              <h2 class="site-display-xl text-[var(--color-ink)]">
                Familiar Filipino plates, synced across every terminal.
              </h2>
              <p class="text-base text-[var(--color-muted)] max-w-[56ch]">
                Prices, photos, and Sold Out switches updated in Admin Menu flow straight to every
                waiter’s screen and kitchen ticket.
              </p>
            </div>

            <!-- Quiet Architectural Stepper -->
            <div v-if="carouselDishes.length > 0" class="flex items-center gap-2 shrink-0">
              <span class="font-mono text-xs font-semibold text-[var(--color-muted)] tabular-nums pr-2">
                {{ String(activeSlide + 1).padStart(2, '0') }} / {{ String(carouselDishes.length).padStart(2, '0') }}
              </span>
              <button
                type="button"
                class="w-11 h-11 rounded-[var(--radius-input)] border border-[var(--color-line-strong)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)] inline-flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous dish"
                @click="prevSlide"
              >
                <BaseIcon name="chevron-right" :size="17" custom-class="rotate-180" />
              </button>
              <button
                type="button"
                class="w-11 h-11 rounded-[var(--radius-input)] border border-[var(--color-line-strong)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)] inline-flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Next dish"
                @click="nextSlide"
              >
                <BaseIcon name="chevron-right" :size="17" />
              </button>
            </div>
          </div>

          <!-- Asymmetric Plate Feature (Clean unobstructed photo left + structured notes right) -->
          <div
            v-if="currentDish"
            class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"
            tabindex="0"
            aria-roledescription="carousel"
            aria-label="Featured dishes"
            @keydown.left.prevent="prevSlide"
            @keydown.right.prevent="nextSlide"
          >
            <div class="lg:col-span-7">
              <div class="site-frame aspect-[4/3]">
                <img
                  :src="currentDish.image"
                  :alt="currentDish.name"
                  width="640"
                  height="480"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>

            <div class="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div class="space-y-3 pb-6 border-b border-[var(--color-line)]">
                <div class="flex items-center gap-2 text-xs font-mono">
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="currentDish.is_available ? 'bg-[var(--color-leaf)]' : 'bg-[var(--color-berry)]'"
                    aria-hidden="true"
                  />
                  <span
                    class="font-semibold uppercase tracking-[0.05em]"
                    :class="currentDish.is_available ? 'text-[var(--color-leaf-ink)]' : 'text-[var(--color-berry-ink)]'"
                  >
                    {{ currentDish.is_available ? 'Available on POS' : 'Marked Sold Out' }}
                  </span>
                  <span v-if="currentDish.is_popular" class="text-[var(--color-muted)]">
                    · House favorite
                  </span>
                </div>

                <h3 class="font-display text-2xl font-bold text-[var(--color-ink)]">
                  {{ currentDish.name }}
                </h3>

                <p class="text-base text-[var(--color-muted)] leading-relaxed">
                  {{ currentDish.description }}
                </p>

                <p class="servio-total-numeral text-2xl font-bold text-[var(--color-accent)] pt-1">
                  {{ formatCurrency(currentDish.price) }}
                </p>
              </div>

              <!-- Filmstrip Quick Dish Selector (Balanced 4-thumb row) -->
              <div class="space-y-2.5">
                <p class="site-mono-index text-[var(--color-muted)]">
                  Browse plated dishes
                </p>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    v-for="entry in nearbyDishes"
                    :key="entry.dish.id"
                    type="button"
                    class="group text-left rounded-[var(--radius-input)] border overflow-hidden transition-colors cursor-pointer"
                    :class="
                      entry.index === activeSlide
                        ? 'border-[var(--color-accent)] bg-[var(--color-bg)]'
                        : 'border-[var(--color-line)] bg-[var(--color-surface)] hover:border-[var(--color-line-strong)]'
                    "
                    @click="activeSlide = entry.index"
                  >
                    <div class="aspect-[4/3] bg-[var(--color-surface-alt)] overflow-hidden">
                      <img
                        :src="entry.dish.image"
                        :alt="entry.dish.name"
                        width="240"
                        height="180"
                        class="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <p class="px-2 py-1.5 text-xs font-semibold text-[var(--color-ink)] truncate">
                      {{ entry.dish.name }}
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Printed 2-Column Live Menu Sheet (Dotted Leaders + Crisp Rectangular Category Tabs) -->
          <div class="pt-8 border-t border-[var(--color-line)] space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div
                class="flex flex-wrap items-center gap-1.5"
                role="group"
                aria-label="Filter menu snapshot by category"
              >
                <button
                  type="button"
                  :aria-pressed="activeMenuCategoryId === null"
                  class="min-h-[44px] px-4 rounded-[var(--radius-input)] text-sm font-semibold border transition-colors cursor-pointer"
                  :class="
                    activeMenuCategoryId === null
                      ? 'bg-[var(--color-ink)] text-[var(--color-surface)] border-[var(--color-ink)]'
                      : 'bg-[var(--color-surface)] border-[var(--color-line)] text-[var(--color-ink)] hover:border-[var(--color-line-strong)]'
                  "
                  @click="activeMenuCategoryId = null"
                >
                  All ({{ catalogItems.length }})
                </button>
                <button
                  v-for="cat in catalogCategories"
                  :key="cat.id"
                  type="button"
                  :aria-pressed="activeMenuCategoryId === cat.id"
                  class="min-h-[44px] px-4 rounded-[var(--radius-input)] text-sm font-semibold border transition-colors cursor-pointer"
                  :class="
                    activeMenuCategoryId === cat.id
                      ? 'bg-[var(--color-ink)] text-[var(--color-surface)] border-[var(--color-ink)]'
                      : 'bg-[var(--color-surface)] border-[var(--color-line)] text-[var(--color-ink)] hover:border-[var(--color-line-strong)]'
                  "
                  @click="activeMenuCategoryId = cat.id"
                >
                  {{ cat.name }}
                </button>
              </div>

              <router-link
                v-if="!authStore.isAuthenticated || authStore.isAdmin"
                :to="authStore.isAdmin ? '/admin/menu' : '/login'"
                class="min-h-[44px] inline-flex items-center text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
              >
                {{ authStore.isAdmin ? 'Edit catalog in Admin Menu →' : 'Manage catalog in Admin →' }}
              </router-link>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
              <div
                v-for="item in snapshotMenuItems"
                :key="item.id"
                class="flex items-baseline gap-1 py-3 border-b border-[var(--color-line)]"
                :class="!item.is_available ? 'opacity-65' : ''"
              >
                <span class="font-display text-base font-bold text-[var(--color-ink)]">
                  {{ item.name }}
                </span>
                <span
                  v-if="!item.is_available"
                  class="ml-1.5 font-mono text-[11px] font-semibold uppercase text-[var(--color-berry-ink)]"
                >
                  (Sold out)
                </span>
                <span class="site-menu-leader" aria-hidden="true" />
                <span class="font-mono text-sm font-semibold tabular-nums text-[var(--color-ink)] shrink-0">
                  {{ formatCurrency(item.price) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. PAY-FIRST SERVICE FLOW — HAIRLINE 4-COLUMN LEDGER (REPLACES REPETITIVE ROUNDED CARDS) -->
      <section
        id="workflow"
        class="scroll-mt-24 py-14 sm:py-18 bg-[var(--color-surface-alt)] border-y border-[var(--color-line)]"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div class="lg:col-span-7 space-y-2">
              <p class="site-mono-index text-[var(--color-accent)]">
                02 / Pay-First Workflow
              </p>
              <h2 class="site-display-xl text-[var(--color-ink)]">
                One clear order of service from table to kitchen.
              </h2>
            </div>
            <p class="lg:col-span-5 text-base text-[var(--color-muted)] leading-relaxed">
              Cooks only receive tickets once payment is confirmed at the register — eliminating
              unpaid walkouts and mismatched verbal add-ons.
            </p>
          </div>

          <ol class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-b border-[var(--color-line)] divide-y sm:divide-y-0 lg:divide-x divide-[var(--color-line)]">
            <li
              v-for="step in workflowSteps"
              :key="step.num"
              class="py-6 sm:p-6 lg:first:pl-0 lg:last:pr-0 flex flex-col justify-between gap-5"
            >
              <div class="space-y-3">
                <div class="flex items-center justify-between gap-2">
                  <span class="font-mono text-sm font-bold text-[var(--color-accent)] tabular-nums">
                    {{ step.num }}
                  </span>
                  <span class="font-mono text-xs text-[var(--color-muted)]">
                    {{ step.station }}
                  </span>
                </div>
                <h3 class="site-display-md text-[var(--color-ink)]">
                  {{ step.title }}
                </h3>
                <p class="text-sm text-[var(--color-muted)] leading-relaxed">
                  {{ step.desc }}
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <!-- 4. STAFF STATIONS — FULL-WIDTH ESPRESSO DIRECTORY ROWS (REPLACES 3-TIER SAAS CARDS) -->
      <section
        id="stations"
        class="scroll-mt-24 py-16 sm:py-20 bg-[var(--color-sidebar)] text-[var(--color-sidebar-ink)]"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div class="lg:col-span-7 space-y-2">
              <p class="site-mono-index text-[var(--color-kds-honey)]">
                03 / Staff Stations
              </p>
              <h2 class="site-display-xl text-[var(--color-sidebar-ink)]">
                Dedicated terminals for every role on the floor.
              </h2>
            </div>
            <p class="lg:col-span-5 text-base text-[var(--color-sidebar-muted)] leading-relaxed">
              Each staff account opens straight into its assigned station — keeping floor waiters
              fast, kitchen cooks focused, and owners informed.
            </p>
          </div>

          <div class="border-t border-[var(--color-sidebar-line)] divide-y divide-[var(--color-sidebar-line)]">
            <article
              v-for="(station, idx) in staffStations"
              :key="station.role"
              class="py-7 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
            >
              <!-- Role Identity -->
              <div class="lg:col-span-3 space-y-1">
                <p class="font-mono text-xs text-[var(--color-kds-honey)] tabular-nums">
                  0{{ idx + 1 }} · {{ station.badge }}
                </p>
                <h3 class="font-display text-xl font-bold text-[var(--color-sidebar-ink)]">
                  {{ station.role }}
                </h3>
              </div>

              <!-- Operational Capabilities (Plain scannable prose, no pill soup) -->
              <div class="lg:col-span-6 space-y-2">
                <p class="text-base text-[var(--color-sidebar-ink)]/90 leading-relaxed">
                  {{ station.summary }}
                </p>
                <p class="text-sm text-[var(--color-sidebar-muted)] leading-relaxed">
                  {{ station.points.join(' · ') }}
                </p>
              </div>

              <!-- Role-Aware Action (Preserves AUD-006 zero-bounce behavior) -->
              <div class="lg:col-span-3 flex lg:justify-end">
                <router-link
                  v-if="!authStore.isAuthenticated || canAccessRoles(station.allowedRoles)"
                  :to="authStore.isAuthenticated ? station.targetRoute : '/login'"
                  class="min-h-[44px] px-4 rounded-[var(--radius-input)] text-sm font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  :class="
                    station.featured
                      ? 'bg-[var(--color-kds-pot)] text-[var(--color-kds-bg)] hover:brightness-95'
                      : 'border border-[var(--color-sidebar-line)] bg-[var(--color-sidebar-surface)] text-[var(--color-sidebar-ink)] hover:border-[var(--color-sidebar-muted)]'
                  "
                >
                  <span>{{ authStore.isAuthenticated ? station.openLabel : `Sign in as ${station.shortName}` }}</span>
                  <BaseIcon name="chevron-right" :size="15" />
                </router-link>
                <span
                  v-else
                  class="min-h-[44px] px-4 rounded-[var(--radius-input)] border border-[var(--color-sidebar-line)] text-xs font-mono text-[var(--color-sidebar-muted)] inline-flex items-center"
                >
                  Requires {{ station.shortName }} account
                </span>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- 5. OWNER CONTROLS & OFFLINE LAN — ASYMMETRIC EDITORIAL SPREAD (REPLACES 3-ICON-BOX GRID) -->
      <section
        id="owner-controls"
        class="scroll-mt-24 py-16 sm:py-20 bg-[var(--color-bg)]"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div id="architecture" class="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div class="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
              <p class="site-mono-index text-[var(--color-accent)]">
                04 / Owner Controls &amp; Local LAN
              </p>
              <h2 class="site-display-xl text-[var(--color-ink)]">
                Clear daily numbers, zero internet dependency.
              </h2>
              <p class="text-base text-[var(--color-muted)] leading-relaxed max-w-[44ch]">
                All fonts (with verified native <code class="font-mono font-bold text-[var(--color-ink)]">₱</code> Peso glyphs),
                dish photos, icons, and polling run strictly on your restaurant Wi-Fi. No cloud
                lag, no subscription lockouts, and clean 80 mm receipts.
              </p>
              <div class="pt-2">
                <router-link
                  :to="authStore.isAuthenticated ? workspacePath : '/login'"
                  class="min-h-[46px] px-5 rounded-[var(--radius-input)] bg-[var(--color-ink)] hover:bg-[var(--color-sidebar-surface)] text-[var(--color-surface)] text-sm font-semibold inline-flex items-center gap-2 transition-colors"
                >
                  <span>{{ authStore.isAuthenticated ? `Open ${workspaceLabel}` : 'Open Servio POS' }}</span>
                  <BaseIcon name="chevron-right" :size="15" />
                </router-link>
              </div>
            </div>

            <div class="lg:col-span-7 border-t border-[var(--color-line)] divide-y divide-[var(--color-line)]">
              <div
                v-for="item in ownerArchitectureItems"
                :key="item.code"
                class="py-6 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-baseline"
              >
                <span class="sm:col-span-2 font-mono text-xs font-bold text-[var(--color-accent)]">
                  {{ item.code }}
                </span>
                <div class="sm:col-span-10 space-y-1.5">
                  <h3 class="site-display-md text-[var(--color-ink)]">
                    {{ item.title }}
                  </h3>
                  <p class="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
                    {{ item.desc }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 6. LEFT-ALIGNED EDITORIAL QUICK ANSWERS (NOT centered) -->
          <div class="pt-14 border-t border-[var(--color-line)] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div class="lg:col-span-4 space-y-2">
              <p class="site-mono-index text-[var(--color-accent)]">
                05 / Quick Answers
              </p>
              <h2 class="site-display-xl text-[var(--color-ink)]">
                How Servio runs on shift.
              </h2>
              <p class="text-sm text-[var(--color-muted)] leading-relaxed">
                Supports handheld phones (360 px), dining room tablets, countertop POS registers,
                and wall-mounted Kitchen Display screens.
              </p>
            </div>
            <div class="lg:col-span-8">
              <SiteAccordion :items="systemFaqs" />
            </div>
          </div>
        </div>
      </section>
    </main>

    <HomeFooter :section-links="sectionLinks" />
  </div>
</template>

<script setup lang="ts">
import '@/styles/publicSite.css'
import { ref, computed, onMounted } from 'vue'
import type { Role } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { useMenuStore } from '@/stores/menu'
import { useOrdersStore } from '@/stores/orders'
import { USE_MOCK } from '@/services/api'
import { MOCK_CATEGORIES, MOCK_MENU_ITEMS } from '@/services/mockData'
import { formatCurrency, formatTableLabel } from '@/utils/format'
import BaseIcon from '@/components/icons/BaseIcon.vue'
import SiteAccordion, { type AccordionItem } from '@/components/site/SiteAccordion.vue'
import HomeHeader, { type HomeSectionLink, type SystemExploreModule } from '@/components/home/HomeHeader.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'

const authStore = useAuthStore()
const menuStore = useMenuStore()
const ordersStore = useOrdersStore()

const activeSlide = ref(0)
const activeMenuCategoryId = ref<number | null>(null)

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

const canAccessRoles = (allowedRoles: Role[]) =>
  Boolean(authStore.role && allowedRoles.includes(authStore.role))

const catalogItems = computed(() =>
  menuStore.items.length > 0 ? menuStore.items : MOCK_MENU_ITEMS,
)

const catalogCategories = computed(() =>
  menuStore.categories.length > 0 ? menuStore.categories : MOCK_CATEGORIES,
)

const heroLeadDish = computed(() => {
  const withPhoto = catalogItems.value.filter((d) => Boolean(d.image))
  return withPhoto[0] ?? { name: 'Sinigang na Baboy', image: '/Dishes/Sinigang na Baboy.jpg' }
})

const carouselDishes = computed(() =>
  catalogItems.value.filter((d) => Boolean(d.image)).slice(0, 10),
)

const prevIndex = computed(() =>
  carouselDishes.value.length > 0
    ? (activeSlide.value - 1 + carouselDishes.value.length) % carouselDishes.value.length
    : 0,
)

const nextIndex = computed(() =>
  carouselDishes.value.length > 0
    ? (activeSlide.value + 1) % carouselDishes.value.length
    : 0,
)

const currentDish = computed(() => carouselDishes.value[activeSlide.value] ?? null)

const nearbyDishes = computed(() => {
  const list = carouselDishes.value
  if (list.length === 0) return []
  const indices = [
    activeSlide.value,
    (activeSlide.value + 1) % list.length,
    (activeSlide.value + 2) % list.length,
    (activeSlide.value + 3) % list.length,
  ]
  const unique = Array.from(new Set(indices))
  return unique.map((index) => ({ index, dish: list[index]! }))
})

const prevSlide = () => {
  activeSlide.value = prevIndex.value
}

const nextSlide = () => {
  activeSlide.value = nextIndex.value
}

const snapshotMenuItems = computed(() => {
  const list = activeMenuCategoryId.value
    ? catalogItems.value.filter((i) => i.category_id === activeMenuCategoryId.value)
    : catalogItems.value
  return list.slice(0, 12)
})

const previewTicket = computed(() => {
  if (authStore.isAuthenticated && ordersStore.activeOrders.length > 0) {
    const first = ordersStore.activeOrders[0]
    const refNum = first.order_ref.replace(/^#?ORD-?/i, '')
    const itemsText = first.items
      .slice(0, 2)
      .map((i) => i.name)
      .join(' + ')
    return {
      isLive: true,
      heading: `${formatTableLabel(first.table_number)} · #${refNum}`,
      badge: first.payment_status === 'paid' ? `PAID · ${first.status.toUpperCase()}` : 'UNPAID',
      summary: itemsText || 'Active table items',
      total: first.total,
    }
  }
  return {
    isLive: false,
    heading: 'Table 4 · Sample #1204',
    badge: '1. PAID → 2. COOKING → 3. SERVE',
    summary: 'Sinigang na Baboy + Calamansi Juice',
    total: 420,
  }
})

const sectionLinks: HomeSectionLink[] = [
  { href: '#dishes', label: 'Menu' },
  { href: '#workflow', label: 'Workflow' },
  { href: '#stations', label: 'Stations' },
  { href: '#owner-controls', label: 'Owner tools' },
  { href: '#architecture', label: 'Why Servio' },
]

const systemExploreCards: SystemExploreModule[] = [
  {
    title: 'Visual Table Map',
    desc: 'Live 2–8 seat floor map with available, occupied & ready alerts.',
    sectionHref: '#workflow',
    authRoute: '/tables',
    allowedRoles: ['waiter', 'admin'],
    roleTag: 'Floor',
  },
  {
    title: 'Waiter POS',
    desc: 'One-tap Filipino dish cards, reload-safe drafts & kitchen notes.',
    sectionHref: '#dishes',
    authRoute: '/pos',
    allowedRoles: ['waiter', 'admin'],
    roleTag: 'Floor',
  },
  {
    title: 'Pay First & Receipts',
    desc: 'Cash, GCash & Card upfront checkout with 80 mm thermal print.',
    sectionHref: '#workflow',
    authRoute: '/payment',
    allowedRoles: ['waiter', 'admin'],
    roleTag: 'Cashier',
  },
  {
    title: 'Kitchen Board (KDS)',
    desc: 'High-contrast dark display with 3.5 s paid-ticket polling.',
    sectionHref: '#stations',
    authRoute: '/kitchen',
    allowedRoles: ['kitchen', 'admin'],
    roleTag: 'Kitchen',
  },
  {
    title: 'Sales & Reports',
    desc: 'Manila-time daily revenue, payment split & best-selling dishes.',
    sectionHref: '#owner-controls',
    authRoute: '/admin/dashboard',
    allowedRoles: ['admin'],
    roleTag: 'Admin',
  },
  {
    title: 'Menu & Staff Admin',
    desc: 'Dish photo uploads, instant Sold Out switches & staff accounts.',
    sectionHref: '#owner-controls',
    authRoute: '/admin/menu',
    allowedRoles: ['admin'],
    roleTag: 'Admin',
  },
]

const workflowSteps = [
  {
    num: '01',
    station: 'Tables',
    title: 'Choose a Table',
    desc: 'See open, occupied, unpaid, and food-ready tables across the dining room and seat guests in one tap.',
  },
  {
    num: '02',
    station: 'Waiter POS',
    title: 'Take the Order',
    desc: 'Tap Filipino dishes, desserts, and drinks straight into the tray with optional kitchen notes and live totals.',
  },
  {
    num: '03',
    station: 'Pay Bill',
    title: 'Collect Payment First',
    desc: 'Accept Cash, GCash, or Card upfront with quick-tender change math and an 80 mm thermal receipt.',
  },
  {
    num: '04',
    station: 'Kitchen Board',
    title: 'Cook, Serve & Clear',
    desc: 'Paid tickets land on the Kitchen Board immediately; serve warm and clear tables safely once guests leave.',
  },
]

const staffStations = [
  {
    role: 'Waiter & Cashier',
    shortName: 'Waiter',
    badge: 'Floor & Register',
    featured: false,
    targetRoute: '/tables',
    openLabel: 'Open Dining Room',
    allowedRoles: ['waiter', 'admin'] as Role[],
    summary: 'Built for fast table turnover, zero missed add-ons, and calm upfront billing.',
    points: [
      'Visual 2–8 seat floor map',
      'Reload-safe POS drafts & kitchen notes',
      'Cash, GCash & Card with 80 mm thermal receipts',
    ],
  },
  {
    role: 'Kitchen Staff',
    shortName: 'Kitchen',
    badge: 'Wall Display (KDS)',
    featured: true,
    targetRoute: '/kitchen',
    openLabel: 'Open Kitchen Board',
    allowedRoles: ['kitchen', 'admin'] as Role[],
    summary: 'Full-screen dark display engineered to stay readable across a bright, busy pass.',
    points: [
      'Paid tickets only via 3.5 s LAN polling',
      'Large high-contrast dish text',
      'Live elapsed timers & >10 min late alerts',
    ],
  },
  {
    role: 'Owner & Admin',
    shortName: 'Owner',
    badge: 'Management',
    featured: false,
    targetRoute: '/admin/dashboard',
    openLabel: 'Open Owner Dashboard',
    allowedRoles: ['admin'] as Role[],
    summary: 'Tune the menu, watch daily sales, and manage staff accounts without spreadsheet friction.',
    points: [
      'Manila-time revenue & payment split',
      'Live dish editor & Sold Out toggles',
      'Role-based staff accounts & safe deactivation',
    ],
  },
]

const ownerArchitectureItems = [
  {
    code: 'RPT',
    title: 'Daily sales & payment split',
    desc: 'Track Manila-time daily revenue, average table bill, exact Cash/GCash/Card percentages, and best-selling Filipino dishes by date range.',
  },
  {
    code: 'CAT',
    title: 'Menu catalog & instant Sold Out',
    desc: 'Add or edit dishes with JPG/PNG/WebP photo uploads, House Favorite flags, and Sold Out switches that propagate immediately across waiter terminals.',
  },
  {
    code: 'RBAC',
    title: 'Role-based staff governance',
    desc: 'Create Admin, Waiter, and Kitchen accounts with generated temporary passwords, first-login password updates, and history-preserving soft deactivation.',
  },
  {
    code: 'LAN',
    title: 'Offline local Wi-Fi resilience',
    desc: 'Zero external CDNs, self-hosted fonts with verified ₱ Peso glyphs, and lightweight 3.5-second polling so service keeps moving even when internet drops.',
  },
]

const systemFaqs: AccordionItem[] = [
  {
    id: 'sys-pay-first',
    question: 'How does the Pay First, Dine After workflow work?',
    answer:
      'Waiters tap an open table, add dishes in POS, and collect Cash, GCash, or Card payment upfront. Only paid orders are dispatched to the Kitchen Display (KDS), eliminating unpaid walkouts and mismatched kitchen tickets.',
  },
  {
    id: 'sys-offline',
    question: 'Does Servio work when restaurant internet drops?',
    answer:
      'Yes. All typography (including verified Philippine Peso ₱ glyphs), icons, dish photos, and polling endpoints run strictly over local restaurant Wi-Fi / LAN with zero external CDN dependencies.',
  },
  {
    id: 'sys-sync',
    question: 'How do Kitchen, Waiter, and Admin screens stay synchronized?',
    answer:
      'Servio uses lightweight 3.5-second visibility-aware polling across Tables, Active Orders, Payment, and Kitchen screens so devices recover automatically from Wi-Fi handoffs without brittle WebSocket daemons.',
  },
  {
    id: 'sys-receipt',
    question: 'How does 80 mm thermal receipt printing work?',
    answer:
      'After payment confirmation, Servio opens a clean receipt preview formatted strictly to 80 mm paper (72 mm / 42-column Geist Mono print CSS) ready for countertop thermal printers.',
  },
]

onMounted(async () => {
  if (USE_MOCK || authStore.isAuthenticated) {
    await menuStore.fetchMenu()
  }
  if (authStore.isAuthenticated && ordersStore.orders.length === 0) {
    await ordersStore.fetchOrders(true)
  }
})
</script>
