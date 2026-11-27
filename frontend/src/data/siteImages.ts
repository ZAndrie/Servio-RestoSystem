/**
 * Centralized Image Manifest for SERVIO Public Website
 * Every entry has a primary editorial path and a verified local fallback in public/
 * so images never appear broken and can be replaced from one place.
 */

export interface ManagedImage {
  src: string
  fallback: string
  alt: string
  caption?: string
}

export const SITE_IMAGES: Record<string, ManagedImage> = {
  heroFeast: {
    src: '/site/servio-hero-feast.jpg',
    fallback: '/Dishes/Sinigang na Baboy.jpg',
    alt: 'A generous Filipino family dinner spread with steaming sinigang na baboy, kare-kare, charcoal-grilled chicken inasal on banana leaf, rice, and calamansi on a wooden table',
    caption: 'Shared Filipino family favorites served warm.',
  },
  storyKitchen: {
    src: '/site/servio-story-kitchen.jpg',
    fallback: '/Dishes/Chicken Adobo.jpg',
    alt: 'Hands ladling savory Filipino adobo onto a stoneware plate in warm natural kitchen light surrounded by garlic, calamansi, and bay leaves',
    caption: 'Prepared fresh in our kitchen every service.',
  },
  cateringSpread: {
    src: '/site/servio-catering-spread.jpg',
    fallback: '/Dishes/Pancit Canton.jpg',
    alt: 'Filipino celebration table featuring a woven bilao of pancit canton, crisp lumpiang shanghai, grilled chicken inasal, and sizzling sisig',
    caption: 'Abundant bilao platters and trays prepared for sharing.',
  },
  diningRoom: {
    src: '/site/servio-dining-room.jpg',
    fallback: '/Dishes/Pork Belly Kare-Kare.jpg',
    alt: 'Sunlit Filipino family restaurant dining room with a long wooden table, woven rattan chairs, warm cream plaster walls, and deep forest-green paneling',
    caption: 'Warm communal seating ready for birthdays and reunions.',
  },
  ingredientsHarvest: {
    src: '/site/servio-ingredients-harvest.jpg',
    fallback: '/Dishes/Tinolang Manok.jpg',
    alt: 'Fresh Filipino market ingredients including kangkong, eggplant, okra, calamansi, tamarind, ginger, garlic, chilies, bay leaves, and white rice on a woven tray',
    caption: 'Thoughtful everyday ingredients selected for flavor and freshness.',
  },
  crispyPata: {
    src: '/site/servio-crispy-pata.jpg',
    fallback: '/Dishes/Sisig de porc.jpg',
    alt: 'Golden crisp crispy pata served on a banana leaf with soy-vinegar chili dipping sauce, pickled atchara, and toasted garlic rice',
    caption: 'Golden crackling specialties crafted for the center of the table.',
  },
  sinigang: {
    src: '/Dishes/Sinigang na Baboy.jpg',
    fallback: '/Dishes/Sinigang na Baboy.jpg',
    alt: 'Steaming bowl of Sinigang na Baboy with tender pork ribs, kangkong, and fresh vegetables in tamarind broth',
  },
  kareKare: {
    src: '/Dishes/Pork Belly Kare-Kare.jpg',
    fallback: '/Dishes/Pork Belly Kare-Kare.jpg',
    alt: 'Rich peanut-sauce Kare-Kare topped with crisp pork belly, pechay, eggplant, and string beans',
  },
  chickenInasal: {
    src: '/Dishes/Chicken Inasal.jpg',
    fallback: '/Dishes/Chicken Inasal.jpg',
    alt: 'Charcoal-grilled Chicken Inasal glazed in annatto oil and lemongrass on banana leaf',
  },
  adobo: {
    src: '/Dishes/Chicken Adobo.jpg',
    fallback: '/Dishes/Chicken Adobo.jpg',
    alt: 'Classic Filipino Adobo braised in soy sauce, cane vinegar, garlic, and bay leaves',
  },
  sisig: {
    src: '/Dishes/Sisig de porc.jpg',
    fallback: '/Dishes/Sisig de porc.jpg',
    alt: 'Sizzling Pork Sisig topped with fresh calamansi, chopped onions, and chilies',
  },
  pancit: {
    src: '/Dishes/Pancit Canton.jpg',
    fallback: '/Dishes/Pancit Canton.jpg',
    alt: 'Stir-fried Pancit Canton noodles tossed with shrimp, pork, crisp vegetables, and calamansi',
  },
  bistek: {
    src: '/Dishes/Bistek.jpg',
    fallback: '/Dishes/Bistek.jpg',
    alt: 'Bistek Tagalog beef slices simmered in soy-calamansi sauce topped with sweet onion rings',
  },
  tinola: {
    src: '/Dishes/Tinolang Manok.jpg',
    fallback: '/Dishes/Tinolang Manok.jpg',
    alt: 'Comforting ginger Tinolang Manok soup with chicken, green papaya, and leafy greens',
  },
  curry: {
    src: '/Dishes/Chicken Curry.jpg',
    fallback: '/Dishes/Chicken Curry.jpg',
    alt: 'Creamy Filipino-style Chicken Curry cooked with coconut milk, potatoes, and sweet peppers',
  },
  haloHalo: {
    src: '/Drinks/HaloHalo.jpg',
    fallback: '/Drinks/HaloHalo.jpg',
    alt: 'Tall glass of Filipino Halo-Halo layered with shaved ice, ube, leche flan, and sweet toppings',
  },
  lecheFlan: {
    src: '/Desserts/Flan de Queso.jpg',
    fallback: '/Desserts/Flan de Queso.jpg',
    alt: 'Silky golden Leche Flan glazed in warm caramel syrup',
  },
  kakanin: {
    src: '/Desserts/Kakanin Specials.jpg',
    fallback: '/Desserts/Kakanin Specials.jpg',
    alt: 'Traditional Filipino kakanin rice cakes plated warm for sharing',
  },
  calamansi: {
    src: '/Drinks/Calamansi Juice (Filipino Lemonade) – Tangy & Refreshing!.jpg',
    fallback: '/Drinks/Calamansi Juice (Filipino Lemonade) – Tangy & Refreshing!.jpg',
    alt: 'Freshly squeezed Calamansi Juice served cold over ice',
  },
  mangoSago: {
    src: '/Drinks/Mango Sago.jpg',
    fallback: '/Drinks/Mango Sago.jpg',
    alt: 'Chilled Mango Sago dessert drink with ripe mango cubes and creamy coconut milk',
  },
  taho: {
    src: '/Drinks/Taho (Filipino Sweet Tofu).jpg',
    fallback: '/Drinks/Taho (Filipino Sweet Tofu).jpg',
    alt: 'Filipino sweet silken tofu Taho layered with arnibal brown sugar syrup and sago pearls',
  },
  icedTea: {
    src: '/Drinks/Iced Tea.jpg',
    fallback: '/Drinks/Iced Tea.jpg',
    alt: 'Tall glass of refreshing house brewed iced tea with citrus',
  },
}

export const HOMEPAGE_GALLERY_SLIDES: ManagedImage[] = [
  SITE_IMAGES.sinigang,
  SITE_IMAGES.crispyPata,
  SITE_IMAGES.kareKare,
  SITE_IMAGES.chickenInasal,
  SITE_IMAGES.pancit,
  SITE_IMAGES.adobo,
  SITE_IMAGES.haloHalo,
  SITE_IMAGES.calamansi,
]

export const SOCIAL_COLLAGE_IMAGES: ManagedImage[] = [
  SITE_IMAGES.heroFeast,
  SITE_IMAGES.sisig,
  SITE_IMAGES.haloHalo,
  SITE_IMAGES.cateringSpread,
]
