<template>
  <Dialog.Root
    :model-value="modelValue"
    @update:model-value="handleOpenChange"
  >
    <Teleport to="body">
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 safe-pb transition-ui"
        :class="
          modelValue
            ? 'opacity-100 pointer-events-auto visible'
            : 'opacity-0 pointer-events-none invisible'
        "
        :inert="!modelValue || undefined"
        :aria-hidden="!modelValue"
      >
        <!-- Soft backdrop -->
        <div
          class="absolute inset-0 bg-[var(--color-ink)]/45 transition-opacity duration-200"
          @click="close"
        />

        <!-- Dialog surface wrapping Vuetify0 Dialog.Content -->
        <Dialog.Content
          as="div"
          :scrim="false"
          :close-on-click-outside="false"
          class="relative w-full bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[var(--radius-card)] shadow-[var(--shadow-float)] overflow-hidden transition-sheet origin-center"
          :class="[
            maxWidthClass,
            modelValue ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-2 opacity-0',
          ]"
        >
          <div class="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-[var(--color-line)]">
            <div class="space-y-1 min-w-0">
              <Dialog.Title as="h2" class="font-display text-xl font-semibold text-[var(--color-ink)]">
                {{ title }}
              </Dialog.Title>
              <Dialog.Description
                v-if="subtitle"
                class="text-sm text-[var(--color-muted)] text-pretty prose-measure"
              >
                {{ subtitle }}
              </Dialog.Description>
            </div>

            <Dialog.Close
              as="button"
              type="button"
              class="touch-extend-44 w-9 h-9 rounded-[var(--radius-pill)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)] transition-ui shrink-0 cursor-pointer"
              aria-label="Close dialog"
              @click="close"
            >
              <BaseIcon name="x" :size="18" />
            </Dialog.Close>
          </div>

          <div class="px-6 py-5 max-h-[75dvh] overflow-y-auto">
            <slot />
          </div>

          <div
            v-if="$slots.footer"
            class="px-6 py-4 bg-[var(--color-bg)] border-t border-[var(--color-line)] flex items-center justify-end gap-2"
          >
            <slot name="footer" />
          </div>
        </Dialog.Content>
      </div>
    </Teleport>
  </Dialog.Root>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { Dialog } from '@vuetify/v0'
import BaseIcon from '@/components/icons/BaseIcon.vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    subtitle?: string
    maxWidth?: 'sm' | 'md' | 'lg'
  }>(),
  {
    subtitle: '',
    maxWidth: 'md',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
}>()

const maxWidthClass = computed(() => {
  if (props.maxWidth === 'sm') return 'max-w-sm'
  if (props.maxWidth === 'lg') return 'max-w-2xl'
  return 'max-w-lg'
})

const handleOpenChange = (val: boolean | undefined) => {
  emit('update:modelValue', Boolean(val))
}

const close = () => emit('update:modelValue', false)

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
</script>
