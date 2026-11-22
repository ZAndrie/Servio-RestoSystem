import { createThemePlugin, createStackPlugin } from '@vuetify/v0'

export const vuetifyTheme = createThemePlugin({
  default: 'servioLight',
  target: 'html',
  themes: {
    servioLight: {
      dark: false,
      colors: {
        primary: 'oklch(48% 0.105 72)',
        secondary: 'oklch(24% 0.02 55)',
        error: 'oklch(47% 0.16 22)',
        info: 'oklch(43% 0.11 58)',
        success: 'oklch(40% 0.10 148)',
        warning: 'oklch(40% 0.10 82)',
        background: 'oklch(96.5% 0.012 85)',
        surface: 'oklch(98.8% 0.006 85)',
        'surface-tint': 'oklch(94.2% 0.014 84)',
        'surface-variant': 'oklch(92.5% 0.016 83)',
        divider: 'oklch(90% 0.015 82)',
        'on-primary': 'oklch(98.8% 0.006 85)',
        'on-secondary': 'oklch(92% 0.015 85)',
        'on-error': 'oklch(98.8% 0.006 85)',
        'on-info': 'oklch(98.8% 0.006 85)',
        'on-success': 'oklch(98.8% 0.006 85)',
        'on-warning': 'oklch(24% 0.02 55)',
        'on-background': 'oklch(24% 0.02 55)',
        'on-surface': 'oklch(24% 0.02 55)',
        'on-surface-variant': 'oklch(47% 0.025 65)',
      },
    },
    servioKitchen: {
      dark: true,
      colors: {
        primary: 'oklch(78% 0.12 60)',
        secondary: 'oklch(78% 0.018 80)',
        error: 'oklch(77% 0.14 22)',
        info: 'oklch(85% 0.12 85)',
        success: 'oklch(80% 0.11 145)',
        warning: 'oklch(85% 0.12 85)',
        background: 'oklch(19% 0.018 50)',
        surface: 'oklch(24% 0.02 52)',
        'surface-tint': 'oklch(28% 0.022 52)',
        'surface-variant': 'oklch(28% 0.022 52)',
        divider: 'oklch(34% 0.022 55)',
        'on-primary': 'oklch(19% 0.018 50)',
        'on-secondary': 'oklch(19% 0.018 50)',
        'on-error': 'oklch(19% 0.018 50)',
        'on-info': 'oklch(19% 0.018 50)',
        'on-success': 'oklch(19% 0.018 50)',
        'on-warning': 'oklch(19% 0.018 50)',
        'on-background': 'oklch(95% 0.014 85)',
        'on-surface': 'oklch(95% 0.014 85)',
        'on-surface-variant': 'oklch(78% 0.018 80)',
      },
    },
  },
})

export const vuetifyStack = createStackPlugin({
  baseZIndex: 1000,
  increment: 10,
})

export default vuetifyTheme
