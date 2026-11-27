<template>
  <!-- Replaces Cabalar /food-truck: Hero + Packages + 3-Step Booking + Inquiry Form + Gallery + FAQs -->
  <SiteLayout surface="cream">
    <!-- 1. HERO SECTION -->
    <section class="pt-10 sm:pt-14 lg:pt-20 pb-12 sm:pb-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div class="max-w-4xl space-y-5">
          <p class="site-eyebrow text-[var(--site-terracotta)]">SERVIO Catering</p>
          <h1 class="site-display-hero text-[var(--site-green)]">
            Bring the Taste of Home to Your Celebration.
          </h1>
          <p class="site-body-lg text-[var(--site-muted)] max-w-[56ch]">
            Whether you are hosting an intimate birthday dinner at home, a family reunion, or an
            organized group celebration, SERVIO prepares generous Filipino spreads made for sharing.
          </p>
          <div class="flex flex-wrap gap-3.5 pt-1">
            <a
              href="#catering-form"
              class="min-h-[52px] px-7 rounded-full bg-[var(--site-green)] hover:bg-[var(--site-green-hover)] text-[var(--site-cream)] text-sm font-bold uppercase tracking-[0.09em] inline-flex items-center gap-2 transition-colors"
            >
              <span>Request a Catering Quote</span>
              <BaseIcon name="chevron-right" :size="16" />
            </a>
            <router-link
              to="/menu"
              class="min-h-[52px] px-7 rounded-full border-[1.5px] border-[var(--site-green)] text-[var(--site-green)] hover:bg-[var(--site-green)] hover:text-[var(--site-cream)] text-sm font-bold uppercase tracking-[0.09em] inline-flex items-center transition-colors"
            >
              Browse Sample Dishes
            </router-link>
          </div>
        </div>

        <div class="site-frame aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/9] w-full shadow-[var(--shadow-card)]">
          <EditorialImage :image="SITE_IMAGES.cateringSpread" eager />
        </div>
      </div>
    </section>

    <!-- 2. CONFIGURABLE CATERING PACKAGES -->
    <section class="py-16 sm:py-20 bg-[var(--site-sand)] border-y border-[var(--site-line)]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div class="site-reveal max-w-2xl space-y-3">
          <p class="site-eyebrow text-[var(--site-terracotta)]">Catering Packages</p>
          <h2 class="site-display-xl text-[var(--site-green)]">
            Thoughtful Spreads for Every Gathering Size.
          </h2>
          <p class="text-base text-[var(--site-muted)]">
            Each offering below is a flexible starting point — dish mixes, tray quantities, and
            pricing are confirmed together during planning.
          </p>
        </div>

        <div class="site-reveal grid grid-cols-1 lg:grid-cols-3 gap-6">
          <article
            v-for="pkg in CATERING_PACKAGES"
            :key="pkg.id"
            class="rounded-[1.5rem] bg-[var(--site-cream)] border border-[var(--site-line)] p-7 sm:p-8 flex flex-col justify-between gap-6"
          >
            <div class="space-y-4">
              <div class="flex items-center justify-between gap-2">
                <span class="font-mono text-2xl font-bold text-[var(--site-terracotta)]">
                  {{ pkg.number }}
                </span>
                <span class="px-3 py-1 rounded-full bg-[var(--site-sand)] text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--site-green)]">
                  Configurable
                </span>
              </div>

              <div class="space-y-2">
                <h3 class="site-display-md text-[var(--site-green)]">{{ pkg.name }}</h3>
                <p class="text-sm font-semibold text-[var(--site-terracotta)]">{{ pkg.idealFor }}</p>
                <p class="text-sm text-[var(--site-muted)] leading-relaxed">
                  {{ pkg.description }}
                </p>
              </div>

              <ul class="space-y-2 pt-2 border-t border-[var(--site-line)] text-sm text-[var(--site-charcoal)]">
                <li
                  v-for="hl in pkg.highlights"
                  :key="hl"
                  class="flex items-start gap-2.5"
                >
                  <span class="mt-0.5 w-5 h-5 rounded-full bg-[var(--site-green-soft)] text-[var(--site-green)] inline-flex items-center justify-center shrink-0">
                    <BaseIcon name="check" :size="12" />
                  </span>
                  <span>{{ hl }}</span>
                </li>
              </ul>
            </div>

            <div class="space-y-3 pt-2">
              <p class="text-xs text-[var(--site-muted)] leading-relaxed">
                {{ pkg.pricingNote }}
              </p>
              <button
                type="button"
                class="w-full min-h-[46px] px-5 rounded-full border-[1.5px] border-[var(--site-green)] text-[var(--site-green)] hover:bg-[var(--site-green)] hover:text-[var(--site-cream)] text-xs font-bold uppercase tracking-[0.1em] transition-colors cursor-pointer"
                @click="selectPackageAndScroll(pkg.name)"
              >
                Inquire About This Package
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 3. 3-STEP ILLUSTRATED BOOKING PROCESS (Cabalar /food-truck signature 3-col step row) -->
    <section class="py-16 sm:py-20 lg:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div class="site-reveal text-center max-w-2xl mx-auto space-y-3">
          <p class="site-eyebrow text-[var(--site-terracotta)]">How It Works</p>
          <h2 class="site-display-xl text-[var(--site-green)]">
            Three Simple Steps to Your Table.
          </h2>
        </div>

        <div class="site-reveal grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          <div
            v-for="step in CATERING_BOOKING_STEPS"
            :key="step.number"
            class="text-center md:text-left space-y-4 p-6 rounded-[1.5rem] border border-[var(--site-line)] bg-[var(--site-cream)]"
          >
            <div class="flex items-center justify-center md:justify-between gap-3">
              <SiteIllustration
                :kind="step.illustration"
                :size="60"
                custom-class="text-[var(--site-green)]"
              />
              <span class="site-eyebrow text-[var(--site-terracotta)]">{{ step.number }}</span>
            </div>
            <h3 class="site-display-md text-[var(--site-green)]">{{ step.title }}</h3>
            <p class="text-sm sm:text-base text-[var(--site-muted)] leading-relaxed">
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. CATERING INQUIRY FORM (Cabalar minimalist underline inputs + Demo Mode safeguard) -->
    <section
      id="catering-form"
      class="scroll-mt-24 py-16 sm:py-20 lg:py-24 border-y border-[var(--site-line)] bg-[var(--site-cream)]"
    >
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div class="space-y-3">
          <p class="site-eyebrow text-[var(--site-terracotta)]">Start Planning</p>
          <h2 class="site-display-xl text-[var(--site-green)]">
            Catering Inquiry Form
          </h2>
          <p class="text-base text-[var(--site-muted)] max-w-[58ch]">
            Share the details of your gathering below so we can prepare a tailored menu proposal.
          </p>
        </div>

        <!-- Explicit Demo Mode Notice -->
        <div class="rounded-[1rem] bg-[var(--site-sand)] border border-[var(--site-line)] px-4 py-3.5 flex items-start gap-3 text-xs sm:text-sm text-[var(--site-charcoal)]">
          <BaseIcon name="alert" :size="18" custom-class="text-[var(--site-terracotta)] shrink-0 mt-0.5" />
          <p>{{ RESTAURANT_CONFIG.forms.demoNotice }}</p>
        </div>

        <!-- Demo Submission Receipt -->
        <div
          v-if="submittedSummary"
          role="status"
          aria-live="polite"
          class="rounded-[1.5rem] bg-[var(--site-green)] text-[var(--site-cream)] p-7 sm:p-9 space-y-5"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="space-y-1">
              <p class="site-eyebrow text-[var(--site-gold)]">Demo Inquiry Preview Recorded</p>
              <h3 class="site-display-md text-[var(--site-cream)]">
                Thank you, {{ submittedSummary.fullName }}!
              </h3>
            </div>
            <span class="px-3 py-1 rounded-full bg-[var(--site-cream)]/15 text-xs font-bold uppercase tracking-[0.08em]">
              Demo Mode
            </span>
          </div>

          <p class="text-sm text-[var(--site-cream)]/85 leading-relaxed">
            Your catering inquiry passed all validations and is previewed below. Because no email
            backend is connected yet, this request was <strong>not transmitted</strong> to an inbox.
          </p>

          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm pt-3 border-t border-[var(--site-cream)]/20">
            <div><dt class="text-xs text-[var(--site-gold)] uppercase">Package</dt><dd class="font-semibold">{{ submittedSummary.preferredPackage }}</dd></div>
            <div><dt class="text-xs text-[var(--site-gold)] uppercase">Event Type &amp; Date</dt><dd class="font-semibold">{{ submittedSummary.eventType }} · {{ submittedSummary.eventDate }}</dd></div>
            <div><dt class="text-xs text-[var(--site-gold)] uppercase">Expected Guests</dt><dd class="font-semibold">{{ submittedSummary.guestCount }} guests</dd></div>
            <div><dt class="text-xs text-[var(--site-gold)] uppercase">Service Type</dt><dd class="font-semibold">{{ submittedSummary.fulfillmentType }}</dd></div>
            <div><dt class="text-xs text-[var(--site-gold)] uppercase">Contact</dt><dd class="font-semibold">{{ submittedSummary.contactNumber }} · {{ submittedSummary.email }}</dd></div>
            <div v-if="submittedSummary.eventLocation"><dt class="text-xs text-[var(--site-gold)] uppercase">Location</dt><dd class="font-semibold">{{ submittedSummary.eventLocation }}</dd></div>
          </dl>

          <div class="pt-2">
            <button
              type="button"
              class="min-h-[46px] px-6 rounded-full bg-[var(--site-cream)] text-[var(--site-green)] text-xs font-bold uppercase tracking-[0.1em] hover:bg-[var(--site-sand)] transition-colors cursor-pointer"
              @click="resetForm"
            >
              Submit Another Demo Inquiry
            </button>
          </div>
        </div>

        <!-- 10-Field Validated Form -->
        <form v-else class="space-y-8" novalidate @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label for="cat-name" class="site-eyebrow text-[var(--site-green)] block mb-1">
                Full Name *
              </label>
              <input
                id="cat-name"
                v-model.trim="form.fullName"
                type="text"
                required
                placeholder="Your full name"
                class="site-underline-input"
                :aria-invalid="Boolean(errors.fullName)"
              />
              <p v-if="errors.fullName" role="alert" class="mt-1 text-xs font-semibold text-[var(--site-terracotta)]">
                {{ errors.fullName }}
              </p>
            </div>

            <div>
              <label for="cat-phone" class="site-eyebrow text-[var(--site-green)] block mb-1">
                Contact Number *
              </label>
              <input
                id="cat-phone"
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
              <label for="cat-email" class="site-eyebrow text-[var(--site-green)] block mb-1">
                Email Address *
              </label>
              <input
                id="cat-email"
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
              <label for="cat-event-type" class="site-eyebrow text-[var(--site-green)] block mb-1">
                Event Type *
              </label>
              <select
                id="cat-event-type"
                v-model="form.eventType"
                class="site-underline-input cursor-pointer"
                :aria-invalid="Boolean(errors.eventType)"
              >
                <option value="">Select an occasion...</option>
                <option value="Birthday Celebration">Birthday Celebration</option>
                <option value="Family Reunion">Family Reunion</option>
                <option value="Anniversary / Milestone">Anniversary / Milestone</option>
                <option value="Office / Team Gathering">Office / Team Gathering</option>
                <option value="Holiday / Fiesta Spread">Holiday / Fiesta Spread</option>
                <option value="Other Gathering">Other Gathering</option>
              </select>
              <p v-if="errors.eventType" role="alert" class="mt-1 text-xs font-semibold text-[var(--site-terracotta)]">
                {{ errors.eventType }}
              </p>
            </div>

            <div>
              <label for="cat-date" class="site-eyebrow text-[var(--site-green)] block mb-1">
                Event Date *
              </label>
              <input
                id="cat-date"
                v-model="form.eventDate"
                type="date"
                required
                class="site-underline-input"
                :aria-invalid="Boolean(errors.eventDate)"
              />
              <p v-if="errors.eventDate" role="alert" class="mt-1 text-xs font-semibold text-[var(--site-terracotta)]">
                {{ errors.eventDate }}
              </p>
            </div>

            <div>
              <label for="cat-guests" class="site-eyebrow text-[var(--site-green)] block mb-1">
                Estimated Number of Guests *
              </label>
              <input
                id="cat-guests"
                v-model="form.guestCount"
                type="number"
                min="1"
                max="1000"
                required
                placeholder="e.g. 25"
                class="site-underline-input"
                :aria-invalid="Boolean(errors.guestCount)"
              />
              <p v-if="errors.guestCount" role="alert" class="mt-1 text-xs font-semibold text-[var(--site-terracotta)]">
                {{ errors.guestCount }}
              </p>
            </div>

            <div>
              <label for="cat-package" class="site-eyebrow text-[var(--site-green)] block mb-1">
                Preferred Package *
              </label>
              <select
                id="cat-package"
                v-model="form.preferredPackage"
                class="site-underline-input cursor-pointer"
                :aria-invalid="Boolean(errors.preferredPackage)"
              >
                <option value="">Choose a starting package...</option>
                <option v-for="pkg in CATERING_PACKAGES" :key="pkg.id" :value="pkg.name">
                  {{ pkg.name }}
                </option>
                <option value="Custom Tray & Bilao Mix">Custom Tray &amp; Bilao Mix</option>
              </select>
              <p v-if="errors.preferredPackage" role="alert" class="mt-1 text-xs font-semibold text-[var(--site-terracotta)]">
                {{ errors.preferredPackage }}
              </p>
            </div>

            <div>
              <span class="site-eyebrow text-[var(--site-green)] block mb-2">
                Delivery or Pickup *
              </span>
              <div class="flex items-center gap-3">
                <button
                  v-for="mode in (['Delivery', 'Pickup'] as const)"
                  :key="mode"
                  type="button"
                  class="flex-1 min-h-[44px] px-4 rounded-full border-[1.5px] text-xs font-bold uppercase tracking-[0.08em] transition-colors cursor-pointer"
                  :class="
                    form.fulfillmentType === mode
                      ? 'bg-[var(--site-green)] text-[var(--site-cream)] border-[var(--site-green)]'
                      : 'border-[var(--site-line)] text-[var(--site-charcoal)] hover:border-[var(--site-green)]'
                  "
                  @click="form.fulfillmentType = mode"
                >
                  {{ mode }}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label for="cat-location" class="site-eyebrow text-[var(--site-green)] block mb-1">
              Event Location {{ form.fulfillmentType === 'Delivery' ? '*' : '(Optional for Pickup)' }}
            </label>
            <input
              id="cat-location"
              v-model.trim="form.eventLocation"
              type="text"
              placeholder="Venue name, barangay, or city"
              class="site-underline-input"
              :aria-invalid="Boolean(errors.eventLocation)"
            />
            <p v-if="errors.eventLocation" role="alert" class="mt-1 text-xs font-semibold text-[var(--site-terracotta)]">
              {{ errors.eventLocation }}
            </p>
          </div>

          <div>
            <label for="cat-notes" class="site-eyebrow text-[var(--site-green)] block mb-1">
              Additional Requests &amp; Dish Preferences
            </label>
            <textarea
              id="cat-notes"
              v-model.trim="form.additionalRequests"
              rows="3"
              placeholder="Tell us about favorite viands, spice notes, dietary requests, or preferred serving time..."
              class="site-underline-input resize-y"
            />
          </div>

          <div class="flex flex-wrap items-center justify-between gap-4 pt-2">
            <p class="text-xs text-[var(--site-muted)]">
              * Required fields. Demo validation preview only — no external email is sent.
            </p>
            <button
              type="submit"
              class="min-h-[52px] px-8 rounded-full bg-[var(--site-green)] hover:bg-[var(--site-green-hover)] text-[var(--site-cream)] text-sm font-bold uppercase tracking-[0.1em] inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Preview Catering Inquiry</span>
              <BaseIcon name="chevron-right" :size="16" />
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- 5. EVENT GALLERY CAROUSEL -->
    <section class="py-16 sm:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div class="space-y-2">
            <p class="site-eyebrow text-[var(--site-terracotta)]">From Our Celebration Tables</p>
            <h2 class="site-display-lg text-[var(--site-green)]">A Look at SERVIO Spreads.</h2>
          </div>

          <div class="flex items-center gap-2.5">
            <button
              type="button"
              class="w-11 h-11 rounded-full border-[1.5px] border-[var(--site-green)] text-[var(--site-green)] hover:bg-[var(--site-green)] hover:text-[var(--site-cream)] inline-flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Previous catering photo"
              @click="galleryIndex = (galleryIndex - 1 + gallerySlides.length) % gallerySlides.length"
            >
              <BaseIcon name="chevron-right" :size="16" custom-class="rotate-180" />
            </button>
            <button
              type="button"
              class="w-11 h-11 rounded-full border-[1.5px] border-[var(--site-green)] text-[var(--site-green)] hover:bg-[var(--site-green)] hover:text-[var(--site-cream)] inline-flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Next catering photo"
              @click="galleryIndex = (galleryIndex + 1) % gallerySlides.length"
            >
              <BaseIcon name="chevron-right" :size="16" />
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div class="md:col-span-8 site-frame aspect-[16/10] shadow-[var(--shadow-card)]">
            <EditorialImage :image="gallerySlides[galleryIndex]" />
          </div>
          <div class="md:col-span-4 space-y-4">
            <div class="site-frame aspect-[4/3] opacity-90">
              <EditorialImage :image="gallerySlides[(galleryIndex + 1) % gallerySlides.length]" />
            </div>
            <p class="text-sm text-[var(--site-muted)] leading-relaxed">
              {{ gallerySlides[galleryIndex].alt }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. CATERING FAQS -->
    <section class="py-16 sm:py-20 border-t border-[var(--site-line)]">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 site-reveal">
        <div class="text-center space-y-2.5">
          <p class="site-eyebrow text-[var(--site-terracotta)]">Questions Answered</p>
          <h2 class="site-display-lg text-[var(--site-green)]">Catering FAQs</h2>
        </div>

        <SiteAccordion :items="cateringFaqItems" />
      </div>
    </section>
  </SiteLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { RESTAURANT_CONFIG } from '@/data/restaurant'
import { SITE_IMAGES } from '@/data/siteImages'
import { CATERING_PACKAGES, CATERING_BOOKING_STEPS } from '@/data/packages'
import { FAQ_CATEGORIES } from '@/data/faqs'
import { useScrollReveal } from '@/composables/useScrollReveal'
import SiteLayout from '@/components/site/SiteLayout.vue'
import EditorialImage from '@/components/site/EditorialImage.vue'
import SiteIllustration from '@/components/site/SiteIllustration.vue'
import SiteAccordion from '@/components/site/SiteAccordion.vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'

useScrollReveal()

const cateringFaqItems = FAQ_CATEGORIES.find((c) => c.id === 'catering-events')?.items ?? []

const gallerySlides = [
  SITE_IMAGES.cateringSpread,
  SITE_IMAGES.heroFeast,
  SITE_IMAGES.crispyPata,
  SITE_IMAGES.pancit,
  SITE_IMAGES.chickenInasal,
]
const galleryIndex = ref(0)

interface CateringFormState {
  fullName: string
  contactNumber: string
  email: string
  eventType: string
  eventDate: string
  guestCount: string
  preferredPackage: string
  fulfillmentType: 'Delivery' | 'Pickup'
  eventLocation: string
  additionalRequests: string
}

const createInitialForm = (): CateringFormState => ({
  fullName: '',
  contactNumber: '',
  email: '',
  eventType: '',
  eventDate: '',
  guestCount: '',
  preferredPackage: '',
  fulfillmentType: 'Delivery',
  eventLocation: '',
  additionalRequests: '',
})

const form = reactive<CateringFormState>(createInitialForm())
const errors = reactive<Partial<Record<keyof CateringFormState, string>>>({})
const submittedSummary = ref<CateringFormState | null>(null)

const selectPackageAndScroll = (pkgName: string) => {
  submittedSummary.value = null
  form.preferredPackage = pkgName
  const el = document.getElementById('catering-form')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const validate = (): boolean => {
  for (const key of Object.keys(errors) as (keyof CateringFormState)[]) {
    delete errors[key]
  }
  if (!form.fullName) errors.fullName = 'Please enter your full name.'
  if (!form.contactNumber || form.contactNumber.length < 7) {
    errors.contactNumber = 'Please enter a valid contact number.'
  }
  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!form.eventType) errors.eventType = 'Please select an event type.'
  if (!form.eventDate) errors.eventDate = 'Please choose an event date.'
  const guests = Number(form.guestCount)
  if (!form.guestCount || !Number.isFinite(guests) || guests < 1) {
    errors.guestCount = 'Please enter an estimated guest count.'
  }
  if (!form.preferredPackage) errors.preferredPackage = 'Please choose a preferred package.'
  if (form.fulfillmentType === 'Delivery' && !form.eventLocation) {
    errors.eventLocation = 'Please enter an event location for delivery.'
  }
  return Object.keys(errors).length === 0
}

const handleSubmit = () => {
  if (!validate()) return
  submittedSummary.value = { ...form }
}

const resetForm = () => {
  Object.assign(form, createInitialForm())
  submittedSummary.value = null
}
</script>
