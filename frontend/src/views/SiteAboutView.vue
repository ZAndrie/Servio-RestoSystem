<template>
  <!-- Cabalar /about signature: inverted Deep Forest Green canvas with Warm Cream typography & cards -->
  <SiteLayout surface="green">
    <!-- 1. HERO SECTION -->
    <section class="pt-10 sm:pt-14 lg:pt-20 pb-14 sm:pb-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 lg:space-y-12">
        <div class="max-w-4xl space-y-5">
          <p class="site-eyebrow text-[var(--site-gold)]">Our Story</p>
          <h1 class="site-display-hero text-[var(--site-cream)]">
            It All Starts at Home.
          </h1>
          <p class="site-body-lg text-[var(--site-cream)]/85 max-w-[54ch]">
            {{ RESTAURANT_CONFIG.taglineSupporting }}
          </p>
        </div>

        <div class="site-frame aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/10] w-full border border-[var(--site-cream)]/15">
          <EditorialImage :image="SITE_IMAGES.storyKitchen" eager />
        </div>
      </div>
    </section>

    <!-- 2. COOKING PHILOSOPHY -->
    <section class="py-16 sm:py-20 lg:py-24 border-t border-[var(--site-cream)]/15">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 site-reveal">
        <p class="site-eyebrow text-[var(--site-gold)]">Our Cooking Philosophy</p>
        <h2 class="site-display-xl text-[var(--site-cream)]">
          Good Food. Honest Ingredients. A Whole Lot of Heart.
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-base sm:text-lg text-[var(--site-cream)]/85 leading-relaxed">
          <p>
            Filipino home cooking has never been about rushing a meal out of the kitchen. It is
            about simmering adobo until the sauce clings gently, letting tamarind broth bloom with
            crisp vegetables, and setting bowls down in the middle of the table so everyone shares.
          </p>
          <p>
            At SERVIO, we honor those everyday family traditions with thoughtful preparation,
            generous portions, and warm hospitality — a welcoming table for weekday lunches, Sunday
            reunions, and every milestone in between.
          </p>
        </div>
      </div>
    </section>

    <!-- 3. SIX BRAND VALUES (Cabalar signature: 6 tall numbered Cream cards on Deep Green canvas) -->
    <section class="py-16 sm:py-20 lg:py-24 border-t border-[var(--site-cream)]/15">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div class="site-reveal max-w-2xl space-y-3">
          <p class="site-eyebrow text-[var(--site-gold)]">What We Stand For</p>
          <h2 class="site-display-xl text-[var(--site-cream)]">
            Six Promises on Every Table.
          </h2>
        </div>

        <div class="site-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <article
            v-for="val in ABOUT_BRAND_VALUES"
            :key="val.number"
            class="rounded-[1.5rem] bg-[var(--site-cream)] text-[var(--site-charcoal)] p-7 sm:p-8 min-h-[270px] flex flex-col justify-between gap-8 border border-[var(--site-cream)]/20"
          >
            <div class="flex items-start justify-between gap-4">
              <SiteIllustration
                :kind="val.illustration"
                :size="56"
                custom-class="text-[var(--site-green)]"
              />
              <span class="font-mono text-2xl sm:text-3xl font-bold text-[var(--site-terracotta)] tabular-nums">
                {{ val.number }}
              </span>
            </div>

            <div class="space-y-2.5">
              <h3 class="site-display-md text-[var(--site-green)]">
                {{ val.title }}
              </h3>
              <p class="text-sm sm:text-base text-[var(--site-muted)] leading-relaxed">
                {{ val.description }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 4. MEET THE PEOPLE BEHIND SERVIO (Editable placeholder — zero fabricated identities) -->
    <section class="py-16 sm:py-20 lg:py-24 border-t border-[var(--site-cream)]/15">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="site-reveal grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div class="lg:col-span-6">
            <div class="site-frame aspect-[4/3] w-full border border-[var(--site-cream)]/20">
              <EditorialImage :image="SITE_IMAGES.diningRoom" />
            </div>
          </div>

          <div class="lg:col-span-6 space-y-5">
            <p class="site-eyebrow text-[var(--site-gold)]">The SERVIO Family</p>
            <h2 class="site-display-xl text-[var(--site-cream)]">
              The People Behind Every Plate.
            </h2>
            <p class="text-base sm:text-lg text-[var(--site-cream)]/85 leading-relaxed">
              Behind every steaming bowl and shared platter is a kitchen and dining team who take
              pride in cooking with consistency and greeting guests like neighbors.
            </p>

            <!-- Clearly Marked Editable Placeholder Card (No fake names or invented founder bios) -->
            <div class="rounded-[1.25rem] border border-dashed border-[var(--site-gold)]/60 bg-[var(--site-cream)]/5 p-5 space-y-2">
              <p class="site-eyebrow text-[var(--site-gold)]">
                Editable Team &amp; Founder Showcase Placeholder
              </p>
              <p class="text-sm text-[var(--site-cream)]/80 leading-relaxed">
                Replace this section in <code class="font-mono text-xs text-[var(--site-gold)]">src/views/SiteAboutView.vue</code>
                with your real founder story, kitchen leadership portraits, and verified team quotes
                before launching live.
              </p>
            </div>

            <div class="pt-2">
              <router-link
                to="/contact"
                class="min-h-[48px] px-6 rounded-full border-[1.5px] border-[var(--site-cream)] text-[var(--site-cream)] hover:bg-[var(--site-cream)] hover:text-[var(--site-green)] text-xs font-bold uppercase tracking-[0.1em] inline-flex items-center gap-2 transition-colors"
              >
                <span>Connect With Our Team</span>
                <BaseIcon name="chevron-right" :size="15" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. CONTINUOUS HORIZONTAL FOOD SHOWCASE MARQUEE (Echoes Cabalar's /about dish ticker) -->
    <section class="py-16 sm:py-20 border-t border-[var(--site-cream)]/15 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 site-reveal">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div class="space-y-2">
            <p class="site-eyebrow text-[var(--site-gold)]">From the Family Table</p>
            <h2 class="site-display-lg text-[var(--site-cream)]">
              Dishes Made to Be Passed Around.
            </h2>
          </div>
          <router-link
            to="/menu"
            class="text-xs font-bold uppercase tracking-[0.1em] text-[var(--site-gold)] hover:text-[var(--site-cream)] transition-colors"
          >
            Browse Full Menu →
          </router-link>
        </div>
      </div>

      <div class="space-y-5">
        <!-- Row 1 -->
        <div class="overflow-hidden">
          <div class="site-marquee-track gap-6 pr-6 items-center">
            <router-link
              v-for="(dish, idx) in marqueeRowOne"
              :key="`r1-${dish.name}-${idx}`"
              to="/menu"
              class="inline-flex items-center gap-4 group shrink-0"
            >
              <div class="w-24 h-16 sm:w-28 sm:h-20 rounded-[1rem] overflow-hidden border border-[var(--site-cream)]/25 shrink-0">
                <EditorialImage :image="dish.image" />
              </div>
              <span class="font-display text-2xl sm:text-4xl font-bold text-[var(--site-cream)] group-hover:text-[var(--site-gold)] transition-colors whitespace-nowrap">
                {{ dish.name }}
              </span>
              <span class="text-[var(--site-gold)] text-xl px-2" aria-hidden="true">·</span>
            </router-link>
          </div>
        </div>

        <!-- Row 2 (Reverse) -->
        <div class="overflow-hidden">
          <div class="site-marquee-track reverse gap-6 pr-6 items-center">
            <router-link
              v-for="(dish, idx) in marqueeRowTwo"
              :key="`r2-${dish.name}-${idx}`"
              to="/menu"
              class="inline-flex items-center gap-4 group shrink-0"
            >
              <div class="w-24 h-16 sm:w-28 sm:h-20 rounded-[1rem] overflow-hidden border border-[var(--site-cream)]/25 shrink-0">
                <EditorialImage :image="dish.image" />
              </div>
              <span class="font-display text-2xl sm:text-4xl font-bold text-[var(--site-cream)]/90 group-hover:text-[var(--site-gold)] transition-colors whitespace-nowrap">
                {{ dish.name }}
              </span>
              <span class="text-[var(--site-gold)] text-xl px-2" aria-hidden="true">·</span>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. CLOSING DUAL EDITORIAL CTAS -->
    <section class="py-16 sm:py-20 lg:py-24 border-t border-[var(--site-cream)]/15">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="site-reveal grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="rounded-[1.75rem] bg-[var(--site-sand)] text-[var(--site-charcoal)] p-8 sm:p-10 flex flex-col justify-between gap-6">
            <div class="space-y-3">
              <p class="site-eyebrow text-[var(--site-terracotta)]">Celebrations &amp; Gatherings</p>
              <h3 class="site-display-lg text-[var(--site-green)]">
                Bring SERVIO to Your Next Celebration.
              </h3>
              <p class="text-sm sm:text-base text-[var(--site-muted)] leading-relaxed">
                Explore our configurable Filipino catering packages and private family dining options.
              </p>
            </div>
            <div>
              <router-link
                to="/catering"
                class="min-h-[48px] px-6 rounded-full border-[1.5px] border-[var(--site-green)] text-[var(--site-green)] hover:bg-[var(--site-green)] hover:text-[var(--site-cream)] text-xs font-bold uppercase tracking-[0.1em] inline-flex items-center gap-2 transition-colors"
              >
                <span>Explore Catering</span>
                <BaseIcon name="chevron-right" :size="15" />
              </router-link>
            </div>
          </div>

          <div class="rounded-[1.75rem] bg-[var(--site-cream)] text-[var(--site-charcoal)] p-8 sm:p-10 flex flex-col justify-between gap-6">
            <div class="space-y-3">
              <p class="site-eyebrow text-[var(--site-terracotta)]">{{ RESTAURANT_CONFIG.taglinePrimary }}</p>
              <h3 class="site-display-lg text-[var(--site-green)]">
                Come Be Part of Our Table.
              </h3>
              <p class="text-sm sm:text-base text-[var(--site-muted)] leading-relaxed">
                Browse our Filipino classics, family platters, and cool desserts prepared with heart.
              </p>
            </div>
            <div class="flex flex-wrap gap-3">
              <router-link
                to="/menu"
                class="min-h-[48px] px-6 rounded-full bg-[var(--site-green)] hover:bg-[var(--site-green-hover)] text-[var(--site-cream)] text-xs font-bold uppercase tracking-[0.1em] inline-flex items-center gap-2 transition-colors"
              >
                <span>Explore the Menu</span>
                <BaseIcon name="chevron-right" :size="15" />
              </router-link>
              <router-link
                to="/order"
                class="min-h-[48px] px-6 rounded-full border-[1.5px] border-[var(--site-green)] text-[var(--site-green)] hover:bg-[var(--site-green)] hover:text-[var(--site-cream)] text-xs font-bold uppercase tracking-[0.1em] inline-flex items-center transition-colors"
              >
                Order Online
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </SiteLayout>
</template>

<script setup lang="ts">
import { RESTAURANT_CONFIG } from '@/data/restaurant'
import { SITE_IMAGES } from '@/data/siteImages'
import { ABOUT_BRAND_VALUES } from '@/data/packages'
import { useScrollReveal } from '@/composables/useScrollReveal'
import SiteLayout from '@/components/site/SiteLayout.vue'
import EditorialImage from '@/components/site/EditorialImage.vue'
import SiteIllustration from '@/components/site/SiteIllustration.vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'

useScrollReveal()

const rowOneBase = [
  { name: 'Sinigang na Baboy', image: SITE_IMAGES.sinigang },
  { name: 'Chicken Adobo', image: SITE_IMAGES.adobo },
  { name: 'Beef Kare-Kare', image: SITE_IMAGES.kareKare },
  { name: 'Crispy Pata', image: SITE_IMAGES.crispyPata },
  { name: 'Chicken Inasal', image: SITE_IMAGES.chickenInasal },
]

const rowTwoBase = [
  { name: 'Pancit Canton', image: SITE_IMAGES.pancit },
  { name: 'Pork Sisig', image: SITE_IMAGES.sisig },
  { name: 'Halo-Halo', image: SITE_IMAGES.haloHalo },
  { name: 'Leche Flan', image: SITE_IMAGES.lecheFlan },
  { name: 'Fresh Calamansi Juice', image: SITE_IMAGES.calamansi },
]

// Duplicate each row once so CSS translateX(-50%) loops seamlessly
const marqueeRowOne = [...rowOneBase, ...rowOneBase]
const marqueeRowTwo = [...rowTwoBase, ...rowTwoBase]
</script>
