<template>
  <div
    class="relative overflow-hidden select-none"
    :class="[
      compact ? 'w-12 h-12 rounded-[var(--radius-input)] shrink-0' : 'aspect-[4/3] w-full',
      tileTintClass,
    ]"
    :style="viewTransitionName ? { viewTransitionName } : undefined"
  >
    <!-- Actual dish photograph when provided and healthy -->
    <img
      v-if="image && !imgFailed"
      :src="image"
      :alt="name"
      loading="lazy"
      decoding="async"
      class="w-full h-full object-cover transition-opacity duration-200"
      :class="[
        imgLoaded ? 'opacity-100' : 'opacity-0',
        desaturated ? 'grayscale opacity-60' : '',
      ]"
      @load="imgLoaded = true"
      @error="imgFailed = true"
    />

    <!-- Warm typographic + uniform-stroke line illustration fallback (never a gray box) -->
    <div
      v-if="!image || imgFailed || !imgLoaded"
      class="absolute inset-0 flex flex-col items-center justify-center p-3 text-center"
      :class="desaturated ? 'grayscale opacity-70' : ''"
    >
      <BaseIcon
        :name="artworkIcon"
        :size="compact ? 22 : 40"
        :stroke-width="1.5"
        :custom-class="iconColorClass"
      />
      <span
        v-if="!compact && (!image || imgFailed)"
        class="mt-2 label-tracked text-[var(--color-muted)] max-w-[18ch] truncate"
      >
        {{ artworkCaption }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { DishArtworkKind } from '@/types'
import BaseIcon from '@/components/icons/BaseIcon.vue'

const props = withDefaults(
  defineProps<{
    name: string
    image?: string
    artwork?: DishArtworkKind
    compact?: boolean
    desaturated?: boolean
    viewTransitionName?: string
  }>(),
  {
    image: undefined,
    artwork: 'plate',
    compact: false,
    desaturated: false,
    viewTransitionName: undefined,
  },
)

const imgLoaded = ref(false)
const imgFailed = ref(false)

watch(
  () => props.image,
  () => {
    imgLoaded.value = false
    imgFailed.value = false
  },
)

const artworkIcon = computed(() => {
  switch (props.artwork) {
    case 'bowl':
      return 'bowl'
    case 'glass':
      return 'glass'
    case 'dessert':
      return 'dessert'
    case 'plate':
    default:
      return 'plate'
  }
})

const artworkCaption = computed(() => {
  switch (props.artwork) {
    case 'bowl':
      return 'House Kettle'
    case 'glass':
      return 'Freshly Poured'
    case 'dessert':
      return 'Sweet Kitchen'
    case 'plate':
    default:
      return 'From the Grill'
  }
})

const tileTintClass = computed(() => {
  switch (props.artwork) {
    case 'bowl':
      return 'bg-[var(--color-pot-bg)]'
    case 'glass':
      return 'bg-[var(--color-leaf-bg)]'
    case 'dessert':
      return 'bg-[var(--color-accent-subtle)]'
    case 'plate':
    default:
      return 'bg-[var(--color-honey-bg)]'
  }
})

const iconColorClass = computed(() => {
  switch (props.artwork) {
    case 'bowl':
      return 'text-[var(--color-pot-ink)]'
    case 'glass':
      return 'text-[var(--color-leaf-ink)]'
    case 'dessert':
      return 'text-[var(--color-accent)]'
    case 'plate':
    default:
      return 'text-[var(--color-honey-ink)]'
  }
})
</script>
