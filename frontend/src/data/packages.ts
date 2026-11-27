import { SITE_IMAGES, type ManagedImage } from './siteImages'

export interface BrandPrinciple {
  number: string
  title: string
  description: string
  illustration: 'heart-pot' | 'family-table' | 'filipino-leaf' | 'fresh-basket' | 'shared-bilao' | 'open-lantern'
}

export interface IngredientStorySection {
  id: string
  number: string
  eyebrow: string
  heading: string
  description: string
  supplierPlaceholder: string
  highlights: string[]
  image: ManagedImage
}

export interface CateringPackage {
  id: string
  number: string
  name: string
  idealFor: string
  description: string
  highlights: string[]
  pricingNote: string
}

export interface PrivateEventPackage {
  id: string
  name: string
  eyebrow: string
  description: string
  highlights: string[]
  pricingNote: string
  image: ManagedImage
}

// 6 Brand Values for /about (inspired by Cabalar's 6 numbered principle cards)
export const ABOUT_BRAND_VALUES: BrandPrinciple[] = [
  {
    number: '01',
    title: 'Cook with Heart',
    description: 'Every dish deserves attention, care, and thoughtful preparation.',
    illustration: 'heart-pot',
  },
  {
    number: '02',
    title: 'Family Comes First',
    description: 'SERVIO is built around the happiness of sharing a meal.',
    illustration: 'family-table',
  },
  {
    number: '03',
    title: 'Honor Filipino Flavor',
    description: 'We celebrate the familiar flavors and food traditions that make Filipino cooking special.',
    illustration: 'filipino-leaf',
  },
  {
    number: '04',
    title: 'Keep It Fresh',
    description: 'Thoughtful ingredient selection matters in every meal.',
    illustration: 'fresh-basket',
  },
  {
    number: '05',
    title: 'Made for Sharing',
    description: 'Generous portions and meals that bring people together.',
    illustration: 'shared-bilao',
  },
  {
    number: '06',
    title: 'Always Welcome',
    description: 'Every guest deserves to feel at home at SERVIO.',
    illustration: 'open-lantern',
  },
]

// 5 Ingredient Categories for /ingredients (replaces Cabalar's Farms & Friends)
export const INGREDIENT_SECTIONS: IngredientStorySection[] = [
  {
    id: 'produce',
    number: '01',
    eyebrow: 'Fresh Produce',
    heading: 'Crisp Greens & Everyday Market Vegetables',
    description:
      'From leafy kangkong and pechay to eggplant, okra, and ripe tomatoes, our kitchen builds every broth and sautéed dish around fresh, well-prepared vegetables that keep their natural brightness and bite.',
    supplierPlaceholder: 'Supplier / Market Note (Editable): Add verified produce partners once confirmed.',
    highlights: ['Kangkong & Pechay', 'Eggplant & Okra', 'Green Papaya & String Beans'],
    image: SITE_IMAGES.ingredientsHarvest,
  },
  {
    id: 'proteins',
    number: '02',
    eyebrow: 'Quality Proteins',
    heading: 'Carefully Selected Cuts for Slow Cooking & Grilling',
    description:
      'Filipino comfort dishes rely on patience and the right cuts — tender pork for braising and crisp roasting, savory beef for hearty stews, and juicy chicken marinated overnight before hitting the grill.',
    supplierPlaceholder: 'Supplier / Butcher Note (Editable): Add confirmed poultry & meat suppliers here.',
    highlights: ['Slow-Braised Pork Cuts', 'Marinated Grilled Chicken', 'Tender Beef Stewing Cuts'],
    image: SITE_IMAGES.storyKitchen,
  },
  {
    id: 'seafood',
    number: '03',
    eyebrow: 'Seafood',
    heading: 'Clean, Bright Flavors from Coastal Classics',
    description:
      'Whether it is golden pan-fried boneless bangus or savory shrimp folded into festive pancit, we handle seafood gently so its natural sweetness shines alongside citrus and garlic.',
    supplierPlaceholder: 'Seafood Sourcing Note (Editable): Add verified seafood partner details when confirmed.',
    highlights: ['Marinated Milkfish (Bangus)', 'Stir-Fried Shrimp', 'Classic Bagoong Pairings'],
    image: SITE_IMAGES.pancit,
  },
  {
    id: 'rice-grains',
    number: '04',
    eyebrow: 'Rice and Grains',
    heading: 'The Warm Anchor of Every Filipino Table',
    description:
      'No Filipino meal feels complete without warm rice at the center. We prepare fluffy steamed rice and fragrant toasted garlic rice in steady batches throughout service.',
    supplierPlaceholder: 'Rice & Grain Note (Editable): Add confirmed rice variety or mill details here.',
    highlights: ['Fragrant Steamed White Rice', 'Toasted Garlic Rice', 'Traditional Kakanin Grains'],
    image: SITE_IMAGES.heroFeast,
  },
  {
    id: 'herbs-spices',
    number: '05',
    eyebrow: 'Filipino Herbs and Spices',
    heading: 'Aromatics That Bring Home Into Every Pot',
    description:
      'The unmistakable aroma of a Filipino kitchen comes from simple staples used with care — fresh calamansi, tamarind, whole garlic, ginger, lemongrass, bay leaves, cane vinegar, and warm chilies.',
    supplierPlaceholder: 'Pantry & Aromatics Note (Editable): Customize regional spice notes in src/data/packages.ts.',
    highlights: ['Fresh Calamansi & Tamarind', 'Garlic, Ginger & Lemongrass', 'Bay Leaves & Cane Vinegar'],
    image: SITE_IMAGES.calamansi,
  },
]

// Catering Offerings & 3-Step Booking for /catering (replaces Cabalar's Food Truck)
export const CATERING_PACKAGES: CateringPackage[] = [
  {
    id: 'small-family',
    number: '01',
    name: 'Small Family Gathering',
    idealFor: 'For birthdays, intimate gatherings, and small celebrations.',
    description:
      'A comforting spread of sharing viands, noodles, and rice trays tailored for cozy home celebrations and weekend family lunches.',
    highlights: [
      'Configurable main viand trays',
      'Choice of Pancit or specialty side',
      'Steamed or garlic rice trays',
      'Optional Filipino dessert add-ons',
    ],
    pricingNote: 'Editable placeholder — confirm serving size & package pricing upon inquiry.',
  },
  {
    id: 'family-celebration',
    number: '02',
    name: 'Family Celebration',
    idealFor: 'For reunions, parties, and larger family occasions.',
    description:
      'Designed around generous bilao platters and crowd-pleasing Filipino classics so everyone can gather, pass plates, and go back for seconds.',
    highlights: [
      'Expanded choice of Filipino classics',
      'Celebration centerpiece dish option',
      'Appetizer & Lumpiang Shanghai trays',
      'Refreshment & dessert tray options',
    ],
    pricingNote: 'Editable placeholder — confirm final guest count & quote with SERVIO.',
  },
  {
    id: 'special-event',
    number: '03',
    name: 'Special Event Package',
    idealFor: 'For organized events and group celebrations.',
    description:
      'Custom-planned Filipino menu spreads for milestones, office gatherings, and community celebrations with coordinated pickup or delivery scheduling.',
    highlights: [
      'Tailored multi-course Filipino menu',
      'Flexible pickup or delivery coordination',
      'Dedicated menu planning consultation',
      'Custom dietary request review',
    ],
    pricingNote: 'Editable placeholder — package inclusions, minimum lead time & pricing configurable.',
  },
]

export const CATERING_BOOKING_STEPS = [
  {
    number: 'Step 01',
    title: 'Tell Us About Your Event',
    description:
      'Share your date, expected guests, preferred dishes, and pickup or delivery preference through our inquiry form.',
    illustration: 'step-inquiry' as const,
  },
  {
    number: 'Step 02',
    title: 'Plan Your Package',
    description:
      'We review dish selections, tray quantities, timing, and special notes together so nothing is missed.',
    illustration: 'step-plan' as const,
  },
  {
    number: 'Step 03',
    title: 'Celebrate with SERVIO',
    description:
      'Your trays are cooked fresh and prepared on schedule so you can focus on enjoying time with family and guests.',
    illustration: 'step-celebrate' as const,
  },
]

// Private Events Packages for /private-events (inspired by Cabalar's deep-green highlight cards)
export const PRIVATE_EVENT_PACKAGES: PrivateEventPackage[] = [
  {
    id: 'family-feast-gathering',
    eyebrow: 'Group Dining Package · Editable',
    name: 'Family Feast Table',
    description:
      'Gather your favorite people around a dedicated table dressed with generous Filipino classics, warm rice bowls, and comforting desserts served family-style.',
    highlights: [
      'RESERVED GROUP SEATING (CONFIGURABLE)',
      'SHARED FILIPINO CLASSICS',
      'PANCIT & SHANGHAI STARTERS',
      'STEAMED OR GARLIC RICE',
      'DESSERT PLATTER OPTIONS',
      'DEDICATED FLOOR HOSPITALITY',
    ],
    pricingNote: 'Capacity limits, per-guest pricing, and deposit terms are editable placeholders — confirm directly with SERVIO.',
    image: SITE_IMAGES.diningRoom,
  },
  {
    id: 'celebration-spread-drinks',
    eyebrow: 'Food & Refreshments · Editable',
    name: 'Celebration Spread & Refreshments',
    description:
      'Pair a full Filipino celebration menu with chilled house beverages — from fresh calamansi juice and iced tea pitchers to classic Halo-Halo and Leche Flan finishes.',
    highlights: [
      'CUSTOMIZABLE VIAND SELECTION',
      'CELEBRATION CENTERPIECE DISHES',
      'CALAMANSI & ICED TEA PITCHERS',
      'CLASSIC FILIPINO DESSERTS',
      'FLEXIBLE SEATING ARRANGEMENT',
      'PERSONALIZED EVENT COORDINATION',
    ],
    pricingNote: 'All menu pairings, room buyout options, and beverage terms are configurable in src/data/packages.ts.',
    image: SITE_IMAGES.cateringSpread,
  },
]
