<template>
  <div
    ref="containerRef"
    class="relative"
    :class="variant === 'pill' ? 'w-full sm:w-52' : 'w-full'"
    :style="viewTransitionName ? { viewTransitionName } : undefined"
  >
    <div class="relative flex items-center">
      <!-- Leading Icon -->
      <span
        v-if="icon"
        class="absolute left-3.5 z-10 text-[var(--color-muted)] pointer-events-none optical-nav-icon flex items-center"
        aria-hidden="true"
      >
        <BaseIcon :name="icon" :size="variant === 'pill' ? 16 : 18" />
      </span>

      <input
        ref="inputRef"
        :id="inputId"
        type="text"
        :value="query"
        :placeholder="placeholder"
        :aria-label="ariaLabel || placeholder"
        role="combobox"
        :aria-expanded="isOpen"
        :aria-controls="listboxId"
        :aria-activedescendant="activeDescendantId"
        aria-autocomplete="list"
        autocomplete="off"
        class="w-full min-h-[44px] bg-[var(--color-surface)] border border-[var(--color-line)] text-[var(--color-ink)] placeholder:text-[var(--color-muted)] transition-ui focus:border-[var(--color-accent)] focus:outline-none"
        :class="[
          variant === 'pill'
            ? 'rounded-[var(--radius-pill)] pl-10 pr-10 py-2 text-base font-medium'
            : 'rounded-[var(--radius-pill)] pl-11 pr-11 py-2.5 text-base',
          inputClass,
        ]"
        @focus="openDropdown"
        @input="handleInput"
        @keydown="handleKeyDown"
      />

      <!-- Clear or Chevron button (Term 2 optical centre & Term 8 44px touch target) -->
      <button
        v-if="allowClear && query"
        type="button"
        class="touch-extend-44 absolute right-2 z-10 w-8 h-8 rounded-[var(--radius-pill)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)] transition-ui cursor-pointer"
        aria-label="Clear search"
        @click="clearSelection"
      >
        <BaseIcon name="x" :size="15" />
      </button>
      <button
        v-else
        type="button"
        tabindex="-1"
        class="touch-extend-44 absolute right-2 z-10 w-8 h-8 rounded-[var(--radius-pill)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-ui cursor-pointer"
        :aria-label="isOpen ? 'Close options' : 'Open options'"
        @click="toggleOpen"
      >
        <BaseIcon
          name="chevron-down"
          :size="16"
          :custom-class="['optical-chevron transition-transform duration-150', isOpen ? 'rotate-180' : ''].join(' ')"
        />
      </button>
    </div>

    <!-- Term 10 & 18: Origin-aware interruptible CSS transition (scales from trigger edge) -->
    <div
      :id="listboxId"
      role="listbox"
      :aria-label="ariaLabel || 'Suggestions'"
      class="absolute left-0 right-0 top-full mt-2 z-50 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] shadow-[var(--shadow-float)] overflow-hidden transition-ui"
      :class="[
        variant === 'pill' ? 'origin-top-right min-w-[230px] left-auto' : 'origin-top',
        isOpen
          ? 'opacity-100 scale-100 pointer-events-auto translate-y-0'
          : 'opacity-0 scale-95 pointer-events-none -translate-y-1',
      ]"
      :aria-hidden="!isOpen"
    >
      <ul v-if="filteredOptions.length > 0" class="max-h-72 overflow-y-auto p-1.5 space-y-0.5">
        <li
          v-for="(option, idx) in filteredOptions"
          :key="option.value"
          :id="`${listboxId}-opt-${idx}`"
          role="option"
          :aria-selected="isSelected(option)"
          :aria-disabled="option.disabled || undefined"
          class="min-h-[44px] px-3.5 py-2.5 rounded-[var(--radius-input)] flex items-center justify-between gap-3 transition-ui select-none"
          :class="[
            option.disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer',
            idx === activeIndex
              ? 'bg-[var(--color-accent-subtle)] text-[var(--color-ink)]'
              : 'text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)]',
          ]"
          @mouseenter="activeIndex = idx"
          @mousedown.prevent="selectOption(option)"
        >
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 text-base font-medium leading-snug">
              <span
                v-if="option.dotClass"
                class="w-2 h-2 rounded-full shrink-0 optical-dot"
                :class="option.dotClass"
                aria-hidden="true"
              />
              <span class="truncate">
                <template
                  v-for="(chunk, cIdx) in highlight(option.label)"
                  :key="cIdx"
                >
                  <mark
                    v-if="chunk.match"
                    class="bg-[var(--color-accent-soft)] text-[var(--color-ink)] rounded-[4px] px-0.5 font-semibold"
                  >{{ chunk.text }}</mark>
                  <span v-else>{{ chunk.text }}</span>
                </template>
              </span>
            </div>
            <p
              v-if="option.sublabel"
              class="text-sm text-[var(--color-muted)] truncate mt-0.5 tabular-nums"
            >
              {{ option.sublabel }}
            </p>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <span
              v-if="option.meta"
              class="text-sm font-semibold tabular-nums text-[var(--color-ink)]"
            >
              {{ option.meta }}
            </span>
            <BaseIcon
              v-if="isSelected(option)"
              name="check"
              :size="16"
              custom-class="text-[var(--color-accent)]"
            />
          </div>
        </li>
      </ul>

      <div
        v-else
        class="px-4 py-5 text-center text-sm text-[var(--color-muted)]"
      >
        {{ emptyText }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useClickOutside, toHighlight, useId } from '@vuetify/v0'
import BaseIcon from '@/components/icons/BaseIcon.vue'

export interface ComboboxOption {
  label: string
  value: string | number
  sublabel?: string
  meta?: string
  keywords?: string
  dotClass?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue: string | number | null
    options: ComboboxOption[]
    placeholder?: string
    ariaLabel?: string
    icon?: string
    variant?: 'search' | 'pill'
    allowClear?: boolean
    filterOnly?: boolean
    clearOnSelect?: boolean
    emptyText?: string
    inputClass?: string
    viewTransitionName?: string
  }>(),
  {
    placeholder: 'Search...',
    ariaLabel: undefined,
    icon: 'search',
    variant: 'search',
    allowClear: true,
    filterOnly: false,
    clearOnSelect: false,
    emptyText: 'No matching items found.',
    inputClass: '',
    viewTransitionName: undefined,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
  (e: 'query', value: string): void
  (e: 'select', option: ComboboxOption): void
}>()

const uid = useId()
const inputId = `servio-cb-input-${uid}`
const listboxId = `servio-cb-list-${uid}`

const containerRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const query = ref('')
const activeIndex = ref(0)
const isTyping = ref(false)

useClickOutside(containerRef, () => {
  if (isOpen.value) {
    isOpen.value = false
    syncDisplayText()
  }
})

const syncDisplayText = () => {
  if (props.filterOnly) {
    query.value = String(props.modelValue ?? '')
    return
  }
  const matched = props.options.find((o) => o.value === props.modelValue)
  query.value = matched ? matched.label : String(props.modelValue ?? '')
  isTyping.value = false
}

watch(
  () => [props.modelValue, props.options],
  () => {
    if (!isTyping.value) syncDisplayText()
  },
  { immediate: true },
)

const filteredOptions = computed(() => {
  const q = isTyping.value || props.filterOnly ? query.value.trim().toLowerCase() : ''
  if (!q) return props.options
  return props.options.filter((o) => {
    const haystack = `${o.label} ${o.sublabel ?? ''} ${o.keywords ?? ''}`.toLowerCase()
    return haystack.includes(q)
  })
})

const activeDescendantId = computed(() => {
  if (!isOpen.value || filteredOptions.value.length === 0) return undefined
  return `${listboxId}-opt-${activeIndex.value}`
})

const highlight = (text: string) => {
  const q = isTyping.value || props.filterOnly ? query.value.trim() : ''
  if (!q) return [{ text, match: false }]
  return toHighlight(text, q, { ignoreCase: true, matchAll: true })
}

const isSelected = (option: ComboboxOption) => option.value === props.modelValue

const openDropdown = () => {
  isOpen.value = true
  activeIndex.value = Math.max(
    0,
    filteredOptions.value.findIndex((o) => o.value === props.modelValue),
  )
  if (props.variant === 'pill' && inputRef.value) {
    inputRef.value.select()
  }
}

const toggleOpen = () => {
  if (isOpen.value) {
    isOpen.value = false
    syncDisplayText()
  } else {
    inputRef.value?.focus()
    openDropdown()
  }
}

const handleInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value
  query.value = val
  isTyping.value = true
  isOpen.value = true
  activeIndex.value = 0
  emit('query', val)
  if (props.filterOnly) {
    emit('update:modelValue', val)
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (!isOpen.value) {
      openDropdown()
      return
    }
    if (filteredOptions.value.length > 0) {
      activeIndex.value = (activeIndex.value + 1) % filteredOptions.value.length
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (!isOpen.value) {
      openDropdown()
      return
    }
    if (filteredOptions.value.length > 0) {
      activeIndex.value =
        (activeIndex.value - 1 + filteredOptions.value.length) % filteredOptions.value.length
    }
  } else if (e.key === 'Enter') {
    if (isOpen.value && filteredOptions.value[activeIndex.value]) {
      e.preventDefault()
      selectOption(filteredOptions.value[activeIndex.value])
    }
  } else if (e.key === 'Escape') {
    if (isOpen.value) {
      e.preventDefault()
      isOpen.value = false
      syncDisplayText()
    }
  }
}

const selectOption = (option: ComboboxOption) => {
  if (option.disabled) return
  if (props.clearOnSelect) {
    emit('select', option)
    emit('update:modelValue', props.filterOnly ? '' : null)
    isTyping.value = false
    query.value = ''
    isOpen.value = false
    return
  }
  emit('update:modelValue', option.value)
  emit('select', option)
  isTyping.value = false
  query.value = option.label
  isOpen.value = false
}

const clearSelection = () => {
  query.value = ''
  isTyping.value = false
  emit('query', '')
  if (props.filterOnly) {
    emit('update:modelValue', '')
  } else {
    emit('update:modelValue', null)
  }
  inputRef.value?.focus()
}
</script>
