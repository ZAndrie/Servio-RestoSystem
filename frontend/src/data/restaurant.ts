/**
 * Centralized Restaurant Configuration for SERVIO
 * All contact details, addresses, hours, and social handles are clearly marked
 * editable placeholders until confirmed business details are supplied.
 */

export interface OperatingHourRow {
  days: string
  hours: string
  openDays: number[] // 0 = Sun, 1 = Mon ... 6 = Sat
  openHour: number // 24h Manila time
  closeHour: number
  isClosed?: boolean
}

export interface SocialLinkItem {
  platform: 'Instagram' | 'Facebook' | 'TikTok'
  handle: string
  placeholderNote: string
  url: string | null // Set to real https:// URL once connected
}

export const RESTAURANT_CONFIG = {
  name: 'SERVIO',
  taglinePrimary: 'Made with Heart. Served Like Home.',
  taglineSupporting:
    'Bringing the comfort of Filipino home cooking to every table, one meaningful meal at a time.',
  taglineSecondary: 'Good food. Warm hearts. Together at SERVIO.',
  shortDescription:
    'A Filipino home-style family restaurant built around generational recipes, generous shared meals, and genuine Filipino hospitality.',

  // Clearly marked editable placeholders (never presented as fabricated facts)
  contact: {
    addressLine1: '[Editable Street Address Placeholder]',
    addressLine2: '[Editable City / Province, Philippines]',
    phone: '[Editable Phone Number Placeholder]',
    email: '[Editable Email Address Placeholder]',
    directionsUrl: null as string | null, // Add official Google Maps link when confirmed
    mapEmbedLabel: 'Map Embed Placeholder — Add your Google Maps location URL in src/data/restaurant.ts',
  },

  // Configurable operating hours (Asia/Manila time)
  hoursNote: 'Sample operating hours shown below — update in src/data/restaurant.ts before launch.',
  operatingHours: [
    {
      days: 'Tuesday – Friday',
      hours: '11:00 AM – 9:00 PM',
      openDays: [2, 3, 4, 5],
      openHour: 11,
      closeHour: 21,
    },
    {
      days: 'Saturday – Sunday',
      hours: '10:30 AM – 9:30 PM',
      openDays: [0, 6],
      openHour: 10.5,
      closeHour: 21.5,
    },
    {
      days: 'Monday',
      hours: 'Closed (Kitchen Prep & Rest)',
      openDays: [1],
      openHour: 0,
      closeHour: 0,
      isClosed: true,
    },
  ] as OperatingHourRow[],

  serviceModes: [
    {
      label: 'Dine-In',
      detail: 'Family tables & group gatherings welcome (walk-ins and advance reservations configurable).',
      available: true,
    },
    {
      label: 'Takeout & Pickup',
      detail: 'Order ahead online and pick up warm at our front counter.',
      available: true,
    },
    {
      label: 'Local Delivery',
      detail: 'Configurable delivery zone & courier dispatch (Demo mode active until connected).',
      available: true,
    },
  ],

  social: [
    {
      platform: 'Instagram',
      handle: '@servio.placeholder',
      placeholderNote: 'Connect your official Instagram URL in src/data/restaurant.ts',
      url: null,
    },
    {
      platform: 'Facebook',
      handle: 'SERVIO Family Restaurant (Placeholder)',
      placeholderNote: 'Connect your official Facebook Page URL in src/data/restaurant.ts',
      url: null,
    },
    {
      platform: 'TikTok',
      handle: '@serviokitchen.placeholder',
      placeholderNote: 'Connect your official TikTok URL in src/data/restaurant.ts',
      url: null,
    },
  ] as SocialLinkItem[],

  ordering: {
    isDemoMode: true,
    demoNotice:
      'Demo Ordering Mode: No live payment gateway or backend order dispatch is connected yet. Submitted orders are previewed locally so you can test the full checkout flow safely.',
    paymentMethods: [
      { id: 'cash', label: 'Cash on Pickup / Delivery', note: 'Pay directly when receiving your meal.' },
      { id: 'gcash', label: 'GCash (Configurable)', note: 'Connect official merchant QR or gateway before launch.' },
      { id: 'card', label: 'Debit / Credit Card (Configurable)', note: 'Connect payment processor before launch.' },
    ],
  },

  forms: {
    isDemoMode: true,
    demoNotice:
      'Demo Form Mode: No email service or CRM backend is configured yet. Validations run live, and your inquiry is previewed locally rather than transmitted.',
  },

  privacySummary: [
    'SERVIO only collects contact and order details you explicitly enter into inquiry or checkout forms to respond to requests and fulfill restaurant orders.',
    'While running in demo mode, no form submissions or payment details are transmitted to third-party servers.',
    'Replace this placeholder policy with your official restaurant Privacy Policy before publishing live.',
  ],
}

export function getManilaOpenStatus(): { isOpen: boolean; label: string; detail: string } {
  try {
    const now = new Date()
    const dayStr = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Manila',
      weekday: 'short',
    }).format(now)
    const hourParts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Manila',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).formatToParts(now)
    const hour = Number(hourParts.find((p) => p.type === 'hour')?.value ?? '12') % 24
    const minute = Number(hourParts.find((p) => p.type === 'minute')?.value ?? '0')
    const decimalHour = hour + minute / 60

    const dayMap: Record<string, number> = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    }
    const dayIdx = dayMap[dayStr] ?? 2
    const schedule = RESTAURANT_CONFIG.operatingHours.find((row) => row.openDays.includes(dayIdx))

    if (!schedule || schedule.isClosed) {
      return {
        isOpen: false,
        label: "Sorry, We're Resting Today",
        detail: 'Kitchen reopens Tuesday at 11:00 AM (Sample Hours · Manila Time)',
      }
    }

    if (decimalHour >= schedule.openHour && decimalHour < schedule.closeHour) {
      return {
        isOpen: true,
        label: 'The Kitchen Is Open',
        detail: `Serving today ${schedule.hours} (Sample Hours · Manila Time)`,
      }
    }

    return {
      isOpen: false,
      label: 'Currently Closed',
      detail: `Next service: ${schedule.days} · ${schedule.hours} (Sample Hours)`,
    }
  } catch {
    return {
      isOpen: true,
      label: 'Warm Meals Await',
      detail: 'See sample operating hours below.',
    }
  }
}
