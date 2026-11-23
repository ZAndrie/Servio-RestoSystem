<template>
  <main class="relative min-h-[100dvh] flex items-center justify-center p-4 sm:p-6 safe-pb overflow-hidden bg-[var(--color-bg)]">
    <!-- Single faint organic leaf backdrop accent (calm, subtle, zero glow) -->
    <svg
      class="pointer-events-none select-none fixed -top-16 -right-16 w-[380px] h-[380px] text-[var(--color-leaf)] opacity-[0.07] blur-[2px]"
      viewBox="0 0 240 240"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M210 30C125 35 60 85 40 190c95-15 160-72 170-160Z" />
    </svg>

    <section
      class="relative w-full max-w-[420px] bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[var(--radius-card)] p-6 sm:p-8 space-y-6"
      aria-labelledby="login-heading"
    >
      <!-- Back to Homepage Link -->
      <div class="flex items-center justify-between pb-1">
        <router-link
          to="/"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-ui"
        >
          <BaseIcon name="arrow-left" :size="14" />
          <span>Back to Home</span>
        </router-link>
        <span class="text-[11px] text-[var(--color-muted)] font-medium">Servio POS</span>
      </div>

      <!-- Brand Header (Term 1 manually kerned serif wordmark) -->
      <header class="text-center space-y-2.5">
        <img
          src="/servio-logo-icon.jpg"
          alt="Servio"
          width="60"
          height="60"
          class="w-[60px] h-[60px] mx-auto rounded-[var(--radius-input)] object-cover border border-[var(--color-line)]"
        />
        <div class="space-y-1">
          <h1
            id="login-heading"
            class="servio-wordmark text-2xl text-[var(--color-ink)]"
          >
            Servio
          </h1>
          <p class="text-sm text-[var(--color-muted)] text-pretty max-w-[34ch] mx-auto">
            Dining room, kitchen, and cashier ordering made simple.
          </p>
        </div>
      </header>

      <!-- First-login password change view (when required by account policy) -->
      <form
        v-if="showPasswordUpdate"
        class="space-y-4"
        @submit.prevent="handlePasswordUpdate"
      >
        <div class="p-3.5 rounded-[var(--radius-input)] bg-[var(--color-honey-bg)] border border-[var(--color-honey)]/50 text-[var(--color-honey-ink)] text-sm">
          Set a new password for your account before starting your shift.
        </div>

        <div class="space-y-1.5">
          <label for="new-password" class="block text-sm font-medium text-[var(--color-ink)]">
            New password
          </label>
          <input
            id="new-password"
            v-model="newPassword"
            type="password"
            required
            minlength="6"
            autocomplete="new-password"
            placeholder="At least 6 characters"
            class="w-full min-h-[48px] px-3.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)] text-base text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none transition-ui"
          />
        </div>

        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="authStore.isLoading"
          custom-class="w-full"
        >
          Save password and continue
        </BaseButton>
      </form>

      <!-- Standard Sign-In -->
      <template v-else>
        <!-- Quick Staff Demo Buttons (44px+ touch targets, 8px spacing) -->
        <div class="p-3.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)] space-y-2.5">
          <span class="block label-tracked text-[var(--color-muted)] text-center">
            Tap your name to start
          </span>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="demo in demoStaff"
              :key="demo.username"
              type="button"
              :disabled="authStore.isLoading"
              class="min-h-[48px] px-2 py-2 rounded-[var(--radius-input)] bg-[var(--color-surface)] border border-[var(--color-line)] hover:border-[var(--color-line-strong)] hover:bg-[var(--color-surface-alt)] active:translate-y-px transition-ui text-center cursor-pointer disabled:opacity-50"
              @click="quickLogin(demo.username)"
            >
              <span class="block text-sm font-semibold text-[var(--color-ink)] leading-tight">
                {{ demo.firstName }}
              </span>
              <span class="block text-xs text-[var(--color-muted)] mt-0.5">
                {{ demo.roleLabel }}
              </span>
            </button>
          </div>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div
            v-if="authStore.error"
            role="alert"
            class="p-3.5 rounded-[var(--radius-input)] bg-[var(--color-berry-bg)] border border-[var(--color-berry)]/35 text-[var(--color-berry-ink)] text-sm font-medium"
          >
            {{ authStore.error }}
          </div>

          <div class="space-y-1.5">
            <label for="login-username" class="block text-sm font-medium text-[var(--color-ink)]">
              Username
            </label>
            <input
              id="login-username"
              v-model="username"
              type="text"
              required
              autocomplete="username"
              placeholder="waiter, admin, or kitchen"
              class="w-full min-h-[48px] px-3.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)] text-base text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none transition-ui"
            />
          </div>

          <div class="space-y-1.5">
            <label for="login-password" class="block text-sm font-medium text-[var(--color-ink)]">
              Password
            </label>
            <input
              id="login-password"
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              placeholder="Enter password"
              class="w-full min-h-[48px] px-3.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)] text-base text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none transition-ui"
            />
          </div>

          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            :loading="authStore.isLoading"
            custom-class="w-full"
          >
            {{ authStore.isLoading ? 'Signing in...' : 'Sign in' }}
          </BaseButton>
        </form>

        <p class="text-center text-xs text-[var(--color-muted)]">
          Servio Restaurant Ordering
        </p>
      </template>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const showPasswordUpdate = ref(false)
const newPassword = ref('')

const demoStaff = [
  { username: 'waiter', password: 'waiter123', firstName: 'Ana', roleLabel: 'Waiter' },
  { username: 'kitchen', password: 'kitchen123', firstName: 'Ramon', roleLabel: 'Kitchen' },
  { username: 'admin', password: 'admin123', firstName: 'Maria', roleLabel: 'Admin' },
]

const navigateToLanding = () => {
  const redirect = route.query.redirect as string | undefined
  if (redirect && redirect !== '/login') {
    router.push(redirect)
    return
  }
  if (authStore.isAdmin) router.push('/admin/dashboard')
  else if (authStore.isKitchen) router.push('/kitchen')
  else router.push('/tables')
}

const completeSignIn = async (user: string, pass: string) => {
  const res = await authStore.login(user, pass)
  if (!res.success) return

  if (authStore.mustChangePassword) {
    showPasswordUpdate.value = true
    return
  }
  navigateToLanding()
}

const handleSubmit = () => completeSignIn(username.value, password.value)

const quickLogin = (roleUser: string) => {
  const matched = demoStaff.find((d) => d.username === roleUser)
  const demoPass = matched?.password || 'servio2026'
  username.value = roleUser
  password.value = demoPass
  completeSignIn(roleUser, demoPass)
}

const handlePasswordUpdate = async () => {
  const ok = await authStore.changePassword(newPassword.value)
  if (ok) navigateToLanding()
}
</script>
