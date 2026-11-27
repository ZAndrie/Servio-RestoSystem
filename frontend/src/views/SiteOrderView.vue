<template>
  <SiteLayout surface="cream">
    <!-- HEADER & MODE SWITCHER -->
    <section class="pt-8 sm:pt-12 pb-6 border-b border-[var(--site-line)]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div class="space-y-2">
            <p class="site-eyebrow text-[var(--site-terracotta)]">Order Online</p>
            <h1 class="site-display-xl text-[var(--site-green)]">
              SERVIO at Your Table.
            </h1>
          </div>

          <!-- Step Tabs -->
          <div class="inline-flex p-1 rounded-full bg-[var(--site-sand)] border border-[var(--site-line)] self-start md:self-end">
            <button
              type="button"
              class="min-h-[42px] px-5 rounded-full text-xs font-bold uppercase tracking-[0.09em] transition-colors cursor-pointer"
              :class="
                step === 'browse'
                  ? 'bg-[var(--site-green)] text-[var(--site-cream)]'
                  : 'text-[var(--site-charcoal)] hover:text-[var(--site-green)]'
              "
              @click="goToStep('browse')"
            >
              1. Browse Menu
            </button>
            <button
              type="button"
              class="min-h-[42px] px-5 rounded-full text-xs font-bold uppercase tracking-[0.09em] inline-flex items-center gap-2 transition-colors cursor-pointer"
              :class="
                step === 'checkout'
                  ? 'bg-[var(--site-green)] text-[var(--site-cream)]'
                  : 'text-[var(--site-charcoal)] hover:text-[var(--site-green)]'
              "
              @click="goToStep('checkout')"
            >
              <span>2. Checkout</span>
              <span
                v-if="cartStore.itemCount > 0"
                class="min-w-[20px] h-[20px] px-1 rounded-full text-[11px] font-bold tabular-nums inline-flex items-center justify-center"
                :class="
                  step === 'checkout'
                    ? 'bg-[var(--site-cream)] text-[var(--site-green)]'
                    : 'bg-[var(--site-green)] text-[var(--site-cream)]'
                "
              >
                {{ cartStore.itemCount }}
              </span>
            </button>
          </div>
        </div>

        <!-- Explicit Demo Mode Notice -->
        <div class="rounded-[1rem] bg-[var(--site-sand)] border border-[var(--site-line)] px-4 py-3 flex items-start gap-3 text-xs sm:text-sm text-[var(--site-charcoal)]">
          <BaseIcon name="alert" :size="18" custom-class="text-[var(--site-terracotta)] shrink-0 mt-0.5" />
          <p class="leading-relaxed">{{ RESTAURANT_CONFIG.ordering.demoNotice }}</p>
        </div>
      </div>
    </section>

    <!-- STEP 1: BROWSE & BUILD ORDER -->
    <section v-if="step === 'browse'" class="py-8 sm:py-12 pb-28 lg:pb-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        <!-- Left: Search + Categories + Dish Grid -->
        <div class="lg:col-span-8 space-y-6">
          <!-- Search & Filter Controls -->
          <div class="space-y-4">
            <div class="relative">
              <BaseIcon
                name="search"
                :size="18"
                custom-class="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--site-muted)] pointer-events-none"
              />
              <input
                v-model.trim="searchQuery"
                type="search"
                placeholder="Search Filipino favorites (e.g. Sinigang, Adobo, Halo-Halo)..."
                aria-label="Search SERVIO menu"
                class="w-full min-h-[48px] pl-11 pr-10 rounded-full bg-[var(--site-white)] border border-[var(--site-line)] text-sm text-[var(--site-charcoal)] focus:border-[var(--site-green)] focus:outline-none"
              />
              <button
                v-if="searchQuery"
                type="button"
                aria-label="Clear search"
                class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-[var(--site-muted)] hover:text-[var(--site-charcoal)] cursor-pointer"
                @click="searchQuery = ''"
              >
                <BaseIcon name="x" :size="15" />
              </button>
            </div>

            <div class="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                class="min-h-[38px] px-4 rounded-full text-xs font-bold uppercase tracking-[0.08em] whitespace-nowrap border transition-colors cursor-pointer shrink-0"
                :class="
                  selectedCategory === 'all'
                    ? 'bg-[var(--site-green)] text-[var(--site-cream)] border-[var(--site-green)]'
                    : 'bg-transparent text-[var(--site-charcoal)] border-[var(--site-line)] hover:border-[var(--site-green)]'
                "
                @click="selectedCategory = 'all'"
              >
                All Dishes ({{ PUBLIC_MENU_ITEMS.length }})
              </button>
              <button
                v-for="cat in PUBLIC_MENU_CATEGORIES"
                :key="cat.id"
                type="button"
                class="min-h-[38px] px-4 rounded-full text-xs font-bold uppercase tracking-[0.08em] whitespace-nowrap border transition-colors cursor-pointer shrink-0"
                :class="
                  selectedCategory === cat.id
                    ? 'bg-[var(--site-green)] text-[var(--site-cream)] border-[var(--site-green)]'
                    : 'bg-transparent text-[var(--site-charcoal)] border-[var(--site-line)] hover:border-[var(--site-green)]'
                "
                @click="selectedCategory = cat.id"
              >
                {{ cat.name }}
              </button>
            </div>
          </div>

          <!-- Empty Search Result -->
          <div
            v-if="filteredItems.length === 0"
            class="rounded-[1.5rem] bg-[var(--site-sand)] border border-[var(--site-line)] p-10 text-center space-y-4"
          >
            <SiteIllustration kind="menu" :size="54" custom-class="mx-auto text-[var(--site-green)]" />
            <div class="space-y-1">
              <p class="font-display text-xl font-bold text-[var(--site-green)]">No dishes matched "{{ searchQuery }}"</p>
              <p class="text-sm text-[var(--site-muted)]">Try searching for Adobo, Sinigang, Pancit, or reset your filter.</p>
            </div>
            <button
              type="button"
              class="min-h-[44px] px-6 rounded-full bg-[var(--site-green)] text-[var(--site-cream)] text-xs font-bold uppercase tracking-[0.09em] cursor-pointer"
              @click="searchQuery = ''; selectedCategory = 'all'"
            >
              Show All Dishes
            </button>
          </div>

          <!-- Dish Card Grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <article
              v-for="item in filteredItems"
              :key="item.id"
              class="rounded-[1.25rem] bg-[var(--site-white)] border border-[var(--site-line)] overflow-hidden flex flex-col justify-between"
            >
              <div>
                <button
                  type="button"
                  class="block w-full aspect-[16/10] overflow-hidden bg-[var(--site-sand)] relative group cursor-pointer"
                  :aria-label="`Customize ${item.name}`"
                  @click="selectedModalItem = item"
                >
                  <EditorialImage
                    :image="item.image"
                    img-class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span
                    v-if="itemQuantityInCart(item.id) > 0"
                    class="absolute top-3 right-3 min-w-[28px] h-[28px] px-2 rounded-full bg-[var(--site-green)] text-[var(--site-cream)] text-xs font-bold tabular-nums inline-flex items-center justify-center shadow-sm"
                  >
                    {{ itemQuantityInCart(item.id) }} in bag
                  </span>
                </button>

                <div class="p-4 sm:p-5 space-y-2">
                  <div class="flex items-start justify-between gap-2">
                    <h2 class="font-display text-lg font-bold text-[var(--site-charcoal)] leading-snug">
                      {{ item.name }}
                    </h2>
                    <span class="font-bold text-base tabular-nums text-[var(--site-green)] shrink-0">
                      {{ formatCurrency(item.demoPrice) }}
                    </span>
                  </div>
                  <p class="text-xs sm:text-sm text-[var(--site-muted)] leading-relaxed">
                    {{ item.shortDescription }}
                  </p>
                </div>
              </div>

              <div class="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 flex items-center justify-between gap-2 border-t border-[var(--site-line)]/60">
                <button
                  type="button"
                  class="min-h-[40px] px-3.5 rounded-full border border-[var(--site-line)] hover:border-[var(--site-green)] text-xs font-bold uppercase tracking-[0.07em] text-[var(--site-green)] transition-colors cursor-pointer"
                  @click="selectedModalItem = item"
                >
                  Customize
                </button>
                <button
                  type="button"
                  :disabled="!item.available"
                  class="min-h-[40px] px-4 rounded-full bg-[var(--site-green)] hover:bg-[var(--site-green-hover)] text-[var(--site-cream)] text-xs font-bold uppercase tracking-[0.08em] inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-45"
                  @click="quickAdd(item)"
                >
                  <BaseIcon name="plus" :size="14" />
                  <span>Add to Bag</span>
                </button>
              </div>
            </article>
          </div>
        </div>

        <!-- Right: Sticky Desktop Live Cart Summary -->
        <aside class="hidden lg:block lg:col-span-4 lg:sticky lg:top-24 rounded-[1.5rem] bg-[var(--site-white)] border border-[var(--site-line)] p-6 space-y-5 shadow-[var(--shadow-card)]">
          <div class="flex items-center justify-between gap-2 pb-3 border-b border-[var(--site-line)]">
            <div>
              <h2 class="font-display text-xl font-bold text-[var(--site-green)]">Your Order Bag</h2>
              <p class="text-xs text-[var(--site-muted)]">
                {{ cartStore.itemCount }} {{ cartStore.itemCount === 1 ? 'item' : 'items' }} · Demo prices
              </p>
            </div>
            <button
              v-if="cartStore.items.length > 0"
              type="button"
              class="text-xs font-bold uppercase tracking-[0.08em] text-[var(--site-muted)] hover:text-[var(--site-terracotta)] cursor-pointer"
              @click="cartStore.clearCart()"
            >
              Clear
            </button>
          </div>

          <div v-if="cartStore.items.length === 0" class="py-8 text-center space-y-3">
            <SiteIllustration kind="menu" :size="48" custom-class="mx-auto text-[var(--site-green)]" />
            <p class="text-sm text-[var(--site-muted)]">
              Add dishes from the menu to start building your SERVIO meal.
            </p>
          </div>

          <template v-else>
            <ul class="divide-y divide-[var(--site-line)] max-h-[44vh] overflow-y-auto pr-1">
              <li
                v-for="line in cartStore.items"
                :key="line.lineId"
                class="py-3 first:pt-0 space-y-2"
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <p class="text-sm font-bold text-[var(--site-charcoal)] leading-snug">
                      {{ line.name }}
                    </p>
                    <p
                      v-if="Object.keys(line.selectedOptions).length > 0"
                      class="text-[11px] text-[var(--site-muted)]"
                    >
                      {{ Object.values(line.selectedOptions).join(' · ') }}
                    </p>
                  </div>
                  <span class="text-sm font-bold tabular-nums text-[var(--site-green)] shrink-0">
                    {{ formatCurrency(line.unitPrice * line.quantity) }}
                  </span>
                </div>

                <div class="flex items-center justify-between gap-2">
                  <div class="inline-flex items-center gap-2">
                    <button
                      type="button"
                      class="w-7 h-7 rounded-full border border-[var(--site-line)] bg-[var(--site-cream)] flex items-center justify-center cursor-pointer"
                      :aria-label="`Decrease ${line.name}`"
                      @click="cartStore.updateQuantity(line.lineId, -1)"
                    >
                      <BaseIcon name="minus" :size="12" />
                    </button>
                    <span class="text-xs font-bold tabular-nums min-w-[2ch] text-center">
                      {{ line.quantity }}
                    </span>
                    <button
                      type="button"
                      class="w-7 h-7 rounded-full border border-[var(--site-line)] bg-[var(--site-cream)] flex items-center justify-center cursor-pointer"
                      :aria-label="`Increase ${line.name}`"
                      @click="cartStore.updateQuantity(line.lineId, 1)"
                    >
                      <BaseIcon name="plus" :size="12" />
                    </button>
                  </div>
                  <button
                    type="button"
                    class="text-[11px] font-semibold text-[var(--site-muted)] hover:text-[var(--site-terracotta)] cursor-pointer"
                    @click="cartStore.removeItem(line.lineId)"
                  >
                    Remove
                  </button>
                </div>
              </li>
            </ul>

            <div class="pt-3 border-t border-[var(--site-line)] space-y-3">
              <div class="flex items-baseline justify-between">
                <span class="text-sm font-semibold text-[var(--site-muted)]">Demo Subtotal</span>
                <span class="font-display text-2xl font-bold tabular-nums text-[var(--site-green)]">
                  {{ formatCurrency(cartStore.subtotal) }}
                </span>
              </div>
              <button
                type="button"
                class="w-full min-h-[50px] px-5 rounded-full bg-[var(--site-green)] hover:bg-[var(--site-green-hover)] text-[var(--site-cream)] text-xs font-bold uppercase tracking-[0.1em] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                @click="goToStep('checkout')"
              >
                <span>Proceed to Checkout</span>
                <BaseIcon name="chevron-right" :size="15" />
              </button>
            </div>
          </template>
        </aside>
      </div>

      <!-- Mobile Sticky Cart Bar -->
      <div
        v-if="cartStore.itemCount > 0"
        class="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--site-green)] text-[var(--site-cream)] border-t border-[var(--site-cream)]/20 px-4 py-3 shadow-lg"
      >
        <div class="max-w-lg mx-auto flex items-center justify-between gap-3">
          <div>
            <p class="text-xs text-[var(--site-gold)] font-bold uppercase tracking-[0.08em]">
              {{ cartStore.itemCount }} {{ cartStore.itemCount === 1 ? 'item' : 'items' }} · Demo
            </p>
            <p class="font-display text-lg font-bold tabular-nums">
              {{ formatCurrency(cartStore.subtotal) }}
            </p>
          </div>
          <button
            type="button"
            class="min-h-[44px] px-5 rounded-full bg-[var(--site-cream)] text-[var(--site-green)] text-xs font-bold uppercase tracking-[0.09em] inline-flex items-center gap-1.5 cursor-pointer"
            @click="goToStep('checkout')"
          >
            <span>Checkout</span>
            <BaseIcon name="chevron-right" :size="14" />
          </button>
        </div>
      </div>
    </section>

    <!-- STEP 2: CHECKOUT & EXPLICIT DEMO CONFIRMATION -->
    <section v-else class="py-10 sm:py-14">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Demo Order Receipt -->
        <div
          v-if="showReceipt && cartStore.lastDemoOrder"
          role="status"
          aria-live="polite"
          class="max-w-3xl mx-auto rounded-[1.75rem] bg-[var(--site-green)] text-[var(--site-cream)] p-7 sm:p-10 space-y-6 shadow-[var(--shadow-card)]"
        >
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="space-y-1.5">
              <p class="site-eyebrow text-[var(--site-gold)]">Demo Order Preview Confirmed</p>
              <h2 class="site-display-lg text-[var(--site-cream)]">
                Salamat, {{ cartStore.lastDemoOrder.customerName }}!
              </h2>
              <p class="font-mono text-xs text-[var(--site-cream)]/80">
                Reference: {{ cartStore.lastDemoOrder.demoRef }}
              </p>
            </div>
            <span class="px-3.5 py-1.5 rounded-full bg-[var(--site-gold)] text-[var(--site-charcoal)] text-xs font-bold uppercase tracking-[0.09em]">
              Demo Mode Only
            </span>
          </div>

          <div class="rounded-[1rem] bg-[var(--site-cream)]/10 border border-[var(--site-cream)]/20 p-4 text-sm text-[var(--site-cream)]/90 leading-relaxed">
            <strong>Important:</strong> No live payment was charged and no real order was sent to a
            restaurant kitchen. This receipt previews the complete SERVIO customer checkout flow.
          </div>

          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2 border-t border-[var(--site-cream)]/20">
            <div>
              <dt class="text-xs uppercase text-[var(--site-gold)]">Fulfillment</dt>
              <dd class="font-bold capitalize">{{ cartStore.lastDemoOrder.orderType }}</dd>
            </div>
            <div>
              <dt class="text-xs uppercase text-[var(--site-gold)]">Payment Preference</dt>
              <dd class="font-bold">{{ cartStore.lastDemoOrder.paymentMethod }}</dd>
            </div>
            <div>
              <dt class="text-xs uppercase text-[var(--site-gold)]">Contact Number</dt>
              <dd class="font-bold">{{ cartStore.lastDemoOrder.contactNumber }}</dd>
            </div>
            <div v-if="cartStore.lastDemoOrder.deliveryAddress">
              <dt class="text-xs uppercase text-[var(--site-gold)]">Delivery Address</dt>
              <dd class="font-bold">{{ cartStore.lastDemoOrder.deliveryAddress }}</dd>
            </div>
          </dl>

          <div class="space-y-2.5 pt-3 border-t border-[var(--site-cream)]/20">
            <p class="site-eyebrow text-[var(--site-gold)]">Order Summary</p>
            <ul class="space-y-2 text-sm">
              <li
                v-for="line in cartStore.lastDemoOrder.items"
                :key="line.lineId"
                class="flex items-baseline justify-between gap-3"
              >
                <span>
                  <strong>{{ line.quantity }}×</strong> {{ line.name }}
                  <span v-if="Object.keys(line.selectedOptions).length > 0" class="text-xs text-[var(--site-cream)]/75">
                    ({{ Object.values(line.selectedOptions).join(', ') }})
                  </span>
                </span>
                <span class="font-bold tabular-nums">
                  {{ formatCurrency(line.unitPrice * line.quantity) }}
                </span>
              </li>
            </ul>
            <div class="flex items-baseline justify-between pt-3 border-t border-[var(--site-cream)]/25">
              <span class="text-sm uppercase tracking-[0.08em] font-bold">Demo Subtotal</span>
              <span class="font-display text-2xl font-bold tabular-nums text-[var(--site-gold)]">
                {{ formatCurrency(cartStore.lastDemoOrder.subtotal) }}
              </span>
            </div>
          </div>

          <div class="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              class="min-h-[48px] px-6 rounded-full bg-[var(--site-cream)] text-[var(--site-green)] hover:bg-[var(--site-sand)] text-xs font-bold uppercase tracking-[0.1em] transition-colors cursor-pointer"
              @click="startNewOrder"
            >
              Start Another Demo Order
            </button>
            <router-link
              to="/"
              class="min-h-[48px] px-6 rounded-full border border-[var(--site-cream)]/50 text-[var(--site-cream)] hover:bg-[var(--site-cream)]/10 text-xs font-bold uppercase tracking-[0.1em] inline-flex items-center transition-colors"
            >
              Return Home
            </router-link>
          </div>
        </div>

        <!-- Empty Bag on Checkout -->
        <div
          v-else-if="cartStore.items.length === 0"
          class="max-w-xl mx-auto rounded-[1.75rem] bg-[var(--site-sand)] border border-[var(--site-line)] p-10 text-center space-y-4"
        >
          <SiteIllustration kind="menu" :size="58" custom-class="mx-auto text-[var(--site-green)]" />
          <h2 class="site-display-md text-[var(--site-green)]">Your order bag is empty</h2>
          <p class="text-sm text-[var(--site-muted)]">
            Browse our Filipino favorites first to add dishes before checking out.
          </p>
          <button
            type="button"
            class="min-h-[48px] px-7 rounded-full bg-[var(--site-green)] text-[var(--site-cream)] text-xs font-bold uppercase tracking-[0.1em] cursor-pointer"
            @click="goToStep('browse')"
          >
            Back to Menu
          </button>
        </div>

        <!-- Active Checkout Form + Review -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <!-- Left: Customer & Fulfillment Details -->
          <form class="lg:col-span-7 space-y-8" novalidate @submit.prevent="handleCheckoutSubmit">
            <!-- Pickup vs Delivery -->
            <div class="space-y-3">
              <p class="site-eyebrow text-[var(--site-terracotta)]">1. Fulfillment Method</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  class="p-4 rounded-[1.25rem] border-[1.5px] text-left transition-colors cursor-pointer space-y-1"
                  :class="
                    checkoutForm.orderType === 'pickup'
                      ? 'bg-[var(--site-green)] text-[var(--site-cream)] border-[var(--site-green)]'
                      : 'bg-[var(--site-white)] text-[var(--site-charcoal)] border-[var(--site-line)] hover:border-[var(--site-green)]'
                  "
                  @click="checkoutForm.orderType = 'pickup'"
                >
                  <p class="font-display text-lg font-bold">Counter Pickup</p>
                  <p class="text-xs opacity-85">Pick up warm from our SERVIO counter.</p>
                </button>

                <button
                  type="button"
                  class="p-4 rounded-[1.25rem] border-[1.5px] text-left transition-colors cursor-pointer space-y-1"
                  :class="
                    checkoutForm.orderType === 'delivery'
                      ? 'bg-[var(--site-green)] text-[var(--site-cream)] border-[var(--site-green)]'
                      : 'bg-[var(--site-white)] text-[var(--site-charcoal)] border-[var(--site-line)] hover:border-[var(--site-green)]'
                  "
                  @click="checkoutForm.orderType = 'delivery'"
                >
                  <p class="font-display text-lg font-bold">Local Delivery</p>
                  <p class="text-xs opacity-85">Configurable delivery zone (Demo preview).</p>
                </button>
              </div>
            </div>

            <!-- Customer Details -->
            <div class="space-y-5">
              <p class="site-eyebrow text-[var(--site-terracotta)]">2. Customer Details</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                <div>
                  <label for="ord-name" class="site-eyebrow text-[var(--site-green)] block mb-1">
                    Full Name *
                  </label>
                  <input
                    id="ord-name"
                    v-model.trim="checkoutForm.customerName"
                    type="text"
                    required
                    placeholder="Who is this order for?"
                    class="site-underline-input"
                    :aria-invalid="Boolean(checkoutErrors.customerName)"
                  />
                  <p v-if="checkoutErrors.customerName" role="alert" class="mt-1 text-xs font-semibold text-[var(--site-terracotta)]">
                    {{ checkoutErrors.customerName }}
                  </p>
                </div>

                <div>
                  <label for="ord-phone" class="site-eyebrow text-[var(--site-green)] block mb-1">
                    Contact Number *
                  </label>
                  <input
                    id="ord-phone"
                    v-model.trim="checkoutForm.contactNumber"
                    type="tel"
                    required
                    placeholder="e.g. 09XX XXX XXXX"
                    class="site-underline-input"
                    :aria-invalid="Boolean(checkoutErrors.contactNumber)"
                  />
                  <p v-if="checkoutErrors.contactNumber" role="alert" class="mt-1 text-xs font-semibold text-[var(--site-terracotta)]">
                    {{ checkoutErrors.contactNumber }}
                  </p>
                </div>
              </div>

              <div v-if="checkoutForm.orderType === 'delivery'">
                <label for="ord-address" class="site-eyebrow text-[var(--site-green)] block mb-1">
                  Delivery Address *
                </label>
                <input
                  id="ord-address"
                  v-model.trim="checkoutForm.deliveryAddress"
                  type="text"
                  required
                  placeholder="House/unit number, street, barangay, landmark"
                  class="site-underline-input"
                  :aria-invalid="Boolean(checkoutErrors.deliveryAddress)"
                />
                <p v-if="checkoutErrors.deliveryAddress" role="alert" class="mt-1 text-xs font-semibold text-[var(--site-terracotta)]">
                  {{ checkoutErrors.deliveryAddress }}
                </p>
              </div>

              <div>
                <label for="ord-notes" class="site-eyebrow text-[var(--site-green)] block mb-1">
                  Order Notes (Optional)
                </label>
                <textarea
                  id="ord-notes"
                  v-model.trim="checkoutForm.orderNotes"
                  rows="2"
                  placeholder="Utensils request, gate notes, or timing reminders..."
                  class="site-underline-input resize-y"
                />
              </div>
            </div>

            <!-- Payment Method -->
            <div class="space-y-3">
              <p class="site-eyebrow text-[var(--site-terracotta)]">3. Payment Preference (Configurable)</p>
              <div class="space-y-2.5">
                <button
                  v-for="method in RESTAURANT_CONFIG.ordering.paymentMethods"
                  :key="method.id"
                  type="button"
                  class="w-full p-4 rounded-[1rem] border-[1.5px] text-left flex items-center justify-between gap-3 transition-colors cursor-pointer"
                  :class="
                    checkoutForm.paymentMethod === method.label
                      ? 'bg-[var(--site-green-soft)] border-[var(--site-green)] text-[var(--site-green)]'
                      : 'bg-[var(--site-white)] border-[var(--site-line)] text-[var(--site-charcoal)] hover:border-[var(--site-green)]'
                  "
                  @click="checkoutForm.paymentMethod = method.label"
                >
                  <div>
                    <p class="text-sm font-bold">{{ method.label }}</p>
                    <p class="text-xs text-[var(--site-muted)]">{{ method.note }}</p>
                  </div>
                  <span
                    class="w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center shrink-0"
                    :class="
                      checkoutForm.paymentMethod === method.label
                        ? 'border-[var(--site-green)] bg-[var(--site-green)] text-[var(--site-cream)]'
                        : 'border-[var(--site-line)]'
                    "
                  >
                    <BaseIcon v-if="checkoutForm.paymentMethod === method.label" name="check" :size="12" />
                  </span>
                </button>
              </div>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[var(--site-line)]">
              <button
                type="button"
                class="min-h-[46px] px-5 rounded-full border border-[var(--site-line)] text-xs font-bold uppercase tracking-[0.09em] text-[var(--site-charcoal)] hover:border-[var(--site-green)] cursor-pointer"
                @click="goToStep('browse')"
              >
                ← Back to Menu
              </button>
              <button
                type="submit"
                class="min-h-[54px] px-8 rounded-full bg-[var(--site-green)] hover:bg-[var(--site-green-hover)] text-[var(--site-cream)] text-sm font-bold uppercase tracking-[0.1em] inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Preview Demo Order · {{ formatCurrency(cartStore.subtotal) }}</span>
              </button>
            </div>
          </form>

          <!-- Right: Order Review Summary -->
          <aside class="lg:col-span-5 rounded-[1.5rem] bg-[var(--site-white)] border border-[var(--site-line)] p-6 space-y-5 shadow-[var(--shadow-card)]">
            <div class="flex items-center justify-between pb-3 border-b border-[var(--site-line)]">
              <h2 class="font-display text-xl font-bold text-[var(--site-green)]">Order Review</h2>
              <button
                type="button"
                class="text-xs font-bold uppercase tracking-[0.08em] text-[var(--site-green)] hover:text-[var(--site-terracotta)] cursor-pointer"
                @click="goToStep('browse')"
              >
                + Add More
              </button>
            </div>

            <ul class="divide-y divide-[var(--site-line)]">
              <li
                v-for="line in cartStore.items"
                :key="line.lineId"
                class="py-3.5 first:pt-0 space-y-2"
              >
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <p class="font-bold text-sm text-[var(--site-charcoal)]">{{ line.name }}</p>
                    <p
                      v-if="Object.keys(line.selectedOptions).length > 0"
                      class="text-xs text-[var(--site-muted)]"
                    >
                      {{ Object.values(line.selectedOptions).join(' · ') }}
                    </p>
                    <p v-if="line.specialInstructions" class="text-xs italic text-[var(--site-muted)]">
                      Note: {{ line.specialInstructions }}
                    </p>
                  </div>
                  <span class="font-bold text-sm tabular-nums text-[var(--site-green)] shrink-0">
                    {{ formatCurrency(line.unitPrice * line.quantity) }}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <div class="inline-flex items-center gap-2">
                    <button
                      type="button"
                      class="w-7 h-7 rounded-full border border-[var(--site-line)] bg-[var(--site-cream)] flex items-center justify-center cursor-pointer"
                      :aria-label="`Decrease ${line.name}`"
                      @click="cartStore.updateQuantity(line.lineId, -1)"
                    >
                      <BaseIcon name="minus" :size="12" />
                    </button>
                    <span class="text-xs font-bold tabular-nums min-w-[2ch] text-center">
                      {{ line.quantity }}
                    </span>
                    <button
                      type="button"
                      class="w-7 h-7 rounded-full border border-[var(--site-line)] bg-[var(--site-cream)] flex items-center justify-center cursor-pointer"
                      :aria-label="`Increase ${line.name}`"
                      @click="cartStore.updateQuantity(line.lineId, 1)"
                    >
                      <BaseIcon name="plus" :size="12" />
                    </button>
                  </div>
                  <button
                    type="button"
                    class="text-xs text-[var(--site-muted)] hover:text-[var(--site-terracotta)] cursor-pointer"
                    @click="cartStore.removeItem(line.lineId)"
                  >
                    Remove
                  </button>
                </div>
              </li>
            </ul>

            <div class="pt-4 border-t border-[var(--site-line)] space-y-2 text-sm">
              <div class="flex justify-between text-[var(--site-muted)]">
                <span>Fulfillment</span>
                <span class="font-semibold capitalize text-[var(--site-charcoal)]">{{ checkoutForm.orderType }}</span>
              </div>
              <div class="flex justify-between text-[var(--site-muted)]">
                <span>Delivery Fee</span>
                <span class="font-semibold text-[var(--site-charcoal)]">
                  {{ checkoutForm.orderType === 'delivery' ? 'Configurable at launch' : 'None (Pickup)' }}
                </span>
              </div>
              <div class="flex items-baseline justify-between pt-3 border-t border-[var(--site-line)]">
                <span class="font-bold text-[var(--site-charcoal)]">Demo Subtotal</span>
                <span class="font-display text-2xl font-bold tabular-nums text-[var(--site-green)]">
                  {{ formatCurrency(cartStore.subtotal) }}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- Customize Dish Modal -->
    <MenuItemDetailModal
      :item="selectedModalItem"
      @close="selectedModalItem = null"
      @add="handleModalAdd"
    />
  </SiteLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RESTAURANT_CONFIG } from '@/data/restaurant'
import {
  PUBLIC_MENU_CATEGORIES,
  PUBLIC_MENU_ITEMS,
  type PublicMenuItem,
} from '@/data/publicMenu'
import { usePublicCartStore } from '@/stores/publicCart'
import { useToastStore } from '@/stores/toast'
import { formatCurrency } from '@/utils/format'
import SiteLayout from '@/components/site/SiteLayout.vue'
import EditorialImage from '@/components/site/EditorialImage.vue'
import SiteIllustration from '@/components/site/SiteIllustration.vue'
import MenuItemDetailModal from '@/components/site/MenuItemDetailModal.vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'

const route = useRoute()
const router = useRouter()
const cartStore = usePublicCartStore()
const toastStore = useToastStore()

const step = ref<'browse' | 'checkout'>(route.query.step === 'checkout' ? 'checkout' : 'browse')
const showReceipt = ref(false)
const searchQuery = ref('')
const selectedCategory = ref<string>('all')
const selectedModalItem = ref<PublicMenuItem | null>(null)

watch(
  () => route.query.step,
  (val) => {
    if (val === 'checkout') {
      step.value = 'checkout'
    } else if (!val) {
      step.value = 'browse'
    }
  },
)

const goToStep = (next: 'browse' | 'checkout') => {
  step.value = next
  showReceipt.value = false
  router.replace({ query: next === 'checkout' ? { step: 'checkout' } : {} })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const filteredItems = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return PUBLIC_MENU_ITEMS.filter((item) => {
    const catMatch = selectedCategory.value === 'all' || item.categoryId === selectedCategory.value
    const queryMatch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.shortDescription.toLowerCase().includes(q) ||
      (item.dietaryTags || []).some((t) => t.toLowerCase().includes(q))
    return catMatch && queryMatch
  })
})

const itemQuantityInCart = (itemId: string) =>
  cartStore.items
    .filter((l) => l.itemId === itemId)
    .reduce((sum, l) => sum + l.quantity, 0)

const quickAdd = (item: PublicMenuItem) => {
  const defaults: Record<string, string> = {}
  if (item.customizations) {
    for (const group of item.customizations) {
      if (group.options[0]) defaults[group.name] = group.options[0].label
    }
  }
  cartStore.addItem(item, 1, defaults, '')
  toastStore.success(`Added ${item.name}`, `${formatCurrency(item.demoPrice)} added to your order bag.`)
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
  selectedModalItem.value = null
  toastStore.success(`Added ${payload.quantity}× ${payload.item.name}`, 'Updated your order bag.')
}

interface CheckoutFormState {
  orderType: 'pickup' | 'delivery'
  customerName: string
  contactNumber: string
  deliveryAddress: string
  paymentMethod: string
  orderNotes: string
}

const checkoutForm = reactive<CheckoutFormState>({
  orderType: 'pickup',
  customerName: '',
  contactNumber: '',
  deliveryAddress: '',
  paymentMethod: RESTAURANT_CONFIG.ordering.paymentMethods[0]?.label ?? 'Cash on Pickup / Delivery',
  orderNotes: '',
})

const checkoutErrors = reactive<Partial<Record<keyof CheckoutFormState, string>>>({})

const validateCheckout = (): boolean => {
  for (const key of Object.keys(checkoutErrors) as (keyof CheckoutFormState)[]) {
    delete checkoutErrors[key]
  }
  if (!checkoutForm.customerName) {
    checkoutErrors.customerName = 'Please enter your name.'
  }
  if (!checkoutForm.contactNumber || checkoutForm.contactNumber.length < 7) {
    checkoutErrors.contactNumber = 'Please enter a valid contact number.'
  }
  if (checkoutForm.orderType === 'delivery' && !checkoutForm.deliveryAddress) {
    checkoutErrors.deliveryAddress = 'Please enter a delivery address.'
  }
  return Object.keys(checkoutErrors).length === 0
}

const handleCheckoutSubmit = () => {
  if (!validateCheckout() || cartStore.items.length === 0) return
  cartStore.recordDemoOrder({
    orderType: checkoutForm.orderType,
    customerName: checkoutForm.customerName,
    contactNumber: checkoutForm.contactNumber,
    deliveryAddress: checkoutForm.orderType === 'delivery' ? checkoutForm.deliveryAddress : '',
    paymentMethod: checkoutForm.paymentMethod,
    orderNotes: checkoutForm.orderNotes,
  })
  showReceipt.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const startNewOrder = () => {
  showReceipt.value = false
  checkoutForm.customerName = ''
  checkoutForm.contactNumber = ''
  checkoutForm.deliveryAddress = ''
  checkoutForm.orderNotes = ''
  goToStep('browse')
}
</script>
