<template>
  <div class="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)] selection:bg-[var(--color-accent-soft)] selection:text-[var(--color-ink)] relative overflow-x-clip">
    <!-- Subtle architectural background decor -->
    <svg
      class="pointer-events-none select-none fixed -top-24 -right-24 w-[480px] h-[480px] text-[var(--color-accent)] opacity-[0.04] blur-[3px] z-0"
      viewBox="0 0 240 240"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M210 30C125 35 60 85 40 190c95-15 160-72 170-160Z" />
    </svg>
    <svg
      class="pointer-events-none select-none fixed top-[45%] -left-32 w-[420px] h-[420px] text-[var(--color-pot)] opacity-[0.03] blur-[4px] z-0"
      viewBox="0 0 240 240"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M30 210c5-85 55-150 160-170-15 95-72 160-160 170Z" />
    </svg>

    <!-- ====================================================================== -->
    <!-- TOP FIXED NAVIGATION BAR (FOLLOWS DOWN ON SCROLL)                       -->
    <!-- ====================================================================== -->
    <header class="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-[var(--color-surface)]/95 border-b border-[var(--color-line)] shadow-xs transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        <!-- Logo & Brand Name -->
        <router-link to="/" class="flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] rounded-[var(--radius-input)] p-1">
          <img
            src="/servio-logo-icon.jpg"
            alt="Servio Logo"
            width="40"
            height="40"
            class="w-10 h-10 rounded-[var(--radius-input)] object-cover border border-[var(--color-line)] group-hover:border-[var(--color-accent)] transition-ui shadow-xs"
          />
          <div>
            <div class="flex items-center gap-2">
              <span class="servio-wordmark text-2xl text-[var(--color-ink)] leading-none">
                Servio
              </span>
              <span class="hidden sm:inline-flex px-2 py-0.5 rounded-[var(--radius-pill)] text-[10px] font-bold tracking-wider uppercase bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent-soft)]">
                Restaurant OS
              </span>
            </div>
            <p class="hidden sm:block text-[11px] text-[var(--color-muted)] font-medium leading-tight">
              Order Management System for Restaurant Owners
            </p>
          </div>
        </router-link>

        <!-- Desktop Navigation Anchor Links (Clean, Non-Technical, Owner-Friendly) -->
        <nav class="hidden md:flex items-center gap-1 text-sm font-medium" aria-label="Main Navigation">
          <a
            href="#modules"
            class="px-3.5 py-2 rounded-[var(--radius-pill)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)] transition-ui"
          >
            How It Works
          </a>
          <a
            href="#owner-controls"
            class="px-3.5 py-2 rounded-[var(--radius-pill)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)] transition-ui"
          >
            Owner Tools
          </a>
          <a
            href="#stations"
            class="px-3.5 py-2 rounded-[var(--radius-pill)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)] transition-ui"
          >
            Staff Stations
          </a>
          <a
            href="#architecture"
            class="px-3.5 py-2 rounded-[var(--radius-pill)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)] transition-ui"
          >
            Why Servio
          </a>
        </nav>

        <!-- Right Action: Secure Sign In -->
        <div class="flex items-center gap-3">
          <template v-if="authStore.isAuthenticated">
            <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-pill)] bg-[var(--color-surface-alt)] border border-[var(--color-line)] text-xs font-semibold text-[var(--color-ink)]">
              <span class="w-2 h-2 rounded-full bg-[var(--color-leaf)] animate-pulse"></span>
              <span>{{ authStore.user?.name }}</span>
              <span class="text-[var(--color-muted)] capitalize">({{ authStore.role }})</span>
            </div>

            <BaseButton
              variant="primary"
              size="sm"
              icon="chevron-right"
              @click="goToWorkspace"
            >
              Open {{ workspaceLabel }}
            </BaseButton>

            <button
              type="button"
              class="min-h-[36px] px-2.5 rounded-[var(--radius-pill)] text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)] transition-ui cursor-pointer"
              title="Sign Out"
              @click="handleLogout"
            >
              <BaseIcon name="logout" :size="16" />
            </button>
          </template>

          <template v-else>
            <router-link
              to="/login"
              class="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 rounded-[var(--radius-pill)] bg-[var(--color-accent)] text-[var(--color-surface)] text-sm font-semibold hover:bg-[var(--color-accent-hover)] active:translate-y-px transition-ui shadow-xs"
            >
              <BaseIcon name="user" :size="16" />
              <span>Owner & Staff Sign In</span>
            </router-link>
          </template>
        </div>
      </div>
    </header>

    <!-- Spacer to offset the fixed top navbar -->
    <div class="h-18" aria-hidden="true"></div>

    <!-- ====================================================================== -->
    <!-- HERO SECTION (ELEGANT, CENTERED FOR RESTAURANT OWNERS)                 -->
    <!-- ====================================================================== -->
    <section class="relative z-10 pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-8">
      <!-- Eyebrow Badge -->
      <div>
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[var(--radius-pill)] bg-[var(--color-accent-subtle)] border border-[var(--color-accent-soft)] text-[var(--color-accent)] text-xs font-bold tracking-wide">
          <span class="w-2 h-2 rounded-full bg-[var(--color-accent)]"></span>
          <span>BUILT FOR RESTAURANT OWNERS & OPERATORS</span>
        </div>
      </div>

      <!-- Main Hero Headline -->
      <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--color-ink)] tracking-tight text-balance leading-tight max-w-4xl mx-auto">
        The Complete Order Management System for Restaurant Owners.
      </h1>

      <!-- Hero Subtitle -->
      <p class="text-base sm:text-lg lg:text-xl text-[var(--color-muted)] leading-relaxed max-w-3xl mx-auto text-pretty">
        Take total control of your restaurant. Servio seamlessly connects dining room table orders, kitchen preparation screens, and cashier settlements into one unified, offline-resilient system designed to maximize table turnover and revenue.
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
        <template v-if="authStore.isAuthenticated">
          <BaseButton
            variant="primary"
            size="lg"
            icon="chevron-right"
            @click="goToWorkspace"
          >
            Go to {{ workspaceLabel }}
          </BaseButton>
        </template>
        <template v-else>
          <router-link
            to="/login"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 min-h-[52px] px-8 rounded-[var(--radius-pill)] bg-[var(--color-accent)] text-[var(--color-surface)] text-base font-bold hover:bg-[var(--color-accent-hover)] active:translate-y-px transition-ui shadow-md"
          >
            <BaseIcon name="user" :size="18" />
            <span>Sign in to Restaurant Portal</span>
          </router-link>
        </template>

        <a
          href="#owner-controls"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[52px] px-7 rounded-[var(--radius-pill)] bg-[var(--color-surface)] border border-[var(--color-line-strong)] text-[var(--color-ink)] text-base font-semibold hover:bg-[var(--color-surface-hover)] active:translate-y-px transition-ui shadow-xs"
        >
          <BaseIcon name="bar-chart" :size="18" />
          <span>Explore Owner Tools</span>
        </a>
      </div>

      <!-- Trust / Feature Micro-Pills -->
      <div class="pt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2.5 text-xs sm:text-sm text-[var(--color-muted)] font-medium">
        <div class="flex items-center gap-1.5">
          <BaseIcon name="check" :size="15" custom-class="text-[var(--color-leaf)]" />
          <span>Faster Table Turnover & Rush Speed</span>
        </div>
        <div class="flex items-center gap-1.5">
          <BaseIcon name="check" :size="15" custom-class="text-[var(--color-leaf)]" />
          <span>Zero Lost Tickets Between Floor & Kitchen</span>
        </div>
        <div class="flex items-center gap-1.5">
          <BaseIcon name="check" :size="15" custom-class="text-[var(--color-leaf)]" />
          <span>99.99% Offline LAN Resilience</span>
        </div>
      </div>
    </section>

    <!-- ====================================================================== -->
    <!-- CORE SYSTEM MODULES (THE 4 PILLARS)                                    -->
    <!-- ====================================================================== -->
    <section id="modules" class="scroll-mt-20 py-16 sm:py-24 bg-[var(--color-surface)] border-y border-[var(--color-line)] relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div class="text-center max-w-3xl mx-auto space-y-3">
          <span class="label-tracked text-[var(--color-accent)] font-bold">
            HOW SERVIO WORKS • ORDER FLOW
          </span>
          <h2 class="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-ink)] text-balance">
            Everything Your Restaurant Needs to Operate at Peak Speed
          </h2>
          <p class="text-sm sm:text-base text-[var(--color-muted)] text-pretty">
            Designed to replace scattered paper tickets and clunky cash registers with a fast, cohesive system built for high-volume service.
          </p>
        </div>

        <!-- 4 Pillars Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Pillar 1: Floor & Table Grid -->
          <div class="p-6 rounded-[var(--radius-card)] bg-[var(--color-bg)] border border-[var(--color-line)] hover:border-[var(--color-accent)] transition-ui space-y-4 flex flex-col justify-between">
            <div class="space-y-3">
              <div class="w-12 h-12 rounded-[var(--radius-input)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] flex items-center justify-center">
                <BaseIcon name="table" :size="24" />
              </div>
              <span class="inline-block label-tracked text-[10px] text-[var(--color-accent)] font-bold">
                FRONT OF HOUSE
              </span>
              <h3 class="font-display text-lg font-bold text-[var(--color-ink)]">
                Visual Table Management
              </h3>
              <p class="text-sm text-[var(--color-muted)] leading-relaxed">
                Color-coded table grid (Available, Seated, Billed). Waiters tap an available table to immediately launch order taking with atomic lock protection.
              </p>
            </div>
            <div class="pt-2 text-xs font-semibold text-[var(--color-ink)] flex items-center gap-1.5">
              <BaseIcon name="check" :size="14" custom-class="text-[var(--color-leaf)]" />
              <span>Real-time table occupancy & turn rates</span>
            </div>
          </div>

          <!-- Pillar 2: Touch POS -->
          <div class="p-6 rounded-[var(--radius-card)] bg-[var(--color-bg)] border border-[var(--color-line)] hover:border-[var(--color-accent)] transition-ui space-y-4 flex flex-col justify-between">
            <div class="space-y-3">
              <div class="w-12 h-12 rounded-[var(--radius-input)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] flex items-center justify-center">
                <BaseIcon name="dish" :size="24" />
              </div>
              <span class="inline-block label-tracked text-[10px] text-[var(--color-accent)] font-bold">
                ORDER ENTRY
              </span>
              <h3 class="font-display text-lg font-bold text-[var(--color-ink)]">
                Touch POS Ordering
              </h3>
              <p class="text-sm text-[var(--color-muted)] leading-relaxed">
                Single-tap item entry, guest modifier notes, price snapshotting, and non-destructive add-ons to open orders without cancelling existing tickets.
              </p>
            </div>
            <div class="pt-2 text-xs font-semibold text-[var(--color-ink)] flex items-center gap-1.5">
              <BaseIcon name="check" :size="14" custom-class="text-[var(--color-leaf)]" />
              <span>Immutable unit price snapshotting</span>
            </div>
          </div>

          <!-- Pillar 3: Kitchen Display System -->
          <div class="p-6 rounded-[var(--radius-card)] bg-[var(--color-bg)] border border-[var(--color-line)] hover:border-[var(--color-accent)] transition-ui space-y-4 flex flex-col justify-between">
            <div class="space-y-3">
              <div class="w-12 h-12 rounded-[var(--radius-input)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] flex items-center justify-center">
                <BaseIcon name="cooking" :size="24" />
              </div>
              <span class="inline-block label-tracked text-[10px] text-[var(--color-accent)] font-bold">
                KITCHEN DISPLAY
              </span>
              <h3 class="font-display text-lg font-bold text-[var(--color-ink)]">
                Kitchen Display (KDS)
              </h3>
              <p class="text-sm text-[var(--color-muted)] leading-relaxed">
                High-contrast kitchen display with live elapsed timers. Chefs advance orders through Pending → Cooking → Ready with a single tap.
              </p>
            </div>
            <div class="pt-2 text-xs font-semibold text-[var(--color-ink)] flex items-center gap-1.5">
              <BaseIcon name="check" :size="14" custom-class="text-[var(--color-leaf)]" />
              <span>Zero lost paper tickets & prep pacing</span>
            </div>
          </div>

          <!-- Pillar 4: Cashiering & Receipts -->
          <div class="p-6 rounded-[var(--radius-card)] bg-[var(--color-bg)] border border-[var(--color-line)] hover:border-[var(--color-accent)] transition-ui space-y-4 flex flex-col justify-between">
            <div class="space-y-3">
              <div class="w-12 h-12 rounded-[var(--radius-input)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] flex items-center justify-center">
                <BaseIcon name="receipt" :size="24" />
              </div>
              <span class="inline-block label-tracked text-[10px] text-[var(--color-accent)] font-bold">
                CASHIERING & AUDIT
              </span>
              <h3 class="font-display text-lg font-bold text-[var(--color-ink)]">
                Settlement & Thermal Receipts
              </h3>
              <p class="text-sm text-[var(--color-muted)] leading-relaxed">
                Fast payment settlement (Cash, GCash, Card, Split Checks), automatic statutory Senior/PWD tax exemptions, and clean 80mm ESC/POS thermal receipts.
              </p>
            </div>
            <div class="pt-2 text-xs font-semibold text-[var(--color-ink)] flex items-center gap-1.5">
              <BaseIcon name="check" :size="14" custom-class="text-[var(--color-leaf)]" />
              <span>Full cashier audit trail & daily Z-Readings</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====================================================================== -->
    <!-- OWNER CONTROLS & CAPABILITIES (FULLY DYNAMIC, FUNCTIONING TABS)       -->
    <!-- ====================================================================== -->
    <section id="owner-controls" class="scroll-mt-20 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 relative z-10">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div class="space-y-2">
          <span class="label-tracked text-[var(--color-accent)] font-bold">
            OWNER & MANAGEMENT TOOLS
          </span>
          <h2 class="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-ink)]">
            Complete Control Across Your Operations
          </h2>
          <p class="text-sm sm:text-base text-[var(--color-muted)] max-w-xl">
            Switch between capabilities to see how Servio protects your profits, coordinates staff, and streamlines daily order management.
          </p>
        </div>

        <!-- Capability Tabs (Functional and Dynamic) -->
        <div class="flex flex-wrap items-center gap-2 p-1.5 rounded-[var(--radius-pill)] bg-[var(--color-surface)] border border-[var(--color-line)] self-start md:self-auto">
          <button
            v-for="tab in capabilityTabs"
            :key="tab.id"
            type="button"
            class="px-4 py-2 rounded-[var(--radius-pill)] text-xs sm:text-sm font-bold transition-ui cursor-pointer"
            :class="
              selectedTabId === tab.id
                ? 'bg-[var(--color-accent)] text-[var(--color-surface)] shadow-xs'
                : 'text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)]'
            "
            @click="selectedTabId = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>

      <!-- DYNAMIC 4-CARD GRID (REACTIVE TO ACTIVE TAB) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="card in activeTabCards"
          :key="card.title"
          class="p-6 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] hover:border-[var(--color-accent)] transition-ui space-y-4 flex flex-col justify-between shadow-xs"
        >
          <div class="space-y-3">
            <div class="w-12 h-12 rounded-[var(--radius-input)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] flex items-center justify-center">
              <BaseIcon :name="card.icon" :size="24" />
            </div>
            <span class="inline-block label-tracked text-[10px] text-[var(--color-accent)] font-bold">
              {{ card.badge }}
            </span>
            <h3 class="font-display text-lg font-bold text-[var(--color-ink)]">
              {{ card.title }}
            </h3>
            <p class="text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed">
              {{ card.description }}
            </p>
          </div>
          <div class="pt-2 text-xs font-semibold text-[var(--color-ink)] flex items-center gap-1.5 border-t border-[var(--color-line)]">
            <BaseIcon name="check" :size="14" custom-class="text-[var(--color-leaf)] shrink-0" />
            <span>{{ card.highlight }}</span>
          </div>
        </div>
      </div>

      <div class="text-center pt-2">
        <p class="text-xs text-[var(--color-muted)]">
          Full catalog syndication, role security matrices, and fiscal reporting ready for single and multi-unit deployments.
        </p>
      </div>
    </section>

    <!-- ====================================================================== -->
    <!-- HARDWARE & OPERATIONAL STATIONS (ENTERPRISE INFORMATION SPECIFICATIONS)-->
    <!-- ====================================================================== -->
    <section id="stations" class="scroll-mt-20 py-16 sm:py-24 bg-[var(--color-surface)] border-y border-[var(--color-line)] relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div class="text-center max-w-2xl mx-auto space-y-3">
          <span class="label-tracked text-[var(--color-accent)] font-bold">
            STAFF STATIONS & SETUP
          </span>
          <h2 class="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-ink)]">
            Engineered for High-Velocity Service Across Every Station
          </h2>
          <p class="text-sm sm:text-base text-[var(--color-muted)]">
            Servio deploys seamlessly across your existing front-of-house mobile tablets, industrial kitchen displays, and back-office management terminals.
          </p>
        </div>

        <!-- 3 Station Architecture Cards (Pure Enterprise Information, Zero Sign In Buttons) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Station 1: Waiter POS Terminal Architecture -->
          <div class="p-6 rounded-[var(--radius-card)] bg-[var(--color-bg)] border border-[var(--color-line)] space-y-5 flex flex-col justify-between shadow-xs">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="w-12 h-12 rounded-full bg-[var(--color-leaf-bg)] text-[var(--color-leaf-ink)] flex items-center justify-center font-bold text-lg">
                  POS
                </div>
                <span class="px-2.5 py-1 rounded-[var(--radius-pill)] bg-[var(--color-surface)] border border-[var(--color-line)] text-xs font-bold text-[var(--color-ink)]">
                  Front of House
                </span>
              </div>
              <div class="space-y-1.5">
                <h3 class="font-display text-xl font-bold text-[var(--color-ink)]">
                  Dining Room & POS Station
                </h3>
                <p class="text-xs text-[var(--color-muted)] leading-relaxed">
                  High-velocity mobile and countertop POS interface engineered for rapid table turnover and seamless modifier handling.
                </p>
              </div>
              <ul class="space-y-2 text-xs text-[var(--color-muted)]">
                <li class="flex items-center gap-2">
                  <BaseIcon name="check" :size="14" custom-class="text-[var(--color-leaf)] shrink-0" />
                  <span>Visual table floor assignment & atomic lock</span>
                </li>
                <li class="flex items-center gap-2">
                  <BaseIcon name="check" :size="14" custom-class="text-[var(--color-leaf)] shrink-0" />
                  <span>One-tap order entry with guest modifier notes</span>
                </li>
                <li class="flex items-center gap-2">
                  <BaseIcon name="check" :size="14" custom-class="text-[var(--color-leaf)] shrink-0" />
                  <span>Direct bill settlement & thermal receipt triggering</span>
                </li>
              </ul>
            </div>

            <!-- Enterprise Hardware & Latency Spec Box -->
            <div class="pt-3.5 border-t border-[var(--color-line)] space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <span class="text-[var(--color-muted)] font-medium">Hardware Support</span>
                <span class="font-mono text-[11px] font-bold text-[var(--color-ink)]">iPads • Android • Windows</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-[var(--color-muted)] font-medium">Order Transmission</span>
                <span class="text-[var(--color-leaf-ink)] font-mono font-bold">&lt; 0.4s to Kitchen</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-[var(--color-muted)] font-medium">Offline Resilience</span>
                <span class="text-[var(--color-ink)] font-mono text-[11px] font-bold">Local SQLite LAN Cache</span>
              </div>
            </div>
          </div>

          <!-- Station 2: Kitchen Display System (KDS) Architecture -->
          <div class="p-6 rounded-[var(--radius-card)] bg-[var(--color-bg)] border border-[var(--color-line)] space-y-5 flex flex-col justify-between shadow-xs">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="w-12 h-12 rounded-full bg-[var(--color-pot-bg)] text-[var(--color-pot-ink)] flex items-center justify-center font-bold text-lg">
                  KDS
                </div>
                <span class="px-2.5 py-1 rounded-[var(--radius-pill)] bg-[var(--color-surface)] border border-[var(--color-line)] text-xs font-bold text-[var(--color-ink)]">
                  Production Line
                </span>
              </div>
              <div class="space-y-1.5">
                <h3 class="font-display text-xl font-bold text-[var(--color-ink)]">
                  Kitchen Display Terminal (KDS)
                </h3>
                <p class="text-xs text-[var(--color-muted)] leading-relaxed">
                  Industrial-grade digital order queue replacing fragile paper printers with high-contrast, heat-resilient station routing.
                </p>
              </div>
              <ul class="space-y-2 text-xs text-[var(--color-muted)]">
                <li class="flex items-center gap-2">
                  <BaseIcon name="check" :size="14" custom-class="text-[var(--color-leaf)] shrink-0" />
                  <span>Multi-station routing (Grill, Saute, Fry, Drinks)</span>
                </li>
                <li class="flex items-center gap-2">
                  <BaseIcon name="check" :size="14" custom-class="text-[var(--color-leaf)] shrink-0" />
                  <span>Real-time elapsed cooking timers with color alerts</span>
                </li>
                <li class="flex items-center gap-2">
                  <BaseIcon name="check" :size="14" custom-class="text-[var(--color-leaf)] shrink-0" />
                  <span>One-touch order status progression (Cooking → Ready)</span>
                </li>
              </ul>
            </div>

            <!-- Enterprise Hardware & Latency Spec Box -->
            <div class="pt-3.5 border-t border-[var(--color-line)] space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <span class="text-[var(--color-muted)] font-medium">Display Format</span>
                <span class="font-mono text-[11px] font-bold text-[var(--color-ink)]">21"-32" Rugged Displays</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-[var(--color-muted)] font-medium">Ticket Accuracy</span>
                <span class="text-[var(--color-leaf-ink)] font-mono font-bold">99.98% Zero Paper Loss</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-[var(--color-muted)] font-medium">Station Pacing</span>
                <span class="text-[var(--color-ink)] font-mono text-[11px] font-bold">Auto-Coursing & Bump</span>
              </div>
            </div>
          </div>

          <!-- Station 3: Admin & Management Console Architecture -->
          <div class="p-6 rounded-[var(--radius-card)] bg-[var(--color-bg)] border border-[var(--color-line)] space-y-5 flex flex-col justify-between shadow-xs">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="w-12 h-12 rounded-full bg-[var(--color-honey-bg)] text-[var(--color-honey-ink)] flex items-center justify-center font-bold text-lg">
                  HQ
                </div>
                <span class="px-2.5 py-1 rounded-[var(--radius-pill)] bg-[var(--color-surface)] border border-[var(--color-line)] text-xs font-bold text-[var(--color-ink)]">
                  Central HQ & Audit
                </span>
              </div>
              <div class="space-y-1.5">
                <h3 class="font-display text-xl font-bold text-[var(--color-ink)]">
                  Owner & Management Console
                </h3>
                <p class="text-xs text-[var(--color-muted)] leading-relaxed">
                  Comprehensive control room providing real-time sales visibility, centralized menu engineering, and strict shift accountability.
                </p>
              </div>
              <ul class="space-y-2 text-xs text-[var(--color-muted)]">
                <li class="flex items-center gap-2">
                  <BaseIcon name="check" :size="14" custom-class="text-[var(--color-leaf)] shrink-0" />
                  <span>Live gross sales, hourly velocity & revenue trends</span>
                </li>
                <li class="flex items-center gap-2">
                  <BaseIcon name="check" :size="14" custom-class="text-[var(--color-leaf)] shrink-0" />
                  <span>Global menu catalog pricing and live 86'd inventory</span>
                </li>
                <li class="flex items-center gap-2">
                  <BaseIcon name="check" :size="14" custom-class="text-[var(--color-leaf)] shrink-0" />
                  <span>Cashier blind drops, float tracking & void audit trails</span>
                </li>
              </ul>
            </div>

            <!-- Enterprise Hardware & Latency Spec Box -->
            <div class="pt-3.5 border-t border-[var(--color-line)] space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <span class="text-[var(--color-muted)] font-medium">Deployment Format</span>
                <span class="font-mono text-[11px] font-bold text-[var(--color-ink)]">Cloud Web & Local LAN</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-[var(--color-muted)] font-medium">Audit Compliance</span>
                <span class="text-[var(--color-leaf-ink)] font-mono font-bold">100% Immutable Z-Reading</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-[var(--color-muted)] font-medium">Access Governance</span>
                <span class="text-[var(--color-ink)] font-mono text-[11px] font-bold">Tier-3 Scoped RBAC</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Enterprise Peripheral Compatibility Ecosystem Matrix (Replaced Sign In Box) -->
        <div class="p-5 sm:p-6 rounded-[var(--radius-card)] bg-[var(--color-bg)] border border-[var(--color-line)] flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs">
          <div class="flex items-center gap-3.5 text-left">
            <div class="w-11 h-11 rounded-full bg-[var(--color-accent-subtle)] text-[var(--color-accent)] flex items-center justify-center shrink-0">
              <BaseIcon name="printer" :size="22" />
            </div>
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--color-ink)]">
                Enterprise Peripheral Ecosystem & Hardware Compatibility
              </h4>
              <p class="text-xs text-[var(--color-muted)] mt-0.5">
                Native ESC/POS thermal printing, RJ11 automated cash drawer triggers, dual customer displays, and local network isolation.
              </p>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[var(--color-ink)]">
            <span class="px-3 py-1.5 rounded-[var(--radius-pill)] bg-[var(--color-surface)] border border-[var(--color-line)] shadow-2xs">Epson & Star ESC/POS 80mm</span>
            <span class="px-3 py-1.5 rounded-[var(--radius-pill)] bg-[var(--color-surface)] border border-[var(--color-line)] shadow-2xs">RJ11/RJ12 Cash Drawers</span>
            <span class="px-3 py-1.5 rounded-[var(--radius-pill)] bg-[var(--color-surface)] border border-[var(--color-line)] shadow-2xs">Touchscreen All-in-Ones</span>
            <span class="px-3 py-1.5 rounded-[var(--radius-pill)] bg-[var(--color-surface)] border border-[var(--color-line)] shadow-2xs">Customer Secondary Displays</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ====================================================================== -->
    <!-- ENTERPRISE RELIABILITY, ARCHITECTURE & BENCHMARKS                     -->
    <!-- ====================================================================== -->
    <section id="architecture" class="scroll-mt-20 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto space-y-3">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[var(--radius-pill)] bg-[var(--color-accent-subtle)] border border-[var(--color-accent-soft)] text-[var(--color-accent)] text-xs font-bold tracking-wide">
          <span class="w-2 h-2 rounded-full bg-[var(--color-accent)]"></span>
          <span>HIGH-AVAILABILITY RESTAURANT INFRASTRUCTURE</span>
        </div>
        <h2 class="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-ink)] text-balance">
          Zero-Downtime Reliability & Resilient Architecture
        </h2>
        <p class="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed text-pretty">
          During peak lunch and dinner rushes, your order flow cannot freeze or lose tickets. Servio combines local offline LAN autonomy with multi-layer fiscal controls to safeguard every table, order, and settlement.
        </p>
      </div>

      <!-- Core Reliability Metrics Strip -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div class="p-5 sm:p-6 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] shadow-xs space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-display text-2xl sm:text-3xl font-extrabold text-[var(--color-accent)]">99.99%</span>
            <div class="w-8 h-8 rounded-full bg-[var(--color-accent-subtle)] text-[var(--color-accent)] flex items-center justify-center">
              <BaseIcon name="refresh" :size="16" />
            </div>
          </div>
          <h3 class="text-sm font-bold text-[var(--color-ink)]">Offline LAN Resilience</h3>
          <p class="text-xs text-[var(--color-muted)] leading-relaxed">
            Floor POS, KDS, and cashier continue full operations even when the ISP internet cable is severed.
          </p>
        </div>

        <div class="p-5 sm:p-6 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] shadow-xs space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-display text-2xl sm:text-3xl font-extrabold text-[var(--color-accent)]">&lt; 0.4s</span>
            <div class="w-8 h-8 rounded-full bg-[var(--color-leaf-bg)] text-[var(--color-leaf-ink)] flex items-center justify-center">
              <BaseIcon name="cooking" :size="16" />
            </div>
          </div>
          <h3 class="text-sm font-bold text-[var(--color-ink)]">Sub-Second Dispatch</h3>
          <p class="text-xs text-[var(--color-muted)] leading-relaxed">
            Instantaneous ticket routing from waiter tablets to kitchen displays across the local subnet.
          </p>
        </div>

        <div class="p-5 sm:p-6 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] shadow-xs space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-display text-2xl sm:text-3xl font-extrabold text-[var(--color-accent)]">100%</span>
            <div class="w-8 h-8 rounded-full bg-[var(--color-honey-bg)] text-[var(--color-honey-ink)] flex items-center justify-center">
              <BaseIcon name="receipt" :size="16" />
            </div>
          </div>
          <h3 class="text-sm font-bold text-[var(--color-ink)]">Immutable Z-Readings</h3>
          <p class="text-xs text-[var(--color-muted)] leading-relaxed">
            Full cashier shift accountability with blind drawer counts, supervisor void logs, and sequential ORs.
          </p>
        </div>

        <div class="p-5 sm:p-6 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] shadow-xs space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-display text-2xl sm:text-3xl font-extrabold text-[var(--color-accent)]">80mm</span>
            <div class="w-8 h-8 rounded-full bg-[var(--color-pot-bg)] text-[var(--color-pot-ink)] flex items-center justify-center">
              <BaseIcon name="printer" :size="16" />
            </div>
          </div>
          <h3 class="text-sm font-bold text-[var(--color-ink)]">ESC/POS Thermal Standard</h3>
          <p class="text-xs text-[var(--color-muted)] leading-relaxed">
            Direct Ethernet/USB receipt printing with automatic 24V RJ11 cash drawer kick pulses.
          </p>
        </div>
      </div>

      <!-- Architectural Data Flow Pipeline (Step-by-Step Order Journey) -->
      <div class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] p-6 sm:p-8 shadow-xs space-y-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-line)]">
          <div>
            <span class="label-tracked text-[var(--color-accent)] font-bold">TRANSACTION PIPELINE</span>
            <h3 class="font-display text-xl sm:text-2xl font-bold text-[var(--color-ink)]">
              End-to-End Local-First Order Flow
            </h3>
          </div>
          <div class="flex items-center gap-2 text-xs font-semibold text-[var(--color-muted)]">
            <span class="w-2.5 h-2.5 rounded-full bg-[var(--color-leaf)] animate-pulse"></span>
            <span>Zero Cloud Roundtrip Latency on Local Subnet</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <!-- Step 1 -->
          <div class="space-y-3 relative">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-[var(--color-accent-subtle)] text-[var(--color-accent)] flex items-center justify-center font-bold text-sm">
                1
              </div>
              <span class="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">Front of House</span>
            </div>
            <h4 class="text-base font-bold text-[var(--color-ink)]">Floor Order Intake</h4>
            <p class="text-xs text-[var(--color-muted)] leading-relaxed">
              Waitstaff select table, tap dishes, add guest modifiers (e.g. "extra broth"), and press Send. Optimistic local cache confirms entry in 0ms.
            </p>
            <div class="text-[11px] font-mono font-semibold text-[var(--color-accent)] bg-[var(--color-bg)] p-2 rounded-[var(--radius-input)] border border-[var(--color-line)]">
              Atomic Table Locking: Active
            </div>
          </div>

          <!-- Step 2 -->
          <div class="space-y-3 relative">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-[var(--color-accent-subtle)] text-[var(--color-accent)] flex items-center justify-center font-bold text-sm">
                2
              </div>
              <span class="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">Local Hub</span>
            </div>
            <h4 class="text-base font-bold text-[var(--color-ink)]">LAN Event Routing</h4>
            <p class="text-xs text-[var(--color-muted)] leading-relaxed">
              Order payload broadcasts via local WebSocket/TCP to all in-store devices. Transaction committed to local SQLite with Write-Ahead Logging.
            </p>
            <div class="text-[11px] font-mono font-semibold text-[var(--color-leaf-ink)] bg-[var(--color-leaf-bg)] p-2 rounded-[var(--radius-input)] border border-[var(--color-line)]">
              Subnet Transmission &lt; 0.4s
            </div>
          </div>

          <!-- Step 3 -->
          <div class="space-y-3 relative">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-[var(--color-accent-subtle)] text-[var(--color-accent)] flex items-center justify-center font-bold text-sm">
                3
              </div>
              <span class="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">Kitchen KDS</span>
            </div>
            <h4 class="text-base font-bold text-[var(--color-ink)]">Line Display & Pacing</h4>
            <p class="text-xs text-[var(--color-muted)] leading-relaxed">
              Ticket appears instantaneously on rugged kitchen screens with live elapsed prep timers. Chefs advance status from Pending to Cooking to Ready.
            </p>
            <div class="text-[11px] font-mono font-semibold text-[var(--color-pot-ink)] bg-[var(--color-pot-bg)] p-2 rounded-[var(--radius-input)] border border-[var(--color-line)]">
              Zero Paper Loss Risk
            </div>
          </div>

          <!-- Step 4 -->
          <div class="space-y-3 relative">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-[var(--color-accent-subtle)] text-[var(--color-accent)] flex items-center justify-center font-bold text-sm">
                4
              </div>
              <span class="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">Cashier Settlement</span>
            </div>
            <h4 class="text-base font-bold text-[var(--color-ink)]">Fiscal Settlement</h4>
            <p class="text-xs text-[var(--color-muted)] leading-relaxed">
              Calculates Senior/PWD discounts & 12% VAT exemption automatically. Triggers 80mm thermal receipt print and 24V RJ11 cash drawer kick.
            </p>
            <div class="text-[11px] font-mono font-semibold text-[var(--color-honey-ink)] bg-[var(--color-honey-bg)] p-2 rounded-[var(--radius-input)] border border-[var(--color-line)]">
              Sequential OR & Z-Reading
            </div>
          </div>
        </div>
      </div>

      <!-- Architectural Comparison: Conventional Cloud POS vs. Servio Local-First -->
      <div class="space-y-6">
        <div class="text-center max-w-2xl mx-auto space-y-2">
          <span class="label-tracked text-[var(--color-accent)] font-bold">OPERATIONAL COMPARISON</span>
          <h3 class="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-ink)]">
            Why Restaurant Owners Choose Local-First Architecture
          </h3>
          <p class="text-xs sm:text-sm text-[var(--color-muted)]">
            Traditional cloud POS vendors route every order through remote web servers. Here is how Servio protects your restaurant during peak hours.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <!-- Conventional Cloud-Only POS -->
          <div class="p-6 sm:p-7 rounded-[var(--radius-card)] bg-[var(--color-surface-alt)]/60 border border-[var(--color-line)] space-y-5">
            <div class="flex items-center justify-between pb-4 border-b border-[var(--color-line)]">
              <div class="space-y-0.5">
                <h4 class="font-display text-lg font-bold text-[var(--color-ink)]">Conventional Cloud-Only POS</h4>
                <p class="text-xs text-[var(--color-muted)]">Remote cloud dependency for in-store operations</p>
              </div>
              <span class="px-2.5 py-1 rounded-[var(--radius-pill)] bg-[var(--color-berry-bg)] text-[var(--color-berry-ink)] text-xs font-bold">
                Fragile Single Point of Failure
              </span>
            </div>

            <ul class="space-y-3.5 text-xs text-[var(--color-muted)]">
              <li class="flex items-start gap-2.5">
                <BaseIcon name="x" :size="16" custom-class="text-[var(--color-berry-ink)] shrink-0 mt-0.5" />
                <div>
                  <strong class="text-[var(--color-ink)] block">Internet Outage = Complete Store Halt</strong>
                  When your external ISP drops, waitstaff cannot seat tables, orders cannot reach the kitchen, and cashiering freezes.
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <BaseIcon name="x" :size="16" custom-class="text-[var(--color-berry-ink)] shrink-0 mt-0.5" />
                <div>
                  <strong class="text-[var(--color-ink)] block">2–5 Second Per-Tap Cloud Latency</strong>
                  Every table click and modifier travels to an offshore cloud datacenter and back, frustrating waitstaff during dinner peaks.
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <BaseIcon name="x" :size="16" custom-class="text-[var(--color-berry-ink)] shrink-0 mt-0.5" />
                <div>
                  <strong class="text-[var(--color-ink)] block">Risk of Dropped & Double-Charged Orders</strong>
                  Network drops midway through ordering cause ghost tickets, chef confusion, and duplicate charge disputes with guests.
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <BaseIcon name="x" :size="16" custom-class="text-[var(--color-berry-ink)] shrink-0 mt-0.5" />
                <div>
                  <strong class="text-[var(--color-ink)] block">Proprietary Terminal Lock-In</strong>
                  Forced purchases of expensive specialized hardware with high monthly device leasing fees.
                </div>
              </li>
            </ul>
          </div>

          <!-- Servio Local-First Enterprise OS -->
          <div class="p-6 sm:p-7 rounded-[var(--radius-card)] bg-[var(--color-surface)] border-2 border-[var(--color-accent)] shadow-md space-y-5 relative">
            <div class="absolute -top-3 right-6 px-3 py-0.5 rounded-[var(--radius-pill)] bg-[var(--color-accent)] text-[var(--color-surface)] text-[10px] font-bold uppercase tracking-wider">
              Servio Enterprise Architecture
            </div>

            <div class="flex items-center justify-between pb-4 border-b border-[var(--color-line)]">
              <div class="space-y-0.5">
                <h4 class="font-display text-lg font-bold text-[var(--color-ink)]">Servio Local-First Enterprise</h4>
                <p class="text-xs text-[var(--color-muted)]">Autonomous local LAN with automated cloud sync</p>
              </div>
              <span class="px-2.5 py-1 rounded-[var(--radius-pill)] bg-[var(--color-leaf-bg)] text-[var(--color-leaf-ink)] text-xs font-bold">
                Zero-Downtime Guarantee
              </span>
            </div>

            <ul class="space-y-3.5 text-xs text-[var(--color-muted)]">
              <li class="flex items-start gap-2.5">
                <BaseIcon name="check" :size="16" custom-class="text-[var(--color-leaf)] shrink-0 mt-0.5" />
                <div>
                  <strong class="text-[var(--color-ink)] block">100% Local LAN Autonomy During Outages</strong>
                  All dining tables, kitchen displays, and thermal printers communicate over the store WiFi/Ethernet without external internet.
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <BaseIcon name="check" :size="16" custom-class="text-[var(--color-leaf)] shrink-0 mt-0.5" />
                <div>
                  <strong class="text-[var(--color-ink)] block">Sub-400ms Tactile Speed on Local Subnet</strong>
                  Instantaneous touchscreen feedback. Waiters submit 10-item orders in seconds without waiting for cloud round-trips.
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <BaseIcon name="check" :size="16" custom-class="text-[var(--color-leaf)] shrink-0 mt-0.5" />
                <div>
                  <strong class="text-[var(--color-ink)] block">Atomic Transaction Idempotency</strong>
                  Distributed revision tokens and local Write-Ahead Logging guarantee tickets arrive once and only once at the kitchen line.
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <BaseIcon name="check" :size="16" custom-class="text-[var(--color-leaf)] shrink-0 mt-0.5" />
                <div>
                  <strong class="text-[var(--color-ink)] block">Universal Hardware Freedom</strong>
                  Runs on standard iPads, Android tablets, Windows PCs, and commercial touchscreens with standard 80mm ESC/POS printers.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Enterprise Fiscal & Shift Governance Pillars (3 Cards) -->
      <div class="space-y-6">
        <div class="text-center max-w-2xl mx-auto space-y-2">
          <span class="label-tracked text-[var(--color-accent)] font-bold">FISCAL AUDIT & COMPLIANCE</span>
          <h3 class="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-ink)]">
            Built-in Controls to Protect Your Bottom Line
          </h3>
          <p class="text-xs sm:text-sm text-[var(--color-muted)]">
            Prevent revenue leakage, cashier till skimming, and tax calculation penalties with enterprise-grade compliance primitives.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Card 1 -->
          <div class="p-6 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] shadow-xs space-y-4">
            <div class="w-12 h-12 rounded-[var(--radius-input)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] flex items-center justify-center">
              <BaseIcon name="receipt" :size="22" />
            </div>
            <h4 class="font-display text-lg font-bold text-[var(--color-ink)]">
              Statutory Senior & PWD Discount Engine
            </h4>
            <p class="text-xs text-[var(--color-muted)] leading-relaxed">
              Complies strictly with RA 9994 & RA 10754. Automatically applies the 20% discount, computes statutory 12% VAT exemption, and pro-rates meals across shared tables with mandatory ID recording for tax audits.
            </p>
            <div class="pt-2 text-xs font-semibold text-[var(--color-leaf-ink)] flex items-center gap-1.5 border-t border-[var(--color-line)]">
              <BaseIcon name="check" :size="14" custom-class="text-[var(--color-leaf)] shrink-0" />
              <span>Audit-proof statutory tax calculations</span>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="p-6 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] shadow-xs space-y-4">
            <div class="w-12 h-12 rounded-[var(--radius-input)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] flex items-center justify-center">
              <BaseIcon name="cash" :size="22" />
            </div>
            <h4 class="font-display text-lg font-bold text-[var(--color-ink)]">
              Cash Drawer Float & Blind Drops
            </h4>
            <p class="text-xs text-[var(--color-muted)] leading-relaxed">
              Enforce opening float declarations and blind shift drawer drops where cashiers count cash without seeing the system target, eliminating till skimming and discrepancies. Mid-shift X-readings and immutable Z-readings.
            </p>
            <div class="pt-2 text-xs font-semibold text-[var(--color-leaf-ink)] flex items-center gap-1.5 border-t border-[var(--color-line)]">
              <BaseIcon name="check" :size="14" custom-class="text-[var(--color-leaf)] shrink-0" />
              <span>Zero cashier till discrepancy leaks</span>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="p-6 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] shadow-xs space-y-4">
            <div class="w-12 h-12 rounded-[var(--radius-input)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] flex items-center justify-center">
              <BaseIcon name="users" :size="22" />
            </div>
            <h4 class="font-display text-lg font-bold text-[var(--color-ink)]">
              Tier-3 Role-Based Security Matrix
            </h4>
            <p class="text-xs text-[var(--color-muted)] leading-relaxed">
              Waitstaff are restricted from deleting sent tickets or voiding items without supervisor PIN authorization. Kitchen staff only see prep queues. Store owners retain master control over discounts, prices, and staff roles.
            </p>
            <div class="pt-2 text-xs font-semibold text-[var(--color-leaf-ink)] flex items-center gap-1.5 border-t border-[var(--color-line)]">
              <BaseIcon name="check" :size="14" custom-class="text-[var(--color-leaf)] shrink-0" />
              <span>Full audit trail on all overrides & voids</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Technical Specification Matrix Table -->
      <div class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] p-6 sm:p-8 shadow-xs space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-[var(--color-line)]">
          <div class="space-y-1">
            <span class="label-tracked text-[var(--color-accent)] font-bold">SPECIFICATIONS MATRIX</span>
            <h3 class="font-display text-xl font-bold text-[var(--color-ink)]">
              Enterprise POS & Infrastructure Compatibility
            </h3>
          </div>
          <span class="hidden sm:inline-flex px-3 py-1 rounded-[var(--radius-pill)] bg-[var(--color-surface-alt)] border border-[var(--color-line)] text-xs font-mono font-semibold text-[var(--color-muted)]">
            Standard: RFC / ESC/POS
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          <div class="space-y-1.5 p-3.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)]">
            <span class="text-[var(--color-muted)] font-semibold block">Local Transport Protocol</span>
            <span class="font-mono font-bold text-[var(--color-ink)] block">TCP/IP WebSocket & HTTP REST</span>
            <p class="text-[11px] text-[var(--color-muted)]">Sub-400ms broadcast across local store 802.11ac/ax WiFi & Ethernet subnet.</p>
          </div>

          <div class="space-y-1.5 p-3.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)]">
            <span class="text-[var(--color-muted)] font-semibold block">Printer Standard & Ports</span>
            <span class="font-mono font-bold text-[var(--color-ink)] block">ESC/POS 80mm • Port 9100 / USB</span>
            <p class="text-[11px] text-[var(--color-muted)]">Certified on Epson TM-T88/T82, Star Micronics, Rongta, and Xprinter series.</p>
          </div>

          <div class="space-y-1.5 p-3.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)]">
            <span class="text-[var(--color-muted)] font-semibold block">Cash Drawer Kick Trigger</span>
            <span class="font-mono font-bold text-[var(--color-ink)] block">RJ11 / RJ12 24V DC Modular Pulse</span>
            <p class="text-[11px] text-[var(--color-muted)]">Automatic drawer kick triggered upon settlement or supervisor cash float count.</p>
          </div>

          <div class="space-y-1.5 p-3.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)]">
            <span class="text-[var(--color-muted)] font-semibold block">Data Engine & Storage</span>
            <span class="font-mono font-bold text-[var(--color-ink)] block">SQLite WAL + Cloud Replication</span>
            <p class="text-[11px] text-[var(--color-muted)]">Write-Ahead Logging prevents corruptions during abrupt power outages.</p>
          </div>

          <div class="space-y-1.5 p-3.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)]">
            <span class="text-[var(--color-muted)] font-semibold block">Sync Idempotency</span>
            <span class="font-mono font-bold text-[var(--color-ink)] block">UUIDv4 Transaction Tokens</span>
            <p class="text-[11px] text-[var(--color-muted)]">Guarantees zero duplicated kitchen tickets even during erratic network reconnection.</p>
          </div>

          <div class="space-y-1.5 p-3.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)]">
            <span class="text-[var(--color-muted)] font-semibold block">Supported Client Platforms</span>
            <span class="font-mono font-bold text-[var(--color-ink)] block">iOS 15+ • Android 10+ • Windows 10/11</span>
            <p class="text-[11px] text-[var(--color-muted)]">Runs in modern browsers with touch gestures, hardware acceleration, and full PWA offline support.</p>
          </div>
        </div>
      </div>

      <!-- Restaurant Owners FAQ Accordion -->
      <div class="space-y-6 max-w-4xl mx-auto">
        <div class="text-center space-y-2">
          <span class="label-tracked text-[var(--color-accent)] font-bold">RESTAURANT OWNER FAQ</span>
          <h3 class="font-display text-xl sm:text-2xl font-bold text-[var(--color-ink)]">
            Frequently Asked Questions by Restaurant Owners
          </h3>
          <p class="text-xs sm:text-sm text-[var(--color-muted)]">
            Everything you need to know about deploying Servio in your dining room and kitchen.
          </p>
        </div>

        <div class="space-y-3">
          <div
            v-for="(faq, index) in architectureFaqs"
            :key="faq.question"
            class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] transition-ui overflow-hidden"
          >
            <button
              type="button"
              class="w-full px-6 py-4.5 flex items-center justify-between gap-4 text-left font-bold text-sm sm:text-base text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-ui cursor-pointer"
              @click="toggleFaq(index)"
            >
              <span>{{ faq.question }}</span>
              <BaseIcon
                name="chevron-down"
                :size="18"
                custom-class="text-[var(--color-muted)] transition-transform duration-200 shrink-0"
                :class="activeFaqIndex === index ? 'rotate-180 text-[var(--color-accent)]' : ''"
              />
            </button>
            <div
              v-show="activeFaqIndex === index"
              class="px-6 pb-5 pt-1 text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed border-t border-[var(--color-line)]/50 bg-[var(--color-bg)]/40"
            >
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Enterprise Callout Banner -->
      <div class="p-8 sm:p-10 rounded-[var(--radius-card)] bg-gradient-to-r from-[var(--color-sidebar)] to-[var(--color-sidebar-surface)] text-[var(--color-sidebar-ink)] flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-[var(--color-sidebar-line)]">
        <div class="space-y-2 text-center md:text-left">
          <h3 class="font-display text-2xl font-bold text-[var(--color-sidebar-ink)]">
            Ready to Streamline Your Restaurant's Order Operations?
          </h3>
          <p class="text-sm text-[var(--color-sidebar-muted)] max-w-xl">
            Join restaurants utilizing Servio for faster table turns, zero ticket losses, and seamless dining room to kitchen coordination.
          </p>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <router-link
            to="/login"
            class="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 rounded-[var(--radius-pill)] bg-[var(--color-accent)] text-[var(--color-surface)] text-sm font-bold hover:bg-[var(--color-accent-hover)] active:translate-y-px transition-ui shadow-sm"
          >
            <BaseIcon name="user" :size="16" />
            <span>Sign In to System Portal</span>
          </router-link>
          <a
            href="#owner-controls"
            class="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 rounded-[var(--radius-pill)] bg-[var(--color-sidebar-surface)] border border-[var(--color-sidebar-line)] text-[var(--color-sidebar-ink)] text-sm font-semibold hover:bg-[var(--color-sidebar)] transition-ui"
          >
            <span>Explore Owner Tools</span>
          </a>
        </div>
      </div>
    </section>

    <!-- ====================================================================== -->
    <!-- FOOTER                                                                 -->
    <!-- ====================================================================== -->
    <footer class="bg-[var(--color-sidebar)] text-[var(--color-sidebar-ink)] border-t border-[var(--color-sidebar-line)] py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <!-- Logo and Brand -->
        <div class="flex items-center gap-3">
          <img
            src="/servio-logo-icon.jpg"
            alt="Servio"
            width="34"
            height="34"
            class="w-8.5 h-8.5 rounded-[var(--radius-input)] object-cover border border-[var(--color-sidebar-line)]"
          />
          <div>
            <div class="flex items-center gap-2">
              <span class="servio-wordmark text-xl text-[var(--color-sidebar-ink)]">
                Servio
              </span>
              <span class="px-2 py-0.2 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[var(--color-sidebar-surface)] text-[var(--color-sidebar-muted)] border border-[var(--color-sidebar-line)]">
                Enterprise
              </span>
            </div>
            <p class="text-xs text-[var(--color-sidebar-muted)]">
              Unified Restaurant Management Platform & Order Flow
            </p>
          </div>
        </div>

        <!-- Links -->
        <div class="flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--color-sidebar-muted)]">
          <a href="#modules" class="hover:text-[var(--color-sidebar-ink)] transition-ui">How It Works</a>
          <a href="#owner-controls" class="hover:text-[var(--color-sidebar-ink)] transition-ui">Owner Tools</a>
          <a href="#stations" class="hover:text-[var(--color-sidebar-ink)] transition-ui">Staff Stations</a>
          <a href="#architecture" class="hover:text-[var(--color-sidebar-ink)] transition-ui">Why Servio</a>
          <router-link to="/login" class="hover:text-[var(--color-sidebar-ink)] transition-ui">Sign In</router-link>
        </div>

        <!-- Copyright -->
        <p class="text-xs text-[var(--color-sidebar-muted)] text-center md:text-right">
          © 2026 Servio Systems. Order Management Platform.
        </p>
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
import BaseIcon from '@/components/icons/BaseIcon.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()
const cartStore = useCartStore()

// Owner Capability Tabs
interface FeatureCard {
  icon: string
  badge: string
  title: string
  description: string
  highlight: string
}

const capabilityTabs = [
  { id: 1, name: 'Core Capabilities' },
  { id: 2, name: 'Store Governance' },
  { id: 3, name: 'Fleet Analytics' },
]

const selectedTabId = ref<number>(1)

const tabCardsMap: Record<number, FeatureCard[]> = {
  1: [
    {
      icon: 'table',
      badge: 'FLOOR MANAGEMENT',
      title: 'Visual Table & Seating Grid',
      description: 'Interactive floor layouts with real-time occupancy indicators. Avoid double-seating, track table turns, and seat guests across multiple dining zones.',
      highlight: 'Live table status (Available, Seated, Billed)',
    },
    {
      icon: 'dish',
      badge: 'ORDER TAKING',
      title: 'High-Speed Touch POS',
      description: 'Single-tap order entry built for fast-paced service. Add special guest instructions, split-second dish additions, and instant kitchen transmission.',
      highlight: 'Sub-second order placement with modifier notes',
    },
    {
      icon: 'cooking',
      badge: 'BACK OF HOUSE',
      title: 'Kitchen Display System (KDS)',
      description: 'High-contrast kitchen display replacing paper tickets. Line cooks track prep pacing, elapsed timers, and advance tickets with one touch.',
      highlight: 'Real-time ticket progression (Cooking → Ready)',
    },
    {
      icon: 'receipt',
      badge: 'CASHIERING',
      title: 'Fast Checkout & Thermal Receipts',
      description: 'Accept cash, cards, and digital wallets. Compute split bills, apply senior/PWD discounts, and print clean 80mm thermal receipts instantly.',
      highlight: 'Compliant thermal receipt generation',
    },
  ],
  2: [
    {
      icon: 'book-open',
      badge: 'CATALOG SYNDICATION',
      title: 'Centralized Master Menu',
      description: 'Control your entire menu from one place. Update dishes, prices, and categories centrally and push changes to all terminals immediately.',
      highlight: 'Instant cross-terminal menu synchronization',
    },
    {
      icon: 'dish',
      badge: 'INVENTORY INTEGRITY',
      title: 'Live 86\'d Item Availability',
      description: 'Mark sold-out dishes or ingredients instantly across all order stations to stop waitstaff from selling items the kitchen cannot fulfill.',
      highlight: 'Prevents out-of-stock ordering during rush hours',
    },
    {
      icon: 'receipt',
      badge: 'CASHIER AUDIT',
      title: 'Shift Reconciliation & Float Control',
      description: 'Enforce cashier shift sign-offs, blind drawer drops, petty cash controls, and supervisor-approved void audit trails.',
      highlight: 'Zero cash drawer discrepancies with Z-Readings',
    },
    {
      icon: 'users',
      badge: 'SECURITY MATRIX',
      title: 'Role-Based Access Control (RBAC)',
      description: 'Grant scoped permissions to waitstaff, kitchen cooks, shift supervisors, and store owners. Protect sensitive sales data and discounts.',
      highlight: 'Strict role separation across stations',
    },
  ],
  3: [
    {
      icon: 'bar-chart',
      badge: 'REVENUE INTELLIGENCE',
      title: 'Consolidated Sales Dashboard',
      description: 'Real-time overview of daily gross sales, hourly revenue velocity, average check sizes, and table turn rates.',
      highlight: 'Live daily revenue tracking & peak hour trends',
    },
    {
      icon: 'dish',
      badge: 'PRODUCTIVITY INSIGHTS',
      title: 'Best-Seller & Menu Mix Analysis',
      description: 'Identify your most profitable dishes and top-selling items to refine your menu engineering and boost restaurant profit margins.',
      highlight: 'Comprehensive dish performance & volume rankings',
    },
    {
      icon: 'table',
      badge: 'MULTI-BRANCH TELEMETRY',
      title: 'Multi-Location Benchmarking',
      description: 'Compare floor occupancy, ticket times, and sales volume across all operating branches in your restaurant group from a single console.',
      highlight: 'Centralized multi-store performance comparisons',
    },
    {
      icon: 'file-text',
      badge: 'FISCAL REPORTING',
      title: 'Automated Tax & Audit Reports',
      description: 'Generate comprehensive VAT summaries, discount audits, payment tender reconciliations, and exportable financial reports.',
      highlight: 'Audit-ready daily and monthly sales rollups',
    },
  ],
}

const activeTabCards = computed(() => {
  return tabCardsMap[selectedTabId.value] || tabCardsMap[1]
})

// Workspace routing for authenticated users
const workspaceLabel = computed(() => {
  if (authStore.isAdmin) return 'Admin Console'
  if (authStore.isKitchen) return 'Kitchen KDS'
  return 'Waiter Station'
})

// Interactive Architecture FAQ for Restaurant Owners
const activeFaqIndex = ref<number | null>(0)
const toggleFaq = (index: number) => {
  activeFaqIndex.value = activeFaqIndex.value === index ? null : index
}

const architectureFaqs = [
  {
    question: 'What happens to our restaurant operations if our internet drops during peak service?',
    answer: 'Servio is engineered with an offline-first local LAN architecture. If your external internet provider goes down, your floor POS, kitchen displays, and cashiers continue running without interruption over your local network. Waiters can seat tables, take orders, kitchen displays receive prep tickets, and cashiers can settle bills and print receipts. The moment internet connectivity returns, all shift data automatically synchronizes to the cloud.',
  },
  {
    question: 'How does Servio handle Senior Citizen and PWD discounts to prevent BIR audit penalties?',
    answer: 'Servio features a built-in statutory calculation engine adhering strictly to RA 9994 (Senior Citizens) and RA 10754 (Persons with Disability). The system automatically computes the 20% statutory discount, waives the 12% Value-Added Tax (VAT), and pro-rates discounts accurately across multi-guest tables with mandatory ID recording and complete audit logging.',
  },
  {
    question: 'Do we need to purchase expensive proprietary touchscreen terminals?',
    answer: 'No. Servio is web-native and responsive, built to run seamlessly on standard commercial iPads (iOS 15+), Android tablets, or Windows all-in-one touchscreens. It connects directly with standard 80mm ESC/POS thermal receipt printers (Epson, Star Micronics, Rongta, Xprinter) via local network or USB, saving you tens of thousands in hardware lock-in fees.',
  },
  {
    question: 'How does the system prevent cash drawer discrepancies and employee theft?',
    answer: 'Servio enforces multi-layer fiscal governance: dual-witness opening float declarations, supervisor PIN authorization for voids and cancellations, and blind shift drawer drops (cashiers enter physical counts without knowing the system expectation). End-of-Day Z-Readings lock shift accounting and produce immutable transaction audit trails.',
  },
]

const goToWorkspace = () => {
  if (authStore.isAdmin) router.push('/admin/dashboard')
  else if (authStore.isKitchen) router.push('/kitchen')
  else router.push('/tables')
}

const handleLogout = async () => {
  ordersStore.stopPolling()
  cartStore.clearCart()
  await authStore.logout()
}
</script>
