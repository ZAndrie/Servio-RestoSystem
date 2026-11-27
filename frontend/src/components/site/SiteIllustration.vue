<template>
  <!-- Original hand-crafted Filipino culinary line-art illustrations (uniform stroke, restrained accents) -->
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="customClass"
    aria-hidden="true"
  >
    <!-- Explore Card & About Value: Simmering Clay Palayok with Heart Steam -->
    <template v-if="kind === 'story' || kind === 'heart-pot'">
      <path d="M14 31h36v7c0 10-8 16-18 16s-18-6-18-16v-7Z" fill="var(--site-terracotta-soft)" />
      <path d="M12 31h40" />
      <path d="M22 26c0-4 10-4 10-10" stroke="var(--site-terracotta)" />
      <path d="M32 23c2-4 7-4 7-9" stroke="var(--site-gold)" />
      <path d="M25 40c0-3 3.5-4.5 7-1 3.5-3.5 7-2 7 1 0 4-7 7.5-7 7.5s-7-3.5-7-7.5Z" stroke="var(--site-terracotta)" />
    </template>

    <!-- Family Table -->
    <template v-else-if="kind === 'family-table'">
      <rect x="10" y="31" width="44" height="7" rx="3" fill="var(--site-gold-soft)" />
      <path d="M16 38v15M48 38v15M24 31a8 8 0 0 1 16 0" />
      <circle cx="32" cy="18" r="2" fill="var(--site-terracotta)" stroke="none" />
      <path d="M14 25h6M44 25h6" />
    </template>

    <!-- Banana Leaf & Calamansi (Our Ingredients / Honor Filipino Flavor) -->
    <template v-else-if="kind === 'ingredients' || kind === 'filipino-leaf'">
      <path d="M12 46C14 24 30 14 52 14c-2 22-14 34-40 32Z" fill="var(--site-green-soft)" />
      <path d="M12 46 48 18" />
      <path d="M24 37l2-9M34 29l2-8M27 36l9 1M36 28l8 1" />
      <circle cx="46" cy="44" r="7" fill="var(--site-gold-soft)" stroke="var(--site-terracotta)" />
      <path d="M46 39v10M41 44h10" stroke="var(--site-terracotta)" stroke-width="1.5" />
    </template>

    <!-- Fresh Market Basket -->
    <template v-else-if="kind === 'fresh-basket'">
      <path d="M12 32h40l-4 18a4 4 0 0 1-4 3H20a4 4 0 0 1-4-3l-4-18Z" fill="var(--site-gold-soft)" />
      <path d="M20 32c2-11 22-11 24 0" />
      <path d="M22 39h20M24 46h16" stroke-width="1.5" />
      <circle cx="25" cy="27" r="4" fill="var(--site-green-soft)" />
      <circle cx="36" cy="26" r="5" fill="var(--site-terracotta-soft)" />
    </template>

    <!-- Menu Card: Steaming Rice Bowl & Spoon/Fork -->
    <template v-else-if="kind === 'menu'">
      <path d="M14 32h36a18 18 0 0 1-36 0Z" fill="var(--site-gold-soft)" />
      <path d="M22 50h20" />
      <path d="M19 32c1-7 7-10 13-10s12 3 13 10" />
      <path d="M26 16c0-2 1-3 1-5M32 15c0-2 1-3 1-5M38 16c0-2 1-3 1-5" stroke="var(--site-terracotta)" />
    </template>

    <!-- Catering / Shared Bilao Platter -->
    <template v-else-if="kind === 'catering' || kind === 'shared-bilao'">
      <ellipse cx="32" cy="36" rx="22" ry="13" fill="var(--site-gold-soft)" />
      <ellipse cx="32" cy="34" rx="16" ry="8" fill="var(--site-green-soft)" />
      <path d="M22 33c3-3 7-3 10 0s7 3 10 0" stroke="var(--site-terracotta)" />
      <circle cx="25" cy="36" r="2" fill="var(--site-terracotta)" stroke="none" />
      <circle cx="39" cy="35" r="2" fill="var(--site-terracotta)" stroke="none" />
      <path d="M14 42c6 6 30 6 36 0" stroke-width="1.5" />
    </template>

    <!-- Private Events / Open Warm Lantern -->
    <template v-else-if="kind === 'events' || kind === 'open-lantern'">
      <path d="M32 10v6" />
      <path d="M20 26c0-6 5-10 12-10s12 4 12 10l3 14H17l3-14Z" fill="var(--site-gold-soft)" />
      <path d="M17 40h30M26 40v4a6 6 0 0 0 12 0v-4" />
      <path d="M32 50v4M22 50l-3 3M42 50l3 3" stroke="var(--site-terracotta)" />
    </template>

    <!-- FAQs: Warm Conversation Teacups / Chat -->
    <template v-else-if="kind === 'faqs'">
      <rect x="10" y="14" width="32" height="22" rx="6" fill="var(--site-green-soft)" />
      <path d="M18 36l-4 7 9-7" fill="var(--site-green-soft)" />
      <path d="M20 23h12M20 28h8" />
      <rect x="26" y="30" width="28" height="18" rx="6" fill="var(--site-gold-soft)" />
      <path d="M46 48l4 6-8-6" fill="var(--site-gold-soft)" />
      <path d="M34 39h12" stroke="var(--site-terracotta)" />
    </template>

    <!-- Catering Step 1: Inquiry Note -->
    <template v-else-if="kind === 'step-inquiry'">
      <rect x="14" y="10" width="32" height="42" rx="5" fill="var(--site-gold-soft)" />
      <path d="M22 22h16M22 30h16M22 38h10" />
      <path d="M40 34l10-10 4 4-10 10-5 1 1-5Z" fill="var(--site-terracotta-soft)" stroke="var(--site-terracotta)" />
    </template>

    <!-- Catering Step 2: Plan Package -->
    <template v-else-if="kind === 'step-plan'">
      <circle cx="32" cy="32" r="20" fill="var(--site-green-soft)" />
      <path d="M22 26h20M22 34h16M22 42h12" />
      <path d="M40 16l4 4 8-8" stroke="var(--site-terracotta)" />
    </template>

    <!-- Catering Step 3: Celebrate -->
    <template v-else-if="kind === 'step-celebrate'">
      <path d="M12 40h40" />
      <path d="M16 40a16 16 0 0 1 32 0" fill="var(--site-gold-soft)" />
      <circle cx="32" cy="21" r="3" fill="var(--site-terracotta-soft)" stroke="var(--site-terracotta)" />
      <path d="M18 18l-3-4M46 18l3-4M32 11V8" stroke="var(--site-terracotta)" />
    </template>

    <!-- Subtle Culinary Sticker: Calamansi Sprig -->
    <template v-else-if="kind === 'calamansi-sticker'">
      <circle cx="32" cy="32" r="28" fill="var(--site-cream)" stroke="var(--site-green)" stroke-width="2" />
      <path d="M20 40C22 26 32 18 46 18c-2 14-10 22-26 22Z" fill="var(--site-green-soft)" />
      <circle cx="34" cy="38" r="9" fill="var(--site-gold-soft)" stroke="var(--site-terracotta)" />
      <path d="M34 32v12M28 38h12" stroke="var(--site-terracotta)" stroke-width="1.5" />
    </template>
  </svg>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    kind:
      | 'story'
      | 'ingredients'
      | 'menu'
      | 'catering'
      | 'events'
      | 'faqs'
      | 'heart-pot'
      | 'family-table'
      | 'filipino-leaf'
      | 'fresh-basket'
      | 'shared-bilao'
      | 'open-lantern'
      | 'step-inquiry'
      | 'step-plan'
      | 'step-celebrate'
      | 'calamansi-sticker'
    size?: number
    customClass?: string
  }>(),
  {
    size: 56,
    customClass: '',
  },
)
</script>
