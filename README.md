# Servio — Restaurant Order Management System

A 3-tier Restaurant Order Management System built with a **Laravel REST API** backend, **Vue 3 + Vuetify** frontend, and **MySQL** database for Admin, Waiter/Cashier, and Kitchen staff.

## Project Structure

```text
Servio-RestoSystem/
├── backend/    # Laravel 12 REST API (Sanctum auth, 6-table MySQL schema, business rules & tests)
└── frontend/   # Vue 3 + TypeScript + Vuetify0 + Tailwind v4 SPA (Pay First, Dine After POS & KDS)
```

## Getting Started

- **Backend API**: See [backend/README.md](backend/README.md) for XAMPP MySQL setup, seeded accounts, API endpoints, and running tests.
- **Frontend App**: See [frontend/README.md](frontend/README.md) for offline LAN setup, mock/live API toggle (`VITE_USE_MOCK`), scripts, and full documentation in `frontend/docs/`.
