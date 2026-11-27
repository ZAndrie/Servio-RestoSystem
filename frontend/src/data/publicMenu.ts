import { SITE_IMAGES, type ManagedImage } from './siteImages'

export interface PublicMenuCustomizationGroup {
  name: string
  options: { label: string; delta: number }[]
}

export interface PublicMenuItem {
  id: string
  categoryId: string
  name: string
  shortDescription: string
  demoPrice: number // Clearly marked sample demo price — replace with official menu prices
  available: boolean
  isFeatured?: boolean
  dietaryTags?: string[]
  image: ManagedImage
  ingredientsNote: string // Editable placeholder; never presented as certified allergen guidance
  allergenNotice: string
  customizations?: PublicMenuCustomizationGroup[]
}

export interface PublicMenuCategory {
  id: string
  number: string
  name: string
  subtitle: string
  servingNote?: string
}

export const PUBLIC_MENU_NOTICE =
  'Sample Menu & Demo Pricing: Dishes, descriptions, availability, and demo prices shown below are editable placeholders in src/data/publicMenu.ts until final SERVIO menu pricing is confirmed.'

export const PUBLIC_MENU_CATEGORIES: PublicMenuCategory[] = [
  {
    id: 'filipino-favorites',
    number: '01',
    name: 'All-Time Filipino Favorites',
    subtitle: 'Slow-simmered ulam made for the center of the family table.',
    servingNote: 'Traditionally enjoyed shared with steamed or garlic rice.',
  },
  {
    id: 'rice-meals',
    number: '02',
    name: 'Rice Meals',
    subtitle: 'Complete individual plates paired with warm rice and classic accompaniments.',
  },
  {
    id: 'filipino-specialties',
    number: '03',
    name: 'Filipino Specialties',
    subtitle: 'Crisp, sizzling, and festive house favorites cooked fresh to order.',
  },
  {
    id: 'family-platters',
    number: '04',
    name: 'Family Platters',
    subtitle: 'Generous trays and bundles crafted for family lunches and weekend gatherings.',
    servingNote: 'Exact serving sizes and bundle pricing are configurable per restaurant policy.',
  },
  {
    id: 'sides-extras',
    number: '05',
    name: 'Sides and Extras',
    subtitle: 'Starters, rice bowls, and bright pickled pairings that round out every meal.',
  },
  {
    id: 'desserts-beverages',
    number: '06',
    name: 'Desserts and Beverages',
    subtitle: 'Cool Filipino sweets and house-prepared refreshments.',
  },
]

const STANDARD_PORTION_OPTIONS: PublicMenuCustomizationGroup[] = [
  {
    name: 'Portion Size (Sample)',
    options: [
      { label: 'Regular Sharing', delta: 0 },
      { label: 'Family Bowl', delta: 140 },
    ],
  },
  {
    name: 'Spice Preference',
    options: [
      { label: 'Classic (Mild)', delta: 0 },
      { label: 'Chili on the Side', delta: 0 },
    ],
  },
]

const RICE_MEAL_OPTIONS: PublicMenuCustomizationGroup[] = [
  {
    name: 'Rice Choice',
    options: [
      { label: 'Steamed White Rice', delta: 0 },
      { label: 'Upgrade to Garlic Rice', delta: 20 },
    ],
  },
  {
    name: 'Add-On',
    options: [
      { label: 'None', delta: 0 },
      { label: 'Extra Fried Egg', delta: 30 },
      { label: 'Side Atchara', delta: 35 },
    ],
  },
]

const DEFAULT_ALLERGEN_NOTE =
  'Allergen & Ingredient Notice (Editable): Please confirm ingredients directly with SERVIO staff if you have food allergies or dietary restrictions. Dishes are prepared in a shared kitchen.'

export const PUBLIC_MENU_ITEMS: PublicMenuItem[] = [
  // 01. All-Time Filipino Favorites
  {
    id: 'chicken-adobo',
    categoryId: 'filipino-favorites',
    name: 'Chicken Adobo',
    shortDescription: 'Classic home-style chicken braised in soy sauce, cane vinegar, garlic, and bay leaves.',
    demoPrice: 245,
    available: true,
    isFeatured: true,
    dietaryTags: ['House Classic'],
    image: SITE_IMAGES.adobo,
    ingredientsNote: 'Editable ingredient summary: Bone-in chicken cuts, soy sauce, vinegar, garlic, peppercorns, bay leaves.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
    customizations: STANDARD_PORTION_OPTIONS,
  },
  {
    id: 'pork-adobo',
    categoryId: 'filipino-favorites',
    name: 'Pork Adobo',
    shortDescription: 'Tender pork shoulder simmered slowly until rich, savory, and deeply glazed.',
    demoPrice: 265,
    available: true,
    dietaryTags: ['Family Favorite'],
    image: SITE_IMAGES.storyKitchen,
    ingredientsNote: 'Editable ingredient summary: Pork cuts, soy sauce, vinegar, crushed garlic, whole black pepper, bay leaf.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
    customizations: STANDARD_PORTION_OPTIONS,
  },
  {
    id: 'sinigang-na-baboy',
    categoryId: 'filipino-favorites',
    name: 'Sinigang na Baboy',
    shortDescription: 'Comforting pork soup simmered in bright tamarind broth with fresh leafy greens and vegetables.',
    demoPrice: 345,
    available: true,
    isFeatured: true,
    dietaryTags: ['Best for Sharing'],
    image: SITE_IMAGES.sinigang,
    ingredientsNote: 'Editable ingredient summary: Pork ribs/belly, tamarind soup base, seasonal Filipino vegetables.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
    customizations: STANDARD_PORTION_OPTIONS,
  },
  {
    id: 'beef-kare-kare',
    categoryId: 'filipino-favorites',
    name: 'Beef Kare-Kare',
    shortDescription: 'Slow-cooked beef in velvety toasted peanut sauce with crisp vegetables and savory bagoong on the side.',
    demoPrice: 385,
    available: true,
    isFeatured: true,
    dietaryTags: ['Contains Peanuts', 'Best for Sharing'],
    image: SITE_IMAGES.kareKare,
    ingredientsNote: 'Editable ingredient summary: Braised beef, ground peanuts, annatto, vegetables, side shrimp paste.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
    customizations: STANDARD_PORTION_OPTIONS,
  },
  {
    id: 'pinakbet',
    categoryId: 'filipino-favorites',
    name: 'Pinakbet',
    shortDescription: 'Colorful medley of sautéed Filipino vegetables seasoned the traditional way.',
    demoPrice: 225,
    available: true,
    dietaryTags: ['Vegetable Dish'],
    image: SITE_IMAGES.ingredientsHarvest,
    ingredientsNote: 'Editable ingredient summary: Squash, eggplant, okra, string beans, bitter melon, aromatics (customizable without meat upon request if supported).',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
    customizations: STANDARD_PORTION_OPTIONS,
  },
  {
    id: 'dinuguan',
    categoryId: 'filipino-favorites',
    name: 'Dinuguan',
    shortDescription: 'Savory, tangy slow-simmered pork stew finished with green finger chilies.',
    demoPrice: 255,
    available: true,
    image: SITE_IMAGES.bistek,
    ingredientsNote: 'Editable ingredient summary: Pork cuts, vinegar, garlic, shallots, green chili, traditional savory broth.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
    customizations: STANDARD_PORTION_OPTIONS,
  },

  // 02. Rice Meals
  {
    id: 'chicken-inasal-rice',
    categoryId: 'rice-meals',
    name: 'Chicken Inasal Rice Meal',
    shortDescription: 'Charcoal-grilled marinated chicken quarter served with warm rice and annatto-calamansi dipping sauce.',
    demoPrice: 215,
    available: true,
    isFeatured: true,
    dietaryTags: ['Grilled'],
    image: SITE_IMAGES.chickenInasal,
    ingredientsNote: 'Editable ingredient summary: Marinated chicken quarter, lemongrass, calamansi, annatto oil, steamed rice.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
    customizations: RICE_MEAL_OPTIONS,
  },
  {
    id: 'pork-sisig-rice',
    categoryId: 'rice-meals',
    name: 'Pork Sisig Rice Meal',
    shortDescription: 'Crisp savory chopped pork topped with onions, calamansi, and chili paired with steamed rice.',
    demoPrice: 210,
    available: true,
    image: SITE_IMAGES.sisig,
    ingredientsNote: 'Editable ingredient summary: Chopped pork, red onion, calamansi, chili, house seasoning, rice.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
    customizations: RICE_MEAL_OPTIONS,
  },
  {
    id: 'beef-tapa-rice',
    categoryId: 'rice-meals',
    name: 'Beef Tapa Rice Meal',
    shortDescription: 'Cured tender beef strips pan-seared to a savory finish with garlic rice and pickled papaya.',
    demoPrice: 220,
    available: true,
    image: SITE_IMAGES.bistek,
    ingredientsNote: 'Editable ingredient summary: Marinated beef slices, garlic fried rice, vinegar dip.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
    customizations: RICE_MEAL_OPTIONS,
  },
  {
    id: 'longganisa-rice',
    categoryId: 'rice-meals',
    name: 'Longganisa Rice Meal',
    shortDescription: 'Pan-browned Filipino pork sausages served warm alongside toasted garlic rice and spiced vinegar.',
    demoPrice: 195,
    available: true,
    image: SITE_IMAGES.adobo,
    ingredientsNote: 'Editable ingredient summary: Filipino longganisa links, garlic rice, side spiced vinegar.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
    customizations: RICE_MEAL_OPTIONS,
  },
  {
    id: 'bangus-silog',
    categoryId: 'rice-meals',
    name: 'Bangus Silog',
    shortDescription: 'Golden pan-fried marinated boneless milkfish served with garlic rice and sunny-side egg.',
    demoPrice: 225,
    available: true,
    dietaryTags: ['Seafood'],
    image: SITE_IMAGES.tinola,
    ingredientsNote: 'Editable ingredient summary: Marinated milkfish (bangus), garlic rice, fried egg, side tomatoes.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
    customizations: RICE_MEAL_OPTIONS,
  },

  // 03. Filipino Specialties
  {
    id: 'crispy-pata',
    categoryId: 'filipino-specialties',
    name: 'Crispy Pata',
    shortDescription: 'Golden crackling pork knuckle fried crisp outside and tender inside with soy-vinegar dip.',
    demoPrice: 695,
    available: true,
    isFeatured: true,
    dietaryTags: ['Celebration Centerpiece'],
    image: SITE_IMAGES.crispyPata,
    ingredientsNote: 'Editable ingredient summary: Whole pork hock, aromatic braising spices, house soy-vinegar onion dipping sauce.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
  },
  {
    id: 'lechon-kawali',
    categoryId: 'filipino-specialties',
    name: 'Lechon Kawali',
    shortDescription: 'Crisp golden pork belly sliced for sharing, served with classic liver sauce or spiced vinegar.',
    demoPrice: 325,
    available: true,
    image: SITE_IMAGES.kareKare,
    ingredientsNote: 'Editable ingredient summary: Pork belly slab, bay leaves, garlic, peppercorns, house dipping sauce.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
    customizations: STANDARD_PORTION_OPTIONS,
  },
  {
    id: 'pork-sisig',
    categoryId: 'filipino-specialties',
    name: 'Pork Sisig',
    shortDescription: 'Sharing plate of crisp chopped pork tossed with red onions, calamansi, and fresh chili.',
    demoPrice: 290,
    available: true,
    isFeatured: true,
    image: SITE_IMAGES.sisig,
    ingredientsNote: 'Editable ingredient summary: Crisp pork, onions, calamansi, chili peppers, house savory seasoning.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
  },
  {
    id: 'pancit-canton',
    categoryId: 'filipino-specialties',
    name: 'Pancit Canton',
    shortDescription: 'Savory stir-fried egg noodles loaded with vegetables, tender meat, shrimp, and fresh calamansi.',
    demoPrice: 245,
    available: true,
    dietaryTags: ['Best for Sharing'],
    image: SITE_IMAGES.pancit,
    ingredientsNote: 'Editable ingredient summary: Wheat egg noodles, cabbage, carrots, snap peas, meat & shrimp, soy seasoning.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
    customizations: STANDARD_PORTION_OPTIONS,
  },
  {
    id: 'bicol-express',
    categoryId: 'filipino-specialties',
    name: 'Bicol Express',
    shortDescription: 'Rich coconut-milk pork stew brightened with aromatics and warm Filipino chilies.',
    demoPrice: 285,
    available: true,
    dietaryTags: ['Mildly Spicy'],
    image: SITE_IMAGES.curry,
    ingredientsNote: 'Editable ingredient summary: Pork belly, coconut milk, shrimp paste, garlic, ginger, green & red chilies.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
    customizations: STANDARD_PORTION_OPTIONS,
  },
  {
    id: 'beef-caldereta',
    categoryId: 'filipino-specialties',
    name: 'Beef Caldereta',
    shortDescription: 'Hearty tomato-braised beef stew with tender potatoes, carrots, bell peppers, and savory richness.',
    demoPrice: 355,
    available: true,
    image: SITE_IMAGES.bistek,
    ingredientsNote: 'Editable ingredient summary: Beef chuck, tomato sauce, potatoes, carrots, bell peppers, aromatics.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
    customizations: STANDARD_PORTION_OPTIONS,
  },

  // 04. Family Platters
  {
    id: 'filipino-favorites-platter',
    categoryId: 'family-platters',
    name: 'Filipino Favorites Platter',
    shortDescription: 'Curated group spread featuring our signature home-style viands prepared for family sharing.',
    demoPrice: 1290,
    available: true,
    dietaryTags: ['Group Platter'],
    image: SITE_IMAGES.heroFeast,
    ingredientsNote: 'Editable bundle note: Customize included dishes and recommended guest count in src/data/publicMenu.ts.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
  },
  {
    id: 'grilled-favorites-platter',
    categoryId: 'family-platters',
    name: 'Grilled Favorites Platter',
    shortDescription: 'Smoky charcoal-grilled chicken inasal and savory favorites served on banana leaf with dipping sauces.',
    demoPrice: 1180,
    available: true,
    dietaryTags: ['Group Platter'],
    image: SITE_IMAGES.chickenInasal,
    ingredientsNote: 'Editable bundle note: Customize grilled selections and sides in src/data/publicMenu.ts.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
  },
  {
    id: 'family-rice-package',
    categoryId: 'family-platters',
    name: 'Family Rice Package',
    shortDescription: 'Generous sharing bowl of steamed or garlic rice sized to accompany family platters.',
    demoPrice: 240,
    available: true,
    image: SITE_IMAGES.cateringSpread,
    ingredientsNote: 'Editable bundle note: Steamed white rice or toasted garlic fried rice.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
    customizations: [
      {
        name: 'Rice Style',
        options: [
          { label: 'Steamed White Rice', delta: 0 },
          { label: 'Toasted Garlic Rice', delta: 45 },
        ],
      },
    ],
  },
  {
    id: 'celebration-food-tray',
    categoryId: 'family-platters',
    name: 'Celebration Food Tray',
    shortDescription: 'Party-sized bilao or tray ideal for birthdays, office lunches, and Sunday reunions.',
    demoPrice: 1650,
    available: true,
    dietaryTags: ['Advance Notice Helpful'],
    image: SITE_IMAGES.cateringSpread,
    ingredientsNote: 'Editable bundle note: Confirm tray selection and lead time directly with SERVIO.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
  },

  // 05. Sides and Extras
  {
    id: 'lumpiang-shanghai',
    categoryId: 'sides-extras',
    name: 'Lumpiang Shanghai',
    shortDescription: 'Crisp hand-rolled pork spring rolls served golden with sweet chili dipping sauce.',
    demoPrice: 175,
    available: true,
    isFeatured: true,
    image: SITE_IMAGES.cateringSpread,
    ingredientsNote: 'Editable ingredient summary: Seasoned ground pork, carrots, aromatics, wheat wrapper, sweet chili sauce.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
  },
  {
    id: 'steamed-rice',
    categoryId: 'sides-extras',
    name: 'Steamed Rice',
    shortDescription: 'Fluffy, freshly steamed fragrant white rice.',
    demoPrice: 45,
    available: true,
    dietaryTags: ['Vegetarian'],
    image: SITE_IMAGES.heroFeast,
    ingredientsNote: 'Editable ingredient summary: Steamed white rice.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
  },
  {
    id: 'garlic-rice',
    categoryId: 'sides-extras',
    name: 'Garlic Rice',
    shortDescription: 'Savory wok-tossed rice finished with crisp golden toasted garlic.',
    demoPrice: 60,
    available: true,
    dietaryTags: ['Vegetarian'],
    image: SITE_IMAGES.crispyPata,
    ingredientsNote: 'Editable ingredient summary: White rice, toasted garlic, light seasoning.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
  },
  {
    id: 'atchara',
    categoryId: 'sides-extras',
    name: 'Atchara',
    shortDescription: 'Bright house-pickled green papaya relish with carrots, bell pepper, and ginger.',
    demoPrice: 65,
    available: true,
    dietaryTags: ['Vegetarian'],
    image: SITE_IMAGES.crispyPata,
    ingredientsNote: 'Editable ingredient summary: Green papaya, vinegar, sugar, carrots, ginger, raisins/peppers.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
  },
  {
    id: 'ensaladang-talong',
    categoryId: 'sides-extras',
    name: 'Ensaladang Talong',
    shortDescription: 'Char-roasted eggplant salad tossed with ripe tomatoes, red onions, and calamansi dressing.',
    demoPrice: 120,
    available: true,
    dietaryTags: ['Vegetable Side'],
    image: SITE_IMAGES.ingredientsHarvest,
    ingredientsNote: 'Editable ingredient summary: Roasted eggplant, fresh tomatoes, onions, vinegar/calamansi (optional bagoong on side).',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
  },

  // 06. Desserts and Beverages
  {
    id: 'halo-halo',
    categoryId: 'desserts-beverages',
    name: 'Halo-Halo',
    shortDescription: 'Classic Filipino shaved ice layered with sweet preserves, ube, leche flan, and creamy milk.',
    demoPrice: 145,
    available: true,
    isFeatured: true,
    dietaryTags: ['Signature Dessert'],
    image: SITE_IMAGES.haloHalo,
    ingredientsNote: 'Editable ingredient summary: Shaved ice, milk, sweet beans, ube, custard flan, assorted Filipino preserves.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
  },
  {
    id: 'leche-flan',
    categoryId: 'desserts-beverages',
    name: 'Leche Flan',
    shortDescription: 'Rich, silky baked custard finished with glossy golden caramel.',
    demoPrice: 135,
    available: true,
    image: SITE_IMAGES.lecheFlan,
    ingredientsNote: 'Editable ingredient summary: Egg yolks, milk, sugar caramel.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
  },
  {
    id: 'buko-pandan',
    categoryId: 'desserts-beverages',
    name: 'Buko Pandan',
    shortDescription: 'Chilled young coconut strips and fragrant pandan jelly folded in lightly sweetened cream.',
    demoPrice: 125,
    available: true,
    image: SITE_IMAGES.kakanin,
    ingredientsNote: 'Editable ingredient summary: Young coconut, pandan gel, cream, light sweetness.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
  },
  {
    id: 'mango-float',
    categoryId: 'desserts-beverages',
    name: 'Mango Float',
    shortDescription: 'Chilled layers of sweet ripe Philippine mangoes, graham biscuits, and velvety cream.',
    demoPrice: 140,
    available: true,
    image: SITE_IMAGES.mangoSago,
    ingredientsNote: 'Editable ingredient summary: Ripe mangoes, whipped cream, graham crackers.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
  },
  {
    id: 'sagot-gulaman',
    categoryId: 'desserts-beverages',
    name: "Sago't Gulaman",
    shortDescription: 'Refreshing chilled brown-sugar drink loaded with chewy tapioca pearls and gelatin cubes.',
    demoPrice: 80,
    available: true,
    image: SITE_IMAGES.taho,
    ingredientsNote: 'Editable ingredient summary: Caramelized brown sugar syrup, sago pearls, gulaman jelly, ice.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
  },
  {
    id: 'fresh-calamansi-juice',
    categoryId: 'desserts-beverages',
    name: 'Fresh Calamansi Juice',
    shortDescription: 'Bright freshly squeezed Philippine calamansi lightly sweetened and served cold over ice.',
    demoPrice: 75,
    available: true,
    isFeatured: true,
    image: SITE_IMAGES.calamansi,
    ingredientsNote: 'Editable ingredient summary: Fresh calamansi juice, water, light sweetener, ice.',
    allergenNotice: DEFAULT_ALLERGEN_NOTE,
    customizations: [
      {
        name: 'Serving Style',
        options: [
          { label: 'Iced', delta: 0 },
          { label: 'Warm', delta: 0 },
          { label: 'Less Sweet', delta: 0 },
        ],
      },
    ],
  },
]
