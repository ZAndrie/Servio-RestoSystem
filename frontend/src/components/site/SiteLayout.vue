<template>
  <div
    class="servio-site min-h-[100dvh] flex flex-col"
    :class="surfaceClass"
  >
    <SiteHeader :inverted="surface === 'green'" />

    <!-- Header Offset Spacer -->
    <div class="h-[76px] shrink-0" aria-hidden="true" />

    <main class="flex-1">
      <slot />
    </main>

    <SiteFooter />
    <SiteCartDrawer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SiteHeader from './SiteHeader.vue'
import SiteFooter from './SiteFooter.vue'
import SiteCartDrawer from './SiteCartDrawer.vue'

const props = withDefaults(
  defineProps<{
    surface?: 'cream' | 'sand' | 'green'
  }>(),
  {
    surface: 'cream',
  },
)

const surfaceClass = computed(() => {
  if (props.surface === 'green') {
    return 'bg-[var(--site-green)] text-[var(--site-cream)]'
  }
  if (props.surface === 'sand') {
    return 'bg-[var(--site-sand)] text-[var(--site-charcoal)]'
  }
  return 'bg-[var(--site-cream)] text-[var(--site-charcoal)]'
})
</script>
