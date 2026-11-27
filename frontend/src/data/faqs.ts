export interface FaqItem {
  id: string
  question: string
  answer: string
}

export interface FaqCategory {
  id: 'general' | 'menu-food' | 'orders-payments' | 'catering-events'
  title: string
  items: FaqItem[]
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'general',
    title: 'General',
    items: [
      {
        id: 'gen-location',
        question: 'Where is SERVIO located?',
        answer:
          'Editable placeholder: Update your exact street address, nearby landmark, and parking guidance in src/data/restaurant.ts once finalized.',
      },
      {
        id: 'gen-hours',
        question: 'What are your operating hours?',
        answer:
          'Sample operating hours are currently listed on our Homepage and Contact page (Tuesday–Sunday, closed Mondays for prep). Update src/data/restaurant.ts to reflect your confirmed restaurant schedule.',
      },
      {
        id: 'gen-walkins',
        question: 'Do you accept walk-in customers?',
        answer:
          'Walk-in guests are warmly welcomed as tables are available. For larger family groups, please check our Private Events or Contact page so we can prepare seating comfortably.',
      },
      {
        id: 'gen-reservations',
        question: 'Do you accept reservations?',
        answer:
          'Editable policy placeholder: Confirm whether SERVIO accepts advance table reservations for all party sizes or specifically for larger family gatherings.',
      },
      {
        id: 'gen-family',
        question: 'Is SERVIO family-friendly?',
        answer:
          'Yes — SERVIO is designed from the ground up as a welcoming Filipino family restaurant with sharing-sized dishes, approachable flavors for all ages, and warm hospitality.',
      },
      {
        id: 'gen-takeout',
        question: 'Do you offer takeout?',
        answer:
          'Yes, dishes can be ordered for counter pickup through our Online Ordering page (currently running in demo preview mode until connected to live order dispatch).',
      },
      {
        id: 'gen-delivery',
        question: 'Do you offer delivery?',
        answer:
          'Editable policy placeholder: Delivery availability, coverage areas, and fees will be confirmed here once SERVIO connects its local delivery partner or in-house rider service.',
      },
    ],
  },
  {
    id: 'menu-food',
    title: 'Menu and Food',
    items: [
      {
        id: 'menu-dishes',
        question: 'What Filipino dishes do you serve?',
        answer:
          'Our sample menu highlights comforting Filipino classics — including Adobo, Sinigang na Baboy, Beef Kare-Kare, Chicken Inasal, Crispy Pata, Pancit Canton, Lumpiang Shanghai, and Halo-Halo. All dishes and prices are editable in src/data/publicMenu.ts.',
      },
      {
        id: 'menu-veg',
        question: 'Do you have vegetarian options?',
        answer:
          'We feature vegetable-focused Filipino dishes and sides such as Pinakbet, Ensaladang Talong, Atchara, and rice bowls. Please confirm meat-free broth or bagoong adjustments directly with our kitchen before ordering.',
      },
      {
        id: 'menu-changes',
        question: 'Can I request changes to my food?',
        answer:
          'Simple adjustments like spice on the side, less ice, or rice upgrades can be noted in the Special Instructions box when ordering. Larger recipe changes depend on kitchen preparation.',
      },
      {
        id: 'menu-allergies',
        question: 'Do you accommodate food allergies?',
        answer:
          'Editable allergen notice: Our dishes are prepared in a shared kitchen that handles peanuts, shellfish (such as shrimp and bagoong), soy, wheat, eggs, and dairy. Please speak directly with SERVIO staff regarding any allergy.',
      },
      {
        id: 'menu-daily',
        question: 'Are your menu items available every day?',
        answer:
          'Because dishes are cooked in fresh batches, select specialties may sell out during busy family hours. Live availability badges are displayed right on our Menu and Online Order pages.',
      },
      {
        id: 'menu-packages',
        question: 'Do you offer family food packages?',
        answer:
          'Yes — explore our Family Platters section on the Menu page or view our Catering packages for larger home celebrations and reunions.',
      },
    ],
  },
  {
    id: 'orders-payments',
    title: 'Orders and Payments',
    items: [
      {
        id: 'ord-place',
        question: 'How can I place an order?',
        answer:
          'Visit our Order Online page (/order) to browse categories, customize dishes, add items to your cart, and choose pickup or delivery. Note: online checkout is currently in clearly marked Demo Mode until connected to a live backend.',
      },
      {
        id: 'ord-payment',
        question: 'What payment methods do you accept?',
        answer:
          'Editable payment configuration: Cash, GCash, and Card options are structured in our checkout configuration. Final accepted payment methods will be confirmed upon live launch.',
      },
      {
        id: 'ord-cancel',
        question: 'Can I cancel an order?',
        answer:
          'Editable policy placeholder: Specify SERVIO’s cancellation cutoff window (e.g., before kitchen preparation begins) once live ordering is enabled.',
      },
      {
        id: 'ord-advance',
        question: 'Can I schedule an order in advance?',
        answer:
          'For large platters, celebration trays, or planned family meals, please reach out via our Catering inquiry form or Contact page so our kitchen can schedule preparation smoothly.',
      },
    ],
  },
  {
    id: 'catering-events',
    title: 'Catering and Events',
    items: [
      {
        id: 'cat-offer',
        question: 'Do you offer catering?',
        answer:
          'Yes — visit our Catering page (/catering) to review our configurable gathering packages (Small Family Gathering, Family Celebration, and Special Event Package) and submit an event inquiry.',
      },
      {
        id: 'cat-trays',
        question: 'Can I order food trays?',
        answer:
          'Party trays and celebration bilao options can be requested through our Catering inquiry form or from our Family Platters section once confirmed pricing and tray sizes are published.',
      },
      {
        id: 'cat-birthdays',
        question: 'Do you accept birthday celebrations?',
        answer:
          'We love hosting birthdays, anniversaries, and family reunions! Explore our Private Events page (/private-events) to plan a shared table or group celebration.',
      },
      {
        id: 'cat-book',
        question: 'How can I book a package?',
        answer:
          'Fill out the Catering Inquiry or Private Event Booking form with your event date, guest count, and preferred dishes. Our team will confirm availability, exact inclusions, and deposit details.',
      },
      {
        id: 'cat-advance',
        question: 'How far in advance should I book?',
        answer:
          'Editable policy placeholder: Insert your confirmed lead-time requirement (for example, 3–7 days for catering trays and 2–4 weeks for larger private dining groups) before launch.',
      },
    ],
  },
]

export const PRIVATE_EVENT_FAQS: FaqItem[] = [
  {
    id: 'pe-reservations',
    question: 'How do group reservations and private dining work?',
    answer:
      'Submit your preferred date, time, and guest count through our Private Event Booking form. Exact seating areas, minimum spend, and availability are confirmed directly by our team.',
  },
  {
    id: 'pe-capacity',
    question: 'What is your event seating capacity?',
    answer:
      'Editable placeholder: Enter SERVIO’s verified semi-private table capacity and full dining room buyout capacity once confirmed.',
  },
  {
    id: 'pe-outside-food',
    question: 'May we bring outside food or a birthday cake?',
    answer:
      'Editable policy placeholder: Confirm SERVIO’s official policy on celebration cakes, corkage, and outside food items before publishing.',
  },
  {
    id: 'pe-packages',
    question: 'Can we customize our food package?',
    answer:
      'Yes — all sample group packages are flexible starting points. Share preferred Filipino favorites and dietary notes in your booking inquiry so we can tailor your menu.',
  },
  {
    id: 'pe-deposits',
    question: 'Is a deposit required to hold a date?',
    answer:
      'Editable policy placeholder: Confirm deposit percentage, payment schedule, and accepted methods for private events here.',
  },
  {
    id: 'pe-cancellation',
    question: 'What is your event cancellation or rescheduling policy?',
    answer:
      'Editable policy placeholder: Add your confirmed notice period for rescheduling or cancelling private dining bookings.',
  },
]
