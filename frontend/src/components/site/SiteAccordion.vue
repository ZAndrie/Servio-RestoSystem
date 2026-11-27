<template>
  <!-- Editorial Hairline Accordion (Unified Servio Tokens — No boxed cards or circle rings) -->
  <div class="border-t" :class="dark ? 'border-[var(--color-sidebar-line)]' : 'border-[var(--color-line)]'">
    <div
      v-for="item in items"
      :key="item.id"
      class="border-b"
      :class="dark ? 'border-[var(--color-sidebar-line)]' : 'border-[var(--color-line)]'"
    >
      <h3>
        <button
          type="button"
          :id="`faq-btn-${item.id}`"
          :aria-expanded="openId === item.id"
          :aria-controls="`faq-panel-${item.id}`"
          class="w-full min-h-[56px] py-4 flex items-center justify-between gap-4 text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          @click="toggle(item.id)"
        >
          <span
            class="font-display text-base sm:text-lg font-bold leading-snug transition-colors"
            :class="
              dark
                ? 'text-[var(--color-sidebar-ink)] group-hover:text-[var(--color-kds-honey)]'
                : 'text-[var(--color-ink)] group-hover:text-[var(--color-accent)]'
            "
          >
            {{ item.question }}
          </span>
          <span
            class="w-9 h-9 rounded-[var(--radius-input)] border flex items-center justify-center shrink-0 transition-transform duration-180"
            :class="[
              dark
                ? 'border-[var(--color-sidebar-line)] text-[var(--color-sidebar-muted)] group-hover:text-[var(--color-sidebar-ink)]'
                : 'border-[var(--color-line)] text-[var(--color-muted)] group-hover:border-[var(--color-line-strong)] group-hover:text-[var(--color-ink)]',
              openId === item.id ? 'rotate-45' : '',
            ]"
            aria-hidden="true"
          >
            <BaseIcon name="plus" :size="16" />
          </span>
        </button>
      </h3>

      <div
        :id="`faq-panel-${item.id}`"
        role="region"
        :aria-labelledby="`faq-btn-${item.id}`"
        class="grid transition-[grid-template-rows,opacity] duration-180 ease-out"
        :class="openId === item.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
      >
        <div class="overflow-hidden">
          <p
            class="pb-5 text-base leading-relaxed max-w-[62ch] text-pretty"
            :class="dark ? 'text-[var(--color-sidebar-muted)]' : 'text-[var(--color-muted)]'"
          >
            {{ item.answer }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'

export interface AccordionItem {
  id: string
  question: string
  answer: string
}

withDefaults(
  defineProps<{
    items: AccordionItem[]
    dark?: boolean
  }>(),
  {
    dark: false,
  },
)

const openId = ref<string | null>(null)

const toggle = (id: string) => {
  openId.value = openId.value === id ? null : id
}
</script>
