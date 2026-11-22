<template>
  <main class="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-6xl w-full mx-auto space-y-6">
    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div class="space-y-1">
        <h1 class="font-display text-2xl font-bold text-[var(--color-ink)]">
          Staff
        </h1>
        <p class="text-base text-[var(--color-muted)] text-pretty prose-measure">
          Add team members and turn off old accounts while keeping all past order records safe.
        </p>
      </div>

      <BaseButton variant="primary" size="md" icon="plus" @click="isAddModalOpen = true">
        Add Staff
      </BaseButton>
    </header>

    <!-- Loading State -->
    <div
      v-if="isLoading && staffList.length === 0"
      class="h-64 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)]"
    />

    <!-- Error State -->
    <div
      v-else-if="loadError"
      role="alert"
      class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-berry)]/40 p-6 text-center space-y-3"
    >
      <p class="text-base font-semibold text-[var(--color-berry-ink)]">
        {{ loadError }}
      </p>
      <BaseButton variant="primary" size="md" @click="fetchStaff">
        Try again
      </BaseButton>
    </div>

    <!-- Staff Directory (Stacked list on phones, Table on tablet/desktop) -->
    <section
      v-else
      class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] overflow-hidden"
    >
      <!-- Mobile (< 768px) stacked cards — zero horizontal table scrolling -->
      <ul class="md:hidden divide-y divide-[var(--color-line)]">
        <li
          v-for="staff in staffList"
          :key="`mob-${staff.id}`"
          class="p-4 space-y-3"
          :class="!staff.is_active ? 'bg-[var(--color-surface-alt)]/50 opacity-75' : ''"
        >
          <div class="flex items-start justify-between gap-2">
            <div>
              <p class="font-semibold text-base text-[var(--color-ink)]">{{ staff.name }}</p>
              <p class="font-mono text-sm text-[var(--color-muted)]">@{{ staff.username }}</p>
            </div>
            <span
              class="inline-flex items-center px-3 py-1 rounded-[var(--radius-pill)] label-tracked border shrink-0"
              :class="roleBadgeClass(staff.role)"
            >
              {{ staff.role }}
            </span>
          </div>
          <div class="flex items-center justify-between gap-3 pt-1">
            <BaseSwitch
              :model-value="staff.is_active"
              :label="staff.is_active ? 'Active' : 'Inactive'"
              :disabled="staff.id === authStore.user?.id"
              @update:model-value="handleToggleActive(staff)"
            />
            <BaseButton variant="outline" size="sm" @click="openResetModal(staff)">
              Reset password
            </BaseButton>
          </div>
        </li>
      </ul>

      <!-- Tablet / Desktop Table -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-left text-base">
          <thead>
            <tr class="border-b border-[var(--color-line)] bg-[var(--color-bg)]/70 text-xs uppercase text-[var(--color-muted)]">
              <th class="py-3.5 px-5 font-semibold">Staff member</th>
              <th class="py-3.5 px-4 font-semibold">Username</th>
              <th class="py-3.5 px-4 font-semibold">Role</th>
              <th class="py-3.5 px-4 font-semibold">Access</th>
              <th class="py-3.5 px-5 font-semibold text-right">Credentials</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-line)]">
            <tr
              v-for="staff in staffList"
              :key="staff.id"
              class="transition-ui"
              :class="!staff.is_active ? 'bg-[var(--color-surface-alt)]/50 opacity-75' : 'hover:bg-[var(--color-bg)]/50'"
            >
              <td class="py-4 px-5 font-semibold text-[var(--color-ink)]">
                {{ staff.name }}
              </td>
              <td class="py-4 px-4 font-mono text-sm text-[var(--color-muted)]">
                @{{ staff.username }}
              </td>
              <td class="py-4 px-4">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-[var(--radius-pill)] label-tracked border"
                  :class="roleBadgeClass(staff.role)"
                >
                  {{ staff.role }}
                </span>
              </td>
              <td class="py-4 px-4">
                <BaseSwitch
                  :model-value="staff.is_active"
                  :label="staff.is_active ? 'Active' : 'Inactive'"
                  :disabled="staff.id === authStore.user?.id"
                  @update:model-value="handleToggleActive(staff)"
                />
              </td>
              <td class="py-4 px-5 text-right">
                <BaseButton
                  variant="outline"
                  size="sm"
                  @click="openResetModal(staff)"
                >
                  Reset password
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Register Staff Dialog -->
    <BaseDialog
      v-model="isAddModalOpen"
      title="Register staff member"
      subtitle="New accounts prompt for a password change on first sign-in."
    >
      <form class="space-y-4" @submit.prevent="handleCreateUser">
        <div class="space-y-1.5">
          <label for="staff-name" class="block text-sm font-medium text-[var(--color-ink)]">
            Full name
          </label>
          <input
            id="staff-name"
            v-model="newStaff.name"
            type="text"
            required
            placeholder="e.g. Marco Villanueva"
            class="w-full min-h-[44px] px-3.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)] text-base text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label for="staff-username" class="block text-sm font-medium text-[var(--color-ink)]">
              Username
            </label>
            <input
              id="staff-username"
              v-model="newStaff.username"
              type="text"
              required
              placeholder="e.g. waiter_marco"
              class="w-full min-h-[44px] px-3.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)] text-base font-mono text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none"
            />
          </div>

          <div class="space-y-1.5">
            <label for="staff-role" class="block text-sm font-medium text-[var(--color-ink)]">
              Role
            </label>
            <select
              id="staff-role"
              v-model="newStaff.role"
              class="w-full min-h-[44px] px-3.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)] text-base text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none"
            >
              <option value="waiter">Waiter / Cashier</option>
              <option value="kitchen">Kitchen</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div class="space-y-1.5">
          <label for="staff-pass" class="block text-sm font-medium text-[var(--color-ink)]">
            Temporary password
          </label>
          <input
            id="staff-pass"
            v-model="newStaff.password"
            type="text"
            required
            minlength="6"
            class="w-full min-h-[44px] px-3.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)] text-base font-mono text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none"
          />
        </div>
      </form>

      <template #footer>
        <BaseButton variant="ghost" size="md" @click="isAddModalOpen = false">
          Cancel
        </BaseButton>
        <BaseButton
          variant="primary"
          size="md"
          :loading="isSubmitting"
          @click="handleCreateUser"
        >
          Create account
        </BaseButton>
      </template>
    </BaseDialog>

    <!-- Reset Password Dialog -->
    <BaseDialog
      :model-value="Boolean(resetTarget)"
      title="Reset staff password"
      :subtitle="resetTarget ? `Issue a temporary sign-in password for ${resetTarget.name}.` : ''"
      max-width="sm"
      @update:model-value="(open) => { if (!open) resetTarget = null }"
    >
      <div class="space-y-1.5">
        <label for="temp-reset-pass" class="block text-sm font-medium text-[var(--color-ink)]">
          Temporary password
        </label>
        <input
          id="temp-reset-pass"
          v-model="resetPasswordValue"
          type="text"
          class="w-full min-h-[44px] px-3.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)] text-base font-mono text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none"
        />
      </div>

      <template #footer>
        <BaseButton variant="ghost" size="md" @click="resetTarget = null">
          Cancel
        </BaseButton>
        <BaseButton
          variant="primary"
          size="md"
          :loading="isSubmitting"
          @click="confirmResetPassword"
        >
          Reset password
        </BaseButton>
      </template>
    </BaseDialog>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { Role, User } from '@/types'
import { userService } from '@/services/userService'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseDialog from '@/components/base/BaseDialog.vue'
import BaseSwitch from '@/components/base/BaseSwitch.vue'

const authStore = useAuthStore()
const toastStore = useToastStore()

const staffList = ref<User[]>([])
const isLoading = ref(false)
const loadError = ref<string | null>(null)
const isSubmitting = ref(false)

const isAddModalOpen = ref(false)
const newStaff = reactive({
  name: '',
  username: '',
  role: 'waiter' as Role,
  password: 'servio2026',
})

const resetTarget = ref<User | null>(null)
const resetPasswordValue = ref('servio2026')

const fetchStaff = async () => {
  isLoading.value = true
  loadError.value = null
  try {
    staffList.value = await userService.getUsers()
  } catch (err: unknown) {
    loadError.value = (err as Error)?.message || 'Unable to load staff accounts.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchStaff)

const roleBadgeClass = (role: Role) => {
  if (role === 'admin') return 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border-[var(--color-accent)]/35'
  if (role === 'kitchen') return 'bg-[var(--color-pot-bg)] text-[var(--color-pot-ink)] border-[var(--color-pot)]/40'
  return 'bg-[var(--color-honey-bg)] text-[var(--color-honey-ink)] border-[var(--color-honey)]/45'
}

const handleToggleActive = async (staff: User) => {
  const prev = staff.is_active
  staff.is_active = !prev
  try {
    await userService.toggleActive(staff.id)
    toastStore.success(
      staff.name,
      staff.is_active ? 'Account reactivated.' : 'Account deactivated. Past order records remain intact.',
    )
  } catch (err: unknown) {
    staff.is_active = prev
    toastStore.error('Update failed', (err as Error)?.message || 'Restored previous account state.')
  }
}

const handleCreateUser = async () => {
  if (!newStaff.name.trim() || !newStaff.username.trim()) return
  isSubmitting.value = true
  try {
    const created = await userService.createUser({ ...newStaff })
    staffList.value.unshift(created)
    toastStore.success('Staff registered', `${created.name} (@${created.username}) can now sign in.`)
    newStaff.name = ''
    newStaff.username = ''
    newStaff.role = 'waiter'
    newStaff.password = 'servio2026'
    isAddModalOpen.value = false
  } catch (err: unknown) {
    toastStore.error('Registration failed', (err as Error)?.message || 'Could not create account.')
  } finally {
    isSubmitting.value = false
  }
}

const openResetModal = (staff: User) => {
  resetTarget.value = staff
  resetPasswordValue.value = 'servio2026'
}

const confirmResetPassword = async () => {
  if (!resetTarget.value || !resetPasswordValue.value.trim()) return
  isSubmitting.value = true
  try {
    await userService.resetPassword(resetTarget.value.id, resetPasswordValue.value.trim())
    toastStore.success('Password reset', `${resetTarget.value.name} will update it on next login.`)
    resetTarget.value = null
  } catch (err: unknown) {
    toastStore.error('Reset failed', (err as Error)?.message || 'Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
