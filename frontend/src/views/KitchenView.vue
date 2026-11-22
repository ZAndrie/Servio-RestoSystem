<template>
  <!-- Kitchen Display: Full-screen, NO sidebar, dark warm-espresso palette (>= 7:1 contrast, >= 20px text) -->
  <div class="min-h-[100dvh] bg-[var(--color-kds-bg)] text-[var(--color-kds-ink)] flex flex-col">
    <!-- Top Kitchen Status Bar -->
    <header class="px-5 sm:px-6 py-4 border-b border-[var(--color-kds-line)] flex flex-wrap items-center justify-between gap-4 safe-pt">
      <div class="flex items-center gap-3.5">
        <img
          src="/servio-logo-icon.jpg"
          alt="Servio"
          width="38"
          height="38"
          class="w-[38px] h-[38px] rounded-[var(--radius-input)] object-cover border border-[var(--color-kds-line)]"
        />
        <div>
          <h1 class="font-display text-xl font-bold text-[var(--color-kds-ink)]">
            Kitchen Board
          </h1>
          <p class="text-sm text-[var(--color-kds-muted)] tabular-nums">
            {{ lastSyncedText }}
          </p>
        </div>
      </div>

      <!-- Ticket Counts + Staff Actions -->
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-2 text-sm font-bold tabular-nums">
          <span class="px-3.5 py-2 rounded-[var(--radius-pill)] bg-[var(--color-kds-honey)]/15 text-[var(--color-kds-honey)] border border-[var(--color-kds-honey)]/35">
            {{ ordersStore.kdsPendingOrders.length }} New
          </span>
          <span class="px-3.5 py-2 rounded-[var(--radius-pill)] bg-[var(--color-kds-pot)]/15 text-[var(--color-kds-pot)] border border-[var(--color-kds-pot)]/35">
            {{ ordersStore.kdsPreparingOrders.length }} Cooking
          </span>
          <span class="px-3.5 py-2 rounded-[var(--radius-pill)] bg-[var(--color-kds-leaf)]/15 text-[var(--color-kds-leaf)] border border-[var(--color-kds-leaf)]/35">
            {{ ordersStore.kdsReadyOrders.length }} Ready
          </span>
        </div>

        <button
          v-if="authStore.isAdmin"
          type="button"
          class="min-h-[48px] px-4 rounded-[var(--radius-pill)] bg-[var(--color-kds-surface)] hover:bg-[var(--color-kds-surface-hover)] border border-[var(--color-kds-line)] text-[var(--color-kds-ink)] text-base font-medium inline-flex items-center gap-2 transition-ui cursor-pointer"
          @click="router.push('/admin/dashboard')"
        >
          <BaseIcon name="arrow-left" :size="18" />
          <span>Admin</span>
        </button>

        <button
          type="button"
          class="min-h-[48px] px-4 rounded-[var(--radius-pill)] bg-[var(--color-kds-surface)] hover:bg-[var(--color-kds-surface-hover)] border border-[var(--color-kds-line)] text-[var(--color-kds-ink)] text-base font-medium inline-flex items-center gap-2 transition-ui cursor-pointer"
          @click="handleLogout"
        >
          <BaseIcon name="logout" :size="18" />
          <span>Sign out</span>
        </button>
      </div>
    </header>

    <!-- Main Preparation Board (2 Primary Columns: Pending | Preparing) -->
    <main class="flex-1 p-5 sm:p-6 safe-pb space-y-6">
      <!-- Error State -->
      <div
        v-if="ordersStore.error"
        role="alert"
        class="rounded-[var(--radius-card)] bg-[var(--color-kds-surface)] border border-[var(--color-kds-berry)] p-6 flex items-center justify-between gap-4"
      >
        <p class="text-lg text-[var(--color-kds-berry)] font-semibold">
          {{ ordersStore.error }}
        </p>
        <BaseButton variant="kds-primary" size="lg" @click="ordersStore.fetchOrders()">
          Reconnect
        </BaseButton>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <!-- Column 1: Incoming Pending Tickets -->
        <section aria-labelledby="kds-pending-heading" class="space-y-4">
          <div class="flex items-center justify-between px-1">
            <h2
              id="kds-pending-heading"
              class="font-display text-xl font-bold text-[var(--color-kds-honey)] flex items-center gap-2.5"
            >
              <BaseIcon name="clock" :size="22" />
              <span>New Orders</span>
            </h2>
            <span class="text-base font-bold text-[var(--color-kds-muted)] tabular-nums">
              {{ ordersStore.kdsPendingOrders.length }}
            </span>
          </div>

          <div
            v-if="ordersStore.kdsPendingOrders.length === 0"
            class="rounded-[var(--radius-card)] bg-[var(--color-kds-surface)] border border-[var(--color-kds-line)] px-6 py-12 text-center"
          >
            <p class="font-display text-xl text-[var(--color-kds-ink)]">
              Nothing cooking yet
            </p>
            <p class="mt-1 text-base text-[var(--color-kds-muted)]">
              New dining room tickets will land here automatically.
            </p>
          </div>

          <div v-else class="space-y-4">
            <OrderCard
              v-for="order in ordersStore.kdsPendingOrders"
              :key="order.id"
              :order="order"
              kds
            >
              <template #actions>
                <BaseButton
                  variant="kds-primary"
                  size="lg"
                  icon="cooking"
                  custom-class="w-full"
                  @click="ordersStore.updateStatus(order.id, 'preparing')"
                >
                  Start cooking
                </BaseButton>
              </template>
            </OrderCard>
          </div>
        </section>

        <!-- Column 2: Preparing on the Stove -->
        <section aria-labelledby="kds-preparing-heading" class="space-y-4">
          <div class="flex items-center justify-between px-1">
            <h2
              id="kds-preparing-heading"
              class="font-display text-xl font-bold text-[var(--color-kds-pot)] flex items-center gap-2.5"
            >
              <BaseIcon name="cooking" :size="22" />
              <span>Cooking Now</span>
            </h2>
            <span class="text-base font-bold text-[var(--color-kds-muted)] tabular-nums">
              {{ ordersStore.kdsPreparingOrders.length }}
            </span>
          </div>

          <div
            v-if="ordersStore.kdsPreparingOrders.length === 0"
            class="rounded-[var(--radius-card)] bg-[var(--color-kds-surface)] border border-[var(--color-kds-line)] px-6 py-12 text-center"
          >
            <p class="font-display text-xl text-[var(--color-kds-ink)]">
              All pans clear
            </p>
            <p class="mt-1 text-base text-[var(--color-kds-muted)]">
              Tap Start cooking on an incoming ticket to move it here.
            </p>
          </div>

          <div v-else class="space-y-4">
            <OrderCard
              v-for="order in ordersStore.kdsPreparingOrders"
              :key="order.id"
              :order="order"
              kds
            >
              <template #actions>
                <BaseButton
                  variant="kds-ready"
                  size="lg"
                  icon="check"
                  custom-class="w-full"
                  @click="ordersStore.updateStatus(order.id, 'ready')"
                >
                  Mark ready for pickup
                </BaseButton>
              </template>
            </OrderCard>
          </div>
        </section>
      </div>

      <!-- Quiet Ready Shelf at bottom for pass verification -->
      <section
        v-if="ordersStore.kdsReadyOrders.length > 0"
        aria-label="Waiting at pickup pass"
        class="pt-4 border-t border-[var(--color-kds-line)] space-y-3"
      >
        <h2 class="label-tracked text-[var(--color-kds-leaf)]">
          Ready at the counter · waiting for waiter
        </h2>
        <div class="flex flex-wrap gap-3">
          <div
            v-for="order in ordersStore.kdsReadyOrders"
            :key="order.id"
            class="px-4 py-3 rounded-[var(--radius-card)] bg-[var(--color-kds-surface)] border border-[var(--color-kds-leaf)]/50 flex items-center gap-3"
          >
            <span class="font-display text-lg font-bold text-[var(--color-kds-leaf)] tabular-nums">
              Table {{ Number(order.table_number.replace(/\D/g, '')) || order.table_number }}
            </span>
            <span class="text-base text-[var(--color-kds-ink)]">
              {{ order.items.reduce((s, i) => s + i.quantity, 0) }} items
            </span>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrdersStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'
import { formatTimePH } from '@/utils/format'
import OrderCard from '@/components/OrderCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'

const router = useRouter()
const ordersStore = useOrdersStore()
const authStore = useAuthStore()

onMounted(() => {
  ordersStore.startPolling(3500)
})

onUnmounted(() => {
  ordersStore.stopPolling()
})

const lastSyncedText = computed(() =>
  ordersStore.lastPolledAt ? `Updated ${formatTimePH(ordersStore.lastPolledAt)}` : 'Updating...',
)

const handleLogout = async () => {
  ordersStore.stopPolling()
  await authStore.logout()
  router.push('/login')
}
</script>
