<template>
  <Button.Root
    :disabled="disabled || loading"
    :loading="loading"
    :grace="0"
    :aria-label="ariaLabel"
    renderless
    v-slot="{ attrs, isLoading, isDisabled }"
  >
    <button
      v-bind="attrs"
      :type="type"
      :form="form"
      :class="[
        'inline-flex items-center justify-center gap-2 font-semibold select-none transition-ui',
        shapeClass,
        sizeClass,
        variantClass,
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:translate-y-px',
        customClass,
      ]"
      @click="handleClick"
    >
      <!-- Processing spinner (fixed dimensions to prevent layout shift) -->
      <svg
        v-if="isLoading"
        class="w-4 h-4 animate-spin shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
        <path
          class="opacity-85"
          fill="currentColor"
          d="M4 12a8 8 0 0 1 8-8V0C5.37 0 0 5.37 0 12h4Z"
        />
      </svg>

      <!-- Leading icon with Term 2 optical centre nudge -->
      <span
        v-else-if="$slots.icon || icon"
        class="inline-flex items-center justify-center optical-nav-icon shrink-0"
        aria-hidden="true"
      >
        <slot name="icon">
          <BaseIcon v-if="icon" :name="icon" :size="iconSize" />
        </slot>
      </span>

      <span v-if="$slots.default" class="inline-flex items-center leading-none">
        <slot />
      </span>

      <!-- Trailing icon with Term 2 optical nudge -->
      <span
        v-if="$slots.trailing || trailingIcon"
        class="inline-flex items-center justify-center optical-chevron shrink-0"
        aria-hidden="true"
      >
        <slot name="trailing">
          <BaseIcon v-if="trailingIcon" :name="trailingIcon" :size="iconSize" />
        </slot>
      </span>
    </button>
  </Button.Root>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@vuetify/v0'
import BaseIcon from '@/components/icons/BaseIcon.vue'

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    form?: string
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dark' | 'kds-primary' | 'kds-ready'
    size?: 'sm' | 'md' | 'lg'
    pill?: boolean
    disabled?: boolean
    loading?: boolean
    icon?: string
    trailingIcon?: string
    ariaLabel?: string
    customClass?: string
  }>(),
  {
    type: 'button',
    form: undefined,
    variant: 'primary',
    size: 'md',
    pill: false,
    disabled: false,
    loading: false,
    icon: '',
    trailingIcon: '',
    ariaLabel: undefined,
    customClass: '',
  },
)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return
  emit('click', event)
}

const iconSize = computed(() => {
  if (props.size === 'sm') return 16
  if (props.size === 'lg') return 20
  return 18
})

const shapeClass = computed(() =>
  props.pill ? 'rounded-[var(--radius-pill)]' : 'rounded-[var(--radius-input)]',
)

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'min-h-[44px] px-4 text-sm'
    case 'lg':
      return 'min-h-[48px] px-6 text-base'
    case 'md':
    default:
      return 'min-h-[44px] px-5 text-base'
  }
})

const variantClass = computed(() => {
  switch (props.variant) {
    case 'primary':
      // Deep bronze accent with warm cream ink (6.45:1 contrast verified)
      return 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-surface)] border border-transparent'
    case 'dark':
      return 'bg-[var(--color-ink)] hover:bg-[var(--color-sidebar-surface)] text-[var(--color-surface)] border border-transparent'
    case 'secondary':
      return 'bg-[var(--color-surface-alt)] hover:bg-[var(--color-surface-hover)] text-[var(--color-ink)] border border-[var(--color-line)]'
    case 'outline':
      return 'bg-[var(--color-surface)] hover:bg-[var(--color-surface-alt)] text-[var(--color-ink)] border border-[var(--color-line-strong)]'
    case 'ghost':
      return 'bg-transparent hover:bg-[var(--color-surface-alt)] text-[var(--color-muted)] hover:text-[var(--color-ink)] border border-transparent'
    case 'danger':
      return 'bg-[var(--color-berry-ink)] hover:opacity-90 text-[var(--color-surface)] border border-transparent'
    case 'kds-primary':
      return 'bg-[var(--color-kds-pot)] hover:brightness-95 text-[var(--color-kds-bg)] font-bold border border-transparent'
    case 'kds-ready':
      return 'bg-[var(--color-kds-leaf)] hover:brightness-95 text-[var(--color-kds-bg)] font-bold border border-transparent'
    default:
      return 'bg-[var(--color-accent)] text-[var(--color-surface)]'
  }
})
</script>
