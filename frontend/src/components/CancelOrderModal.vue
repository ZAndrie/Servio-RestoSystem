<template>
  <BaseDialog
    :model-value="Boolean(order)"
    title="Cancel order"
    :subtitle="order ? `${order.order_ref} · Table ${order.table_number} will be released.` : ''"
    max-width="sm"
    @update:model-value="handleOpenChange"
  >
    <div v-if="order" class="space-y-4">
      <div class="space-y-2">
        <span class="block label-tracked text-[var(--color-muted)]">
          Common reasons
        </span>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="preset in presets"
            :key="preset"
            type="button"
            class="min-h-[44px] px-3.5 py-2 rounded-[var(--radius-pill)] text-sm font-medium border transition-ui cursor-pointer"
            :class="
              reason === preset
                ? 'bg-[var(--color-ink)] text-[var(--color-surface)] border-[var(--color-ink)]'
                : 'bg-[var(--color-bg)] text-[var(--color-ink)] border-[var(--color-line)] hover:border-[var(--color-line-strong)]'
            "
            @click="reason = preset"
          >
            {{ preset }}
          </button>
        </div>
      </div>

      <div class="space-y-1.5">
        <label for="void-reason" class="block text-sm font-semibold text-[var(--color-ink)]">
          Why is this order being cancelled?
        </label>
        <textarea
          id="void-reason"
          v-model="reason"
          rows="3"
          required
          placeholder="State why this order is being cancelled..."
          class="w-full px-3.5 py-2.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)] text-base text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none prose-measure"
        />
      </div>
    </div>

    <template #footer>
      <BaseButton variant="ghost" size="md" @click="close">
        Keep order
      </BaseButton>
      <BaseButton
        variant="danger"
        size="md"
        :disabled="!reason.trim() || ordersStore.isSubmitting"
        :loading="ordersStore.isSubmitting"
        @click="confirmCancel"
      >
        Confirm cancel
      </BaseButton>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Order } from '@/types'
import { useOrdersStore } from '@/stores/orders'
import BaseDialog from '@/components/base/BaseDialog.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const props = defineProps<{
  order: Order | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', reason: string): void
}>()

const ordersStore = useOrdersStore()
const reason = ref('')

const presets = [
  'Guest changed mind',
  'Duplicate entry',
  'Kitchen out of ingredient',
  'Wrong table selected',
]

watch(
  () => props.order,
  () => {
    reason.value = ''
  },
)

const close = () => emit('close')

const handleOpenChange = (open: boolean) => {
  if (!open) close()
}

const confirmCancel = () => {
  if (!reason.value.trim()) return
  emit('confirm', reason.value.trim())
}
</script>
