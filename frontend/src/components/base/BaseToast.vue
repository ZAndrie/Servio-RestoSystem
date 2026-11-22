<template>
  <div
    class="fixed z-[1200] right-4 bottom-20 md:bottom-5 left-4 sm:left-auto sm:w-96 flex flex-col gap-2 pointer-events-none safe-pb-bar no-print"
    aria-label="Notifications"
  >
    <TransitionGroup name="servio-toast">
      <Alert.Root
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        :role="toast.type === 'error' ? 'alert' : 'status'"
        renderless
        v-slot="{ attrs }"
      >
        <div
          v-bind="attrs"
          class="pointer-events-auto rounded-[var(--radius-card)] bg-[var(--color-surface)] border shadow-[var(--shadow-float)] px-4 py-3.5 flex items-start gap-3 transition-ui"
          :class="borderTone(toast.type)"
        >
          <span class="mt-0.5 shrink-0" :class="iconTone(toast.type)">
            <BaseIcon :name="iconName(toast.type)" :size="18" />
          </span>

          <div class="min-w-0 flex-1">
            <p class="text-base font-semibold text-[var(--color-ink)] leading-snug">
              {{ toast.title }}
            </p>
            <p
              v-if="toast.message"
              class="text-sm text-[var(--color-muted)] mt-0.5 text-pretty"
            >
              {{ toast.message }}
            </p>
          </div>

          <div class="flex items-center gap-1 shrink-0">
            <button
              v-if="toast.actionLabel && toast.onAction"
              type="button"
              class="touch-extend-44 min-h-[36px] px-3 rounded-[var(--radius-pill)] bg-[var(--color-accent)] text-[var(--color-surface)] text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-ui cursor-pointer"
              @click="toastStore.triggerAction(toast.id)"
            >
              {{ toast.actionLabel }}
            </button>

            <button
              type="button"
              class="touch-extend-44 w-8 h-8 rounded-[var(--radius-pill)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)] transition-ui cursor-pointer"
              aria-label="Dismiss notification"
              @click="toastStore.remove(toast.id)"
            >
              <BaseIcon name="x" :size="15" />
            </button>
          </div>
        </div>
      </Alert.Root>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { Alert } from '@vuetify/v0'
import { useToastStore } from '@/stores/toast'
import type { ToastItem } from '@/stores/toast'
import BaseIcon from '@/components/icons/BaseIcon.vue'

const toastStore = useToastStore()

const borderTone = (type: ToastItem['type']) => {
  if (type === 'error') return 'border-[var(--color-berry-ink)]/45'
  if (type === 'success') return 'border-[var(--color-leaf-ink)]/40'
  return 'border-[var(--color-line-strong)]'
}

const iconTone = (type: ToastItem['type']) => {
  if (type === 'error') return 'text-[var(--color-berry-ink)]'
  if (type === 'success') return 'text-[var(--color-leaf-ink)]'
  return 'text-[var(--color-accent)]'
}

const iconName = (type: ToastItem['type']) => {
  if (type === 'error') return 'alert'
  if (type === 'success') return 'check'
  return 'clock'
}
</script>

<style scoped>
.servio-toast-enter-active,
.servio-toast-leave-active {
  transition: opacity 180ms ease-out, transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
}
.servio-toast-enter-from,
.servio-toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
@media (prefers-reduced-motion: reduce) {
  .servio-toast-enter-from,
  .servio-toast-leave-to {
    transform: none;
  }
}
</style>
