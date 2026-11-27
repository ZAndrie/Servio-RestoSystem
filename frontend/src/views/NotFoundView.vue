<template>
  <main class="min-h-[100dvh] bg-[var(--color-bg)] text-[var(--color-ink)] flex flex-col items-center justify-center px-5 py-12">
    <div class="w-full max-w-md rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] p-8 text-center space-y-6 shadow-sm">
      <div class="mx-auto w-14 h-14 rounded-[var(--radius-card)] bg-[var(--color-accent-subtle)] border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent)]">
        <BaseIcon name="alert" :size="26" />
      </div>

      <div class="space-y-2">
        <p class="label-tracked text-[var(--color-accent)]">Error 404</p>
        <h1 class="font-display text-2xl sm:text-3xl font-bold text-[var(--color-ink)]">
          Page not found
        </h1>
        <p class="text-base text-[var(--color-muted)] text-pretty">
          We couldn’t find <code class="px-1.5 py-0.5 rounded bg-[var(--color-surface-alt)] text-sm font-mono text-[var(--color-ink)]">{{ route.fullPath }}</code>. Check the address or return to a working station.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
        <BaseButton variant="primary" size="md" @click="goPrimary">
          {{ primaryLabel }}
        </BaseButton>
        <BaseButton variant="outline" size="md" @click="router.push('/')">
          Back to Home
        </BaseButton>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const primaryRoute = computed(() => {
  if (!authStore.isAuthenticated) return '/login'
  if (authStore.isAdmin) return '/admin/dashboard'
  if (authStore.isKitchen) return '/kitchen'
  return '/tables'
})

const primaryLabel = computed(() => {
  if (!authStore.isAuthenticated) return 'Staff Sign In'
  if (authStore.isAdmin) return 'Open Dashboard'
  if (authStore.isKitchen) return 'Open Kitchen Board'
  return 'Open Dining Room'
})

const goPrimary = () => {
  router.push(primaryRoute.value)
}
</script>
