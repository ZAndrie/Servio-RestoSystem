<template>
  <Dialog.Root
    :model-value="modelValue"
    @update:model-value="handleOpenChange"
  >
    <Teleport to="body">
      <div
        ref="sheetWrapRef"
        class="fixed inset-0 z-50 transition-ui"
        :class="[
          side === 'bottom' ? 'flex items-end justify-center' : 'flex items-stretch justify-end',
          modelValue ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible',
        ]"
        :inert="!modelValue || undefined"
        :aria-hidden="!modelValue"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-[var(--color-ink)]/45 transition-opacity duration-200"
          @click="close"
        />

        <!-- Sheet Container wrapping Vuetify0 Dialog.Content -->
        <Dialog.Content
          as="div"
          :scrim="false"
          :close-on-click-outside="false"
          class="relative flex flex-col bg-[var(--color-surface)] border-[var(--color-line)] shadow-[var(--shadow-float)] transition-sheet"
          :class="[
            side === 'bottom'
              ? 'w-full max-w-2xl max-h-[86dvh] rounded-t-[var(--radius-card)] border-t border-x origin-bottom'
              : 'w-full max-w-md h-[100dvh] border-l origin-right',
            modelValue
              ? 'translate-x-0 translate-y-0 opacity-100'
              : side === 'bottom'
                ? 'translate-y-full opacity-90'
                : 'translate-x-full opacity-90',
          ]"
        >
          <!-- Drag handle affordance on bottom sheet -->
          <div v-if="side === 'bottom'" class="flex justify-center pt-2.5 pb-1">
            <span class="w-10 h-1 rounded-[var(--radius-pill)] bg-[var(--color-line-strong)]" aria-hidden="true" />
          </div>

          <!-- Header -->
          <div class="flex items-center justify-between gap-3 px-5 py-4 border-b border-[var(--color-line)] shrink-0">
            <div class="min-w-0">
              <Dialog.Title as="h2" class="font-display text-xl font-semibold text-[var(--color-ink)] truncate">
                {{ title }}
              </Dialog.Title>
              <p v-if="subtitle" class="text-sm text-[var(--color-muted)] truncate mt-0.5">
                {{ subtitle }}
              </p>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <slot name="header-action" />
              <Dialog.Close
                as="button"
                type="button"
                class="touch-extend-44 w-9 h-9 rounded-[var(--radius-pill)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)] transition-ui cursor-pointer"
                aria-label="Close panel"
                @click="close"
              >
                <BaseIcon name="x" :size="18" />
              </Dialog.Close>
            </div>
          </div>

          <!-- Scrollable Content -->
          <div class="flex-1 overflow-y-auto px-5 py-4">
            <slot />
          </div>

          <!-- Optional Sticky Footer with Safe Area Bottom Padding -->
          <div
            v-if="$slots.footer"
            class="px-5 pt-4 safe-pb bg-[var(--color-bg)] border-t border-[var(--color-line)] shrink-0"
          >
            <slot name="footer" />
          </div>
        </Dialog.Content>
      </div>
    </Teleport>
  </Dialog.Root>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { Dialog } from '@vuetify/v0'
import BaseIcon from '@/components/icons/BaseIcon.vue'

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    subtitle?: string
    side?: 'bottom' | 'right'
  }>(),
  {
    subtitle: '',
    side: 'bottom',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
}>()

const sheetWrapRef = ref<HTMLElement | null>(null)
let previouslyFocused: HTMLElement | null = null
let lockedBodyScroll = false

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
      const focusables = sheetWrapRef.value?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
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
  if (e.key === 'Tab' && sheetWrapRef.value) {
    const focusables = Array.from(
      sheetWrapRef.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
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
