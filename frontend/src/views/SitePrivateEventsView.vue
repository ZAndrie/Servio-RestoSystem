<template>
  <!-- Echoes Cabalar /private-events: Hero + Deep Forest Green highlight package cards + Gallery + Booking Form + FAQs -->
  <SiteLayout surface="cream">
    <!-- 1. HERO SECTION -->
    <section class="pt-10 sm:pt-14 lg:pt-20 pb-12 sm:pb-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div class="max-w-4xl space-y-5">
          <p class="site-eyebrow text-[var(--site-terracotta)]">Private Dining &amp; Gatherings</p>
          <h1 class="site-display-hero text-[var(--site-green)]">
            Let's Make Room for Good Memories.
          </h1>
          <p class="site-body-lg text-[var(--site-muted)] max-w-[56ch]">
            Host your next family milestone, birthday dinner, baptismal lunch, or team celebration
            around our warm wooden tables with generous Filipino dishes served family-style.
          </p>
          <div class="flex flex-wrap gap-3.5 pt-1">
            <a
              href="#private-event-form"
              class="min-h-[52px] px-7 rounded-full bg-[var(--site-green)] hover:bg-[var(--site-green-hover)] text-[var(--site-cream)] text-sm font-bold uppercase tracking-[0.09em] inline-flex items-center gap-2 transition-colors"
            >
              <span>Inquire About an Event</span>
              <BaseIcon name="chevron-right" :size="16" />
            </a>
            <router-link
              to="/catering"
              class="min-h-[52px] px-7 rounded-full border-[1.5px] border-[var(--site-green)] text-[var(--site-green)] hover:bg-[var(--site-green)] hover:text-[var(--site-cream)] text-sm font-bold uppercase tracking-[0.09em] inline-flex items-center transition-colors"
            >
              Off-Site Catering
            </router-link>
          </div>
        </div>

        <div class="site-frame aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/9] w-full shadow-[var(--shadow-card)]">
          <EditorialImage :image="SITE_IMAGES.diningRoom" eager />
        </div>
      </div>
    </section>

    <!-- 2. DEEP FOREST GREEN PACKAGE CARDS WITH PILL-BADGE HIGHLIGHTS (Cabalar signature) -->
    <section class="py-12 sm:py-16 lg:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div class="site-reveal max-w-2xl space-y-3">
          <p class="site-eyebrow text-[var(--site-terracotta)]">Group Dining Packages</p>
          <h2 class="site-display-xl text-[var(--site-green)]">
            Food, Refreshments &amp; Warm Hospitality.
          </h2>
          <p class="text-base text-[var(--site-muted)]">
            Customize your seating arrangement, shared Filipino favorites, and drink pairings with
            our team.
          </p>
        </div>

        <div class="space-y-8">
          <article
            v-for="(pkg, idx) in PRIVATE_EVENT_PACKAGES"
            :key="pkg.id"
            class="site-reveal rounded-[1.75rem] bg-[var(--site-green)] text-[var(--site-cream)] p-7 sm:p-10 lg:p-12 shadow-[var(--shadow-card)]"
          >
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div
                class="lg:col-span-7 space-y-6"
                :class="idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'"
              >
                <div class="space-y-2.5">
                  <p class="site-eyebrow text-[var(--site-gold)]">{{ pkg.eyebrow }}</p>
                  <h3 class="site-display-lg text-[var(--site-cream)]">{{ pkg.name }}</h3>
                  <p class="text-base text-[var(--site-cream)]/85 leading-relaxed max-w-[54ch]">
                    {{ pkg.description }}
                  </p>
                </div>

                <!-- Pill-Badge HIGHLIGHTS (Direct homage to Cabalar's Nom Nom / Bevvies pill grid) -->
                <div class="space-y-3">
                  <p class="site-eyebrow text-[var(--site-gold)]">Highlights</p>
                  <ul class="flex flex-wrap gap-2">
                    <li
                      v-for="hl in pkg.highlights"
                      :key="hl"
                      class="px-3.5 py-1.5 rounded-full border border-[var(--site-cream)]/40 text-xs font-bold uppercase tracking-[0.07em] text-[var(--site-cream)]"
                    >
                      {{ hl }}
                    </li>
                  </ul>
                </div>

                <div class="pt-2 space-y-4 border-t border-[var(--site-cream)]/20">
                  <p class="text-xs text-[var(--site-cream)]/75 leading-relaxed">
                    {{ pkg.pricingNote }}
                  </p>
                  <a
                    href="#private-event-form"
                    class="min-h-[46px] px-6 rounded-full bg-[var(--site-cream)] text-[var(--site-green)] hover:bg-[var(--site-sand)] text-xs font-bold uppercase tracking-[0.1em] inline-flex items-center gap-2 transition-colors"
                  >
                    <span>Plan This Gathering</span>
                    <BaseIcon name="chevron-right" :size="15" />
                  </a>
                </div>
              </div>

              <div
                class="lg:col-span-5"
                :class="idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'"
              >
                <div class="site-frame aspect-[4/3] w-full border border-[var(--site-cream)]/20">
                  <EditorialImage :image="pkg.image" />
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 3. FOOD & BEVERAGE OPTIONS + EVENT GALLERY -->
    <section class="py-16 sm:py-20 bg-[var(--site-sand)] border-y border-[var(--site-line)]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div class="site-reveal grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="rounded-[1.25rem] bg-[var(--site-cream)] border border-[var(--site-line)] p-6 space-y-2.5">
            <SiteIllustration kind="heart-pot" :size="48" custom-class="text-[var(--site-green)]" />
            <h3 class="site-display-md text-[var(--site-green)]">Shared Filipino Viands</h3>
            <p class="text-sm text-[var(--site-muted)] leading-relaxed">
              Choose comforting classics like Sinigang, Adobo, Beef Kare-Kare, Crispy Pata, and
              Chicken Inasal plated for the center of every table.
            </p>
          </div>
          <div class="rounded-[1.25rem] bg-[var(--site-cream)] border border-[var(--site-line)] p-6 space-y-2.5">
            <SiteIllustration kind="shared-bilao" :size="48" custom-class="text-[var(--site-green)]" />
            <h3 class="site-display-md text-[var(--site-green)]">Noodles &amp; Starters</h3>
            <p class="text-sm text-[var(--site-muted)] leading-relaxed">
              Welcome guests with crisp Lumpiang Shanghai, festive Pancit Canton, and warm garlic
              rice bowls as everyone settles in.
            </p>
          </div>
          <div class="rounded-[1.25rem] bg-[var(--site-cream)] border border-[var(--site-line)] p-6 space-y-2.5">
            <SiteIllustration kind="open-lantern" :size="48" custom-class="text-[var(--site-green)]" />
            <h3 class="site-display-md text-[var(--site-green)]">Beverages &amp; Desserts</h3>
            <p class="text-sm text-[var(--site-muted)] leading-relaxed">
              Pair dinner with freshly squeezed Calamansi Juice, Sago't Gulaman, Leche Flan, and
              Halo-Halo finishes (options customizable on booking).
            </p>
          </div>
        </div>

        <!-- Event Gallery Strip -->
        <div class="site-reveal grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div
            v-for="img in eventGallery"
            :key="img.src"
            class="site-frame aspect-[4/3] shadow-[var(--shadow-card)]"
          >
            <EditorialImage :image="img" />
          </div>
        </div>
      </div>
    </section>

    <!-- 4. PRIVATE EVENT BOOKING FORM (9 Validated Fields + Explicit Demo Mode) -->
    <section id="private-event-form" class="scroll-mt-24 py-16 sm:py-20 lg:py-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div class="space-y-3">
          <p class="site-eyebrow text-[var(--site-terracotta)]">Reserve a Celebration</p>
          <h2 class="site-display-xl text-[var(--site-green)]">
            Private Event Inquiry
          </h2>
          <p class="text-base text-[var(--site-muted)] max-w-[58ch]">
            Tell us about your occasion, preferred schedule, and group size. Exact table capacity,
            deposit policy, and menu inclusions will be confirmed directly by SERVIO.
          </p>
        </div>

        <div class="rounded-[1rem] bg-[var(--site-sand)] border border-[var(--site-line)] px-4 py-3.5 flex items-start gap-3 text-xs sm:text-sm text-[var(--site-charcoal)]">
          <BaseIcon name="alert" :size="18" custom-class="text-[var(--site-terracotta)] shrink-0 mt-0.5" />
          <p>{{ RESTAURANT_CONFIG.forms.demoNotice }}</p>
        </div>

        <!-- Demo Receipt -->
        <div
          v-if="submittedBooking"
          role="status"
          aria-live="polite"
          class="rounded-[1.5rem] bg-[var(--site-green)] text-[var(--site-cream)] p-7 sm:p-9 space-y-5"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="space-y-1">
              <p class="site-eyebrow text-[var(--site-gold)]">Demo Booking Inquiry Preview</p>
              <h3 class="site-display-md text-[var(--site-cream)]">
                We received your preview request, {{ submittedBooking.name }}.
              </h3>
            </div>
            <span class="px-3 py-1 rounded-full bg-[var(--site-cream)]/15 text-xs font-bold uppercase tracking-[0.08em]">
              Demo Mode
            </span>
          </div>

          <p class="text-sm text-[var(--site-cream)]/85 leading-relaxed">
            This inquiry passed client-side validation and is previewed locally. No live booking or
            email was sent yet.
          </p>

          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm pt-3 border-t border-[var(--site-cream)]/20">
            <div><dt class="text-xs text-[var(--site-gold)] uppercase">Occasion</dt><dd class="font-semibold">{{ submittedBooking.eventType }}</dd></div>
            <div><dt class="text-xs text-[var(--site-gold)] uppercase">Preferred Schedule</dt><dd class="font-semibold">{{ submittedBooking.preferredDate }} · {{ submittedBooking.preferredTime }}</dd></div>
            <div><dt class="text-xs text-[var(--site-gold)] uppercase">Guest Count</dt><dd class="font-semibold">{{ submittedBooking.guestCount }} guests</dd></div>
            <div><dt class="text-xs text-[var(--site-gold)] uppercase">Contact</dt><dd class="font-semibold">{{ submittedBooking.contactNumber }} · {{ submittedBooking.email }}</dd></div>
          </dl>

          <button
            type="button"
            class="min-h-[46px] px-6 rounded-full bg-[var(--site-cream)] text-[var(--site-green)] text-xs font-bold uppercase tracking-[0.1em] hover:bg-[var(--site-sand)] transition-colors cursor-pointer"
            @click="resetForm"
          >
            Start Another Demo Inquiry
          </button>
        </div>

        <!-- 9-Field Form -->
        <form v-else class="space-y-8" novalidate @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label for="pe-name" class="site-eyebrow text-[var(--site-green)] block mb-1">
                Name *
              </label>
              <input
                id="pe-name"
                v-model.trim="form.name"
                type="text"
                required
                placeholder="Your full name"
                class="site-underline-input"
                :aria-invalid="Boolean(errors.name)"
              />
              <p v-if="errors.name" role="alert" class="mt-1 text-xs font-semibold text-[var(--site-terracotta)]">
                {{ errors.name }}
              </p>
            </div>

            <div>
              <label for="pe-email" class="site-eyebrow text-[var(--site-green)] block mb-1">
                Email *
              </label>
              <input
                id="pe-email"
                v-model.trim="form.email"
                type="email"
                required
                placeholder="you@example.com"
                class="site-underline-input"
                :aria-invalid="Boolean(errors.email)"
              />
              <p v-if="errors.email" role="alert" class="mt-1 text-xs font-semibold text-[var(--site-terracotta)]">
                {{ errors.email }}
              </p>
            </div>

            <div>
              <label for="pe-phone" class="site-eyebrow text-[var(--site-green)] block mb-1">
                Contact Number *
              </label>
              <input
                id="pe-phone"
                v-model.trim="form.contactNumber"
                type="tel"
                required
                placeholder="e.g. 09XX XXX XXXX"
                class="site-underline-input"
                :aria-invalid="Boolean(errors.contactNumber)"
              />
              <p v-if="errors.contactNumber" role="alert" class="mt-1 text-xs font-semibold text-[var(--site-terracotta)]">
                {{ errors.contactNumber }}
              </p>
            </div>

            <div>
              <label for="pe-type" class="site-eyebrow text-[var(--site-green)] block mb-1">
                Event Type *
              </label>
              <select
                id="pe-type"
                v-model="form.eventType"
                class="site-underline-input cursor-pointer"
                :aria-invalid="Boolean(errors.eventType)"
              >
                <option value="">Select event type...</option>
                <option value="Birthday Dinner / Lunch">Birthday Dinner / Lunch</option>
                <option value="Family Reunion">Family Reunion</option>
                <option value="Baptismal / Dedication Lunch">Baptismal / Dedication Lunch</option>
                <option value="Anniversary Gathering">Anniversary Gathering</option>
                <option value="Corporate / Team Meal">Corporate / Team Meal</option>
                <option value="Other Celebration">Other Celebration</option>
              </select>
              <p v-if="errors.eventType" role="alert" class="mt-1 text-xs font-semibold text-[var(--site-terracotta)]">
                {{ errors.eventType }}
              </p>
            </div>

            <div>
              <label for="pe-date" class="site-eyebrow text-[var(--site-green)] block mb-1">
                Preferred Date *
              </label>
              <input
                id="pe-date"
                v-model="form.preferredDate"
                type="date"
                required
                class="site-underline-input"
                :aria-invalid="Boolean(errors.preferredDate)"
              />
              <p v-if="errors.preferredDate" role="alert" class="mt-1 text-xs font-semibold text-[var(--site-terracotta)]">
                {{ errors.preferredDate }}
              </p>
            </div>

            <div>
              <label for="pe-time" class="site-eyebrow text-[var(--site-green)] block mb-1">
                Preferred Time *
              </label>
              <select
                id="pe-time"
                v-model="form.preferredTime"
                class="site-underline-input cursor-pointer"
                :aria-invalid="Boolean(errors.preferredTime)"
              >
                <option value="">Select service window...</option>
                <option value="Lunch (11:30 AM – 2:30 PM)">Lunch (11:30 AM – 2:30 PM)</option>
                <option value="Merienda / Afternoon (3:00 PM – 5:30 PM)">Merienda / Afternoon (3:00 PM – 5:30 PM)</option>
                <option value="Dinner (6:00 PM – 9:00 PM)">Dinner (6:00 PM – 9:00 PM)</option>
              </select>
              <p v-if="errors.preferredTime" role="alert" class="mt-1 text-xs font-semibold text-[var(--site-terracotta)]">
                {{ errors.preferredTime }}
              </p>
            </div>

            <div>
              <label for="pe-guests" class="site-eyebrow text-[var(--site-green)] block mb-1">
                Number of Guests *
              </label>
              <input
                id="pe-guests"
                v-model="form.guestCount"
                type="number"
                min="2"
                max="300"
                required
                placeholder="e.g. 20"
                class="site-underline-input"
                :aria-invalid="Boolean(errors.guestCount)"
              />
              <p v-if="errors.guestCount" role="alert" class="mt-1 text-xs font-semibold text-[var(--site-terracotta)]">
                {{ errors.guestCount }}
              </p>
            </div>

            <div>
              <label for="pe-food" class="site-eyebrow text-[var(--site-green)] block mb-1">
                Food Preferences
              </label>
              <input
                id="pe-food"
                v-model.trim="form.foodPreferences"
                type="text"
                placeholder="e.g. Sinigang, Kare-Kare, Crispy Pata, Halo-Halo"
                class="site-underline-input"
              />
            </div>
          </div>

          <div>
            <label for="pe-notes" class="site-eyebrow text-[var(--site-green)] block mb-1">
              Additional Requests
            </label>
            <textarea
              id="pe-notes"
              v-model.trim="form.additionalRequests"
              rows="3"
              placeholder="High chairs, seating notes, dietary restrictions, or celebration details..."
              class="site-underline-input resize-y"
            />
          </div>

          <div class="flex flex-wrap items-center justify-between gap-4 pt-2">
            <p class="text-xs text-[var(--site-muted)]">
              * Required fields. Preview mode only until connected to your booking inbox.
            </p>
            <button
              type="submit"
              class="min-h-[52px] px-8 rounded-full bg-[var(--site-green)] hover:bg-[var(--site-green-hover)] text-[var(--site-cream)] text-sm font-bold uppercase tracking-[0.1em] inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Preview Event Inquiry</span>
              <BaseIcon name="chevron-right" :size="16" />
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- 5. PRIVATE EVENTS FAQS -->
    <section class="py-16 sm:py-20 border-t border-[var(--site-line)]">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 site-reveal">
        <div class="text-center space-y-2.5">
          <p class="site-eyebrow text-[var(--site-terracotta)]">Planning Details</p>
          <h2 class="site-display-lg text-[var(--site-green)]">Private Events FAQs</h2>
        </div>

        <SiteAccordion :items="PRIVATE_EVENT_FAQS" />
      </div>
    </section>
  </SiteLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { RESTAURANT_CONFIG } from '@/data/restaurant'
import { SITE_IMAGES } from '@/data/siteImages'
import { PRIVATE_EVENT_PACKAGES } from '@/data/packages'
import { PRIVATE_EVENT_FAQS } from '@/data/faqs'
import { useScrollReveal } from '@/composables/useScrollReveal'
import SiteLayout from '@/components/site/SiteLayout.vue'
import EditorialImage from '@/components/site/EditorialImage.vue'
import SiteIllustration from '@/components/site/SiteIllustration.vue'
import SiteAccordion from '@/components/site/SiteAccordion.vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'

useScrollReveal()

const eventGallery = [
  SITE_IMAGES.diningRoom,
  SITE_IMAGES.heroFeast,
  SITE_IMAGES.cateringSpread,
  SITE_IMAGES.crispyPata,
]

interface PrivateEventFormState {
  name: string
  email: string
  contactNumber: string
  eventType: string
  preferredDate: string
  preferredTime: string
  guestCount: string
  foodPreferences: string
  additionalRequests: string
}

const createInitial = (): PrivateEventFormState => ({
  name: '',
  email: '',
  contactNumber: '',
  eventType: '',
  preferredDate: '',
  preferredTime: '',
  guestCount: '',
  foodPreferences: '',
  additionalRequests: '',
})

const form = reactive<PrivateEventFormState>(createInitial())
const errors = reactive<Partial<Record<keyof PrivateEventFormState, string>>>({})
const submittedBooking = ref<PrivateEventFormState | null>(null)

const validate = (): boolean => {
  for (const key of Object.keys(errors) as (keyof PrivateEventFormState)[]) {
    delete errors[key]
  }
  if (!form.name) errors.name = 'Please enter your name.'
  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!form.contactNumber || form.contactNumber.length < 7) {
    errors.contactNumber = 'Please enter a valid contact number.'
  }
  if (!form.eventType) errors.eventType = 'Please choose an event type.'
  if (!form.preferredDate) errors.preferredDate = 'Please select a preferred date.'
  if (!form.preferredTime) errors.preferredTime = 'Please select a preferred time.'
  const guests = Number(form.guestCount)
  if (!form.guestCount || !Number.isFinite(guests) || guests < 2) {
    errors.guestCount = 'Please enter an estimated guest count (at least 2).'
  }
  return Object.keys(errors).length === 0
}

const handleSubmit = () => {
  if (!validate()) return
  submittedBooking.value = { ...form }
}

const resetForm = () => {
  Object.assign(form, createInitial())
  submittedBooking.value = null
}
</script>
