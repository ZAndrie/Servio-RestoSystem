<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="customClass"
    aria-hidden="true"
  >
    <template v-if="name === 'search'">
      <circle cx="11" cy="11" r="7.5" />
      <path d="m20 20-3.8-3.8" />
    </template>

    <template v-else-if="name === 'plus'">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </template>

    <template v-else-if="name === 'minus'">
      <path d="M5 12h14" />
    </template>

    <template v-else-if="name === 'check'">
      <path d="M20 6 9 17l-5-5" />
    </template>

    <template v-else-if="name === 'clock'">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 1.8" />
    </template>

    <template v-else-if="name === 'cooking'">
      <path d="M4 11h16" />
      <path d="M6 11v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-6" />
      <path d="M9 7V5" />
      <path d="M12 7V4" />
      <path d="M15 7V5" />
    </template>

    <template v-else-if="name === 'cloche'">
      <path d="M3 18h18" />
      <path d="M4.5 18a7.5 7.5 0 0 1 15 0" />
      <path d="M12 10.5V8" />
      <circle cx="12" cy="6.5" r="1.5" />
    </template>

    <template v-else-if="name === 'bowl'">
      <path d="M4 11h16" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M9 18h6" />
      <path d="M9 7.5c0-1 .8-1.5.8-2.5" />
      <path d="M12 7.5c0-1 .8-1.5.8-2.5" />
      <path d="M15 7.5c0-1 .8-1.5.8-2.5" />
    </template>

    <template v-else-if="name === 'plate'">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="5" />
      <path d="M9.5 12h5" />
    </template>

    <template v-else-if="name === 'glass'">
      <path d="M7 4h10l-1.4 14.5a2 2 0 0 1-2 1.5h-3.2a2 2 0 0 1-2-1.5L7 4Z" />
      <path d="M7.6 10h8.8" />
      <path d="M14 4 16 2" />
    </template>

    <template v-else-if="name === 'dessert'">
      <path d="M6 18h12" />
      <path d="M8 18v-3a4 4 0 0 1 8 0v3" />
      <path d="M9.5 11a2.5 2.5 0 0 1 5 0" />
      <circle cx="12" cy="6.5" r="1.5" />
    </template>

    <template v-else-if="name === 'table'">
      <path d="M3 9h18" />
      <path d="M5 9v10" />
      <path d="M19 9v10" />
      <path d="M8 13h8" />
    </template>

    <template v-else-if="name === 'receipt'">
      <path d="M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5-2 1.5V3Z" />
      <path d="M9 8h6" />
      <path d="M9 12h6" />
      <path d="M9 16h3" />
    </template>

    <template v-else-if="name === 'alert'">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4.5" />
      <path d="M12 16h.01" />
    </template>

    <template v-else-if="name === 'x'">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </template>

    <template v-else-if="name === 'chevron-down'">
      <path d="m6 9 6 6 6-6" />
    </template>

    <template v-else-if="name === 'chevron-up'">
      <path d="m18 15-6-6-6 6" />
    </template>

    <template v-else-if="name === 'chevron-right'">
      <path d="m9 18 6-6-6-6" />
    </template>

    <template v-else-if="name === 'arrow-left'">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </template>

    <template v-else-if="name === 'printer'">
      <path d="M6 9V4h12v5" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect width="12" height="6" x="6" y="14" rx="1" />
    </template>

    <template v-else-if="name === 'user'">
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </template>

    <template v-else-if="name === 'users'">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 19a6 6 0 0 1 12 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M17 14a4.5 4.5 0 0 1 4 4.5" />
    </template>

    <template v-else-if="name === 'logout'">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </template>

    <template v-else-if="name === 'cart'">
      <path d="M4 6h2l2.2 10h9.8l2-7H7.2" />
      <circle cx="10" cy="20" r="1.25" />
      <circle cx="17" cy="20" r="1.25" />
    </template>

    <template v-else-if="name === 'dish'">
      <path d="M3 16h18" />
      <path d="M5 16a7 7 0 0 1 14 0" />
      <path d="M12 9V7" />
      <path d="M10 7h4" />
    </template>

    <template v-else-if="name === 'bar-chart'">
      <path d="M4 20h16" />
      <path d="M7 20v-7" />
      <path d="M12 20V7" />
      <path d="M17 20v-10" />
    </template>

    <template v-else-if="name === 'file-text'">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </template>

    <template v-else-if="name === 'book-open'">
      <path d="M2 5h6a4 4 0 0 1 4 4v11a3 3 0 0 0-3-3H2Z" />
      <path d="M22 5h-6a4 4 0 0 0-4 4v11a3 3 0 0 1 3-3h7Z" />
    </template>

    <template v-else-if="name === 'undo'">
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
    </template>

    <template v-else-if="name === 'trash'">
      <path d="M4 7h16" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
    </template>

    <template v-else-if="name === 'note'">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </template>

    <template v-else-if="name === 'cash'">
      <rect width="18" height="12" x="3" y="6" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 9h.01" />
      <path d="M18 15h.01" />
    </template>

    <template v-else-if="name === 'smartphone'">
      <rect width="12" height="18" x="6" y="3" rx="2" />
      <path d="M12 17h.01" />
    </template>

    <template v-else-if="name === 'credit-card'">
      <rect width="18" height="13" x="3" y="5.5" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 14.5h3" />
    </template>

    <template v-else-if="name === 'refresh'">
      <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" />
      <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" />
      <path d="M3 20v-4h4" />
      <path d="M21 4v4h-4" />
    </template>

    <template v-else-if="name === 'star'">
      <path d="m12 3 2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 16.5 6.8 19.3l1-5.9-4.3-4.2 5.9-.9Z" />
    </template>

    <template v-else-if="name === 'upload'">
      <path d="M12 15V4" />
      <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </template>

    <template v-else-if="name === 'image'">
      <rect width="18" height="16" x="3" y="4" rx="2.5" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m21 15-4.5-4.5a1.5 1.5 0 0 0-2.1 0L7 18" />
    </template>

    <template v-else>
      <circle cx="12" cy="12" r="9" />
    </template>
  </svg>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string
    size?: number
    strokeWidth?: number
    customClass?: string
  }>(),
  {
    size: 18,
    strokeWidth: 1.75,
    customClass: '',
  },
)
</script>
