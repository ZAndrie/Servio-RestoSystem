<template>
  <main class="min-h-[100dvh] flex items-center justify-center p-4 sm:p-6 safe-pb bg-[var(--color-bg)]">
    <section
      class="w-full max-w-[440px] bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[var(--radius-card)] p-6 sm:p-8 space-y-6"
      aria-labelledby="login-heading"
    >
      <!-- Top Utility Bar -->
      <div class="flex items-center justify-between pb-4 border-b border-[var(--color-line)]">
        <router-link
          to="/"
          class="min-h-[44px] -ml-2 px-2 inline-flex items-center gap-1.5 rounded-[var(--radius-input)] text-sm font-semibold text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-ui"
        >
          <BaseIcon name="arrow-left" :size="15" />
          <span>Back to Home</span>
        </router-link>
        <span class="font-mono text-xs uppercase tracking-[0.06em] text-[var(--color-muted)]">
          Staff Portal
        </span>
      </div>

      <!-- Left-Aligned Editorial Brand Header (Not generic centered SaaS card) -->
      <header class="flex items-start gap-3.5">
        <img
          src="/servio-logo-icon.jpg"
          alt="Servio"
          width="48"
          height="48"
          class="w-12 h-12 rounded-[var(--radius-input)] object-cover border border-[var(--color-line)] shrink-0 mt-0.5"
        />
        <div class="space-y-1">
          <h1
            id="login-heading"
            class="servio-wordmark text-2xl text-[var(--color-ink)]"
          >
            Servio
          </h1>
          <p class="text-sm text-[var(--color-muted)] text-pretty">
            Sign in to your dining room, kitchen, or owner station.
          </p>
        </div>
      </header>

      <!-- First-login password change view (when required by account policy) -->
      <form
        v-if="showPasswordUpdate"
        class="space-y-4"
        novalidate
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
            :aria-invalid="Boolean(newPasswordError)"
            :aria-describedby="newPasswordError ? 'new-password-error' : undefined"
            class="w-full min-h-[48px] px-3.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border text-base text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none transition-ui"
            :class="newPasswordError ? 'border-[var(--color-berry)]' : 'border-[var(--color-line)]'"
            @input="newPasswordError = ''"
          />
          <p
            v-if="newPasswordError"
            id="new-password-error"
            role="alert"
            class="text-xs font-semibold text-[var(--color-berry-ink)]"
          >
            {{ newPasswordError }}
          </p>
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
        <!-- Quick Staff Demo Buttons: Strictly gated behind USE_MOCK (compiled out of production API builds) -->
        <div
          v-if="isMockMode"
          class="p-3.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)] space-y-2.5"
        >
          <span class="block label-tracked text-[var(--color-muted)] text-center">
            Offline Demo Mode · Tap your role
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

        <form class="space-y-4" novalidate @submit.prevent="handleSubmit">
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
              placeholder="Enter your staff username"
              :aria-invalid="Boolean(fieldErrors.username)"
              :aria-describedby="fieldErrors.username ? 'login-username-error' : undefined"
              class="w-full min-h-[48px] px-3.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border text-base text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none transition-ui"
              :class="fieldErrors.username ? 'border-[var(--color-berry)]' : 'border-[var(--color-line)]'"
              @input="fieldErrors.username = ''"
            />
            <p
              v-if="fieldErrors.username"
              id="login-username-error"
              role="alert"
              class="text-xs font-semibold text-[var(--color-berry-ink)]"
            >
              {{ fieldErrors.username }}
            </p>
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
              :aria-invalid="Boolean(fieldErrors.password)"
              :aria-describedby="fieldErrors.password ? 'login-password-error' : undefined"
              class="w-full min-h-[48px] px-3.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border text-base text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none transition-ui"
              :class="fieldErrors.password ? 'border-[var(--color-berry)]' : 'border-[var(--color-line)]'"
              @input="fieldErrors.password = ''"
            />
            <p
              v-if="fieldErrors.password"
              id="login-password-error"
              role="alert"
              class="text-xs font-semibold text-[var(--color-berry-ink)]"
            >
              {{ fieldErrors.password }}
            </p>
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
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { USE_MOCK } from '@/services/api'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isMockMode = USE_MOCK
const username = ref('')
const password = ref('')
const showPasswordUpdate = ref(false)
const newPassword = ref('')
const newPasswordError = ref('')

const fieldErrors = reactive({
  username: '',
  password: '',
})

// Compiled only when USE_MOCK is true (tree-shaken out of production API builds)
const demoStaff = USE_MOCK
  ? [
      { username: 'waiter', password: 'waiter123', firstName: 'Ana', roleLabel: 'Waiter' },
      { username: 'kitchen', password: 'kitchen123', firstName: 'Ramon', roleLabel: 'Kitchen' },
      { username: 'admin', password: 'admin123', firstName: 'Maria', roleLabel: 'Admin' },
    ]
  : []

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

const handleSubmit = () => {
  fieldErrors.username = ''
  fieldErrors.password = ''
  authStore.error = null

  if (!username.value.trim()) {
    fieldErrors.username = 'Please enter your username.'
  }
  if (!password.value) {
    fieldErrors.password = 'Please enter your password.'
  }
  if (fieldErrors.username || fieldErrors.password) return

  void completeSignIn(username.value.trim(), password.value)
}

const quickLogin = (roleUser: string) => {
  if (!USE_MOCK) return
  fieldErrors.username = ''
  fieldErrors.password = ''
  const matched = demoStaff.find((d) => d.username === roleUser)
  if (!matched) return
  username.value = roleUser
  password.value = matched.password
  void completeSignIn(roleUser, matched.password)
}

const handlePasswordUpdate = async () => {
  newPasswordError.value = ''
  if (newPassword.value.trim().length < 6) {
    newPasswordError.value = 'New password must be at least 6 characters.'
    return
  }
  const ok = await authStore.changePassword(newPassword.value.trim())
  if (ok) navigateToLanding()
}
</script>
