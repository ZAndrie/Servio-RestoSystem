export interface SiteNavLink {
  label: string
  to: string
  description?: string
  illustration?: 'story' | 'ingredients' | 'menu' | 'catering' | 'events' | 'faqs'
}

export const PRIMARY_NAV_LINKS: SiteNavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Our Ingredients', to: '/ingredients' },
  { label: 'Menu', to: '/menu' },
  { label: 'Catering', to: '/catering' },
  { label: 'Private Events', to: '/private-events' },
  { label: 'FAQs', to: '/faqs' },
  { label: 'Contact', to: '/contact' },
]

// Matches Cabalar's signature 6-card illustrated Explore mega-drawer
export const EXPLORE_DRAWER_CARDS: SiteNavLink[] = [
  {
    label: 'About',
    to: '/about',
    description: 'Our family story & six cooking values',
    illustration: 'story',
  },
  {
    label: 'Our Ingredients',
    to: '/ingredients',
    description: 'Fresh produce, herbs & careful prep',
    illustration: 'ingredients',
  },
  {
    label: 'Menu',
    to: '/menu',
    description: 'Filipino classics, platters & desserts',
    illustration: 'menu',
  },
  {
    label: 'Catering',
    to: '/catering',
    description: 'Celebration trays & group packages',
    illustration: 'catering',
  },
  {
    label: 'Private Events',
    to: '/private-events',
    description: 'Birthdays, reunions & shared tables',
    illustration: 'events',
  },
  {
    label: 'FAQs',
    to: '/faqs',
    description: 'Hours, dietary notes & booking info',
    illustration: 'faqs',
  },
]

export const FOOTER_QUICK_LINKS: SiteNavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Our Ingredients', to: '/ingredients' },
  { label: 'Menu', to: '/menu' },
  { label: 'Catering', to: '/catering' },
  { label: 'Private Events', to: '/private-events' },
  { label: 'FAQs', to: '/faqs' },
  { label: 'Contact', to: '/contact' },
]
