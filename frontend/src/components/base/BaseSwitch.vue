<template>
  <Switch.Root
    :model-value="modelValue"
    :disabled="disabled"
    :label="label"
    renderless
    @update:model-value="onToggle"
    v-slot="{ attrs, isChecked, isDisabled }"
  >
    <button
      v-bind="attrs"
      type="button"
      class="touch-extend-44 inline-flex items-center gap-2.5 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] rounded-[var(--radius-pill)]"
      :class="isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'"
    >
      <span
        class="relative inline-flex h-7 w-12 shrink-0 items-center rounded-[var(--radius-pill)] border transition-ui"
        :class="
          isChecked
            ? 'bg-[var(--color-leaf-ink)] border-[var(--color-leaf-ink)]'
            : 'bg-[var(--color-surface-alt)] border-[var(--color-line-strong)]'
        "
      >
        <span
          class="inline-block h-5 w-5 rounded-[var(--radius-pill)] bg-[var(--color-surface)] shadow-xs transition-ui"
          :class="isChecked ? 'translate-x-6' : 'translate-x-1'"
        />
      </span>
      <span
        v-if="label"
        class="text-sm font-medium"
        :class="isChecked ? 'text-[var(--color-ink)]' : 'text-[var(--color-muted)]'"
      >
        {{ label }}
      </span>
    </button>
  </Switch.Root>
</template>

<script setup lang="ts">
import { Switch } from '@vuetify/v0'

withDefaults(
  defineProps<{
    modelValue: boolean
    label?: string
    disabled?: boolean
  }>(),
  {
    label: '',
    disabled: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const onToggle = (val: boolean | undefined) => {
  emit('update:modelValue', Boolean(val))
}
</script>
