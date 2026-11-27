<template>
  <!-- Echoes Cabalar /farms-friends: warm tinted Soft Sand canvas + 5 alternating 2-column image/text stories -->
  <SiteLayout surface="sand">
    <!-- HERO -->
    <section class="pt-10 sm:pt-14 lg:pt-20 pb-12 sm:pb-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div class="max-w-4xl space-y-5">
          <p class="site-eyebrow text-[var(--site-terracotta)]">Our Ingredients</p>
          <h1 class="site-display-hero text-[var(--site-green)]">
            Good Meals Begin with Good Ingredients.
          </h1>
          <p class="site-body-lg text-[var(--site-muted)] max-w-[56ch]">
            Home-style Filipino cooking lets simple, honest ingredients speak for themselves. Here is
            how we think about every basket of produce, cut of meat, and pot of rice that enters the
            SERVIO kitchen.
          </p>
        </div>

        <!-- Jump Pills -->
        <nav class="flex flex-wrap gap-2.5 pt-2" aria-label="Ingredient categories">
          <a
            v-for="section in INGREDIENT_SECTIONS"
            :key="section.id"
            :href="`#${section.id}`"
            class="min-h-[40px] px-4 rounded-full bg-[var(--site-cream)] border border-[var(--site-line)] hover:border-[var(--site-green)] hover:bg-[var(--site-green)] text-[var(--site-charcoal)] hover:text-[var(--site-cream)] text-xs font-bold uppercase tracking-[0.08em] inline-flex items-center gap-2 transition-colors"
          >
            <span class="font-mono opacity-75">{{ section.number }}</span>
            <span>{{ section.eyebrow }}</span>
          </a>
        </nav>
      </div>
    </section>

    <!-- 5 ALTERNATING EDITORIAL SECTIONS (Pure whitespace rhythm, zero boxed-card clutter) -->
    <section class="py-10 sm:py-16 lg:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 lg:space-y-32">
        <article
          v-for="(section, idx) in INGREDIENT_SECTIONS"
          :id="section.id"
          :key="section.id"
          class="site-reveal scroll-mt-28 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
        >
          <!-- Image Column -->
          <div
            class="lg:col-span-6 relative"
            :class="idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'"
          >
            <div class="site-frame aspect-[4/3] w-full shadow-[var(--shadow-card)]">
              <EditorialImage :image="section.image" :eager="idx === 0" />
            </div>
            <span
              class="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[var(--site-cream)]/95 text-[var(--site-green)] font-mono text-xs font-bold tracking-[0.1em] shadow-sm"
            >
              {{ section.number }}
            </span>
          </div>

          <!-- Narrative Column -->
          <div
            class="lg:col-span-6 space-y-5"
            :class="idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'"
          >
            <p class="site-eyebrow text-[var(--site-terracotta)]">
              {{ section.number }} · {{ section.eyebrow }}
            </p>
            <h2 class="site-display-lg text-[var(--site-green)]">
              {{ section.heading }}
            </h2>
            <p class="text-base sm:text-lg text-[var(--site-charcoal)]/90 leading-relaxed">
              {{ section.description }}
            </p>

            <!-- Highlights -->
            <ul class="flex flex-wrap gap-2 pt-1">
              <li
                v-for="hl in section.highlights"
                :key="hl"
                class="px-3.5 py-1.5 rounded-full bg-[var(--site-cream)] text-xs font-bold text-[var(--site-green)] border border-[var(--site-line)]"
              >
                {{ hl }}
              </li>
            </ul>

            <!-- Transparent Editable Supplier Placeholder (Never fabricates fake farm names) -->
            <p class="text-xs text-[var(--site-muted)] pt-3 border-t border-dashed border-[var(--site-green)]/30">
              {{ section.supplierPlaceholder }}
            </p>
          </div>
        </article>
      </div>
    </section>

    <!-- CLOSING EDITORIAL CTA -->
    <section class="py-16 sm:py-20 lg:py-24">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="site-reveal rounded-[1.75rem] bg-[var(--site-cream)] border border-[var(--site-line)] p-8 sm:p-12 lg:p-14 text-center space-y-5">
          <div class="inline-flex justify-center">
            <SiteIllustration kind="filipino-leaf" :size="56" custom-class="text-[var(--site-green)]" />
          </div>
          <p class="site-eyebrow text-[var(--site-terracotta)]">Taste the Care</p>
          <h2 class="site-display-lg text-[var(--site-green)]">
            See How These Ingredients Come Together on Our Menu.
          </h2>
          <p class="text-base text-[var(--site-muted)] max-w-[50ch] mx-auto">
            From slow-simmered ulam and crisp celebration specialties to bright calamansi coolers,
            every plate begins with thoughtful preparation.
          </p>
          <div class="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <router-link
              to="/menu"
              class="min-h-[50px] px-7 rounded-full bg-[var(--site-green)] hover:bg-[var(--site-green-hover)] text-[var(--site-cream)] text-sm font-bold uppercase tracking-[0.09em] inline-flex items-center gap-2 transition-colors"
            >
              <span>Explore Our Menu</span>
              <BaseIcon name="chevron-right" :size="16" />
            </router-link>
            <router-link
              to="/order"
              class="min-h-[50px] px-7 rounded-full border-[1.5px] border-[var(--site-green)] text-[var(--site-green)] hover:bg-[var(--site-green)] hover:text-[var(--site-cream)] text-sm font-bold uppercase tracking-[0.09em] inline-flex items-center transition-colors"
            >
              Order Online
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </SiteLayout>
</template>

<script setup lang="ts">
import { INGREDIENT_SECTIONS } from '@/data/packages'
import { useScrollReveal } from '@/composables/useScrollReveal'
import SiteLayout from '@/components/site/SiteLayout.vue'
import EditorialImage from '@/components/site/EditorialImage.vue'
import SiteIllustration from '@/components/site/SiteIllustration.vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'

useScrollReveal()
</script>
