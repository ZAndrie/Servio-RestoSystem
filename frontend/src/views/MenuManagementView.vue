<template>
  <main class="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-6xl w-full mx-auto space-y-6">
    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div class="space-y-1">
        <h1 class="font-display text-2xl font-bold text-[var(--color-ink)]">
          Menu
        </h1>
        <p class="text-base text-[var(--color-muted)] text-pretty prose-measure">
          Update dishes, change prices, or mark items sold out so waiters see it right away.
        </p>
      </div>

      <BaseButton variant="primary" size="md" icon="plus" @click="openEditor()">
        Add New Dish
      </BaseButton>
    </header>

    <!-- Search + Category Chips -->
    <section class="flex flex-col sm:flex-row sm:items-center gap-3">
      <div class="flex-1">
        <BaseCombobox
          v-model="searchQuery"
          :options="searchOptions"
          filter-only
          placeholder="Search menu catalog..."
          aria-label="Search menu catalog"
          empty-text="No matching dishes."
        />
      </div>

      <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
        <button
          type="button"
          class="min-h-[44px] px-4 rounded-[var(--radius-pill)] text-sm font-medium transition-ui cursor-pointer shrink-0"
          :class="
            categoryFilter === null
              ? 'bg-[var(--color-ink)] text-[var(--color-surface)] font-semibold'
              : 'bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-line)]'
          "
          @click="categoryFilter = null"
        >
          All ({{ menuStore.items.length }})
        </button>
        <button
          v-for="cat in menuStore.categories"
          :key="cat.id"
          type="button"
          class="min-h-[44px] px-4 rounded-[var(--radius-pill)] text-sm font-medium transition-ui cursor-pointer shrink-0"
          :class="
            categoryFilter === cat.id
              ? 'bg-[var(--color-ink)] text-[var(--color-surface)] font-semibold'
              : 'bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-line)]'
          "
          @click="categoryFilter = cat.id"
        >
          {{ cat.name }}
        </button>
      </div>
    </section>

    <!-- Error State -->
    <div
      v-if="menuStore.error"
      role="alert"
      class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-berry)]/40 p-6 text-center space-y-3"
    >
      <p class="text-base text-[var(--color-berry-ink)] font-semibold">
        {{ menuStore.error }}
      </p>
      <BaseButton variant="primary" size="md" @click="menuStore.fetchMenu()">
        Reload catalog
      </BaseButton>
    </div>

    <!-- Menu Catalog (Stacked list on phones, Table on tablet/desktop) -->
    <section
      v-else
      class="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] overflow-hidden"
    >
      <!-- Mobile (< 768px) stacked list -->
      <ul class="md:hidden divide-y divide-[var(--color-line)]">
        <li
          v-for="item in filteredItems"
          :key="`mob-${item.id}`"
          class="p-4 space-y-3"
          :class="!item.is_available ? 'bg-[var(--color-surface-alt)]/45' : ''"
        >
          <div class="flex items-start gap-3">
            <DishArtwork
              :name="item.name"
              :image="item.image"
              :artwork="item.artwork"
              :desaturated="!item.is_available"
              compact
            />
            <div class="min-w-0 flex-1">
              <div class="flex items-baseline justify-between gap-2">
                <p class="font-display text-lg font-semibold text-[var(--color-ink)] truncate">
                  {{ item.name }}
                </p>
                <span class="font-semibold tabular-nums text-base text-[var(--color-ink)] shrink-0">
                  {{ formatCurrency(item.price) }}
                </span>
              </div>
              <p class="text-sm text-[var(--color-muted)]">
                {{ menuStore.getCategoryName(item.category_id) }}
              </p>
            </div>
          </div>
          <div class="flex items-center justify-between gap-3">
            <BaseSwitch
              :model-value="item.is_available"
              :label="item.is_available ? 'Available' : 'Sold out'"
              @update:model-value="menuStore.toggleAvailability(item.id)"
            />
            <BaseButton variant="outline" size="sm" @click="openEditor(item)">
              Edit
            </BaseButton>
          </div>
        </li>
      </ul>

      <!-- Tablet / Desktop Table -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-left text-base">
          <thead>
            <tr class="border-b border-[var(--color-line)] bg-[var(--color-bg)]/70 text-xs uppercase text-[var(--color-muted)]">
              <th class="py-3.5 px-5 font-semibold">Dish</th>
              <th class="py-3.5 px-4 font-semibold">Category</th>
              <th class="py-3.5 px-4 font-semibold text-right">Price</th>
              <th class="py-3.5 px-4 font-semibold">Availability</th>
              <th class="py-3.5 px-5 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-line)]">
            <tr
              v-for="item in filteredItems"
              :key="item.id"
              class="transition-ui"
              :class="!item.is_available ? 'bg-[var(--color-surface-alt)]/45' : 'hover:bg-[var(--color-bg)]/50'"
            >
              <td class="py-3.5 px-5">
                <div class="flex items-center gap-3.5">
                  <DishArtwork
                    :name="item.name"
                    :image="item.image"
                    :artwork="item.artwork"
                    :desaturated="!item.is_available"
                    compact
                  />
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <span
                        class="font-display text-lg font-semibold text-[var(--color-ink)]"
                        :class="{ 'text-[var(--color-muted)]': !item.is_available }"
                      >
                        {{ item.name }}
                      </span>
                      <span
                        v-if="item.is_popular"
                        class="px-2 py-0.5 rounded-[var(--radius-pill)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] label-tracked"
                      >
                        Popular
                      </span>
                    </div>
                    <p
                      v-if="item.description"
                      class="text-sm text-[var(--color-muted)] truncate max-w-[44ch]"
                    >
                      {{ item.description }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="py-3.5 px-4 text-sm text-[var(--color-muted)] whitespace-nowrap">
                {{ menuStore.getCategoryName(item.category_id) }}
              </td>

              <td class="py-3.5 px-4 text-right font-semibold tabular-nums text-[var(--color-ink)] whitespace-nowrap">
                {{ formatCurrency(item.price) }}
              </td>

              <!-- Term 6: Optimistic Sold-Out Switch wrapping @vuetify/v0 Switch.Root -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <BaseSwitch
                  :model-value="item.is_available"
                  :label="item.is_available ? 'Available' : 'Sold out'"
                  @update:model-value="menuStore.toggleAvailability(item.id)"
                />
              </td>

              <td class="py-3.5 px-5 text-right whitespace-nowrap">
                <BaseButton variant="outline" size="sm" @click="openEditor(item)">
                  Edit
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Add / Edit Dish Modal (wrapping @vuetify/v0 Dialog) -->
    <BaseDialog
      v-model="isEditorOpen"
      :title="form.id ? 'Edit dish' : 'Add new dish'"
      subtitle="Price changes only apply to new orders — past receipts stay untouched."
    >
      <form id="dish-editor-form" class="space-y-4" @submit.prevent="saveDish">
        <!-- Dish Photo Upload (Click or Drag & Drop with 4:3 live preview) -->
        <div class="space-y-1.5">
          <label for="dish-photo-input" class="block text-sm font-semibold text-[var(--color-ink)]">
            Dish photo
          </label>

          <input
            ref="fileInputRef"
            id="dish-photo-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            class="sr-only"
            @change="handleFileSelect"
          />

          <!-- Preview State when an image is uploaded or already set -->
          <div
            v-if="imagePreviewUrl"
            class="rounded-[var(--radius-input)] border border-[var(--color-line)] bg-[var(--color-bg)] overflow-hidden"
          >
            <div class="aspect-[4/3] w-full max-h-48 overflow-hidden bg-[var(--color-surface-alt)]">
              <img
                :src="imagePreviewUrl"
                :alt="form.name || 'Dish preview'"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="px-3.5 py-2.5 flex items-center justify-between gap-2 border-t border-[var(--color-line)]">
              <span class="text-xs text-[var(--color-muted)] truncate">
                {{ selectedFileName || 'Current dish photo' }}
              </span>
              <div class="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  class="min-h-[44px] px-3 rounded-[var(--radius-pill)] text-sm font-semibold text-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] transition-ui cursor-pointer"
                  @click="triggerFilePicker"
                >
                  Change photo
                </button>
                <button
                  type="button"
                  class="min-h-[44px] px-3 rounded-[var(--radius-pill)] text-sm font-semibold text-[var(--color-muted)] hover:text-[var(--color-berry-ink)] hover:bg-[var(--color-berry-bg)] transition-ui cursor-pointer"
                  @click="removePhoto"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          <!-- Empty Upload Dropzone -->
          <button
            v-else
            type="button"
            class="w-full min-h-[128px] px-4 py-5 rounded-[var(--radius-input)] border-2 border-dashed flex flex-col items-center justify-center gap-2 text-center transition-ui cursor-pointer"
            :class="
              isDraggingFile
                ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)]'
                : 'border-[var(--color-line-strong)] bg-[var(--color-bg)] hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-alt)]/60'
            "
            @click="triggerFilePicker"
            @dragover.prevent="isDraggingFile = true"
            @dragleave.prevent="isDraggingFile = false"
            @drop.prevent="handleFileDrop"
          >
            <span class="w-10 h-10 rounded-[var(--radius-pill)] bg-[var(--color-surface)] border border-[var(--color-line)] flex items-center justify-center text-[var(--color-accent)]">
              <BaseIcon name="upload" :size="20" />
            </span>
            <span class="text-base font-semibold text-[var(--color-ink)]">
              Click to upload a photo
            </span>
            <span class="text-xs text-[var(--color-muted)]">
              or drag and drop · JPG, PNG, or WebP (max 5 MB)
            </span>
          </button>

          <p
            v-if="uploadError"
            role="alert"
            class="text-sm font-semibold text-[var(--color-berry-ink)]"
          >
            {{ uploadError }}
          </p>
        </div>

        <div class="space-y-1.5">
          <label for="dish-name" class="block text-sm font-semibold text-[var(--color-ink)]">
            Dish name
          </label>
          <input
            id="dish-name"
            v-model="form.name"
            type="text"
            required
            placeholder="e.g. Sinigang na Baboy"
            class="w-full min-h-[44px] px-3.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)] text-base text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label for="dish-category" class="block text-sm font-semibold text-[var(--color-ink)]">
              Category
            </label>
            <select
              id="dish-category"
              v-model.number="form.category_id"
              class="w-full min-h-[44px] px-3.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)] text-base text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none"
            >
              <option v-for="cat in menuStore.categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label for="dish-price" class="block text-sm font-semibold text-[var(--color-ink)]">
              Price (PHP)
            </label>
            <input
              id="dish-price"
              v-model.number="form.price"
              type="number"
              min="1"
              step="0.01"
              required
              class="w-full min-h-[44px] px-3.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)] text-base tabular-nums text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none"
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <label for="dish-desc" class="block text-sm font-semibold text-[var(--color-ink)]">
            Short note (optional)
          </label>
          <textarea
            id="dish-desc"
            v-model="form.description"
            rows="2"
            placeholder="Brief ingredient note if needed"
            class="w-full px-3.5 py-2.5 rounded-[var(--radius-input)] bg-[var(--color-bg)] border border-[var(--color-line)] text-base text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none"
          />
        </div>

        <div class="flex items-center justify-between pt-1">
          <span class="text-sm font-semibold text-[var(--color-ink)]">
            Highlight as Popular dish
          </span>
          <BaseSwitch v-model="form.is_popular" />
        </div>
      </form>

      <template #footer>
        <BaseButton variant="ghost" size="md" @click="isEditorOpen = false">
          Cancel
        </BaseButton>
        <BaseButton
          type="submit"
          variant="primary"
          size="md"
          :loading="isSaving"
          @click="saveDish"
        >
          {{ form.id ? 'Save changes' : 'Add to menu' }}
        </BaseButton>
      </template>
    </BaseDialog>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import type { MenuItem } from '@/types'
import { useMenuStore } from '@/stores/menu'
import { formatCurrency } from '@/utils/format'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCombobox from '@/components/base/BaseCombobox.vue'
import type { ComboboxOption } from '@/components/base/BaseCombobox.vue'
import BaseDialog from '@/components/base/BaseDialog.vue'
import BaseSwitch from '@/components/base/BaseSwitch.vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'
import DishArtwork from '@/components/base/DishArtwork.vue'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5 MB

const menuStore = useMenuStore()

const searchQuery = ref<string | number | null>('')
const categoryFilter = ref<number | null>(null)
const isEditorOpen = ref(false)
const isSaving = ref(false)

const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedImageFile = ref<File | null>(null)
const selectedFileName = ref('')
const imagePreviewUrl = ref<string | null>(null)
const uploadError = ref<string | null>(null)
const isDraggingFile = ref(false)
let activeObjectUrl: string | null = null

const form = reactive({
  id: undefined as number | undefined,
  name: '',
  category_id: 1,
  price: 150,
  description: '',
  is_popular: false,
  image: undefined as string | undefined,
})

const revokePreviewObjectUrl = () => {
  if (activeObjectUrl) {
    URL.revokeObjectURL(activeObjectUrl)
    activeObjectUrl = null
  }
}

onUnmounted(revokePreviewObjectUrl)

onMounted(() => {
  if (menuStore.items.length === 0) {
    menuStore.fetchMenu()
  }
})

const searchOptions = computed<ComboboxOption[]>(() =>
  menuStore.items.map((item) => ({
    label: item.name,
    value: item.name,
    sublabel: menuStore.getCategoryName(item.category_id),
    meta: formatCurrency(item.price),
  })),
)

const filteredItems = computed(() => {
  const q = String(searchQuery.value ?? '').trim().toLowerCase()
  return menuStore.items.filter((item) => {
    if (categoryFilter.value !== null && item.category_id !== categoryFilter.value) return false
    if (!q) return true
    return (
      item.name.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
    )
  })
})

const triggerFilePicker = () => {
  fileInputRef.value?.click()
}

const applySelectedFile = (file: File) => {
  uploadError.value = null
  if (!file.type.startsWith('image/')) {
    uploadError.value = 'Please choose an image file (JPG, PNG, or WebP).'
    return
  }
  if (file.size > MAX_IMAGE_BYTES) {
    uploadError.value = 'That photo is larger than 5 MB. Please choose a smaller image.'
    return
  }

  revokePreviewObjectUrl()
  activeObjectUrl = URL.createObjectURL(file)
  selectedImageFile.value = file
  selectedFileName.value = file.name
  imagePreviewUrl.value = activeObjectUrl
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) applySelectedFile(file)
  input.value = ''
}

const handleFileDrop = (event: DragEvent) => {
  isDraggingFile.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) applySelectedFile(file)
}

const removePhoto = () => {
  revokePreviewObjectUrl()
  selectedImageFile.value = null
  selectedFileName.value = ''
  imagePreviewUrl.value = null
  form.image = undefined
  uploadError.value = null
}

const openEditor = (item?: MenuItem) => {
  revokePreviewObjectUrl()
  selectedImageFile.value = null
  selectedFileName.value = ''
  uploadError.value = null
  isDraggingFile.value = false

  if (item) {
    form.id = item.id
    form.name = item.name
    form.category_id = item.category_id
    form.price = item.price
    form.description = item.description ?? ''
    form.is_popular = Boolean(item.is_popular)
    form.image = item.image
    imagePreviewUrl.value = item.image ?? null
  } else {
    form.id = undefined
    form.name = ''
    form.category_id = menuStore.categories[0]?.id ?? 1
    form.price = 180
    form.description = ''
    form.is_popular = false
    form.image = undefined
    imagePreviewUrl.value = null
  }
  isEditorOpen.value = true
}

const saveDish = async () => {
  if (!form.name.trim()) return
  isSaving.value = true
  try {
    const ok = await menuStore.saveItem(
      {
        id: form.id,
        name: form.name,
        category_id: form.category_id,
        price: Number(form.price),
        description: form.description,
        is_popular: form.is_popular,
        image: form.image,
      },
      selectedImageFile.value,
    )
    if (ok) {
      revokePreviewObjectUrl()
      isEditorOpen.value = false
    }
  } finally {
    isSaving.value = false
  }
}
</script>
