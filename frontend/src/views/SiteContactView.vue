<template>
  <!-- Echoes Cabalar /contact: minimalist underline-input form paired with clean editorial info & directions -->
  <SiteLayout surface="cream">
    <!-- HERO -->
    <section class="pt-10 sm:pt-14 lg:pt-20 pb-10 sm:pb-14">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <p class="site-eyebrow text-[var(--site-terracotta)]">Get in Touch</p>
        <h1 class="site-display-hero text-[var(--site-green)] max-w-4xl">
          We'd Love to Hear from You.
        </h1>
        <p class="site-body-lg text-[var(--site-muted)] max-w-[54ch]">
          Have a question about our Filipino classics, family seating, catering spreads, or private
          celebrations? Send us a note or check our editable restaurant details below.
        </p>
      </div>
    </section>

    <!-- MAIN SPLIT: CONTACT FORM + RESTAURANT INFO -->
    <section class="py-8 sm:py-12 lg:py-16 border-t border-[var(--site-line)]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
        <!-- Left: 5-Field Editorial Contact Form -->
        <div class="lg:col-span-7 space-y-7">
          <div class="space-y-2">
            <p class="site-eyebrow text-[var(--site-terracotta)]">Send a Message</p>
            <h2 class="site-display-lg text-[var(--site-green)]">Write to SERVIO</h2>
          </div>

          <div class="rounded-[1rem] bg-[var(--site-sand)] border border-[var(--site-line)] px-4 py-3.5 flex items-start gap-3 text-xs sm:text-sm text-[var(--site-charcoal)]">
            <BaseIcon name="alert" :size="18" custom-class="text-[var(--site-terracotta)] shrink-0 mt-0.5" />
            <p>{{ RESTAURANT_CONFIG.forms.demoNotice }}</p>
          </div>

          <!-- Demo Message Preview Receipt -->
          <div
            v-if="submittedMessage"
            role="status"
            aria-live="polite"
            class="rounded-[1.5rem] bg-[var(--site-green)] text-[var(--site-cream)] p-7 sm:p-8 space-y-5"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="space-y-1">
                <p class="site-eyebrow text-[var(--site-gold)]">Demo Message Preview</p>
                <h3 class="site-display-md text-[var(--site-cream)]">
                  Thank you, {{ submittedMessage.fullName }}.
                </h3>
              </div>
              <span class="px-3 py-1 rounded-full bg-[var(--site-cream)]/15 text-xs font-bold uppercase tracking-[0.08em]">
                Demo Mode
              </span>
            </div>

            <p class="text-sm text-[var(--site-cream)]/85 leading-relaxed">
              Your message passed all validations and is shown below as a local preview. No email
              has been transmitted because a mail service is not connected yet.
            </p>

            <div class="rounded-[1rem] bg-[var(--site-cream)]/10 p-4 space-y-2 text-sm">
              <p><strong class="text-[var(--site-gold)]">Subject:</strong> {{ submittedMessage.subject }}</p>
              <p><strong class="text-[var(--site-gold)]">Reply To:</strong> {{ submittedMessage.email }} · {{ submittedMessage.contactNumber }}</p>
              <p class="whitespace-pre-line text-[var(--site-cream)]/90 pt-1">{{ submittedMessage.message }}</p>
            </div>

            <button
              type="button"
              class="min-h-[46px] px-6 rounded-full bg-[var(--site-cream)] text-[var(--site-green)] text-xs font-bold uppercase tracking-[0.1em] hover:bg-[var(--site-sand)] transition-colors cursor-pointer"
              @click="resetForm"
            >
              Send Another Demo Message
            </button>
          </div>

          <form v-else class="space-y-7" novalidate @submit.prevent="handleSubmit">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label for="contact-name" class="site-eyebrow text-[var(--site-green)] block mb-1">
                  Full Name *
                </label>
                <input
                  id="contact-name"
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
                <label for="contact-email" class="site-eyebrow text-[var(--site-green)] block mb-1">
                  Email Address *
                </label>
                <input
                  id="contact-email"
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
                <label for="contact-phone" class="site-eyebrow text-[var(--site-green)] block mb-1">
                  Contact Number *
                </label>
                <input
                  id="contact-phone"
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
                <label for="contact-subject" class="site-eyebrow text-[var(--site-green)] block mb-1">
                  Subject *
                </label>
                <select
                  id="contact-subject"
                  v-model="form.subject"
                  class="site-underline-input cursor-pointer"
                  :aria-invalid="Boolean(errors.subject)"
                >
                  <option value="">Choose a topic...</option>
                  <option value="General Dining Inquiry">General Dining Inquiry</option>
                  <option value="Menu & Allergen Question">Menu &amp; Allergen Question</option>
                  <option value="Catering & Food Trays">Catering &amp; Food Trays</option>
                  <option value="Private Family Event">Private Family Event</option>
                  <option value="Guest Feedback">Guest Feedback</option>
                </select>
                <p v-if="errors.subject" role="alert" class="mt-1 text-xs font-semibold text-[var(--site-terracotta)]">
                  {{ errors.subject }}
                </p>
              </div>
            </div>

            <div>
              <label for="contact-message" class="site-eyebrow text-[var(--site-green)] block mb-1">
                Message *
              </label>
              <textarea
                id="contact-message"
                v-model.trim="form.message"
                rows="4"
                required
                placeholder="Tell us how we can help..."
                class="site-underline-input resize-y"
                :aria-invalid="Boolean(errors.message)"
              />
              <p v-if="errors.message" role="alert" class="mt-1 text-xs font-semibold text-[var(--site-terracotta)]">
                {{ errors.message }}
              </p>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-4 pt-1">
              <p class="text-xs text-[var(--site-muted)]">
                * Required fields. Demo form preview only.
              </p>
              <button
                type="submit"
                class="min-h-[52px] px-8 rounded-full bg-[var(--site-green)] hover:bg-[var(--site-green-hover)] text-[var(--site-cream)] text-sm font-bold uppercase tracking-[0.1em] inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Preview Message</span>
                <BaseIcon name="chevron-right" :size="16" />
              </button>
            </div>
          </form>
        </div>

        <!-- Right: Editable Restaurant Information Panel -->
        <aside class="lg:col-span-5 rounded-[1.75rem] bg-[var(--site-sand)] border border-[var(--site-line)] p-7 sm:p-9 space-y-7">
          <div class="flex items-center justify-between gap-3 pb-4 border-b border-[var(--site-line)]">
            <span
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-[0.09em]"
              :class="
                openStatus.isOpen
                  ? 'bg-[var(--site-green)] text-[var(--site-cream)]'
                  : 'bg-[var(--site-terracotta)] text-[var(--site-cream)]'
              "
            >
              <span
                class="w-2 h-2 rounded-full"
                :class="openStatus.isOpen ? 'bg-[var(--site-gold)]' : 'bg-[var(--site-cream)]'"
                aria-hidden="true"
              />
              {{ openStatus.label }}
            </span>
            <span class="text-xs font-semibold text-[var(--site-muted)]">Manila Time</span>
          </div>

          <div class="space-y-1.5">
            <p class="site-eyebrow text-[var(--site-terracotta)]">Address (Editable)</p>
            <p class="text-base font-bold text-[var(--site-charcoal)]">
              {{ RESTAURANT_CONFIG.contact.addressLine1 }}
            </p>
            <p class="text-sm text-[var(--site-muted)]">
              {{ RESTAURANT_CONFIG.contact.addressLine2 }}
            </p>
          </div>

          <div class="space-y-1.5">
            <p class="site-eyebrow text-[var(--site-terracotta)]">Phone &amp; Email (Editable)</p>
            <p class="text-sm font-semibold text-[var(--site-charcoal)]">
              {{ RESTAURANT_CONFIG.contact.phone }}
            </p>
            <p class="text-sm font-semibold text-[var(--site-charcoal)]">
              {{ RESTAURANT_CONFIG.contact.email }}
            </p>
          </div>

          <div class="space-y-2.5">
            <p class="site-eyebrow text-[var(--site-terracotta)]">Sample Operating Hours</p>
            <dl class="space-y-2 text-sm">
              <div
                v-for="row in RESTAURANT_CONFIG.operatingHours"
                :key="row.days"
                class="flex items-baseline justify-between gap-3 pb-1.5 border-b border-[var(--site-line)]/70"
              >
                <dt class="font-bold text-[var(--site-charcoal)]">{{ row.days }}</dt>
                <dd
                  class="text-right"
                  :class="row.isClosed ? 'text-[var(--site-terracotta)] font-semibold' : 'text-[var(--site-muted)]'"
                >
                  {{ row.hours }}
                </dd>
              </div>
            </dl>
            <p class="text-xs text-[var(--site-muted)]">{{ RESTAURANT_CONFIG.hoursNote }}</p>
          </div>

          <div class="space-y-2.5 pt-1">
            <p class="site-eyebrow text-[var(--site-terracotta)]">Social Channels (Placeholders)</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="soc in RESTAURANT_CONFIG.social"
                :key="soc.platform"
                class="px-3.5 py-1.5 rounded-full bg-[var(--site-cream)] border border-[var(--site-line)] text-xs font-bold text-[var(--site-green)]"
                :title="soc.placeholderNote"
              >
                {{ soc.platform }} · {{ soc.handle }}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <!-- MAP EMBED PLACEHOLDER & DIRECTIONS SECTION -->
    <section id="directions" class="scroll-mt-28 py-16 sm:py-20 border-t border-[var(--site-line)]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div class="space-y-2">
            <p class="site-eyebrow text-[var(--site-terracotta)]">Find SERVIO</p>
            <h2 class="site-display-lg text-[var(--site-green)]">Directions &amp; Location Map</h2>
          </div>

          <a
            v-if="RESTAURANT_CONFIG.contact.directionsUrl"
            :href="RESTAURANT_CONFIG.contact.directionsUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="min-h-[46px] px-6 rounded-full bg-[var(--site-green)] hover:bg-[var(--site-green-hover)] text-[var(--site-cream)] text-xs font-bold uppercase tracking-[0.1em] inline-flex items-center gap-2 self-start sm:self-end transition-colors"
          >
            <span>Open in Google Maps</span>
            <BaseIcon name="chevron-right" :size="15" />
          </a>
        </div>

        <!-- Honest Map Embed Placeholder (Never invents fake GPS coordinates) -->
        <div class="rounded-[1.75rem] bg-[var(--site-sand)] border border-dashed border-[var(--site-green)]/45 p-8 sm:p-14 text-center space-y-4">
          <div class="inline-flex justify-center">
            <SiteIllustration kind="open-lantern" :size="58" custom-class="text-[var(--site-green)]" />
          </div>
          <p class="site-eyebrow text-[var(--site-terracotta)]">Google Maps Embed Placeholder</p>
          <p class="font-display text-xl sm:text-2xl font-bold text-[var(--site-green)] max-w-[36ch] mx-auto">
            {{ RESTAURANT_CONFIG.contact.addressLine1 }} · {{ RESTAURANT_CONFIG.contact.addressLine2 }}
          </p>
          <p class="text-sm text-[var(--site-muted)] max-w-[54ch] mx-auto leading-relaxed">
            {{ RESTAURANT_CONFIG.contact.mapEmbedLabel }}
          </p>
          <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
            <router-link
              to="/menu"
              class="min-h-[46px] px-6 rounded-full border-[1.5px] border-[var(--site-green)] text-[var(--site-green)] hover:bg-[var(--site-green)] hover:text-[var(--site-cream)] text-xs font-bold uppercase tracking-[0.1em] inline-flex items-center transition-colors"
            >
              View Our Menu
            </router-link>
            <router-link
              to="/order"
              class="min-h-[46px] px-6 rounded-full bg-[var(--site-green)] hover:bg-[var(--site-green-hover)] text-[var(--site-cream)] text-xs font-bold uppercase tracking-[0.1em] inline-flex items-center gap-2 transition-colors"
            >
              <span>Order Online</span>
              <BaseIcon name="chevron-right" :size="15" />
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </SiteLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { RESTAURANT_CONFIG, getManilaOpenStatus } from '@/data/restaurant'
import SiteLayout from '@/components/site/SiteLayout.vue'
import SiteIllustration from '@/components/site/SiteIllustration.vue'
import BaseIcon from '@/components/icons/BaseIcon.vue'

const openStatus = getManilaOpenStatus()

interface ContactFormState {
  fullName: string
  email: string
  contactNumber: string
  subject: string
  message: string
}

const createInitial = (): ContactFormState => ({
  fullName: '',
  email: '',
  contactNumber: '',
  subject: '',
  message: '',
})

const form = reactive<ContactFormState>(createInitial())
const errors = reactive<Partial<Record<keyof ContactFormState, string>>>({})
const submittedMessage = ref<ContactFormState | null>(null)

const validate = (): boolean => {
  for (const key of Object.keys(errors) as (keyof ContactFormState)[]) {
    delete errors[key]
  }
  if (!form.fullName) errors.fullName = 'Please enter your full name.'
  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!form.contactNumber || form.contactNumber.length < 7) {
    errors.contactNumber = 'Please enter a valid contact number.'
  }
  if (!form.subject) errors.subject = 'Please select a subject.'
  if (!form.message || form.message.length < 8) {
    errors.message = 'Please write a short message (at least 8 characters).'
  }
  return Object.keys(errors).length === 0
}

const handleSubmit = () => {
  if (!validate()) return
  submittedMessage.value = { ...form }
}

const resetForm = () => {
  Object.assign(form, createInitial())
  submittedMessage.value = null
}
</script>
