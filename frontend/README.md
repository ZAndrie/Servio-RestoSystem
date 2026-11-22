# Servio — Restaurant Order Management & POS Frontend

**Servio** is an offline-capable, LAN-first restaurant ordering, kitchen display, billing, and back-office management frontend built for a Filipino family-run dining workflow (**Pay First, Dine After**).

It runs cleanly on waiters' phones and tablets (`360px`–`1024px`), countertop POS terminals (`1280px+`), and wall-mounted kitchen screens with **zero external CDN dependencies** — all fonts, icons, and dish images are bundled locally.

---

## Core Workflow: Pay First, Dine After

```
1. Choose a Table (/tables)  →  2. Take Order (/pos)  →  3. Pay & Send to Kitchen (/payment)
                                                                       │
   Table Cleared (/tables)   ←  Served to Table (/orders)  ←  Kitchen Board (/kitchen)
```

1. **Waiters** pick an open table from the visual dining room floor map (`/tables`), tap dishes directly on `/pos` (zero popups), and tap **Proceed to Payment**.
2. **Payment** is confirmed first (`/payment/:id` — Cash, GCash, or Card). Only after payment succeeds does the order appear on the **Kitchen Board** and print an **80 mm thermal receipt**.
3. **Kitchen Staff** see only paid orders on a full-screen, high-contrast dark board (`/kitchen`) and advance tickets from **New Orders** → **Cooking Now** → **Ready**.
4. **Waiters** serve ready dishes and tap **Clear Table (Guests Left)** once guests finish dining to reopen the table.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Framework | Vue 3 (`<script setup>`, Composition API) + TypeScript (`~5.9`) |
| Build Tool | Vite 8 (`@vitejs/plugin-vue`) |
| State & Routing | Pinia 4 + Vue Router 5 (RBAC navigation guards) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) with OKLCH `@theme` tokens |
| Headless UI | `@vuetify/v0` primitives wrapped in local `src/components/base/Base*` |
| HTTP Client | Axios (Sanctum Bearer interceptor + `VITE_USE_MOCK` offline layer) |
| Self-Hosted Fonts | `@fontsource/merriweather`, `@fontsource/nunito`, `@fontsource/geist-mono` |

---

## Quick Start

> Make sure your terminal is inside the `frontend/` directory before running `npm` commands.

```bash
cd frontend
npm install
npm run dev
```

Open **`http://localhost:3000`** in your browser.

> **Windows PowerShell note:** If PowerShell blocks `npm.ps1` with an execution policy error, either use `npm.cmd run dev` or run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` once.

### Demo Accounts (Mock Mode — Enabled by Default)

Tap any quick sign-in button on `/login` (or sign in manually with password `servio2026`):

| Staff Name | Username | Role | Default Landing Screen |
| :--- | :--- | :--- | :--- |
| **Ana Reyes** | `waiter` | Waiter / Cashier | `/tables` (Visual Dining Room) |
| **Ramon Cruz** | `kitchen` | Kitchen | `/kitchen` (Full-Screen Kitchen Board) |
| **Maria Santos** | `admin` | Admin | `/admin/dashboard` (Overview & Sales) |

---

## Available Scripts

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Start Vite dev server on port `3000` |
| `npm run type-check` | Run strict Vue + TypeScript checking (`vue-tsc --build --force`) |
| `npm run build` | Run `type-check` and production bundle in parallel (`dist/`) |
| `npm run build-only` | Production Vite build only |
| `npm run preview` | Preview the built `dist/` bundle locally |
| `npm run lint` | Run ESLint across the project |
| `npm run lint:fix` | Auto-fix lint issues |

---

## Switching to the Live Laravel Backend

1. Copy `.env.example` to `.env.local`.
2. Set `VITE_USE_MOCK=false` and point `VITE_API_BASE_URL` to your LAN Laravel API (e.g. `http://192.168.1.100:8000/api`).
3. Restart `npm run dev` or rebuild `npm run build`.

See [docs/API_CONTRACT.md](docs/API_CONTRACT.md) for every expected endpoint, payload, and `multipart/form-data` image upload contract.

---

## Project Structure

```text
frontend/
├── public/
│   ├── Dishes/               # Dedicated local food photographs
│   ├── Desserts/             # Dedicated local dessert photographs
│   ├── Drinks/               # Dedicated local beverage photographs
│   ├── servio-logo-icon.jpg  # Square brand emblem (favicon, sidebar, login)
│   └── servio-logo-lockup.jpg# Full horizontal Servio brand lockup
├── docs/
│   ├── ARCHITECTURE.md       # System analysis, modules, RBAC, state & polling flows
│   ├── API_CONTRACT.md       # Frontend ↔ Laravel REST & multipart upload contract
│   ├── DESIGN_SYSTEM.md      # OKLCH palette, fonts, 80mm receipt & UI craft spec
│   └── USER_GUIDE.md         # Non-technical operations manual for restaurant staff
├── src/
│   ├── components/
│   │   ├── base/             # Local wrappers over @vuetify/v0 headless primitives
│   │   ├── icons/            # Self-hosted uniform-stroke SVG icon set
│   │   ├── AppShell.vue      # Adaptive sidebar / icon rail / mobile bottom bar
│   │   ├── MenuCard.vue      # One-tap add dish card
│   │   ├── OrderPanel.vue    # Live order tray & Proceed to Payment CTA
│   │   ├── OrderCard.vue     # Floor & KDS ticket card (shared 1s ticker)
│   │   ├── ReceiptView.vue   # 80mm thermal receipt (@media print)
│   │   ├── TableStatusStrip.vue # Live selected-table status & timeline
│   │   └── CancelOrderModal.vue # Mandatory void reason modal
│   ├── composables/          # Shared 1-second global ticker (useTicker.ts)
│   ├── plugins/              # Pinia, Vuetify0 theme/stack plugins, Router
│   ├── router/               # Role-based route guards (index.ts)
│   ├── services/             # Axios API client + mock layer behind identical signatures
│   ├── stores/               # Pinia stores (auth, tables, menu, cart, orders, toast)
│   ├── types/                # Shared TypeScript interfaces
│   ├── utils/                # en-PH currency, Asia/Manila time, View Transitions
│   ├── views/                # 9 operational screens (Tables, POS, Payment, Orders, KDS, Admin)
│   └── tailwind.css          # Centralized @theme design tokens & print rules
└── .env.example
```

---

## Documentation Index

- **[System Architecture & Analysis](docs/ARCHITECTURE.md)** — Module coverage, RBAC matrix, Pay-First state machine, store design, and codebase health review.
- **[Backend API Contract](docs/API_CONTRACT.md)** — Laravel endpoints, auth headers, multipart dish image upload, and Pay-First alignment rules.
- **[Design System Specification](docs/DESIGN_SYSTEM.md)** — OKLCH contrast-verified tokens, self-hosted `₱`-verified typography, responsive layout, and 80 mm receipt printing.
- **[Staff Operations Guide](docs/USER_GUIDE.md)** — Step-by-step plain-English guide for Waiters, Kitchen Staff, and Admins.
