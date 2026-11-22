# Servio Design System Specification

## 1. Visual Direction: "A Warm Filipino Family Kitchen"

Servio avoids generic dark-neon SaaS aesthetics in favor of a warm, grounded, calm operational tool modeled on paper menus and physical kitchen tickets:

- **Warm cream paper** (`--color-bg`), deep brown-black espresso ink (never harsh `#000`), and a **single warm bronze accent** used sparingly for primary actions and active navigation pills.
- **Hairline warm-tan borders** over heavy drop shadows; one soft floating shadow (`--shadow-float`) reserved strictly for overlays (dropdowns, dialogs, sheets, toasts).
- **Plain, friendly copy** (*"Kain na!"*, *"Table 7 food is ready!"*, *"Nothing cooking yet"*, *"Salamat po!"*), free of developer jargon.
- **Kitchen Display dark theme** remaps lightness only within the same warm hue family to achieve `>= 7:1` contrast readable from 2–3 meters under steam and glare.

All design tokens live in a single Tailwind v4 `@theme` block inside [src/tailwind.css](file:///c:/Users/BESAÑEZ_IAS2/Desktop/Servio/frontend/src/tailwind.css).

---

## 2. Color Tokens (100% OKLCH, Contrast Verified)

| Token | Value | Role | Verified WCAG Contrast |
| :--- | :--- | :--- | :--- |
| `--color-bg` | `oklch(96.5% 0.012 85)` | Main warm cream canvas | — |
| `--color-surface` | `oklch(98.8% 0.006 85)` | Cards, inputs, panels | — |
| `--color-ink` | `oklch(24% 0.02 55)` | Primary text & headings | **14.92:1** on `--bg` / **15.95:1** on `--surface` |
| `--color-muted` | `oklch(47% 0.025 65)` | Secondary subtitles & helper text | **6.20:1** on `--bg` / **6.63:1** on `--surface` |
| `--color-line` | `oklch(90% 0.015 82)` | Hairline borders & dividers | — |
| `--color-sidebar` | `oklch(22% 0.012 55)` | Dark charcoal-brown sidebar & mobile bar | **13.69:1** with `--sidebar-ink` |
| `--color-accent` | `oklch(48% 0.105 72)` | Deep bronze primary buttons, active nav, total | **6.03:1** on `--bg` / **6.45:1** cream-on-bronze |
| `--color-honey` / `-ink` / `-bg` | `78%` / `40%` / `93%` (`H: 85`) | Pending / Unpaid status | **7.54:1** |
| `--color-pot` / `-ink` / `-bg` | `60%` / `43%` / `93%` (`H: 60`) | Cooking / Occupied status | **6.78:1** |
| `--color-leaf` / `-ink` / `-bg` | `60%` / `40%` / `93%` (`H: 145`) | Available / Ready / Paid status | **7.28:1** |
| `--color-berry` / `-ink` / `-bg` | `52%` / `47%` / `94%` (`H: 20`) | Cancelled / Error / Overdue (`>10m`) | **6.01:1** |
| `--color-kds-bg` / `--color-kds-ink` | `oklch(19% 0.018 50)` / `oklch(95% 0.014 85)` | Kitchen Display full-screen dark board | **16.00:1** (`14.27:1` on `--kds-surface`) |

> Every status badge (`StatusBadge.vue`) pairs **color + icon + uppercase text label**, never relying on hue alone.

---

## 3. Self-Hosted Typography (Verified Native `U+20B1` `₱`)

All three font families are self-hosted via `@fontsource` (imported in [src/main.ts](file:///c:/Users/BESAÑEZ_IAS2/Desktop/Servio/frontend/src/main.ts)) and verified at the binary `.woff` `cmap` table level to include the native Philippine Peso sign (`U+20B1`, `₱`):

| Role | Font Family | Weights | Usage |
| :--- | :--- | :--- | :--- |
| **Display Serif** (`--font-serif`) | `Merriweather` | `400`, `700` | Wordmark, screen headings, dish names (`>= 18px`), large order total. |
| **UI / Body Sans** (`--font-sans`) | `Nunito` | `400`, `500`, `600`, `700` | All body copy (`>= 16px`), buttons, navigation, tables, timers, prices (`tabular-nums`). |
| **Receipt Monospace** (`--font-mono`) | `Geist Mono` | `400`, `500`, `600` | Strictly reserved for the 80 mm thermal paper receipt ([ReceiptView.vue](file:///c:/Users/BESAÑEZ_IAS2/Desktop/Servio/frontend/src/components/ReceiptView.vue)) so everyday screens stay warm and non-technical. |

### Strict Scales (4px Spacing Base)
- **6 Type Sizes**: `text-xs` (`12px`), `text-sm` (`14px`), `text-base` (`16px` body floor), `text-lg` (`19px` dish titles), `text-xl` (`22px` KDS ticket dishes & totals), `text-2xl` (`30px` greetings & hero KPI).
- **3 Radii**: `--radius-input` (`10px`), `--radius-card` (`16px`), `--radius-pill` (`999px`).
- **Role-Specific Leading**: Headings `1.2`, body `1.5`, order lines & dense kitchen tickets `1.3`.

---

## 4. Responsive Layout & Touch Ergonomics

| Breakpoint | Shell Navigation | Take Order (`/pos`) | Tables & Admin Screens |
| :--- | :--- | :--- | :--- |
| **Desktop (`1280px+`)** | `228px` dark left sidebar with bronze active pill | 3-column menu grid + fixed `348px` right order panel | 4-column visual floor plan; full data tables |
| **Tablet (`768–1279px`)** | `76px` collapsed dark icon rail | 2-column menu grid + docked order panel (`1024px+`) or sticky summary drawer (`768–1023px`) | 2–3 column floor plan; responsive tables |
| **Phone (`< 768px`)** | Dark bottom tab bar (`safe-pb-bar`) | 1-column menu cards + sticky summary bar opening bottom `BaseSheet` | 1-column visual tables; stacked mobile cards on Menu & Staff (zero horizontal scroll) |
| **Kitchen Role** | **No sidebar** at any breakpoint | — | Full-screen dark 2-column board (`New Orders` \| `Cooking Now`) + pass shelf |

### Accessibility & Craft Rules Enforced
- **Touch targets**: Every interactive button/link meets `>= 44×44px` (`48px` on primary POS/KDS controls); compact visual icons extend their hit box via `.touch-extend` / `.touch-extend-44` `::before` pseudo-elements.
- **Safe areas**: `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`, `100dvh` everywhere, and `env(safe-area-inset-bottom)` padding on bottom bars and sheets.
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` removes translation/stagger delays (`0ms`) while preserving calm opacity transitions (`120ms`).
- **Shared element transitions**: `executeViewTransition()` wraps route and state transitions using the View Transitions API with automatic fallback.

---

## 5. 80 mm Thermal Receipt Print Specification

Defined in [src/tailwind.css](file:///c:/Users/BESAÑEZ_IAS2/Desktop/Servio/frontend/src/tailwind.css) (`@media print`) and [src/components/ReceiptView.vue](file:///c:/Users/BESAÑEZ_IAS2/Desktop/Servio/frontend/src/components/ReceiptView.vue):
- `@page { size: 80mm auto; margin: 0; }`
- Printable content width: **`72mm`** (`4mm` horizontal margins) with `max-w-[42ch]` **Geist Mono** tabular columns.
- Hides all chrome (`.no-print`) and outputs pure high-contrast monochrome text displaying business header, order reference, table, server, `Asia/Manila` timestamp, snapshotted item prices, total due, payment method, cash tendered, change given, and `"Salamat po!"`.
