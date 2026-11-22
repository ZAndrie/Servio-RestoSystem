<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] label-tracked border whitespace-nowrap select-none"
    :class="[sizeClass, toneClass]"
  >
    <BaseIcon :name="config.icon" :size="compact ? 12 : 14" custom-class="optical-dot shrink-0" />
    <span>{{ config.label }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { OrderStatus } from '@/types'
import BaseIcon from '@/components/icons/BaseIcon.vue'

const props = withDefaults(
  defineProps<{
    status: OrderStatus
    dark?: boolean
    compact?: boolean
  }>(),
  {
    dark: false,
    compact: false,
  },
)

const sizeClass = computed(() => (props.compact ? 'px-2.5 py-1' : 'px-3 py-1'))

const config = computed(() => {
  switch (props.status) {
    case 'pending':
      return {
        label: 'Pending',
        icon: 'clock',
        light: 'bg-[var(--color-honey-bg)] text-[var(--color-honey-ink)] border-[var(--color-honey)]/50',
        dark: 'bg-[var(--color-kds-honey)]/15 text-[var(--color-kds-honey)] border-[var(--color-kds-honey)]/40',
      }
    case 'preparing':
      return {
        label: 'Preparing',
        icon: 'cooking',
        light: 'bg-[var(--color-pot-bg)] text-[var(--color-pot-ink)] border-[var(--color-pot)]/45',
        dark: 'bg-[var(--color-kds-pot)]/15 text-[var(--color-kds-pot)] border-[var(--color-kds-pot)]/40',
      }
    case 'ready':
      return {
        label: 'Ready',
        icon: 'check',
        light: 'bg-[var(--color-leaf-bg)] text-[var(--color-leaf-ink)] border-[var(--color-leaf)]/45',
        dark: 'bg-[var(--color-kds-leaf)]/15 text-[var(--color-kds-leaf)] border-[var(--color-kds-leaf)]/40',
      }
    case 'served':
      return {
        label: 'Served',
        icon: 'cloche',
        light: 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border-[var(--color-accent)]/35',
        dark: 'bg-[var(--color-kds-surface-hover)] text-[var(--color-kds-ink)] border-[var(--color-kds-line)]',
      }
    case 'paid':
      return {
        label: 'Paid',
        icon: 'receipt',
        light: 'bg-[var(--color-leaf-bg)] text-[var(--color-leaf-ink)] border-[var(--color-leaf)]/45',
        dark: 'bg-[var(--color-kds-leaf)]/15 text-[var(--color-kds-leaf)] border-[var(--color-kds-leaf)]/40',
      }
    case 'cancelled':
      return {
        label: 'Cancelled',
        icon: 'x',
        light: 'bg-[var(--color-berry-bg)] text-[var(--color-berry-ink)] border-[var(--color-berry)]/40',
        dark: 'bg-[var(--color-kds-berry)]/15 text-[var(--color-kds-berry)] border-[var(--color-kds-berry)]/40',
      }
    default:
      return {
        label: props.status,
        icon: 'clock',
        light: 'bg-[var(--color-surface-alt)] text-[var(--color-muted)] border-[var(--color-line)]',
        dark: 'bg-[var(--color-kds-surface-hover)] text-[var(--color-kds-muted)] border-[var(--color-kds-line)]',
      }
  }
})

const toneClass = computed(() => (props.dark ? config.value.dark : config.value.light))
</script>
