<template>
  <BaseDialog
    :model-value="Boolean(item)"
    :title="item?.name || ''"
    :subtitle="item ? `Demo Price: ${formatCurrency(computedUnitPrice)} · Editable sample item` : ''"
    max-width="md"
    @update:model-value="(open) => { if (!open) $emit('close') }"
  >
    <div v-if="item" class="space-y-5">
      <!-- Dish Photo -->
      <div class="site-frame aspect-[16/10] w-full">
        <EditorialImage :image="item.image" />
      </div>

      <!-- Description & Tags -->
      <div class="space-y-2">
        <div v-if="item.dietaryTags && item.dietaryTags.length > 0" class="flex flex-wrap gap-1.5">
          <span
            v-for="tag in item.dietaryTags"
            :key="tag"
            class="px-2.5 py-0.5 rounded-full bg-[var(--site-sand)] text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--site-green)]"
          >
            {{ tag }}
          </span>
        </div>
        <p class="text-base text-[var(--site-charcoal)] leading-relaxed">
          {{ item.shortDescription }}
        </p>
      </div>

      <!-- Editable Ingredient & Allergen Notes -->
      <div class="rounded-[12px] bg-[var(--site-cream)] border border-[var(--site-line)] p-3.5 space-y-1.5 text-xs text-[var(--site-muted)]">
        <p><strong class="text-[var(--site-charcoal)]">Ingredients:</strong> {{ item.ingredientsNote }}</p>
        <p>{{ item.allergenNotice }}</p>
      </div>

      <!-- Customizations -->
      <div
        v-for="group in item.customizations || []"
        :key="group.name"
        class="space-y-2"
      >
        <p class="site-eyebrow text-[var(--site-green)]">{{ group.name }}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            v-for="opt in group.options"
            :key="opt.label"
            type="button"
            class="min-h-[44px] px-3.5 py-2 rounded-[10px] border text-left flex items-center justify-between gap-2 text-sm font-semibold transition-colors cursor-pointer"
            :class="
              selectedOptions[group.name] === opt.label
                ? 'bg-[var(--site-green)] text-[var(--site-cream)] border-[var(--site-green)]'
                : 'bg-[var(--site-white)] text-[var(--site-charcoal)] border-[var(--site-line)] hover:border-[var(--site-green)]'
            "
            @click="selectedOptions[group.name] = opt.label"
          >
            <span>{{ opt.label }}</span>
            <span v-if="opt.delta > 0" class="tabular-nums text-xs opacity-90">
              +{{ formatCurrency(opt.delta) }}
            </span>
          </button>
        </div>
      </div>

      <!-- Special Instructions -->
      <div class="space-y-1.5">
        <label for="menu-item-instructions" class="block text-sm font-semibold text-[var(--site-charcoal)]">
          Special instructions (optional)
        </label>
        <textarea
          id="menu-item-instructions"
          v-model="specialInstructions"
          rows="2"
          placeholder="e.g. Sauce on the side, less ice, extra calamansi"
          class="w-full px-3.5 py-2.5 rounded-[10px] bg-[var(--site-cream)] border border-[var(--site-line)] text-sm text-[var(--site-charcoal)] focus:border-[var(--site-green)] focus:outline-none"
        />
      </div>

      <!-- Quantity Row -->
      <div class="flex items-center justify-between pt-2 border-t border-[var(--site-line)]">
        <span class="text-sm font-semibold text-[var(--site-charcoal)]">Quantity</span>
        <div class="inline-flex items-center gap-3">
          <button
            type="button"
            class="w-10 h-10 rounded-full border border-[var(--site-line)] bg-[var(--site-cream)] flex items-center justify-center text-[var(--site-charcoal)] cursor-pointer disabled:opacity-40"
            :disabled="quantity <= 1"
            aria-label="Decrease quantity"
            @click="quantity = Math.max(1, quantity - 1)"
          >
            <BaseIcon name="minus" :size="15" />
          </button>
          <span class="min-w-[2.5ch] text-center font-bold text-lg tabular-nums">
            {{ quantity }}
          </span>
          <button
            type="button"
            class="w-10 h-10 rounded-full border border-[var(--site-line)] bg-[var(--site-cream)] flex items-center justify-center text-[var(--site-charcoal)] cursor-pointer"
            aria-label="Increase quantity"
            @click="quantity += 1"
          >
            <BaseIcon name="plus" :size="15" />
          </button>
        </div>
      </div>
    </div>

    <template v-if="item" #footer>
      <button
        type="button"
        class="min-h-[44px] px-4 rounded-full text-sm font-semibold text-[var(--site-muted)] hover:text-[var(--site-charcoal)] cursor-pointer"
        @click="$emit('close')"
      >
        Cancel
      </button>
      <button
        type="button"
        :disabled="!item.available"
        class="min-h-[48px] px-6 rounded-full bg-[var(--site-green)] hover:bg-[var(--site-green-hover)] text-[var(--site-cream)] text-sm font-bold uppercase tracking-[0.08em] inline-flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
        @click="handleAdd"
      >
        <span>Add to Order</span>
        <span class="tabular-nums">· {{ formatCurrency(computedUnitPrice * quantity) }}</span>
      </button>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { PublicMenuItem } from '@/data/publicMenu'
import { formatCurrency } from '@/utils/format'
import BaseDialog from '@/components/base/BaseDialog.vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'
import EditorialImage from './EditorialImage.vue'

const props = defineProps<{
  item: PublicMenuItem | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (
    e: 'add',
    payload: {
      item: PublicMenuItem
      quantity: number
      selectedOptions: Record<string, string>
      specialInstructions: string
    },
  ): void
}>()

const quantity = ref(1)
const specialInstructions = ref('')
const selectedOptions = reactive<Record<string, string>>({})

watch(
  () => props.item,
  (next) => {
    quantity.value = 1
    specialInstructions.value = ''
    for (const k of Object.keys(selectedOptions)) delete selectedOptions[k]
    if (next?.customizations) {
      for (const group of next.customizations) {
        if (group.options[0]) {
          selectedOptions[group.name] = group.options[0].label
        }
      }
    }
  },
  { immediate: true },
)

const computedUnitPrice = computed(() => {
  if (!props.item) return 0
  let delta = 0
  if (props.item.customizations) {
    for (const group of props.item.customizations) {
      const opt = group.options.find((o) => o.label === selectedOptions[group.name])
      if (opt) delta += opt.delta
    }
  }
  return props.item.demoPrice + delta
})

const handleAdd = () => {
  if (!props.item || !props.item.available) return
  emit('add', {
    item: props.item,
    quantity: quantity.value,
    selectedOptions: { ...selectedOptions },
    specialInstructions: specialInstructions.value,
  })
}
</script>
