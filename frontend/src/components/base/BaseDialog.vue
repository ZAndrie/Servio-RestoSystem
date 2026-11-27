<template>
  <Dialog.Root
    :model-value="modelValue"
    @update:model-value="handleOpenChange"
  >
    <Teleport to="body">
      <div
        ref="dialogWrapRef"
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
              <Dialog.Title
                v-if="title"
                as="h2"
                class="font-display text-xl font-semibold text-[var(--color-ink)]"
              >
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
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { Dialog } from '@vuetify/v0'
import BaseIcon from '@/components/icons/BaseIcon.vue'

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

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

const dialogWrapRef = ref<HTMLElement | null>(null)
let previouslyFocused: HTMLElement | null = null
let lockedBodyScroll = false

const maxWidthClass = computed(() => {
  if (props.maxWidth === 'sm') return 'max-w-sm'
  if (props.maxWidth === 'lg') return 'max-w-2xl'
  return 'max-w-lg'
})

const handleOpenChange = (val: boolean | undefined) => {
  emit('update:modelValue', Boolean(val))
}

const close = () => emit('update:modelValue', false)

const unlockScroll = () => {
  if (lockedBodyScroll && typeof document !== 'undefined') {
    document.body.style.overflow = ''
    lockedBodyScroll = false
  }
}

watch(
  () => props.modelValue,
  async (open) => {
    if (typeof document === 'undefined') return
    if (open) {
      previouslyFocused = document.activeElement as HTMLElement | null
      document.body.style.overflow = 'hidden'
      lockedBodyScroll = true
      await nextTick()
      const focusables = dialogWrapRef.value?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      focusables?.[0]?.focus()
    } else {
      unlockScroll()
      previouslyFocused?.focus?.()
      previouslyFocused = null
    }
  },
  { immediate: true },
)

const onKeyDown = (e: KeyboardEvent) => {
  if (!props.modelValue) return
  if (e.key === 'Escape') {
    close()
    return
  }
  if (e.key === 'Tab' && dialogWrapRef.value) {
    const focusables = Array.from(
      dialogWrapRef.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((el) => el.offsetParent !== null)
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  unlockScroll()
})
</script>
