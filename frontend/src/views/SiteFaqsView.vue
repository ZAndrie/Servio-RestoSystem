<template>
  <!-- Echoes Cabalar /faqs: centered editorial hero + grouped uppercase category accordions -->
  <SiteLayout surface="cream">
    <!-- HERO -->
    <section class="pt-10 sm:pt-14 lg:pt-20 pb-10 sm:pb-14">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
        <p class="site-eyebrow text-[var(--site-terracotta)]">Frequently Asked Questions</p>
        <h1 class="site-display-hero text-[var(--site-green)]">
          We're Here to Help.
        </h1>
        <p class="site-body-lg text-[var(--site-muted)] max-w-[54ch] mx-auto">
          Answers to common questions about dining at SERVIO, our Filipino home-style menu, online
          ordering, and catering or private family celebrations.
        </p>

        <!-- Category Quick Jump Pills -->
        <nav class="flex flex-wrap items-center justify-center gap-2.5 pt-3" aria-label="FAQ categories">
          <a
            v-for="(cat, idx) in FAQ_CATEGORIES"
            :key="cat.id"
            :href="`#${cat.id}`"
            class="min-h-[40px] px-4 rounded-full bg-[var(--site-sand)] hover:bg-[var(--site-green)] text-[var(--site-charcoal)] hover:text-[var(--site-cream)] text-xs font-bold uppercase tracking-[0.08em] inline-flex items-center gap-2 transition-colors"
          >
            <span class="font-mono opacity-75">0{{ idx + 1 }}</span>
            <span>{{ cat.title }}</span>
          </a>
        </nav>
      </div>
    </section>

    <!-- GROUPED ACCORDION SECTIONS -->
    <section class="py-8 sm:py-12 lg:py-16">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
        <div
          v-for="(category, idx) in FAQ_CATEGORIES"
          :id="category.id"
          :key="category.id"
          class="scroll-mt-28 space-y-6 site-reveal"
        >
          <div class="text-center space-y-1.5">
            <p class="site-eyebrow text-[var(--site-terracotta)]">
              0{{ idx + 1 }} · Category
            </p>
            <h2 class="site-display-lg text-[var(--site-green)] uppercase tracking-[0.02em]">
              {{ category.title }}
            </h2>
          </div>

          <SiteAccordion :items="category.items" />
        </div>
      </div>
    </section>

    <!-- CLOSING CONTACT CTA -->
    <section class="py-16 sm:py-20 lg:py-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="site-reveal rounded-[1.75rem] bg-[var(--site-sand)] border border-[var(--site-line)] p-8 sm:p-12 text-center space-y-5">
          <div class="inline-flex justify-center">
            <SiteIllustration kind="faqs" :size="56" custom-class="text-[var(--site-green)]" />
          </div>
          <p class="site-eyebrow text-[var(--site-terracotta)]">Need More Details?</p>
          <h2 class="site-display-lg text-[var(--site-green)]">
            Still Have a Question for Our Kitchen?
          </h2>
          <p class="text-base text-[var(--site-muted)] max-w-[48ch] mx-auto">
            Reach out directly for family gathering notes, allergen checks, or custom celebration
            requests.
          </p>
          <div class="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <router-link
              to="/contact"
              class="min-h-[50px] px-7 rounded-full bg-[var(--site-green)] hover:bg-[var(--site-green-hover)] text-[var(--site-cream)] text-sm font-bold uppercase tracking-[0.09em] inline-flex items-center gap-2 transition-colors"
            >
              <span>Contact Us</span>
              <BaseIcon name="chevron-right" :size="16" />
            </router-link>
            <router-link
              to="/menu"
              class="min-h-[50px] px-7 rounded-full border-[1.5px] border-[var(--site-green)] text-[var(--site-green)] hover:bg-[var(--site-green)] hover:text-[var(--site-cream)] text-sm font-bold uppercase tracking-[0.09em] inline-flex items-center transition-colors"
            >
              View Our Menu
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </SiteLayout>
</template>

<script setup lang="ts">
import { FAQ_CATEGORIES } from '@/data/faqs'
import { useScrollReveal } from '@/composables/useScrollReveal'
import SiteLayout from '@/components/site/SiteLayout.vue'
import SiteAccordion from '@/components/site/SiteAccordion.vue'
import SiteIllustration from '@/components/site/SiteIllustration.vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'

useScrollReveal()
</script>
