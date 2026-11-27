<template>
  <img
    :src="currentSrc"
    :alt="image.alt"
    :loading="eager ? 'eager' : 'lazy'"
    decoding="async"
    :class="imgClass"
    @error="handleError"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ManagedImage } from '@/data/siteImages'

const props = withDefaults(
  defineProps<{
    image: ManagedImage
    eager?: boolean
    imgClass?: string
  }>(),
  {
    eager: false,
    imgClass: 'w-full h-full object-cover',
  },
)

const currentSrc = ref(props.image.src)

watch(
  () => props.image,
  (next) => {
    currentSrc.value = next.src
  },
)

const handleError = () => {
  if (currentSrc.value !== props.image.fallback) {
    currentSrc.value = props.image.fallback
  }
}
</script>
