# Servio — Backend REST API (Laravel)

REST API backend for **Servio**, a 3-tier **Pay-First, Dine-After** Restaurant Order Management System & Kitchen Display System (KDS) built with Laravel 12, Laravel Sanctum, and MySQL (`Asia/Manila` timezone).

Fully aligned with the Vue 3 + TypeScript + `@vuetify/v0` frontend contract in [frontend/docs/API_CONTRACT.md](../frontend/docs/API_CONTRACT.md).

## Local Setup (XAMPP + MySQL on port 3308)

1. Start **MySQL** in the XAMPP Control Panel (configured on port `3308` in `C:\xampp\mysql\bin\my.ini`).
2. Create the `servio` database:
   ```powershell
   & "C:\xampp\mysql\bin\mysql.exe" -h 127.0.0.1 -P 3308 -u root -e "CREATE DATABASE IF NOT EXISTS servio;"
   ```
3. Run migrations, seeders, and connect the public storage symlink for dish photo uploads:
   ```powershell
   & "C:\xampp\php\php.exe" artisan migrate:fresh --seed
   & "C:\xampp\php\php.exe" artisan storage:link
   ```
4. Start the API development server:
   ```powershell
   & "C:\xampp\php\php.exe" artisan serve
   ```
   The API will be available at `http://localhost:8000/api`.

## Seeded Accounts & Demo Data

| Role | Name | Username | Password | Active |
|---|---|---|---|---|
| Admin | Maria Santos | `admin` | `admin123` | Yes |
| Waiter / Cashier | Ana Reyes | `waiter` | `waiter123` | Yes |
| Kitchen | Ramon Cruz | `kitchen` | `kitchen123` | Yes |
| Waiter / Cashier | Paolo Mendoza | `waiter_paolo` | `waiter123` | Yes |
| Kitchen | Liza Bautista | `kitchen_liza` | `kitchen123` | No (deactivated demo) |

Also seeded automatically:
- **10 dining tables** (`T-01`–`T-10`) with capacities `[2, 2, 4, 4, 6, 4, 4, 2, 6, 8]`
- **3 categories** (`Dishes`, `Desserts`, `Drinks`) and **21 Filipino menu items** mapped to `frontend/public/` photographs (with `Chicken Curry` marked sold out for testing)

## API Endpoints (35 Routes)

Send `Authorization: Bearer <token>` and `Accept: application/json` on all endpoints except `POST /api/login`.

| Module | Method & Endpoint | Allowed Roles |
|---|---|---|
| Auth | `POST /api/login` | Public (blocks inactive users with `403`) |
| Auth | `POST /api/logout`, `GET /api/me`, `POST /api/change-password` | All authenticated |
| Staff | `GET/POST/PUT/DELETE /api/users` | `admin` |
| Staff | `PATCH /api/users/{id}/toggle-active`, `POST /api/users/{id}/reset-password` | `admin` |
| Categories | `GET /api/categories`, `GET /api/categories/{id}` | All authenticated |
| Categories | `POST/PUT/DELETE /api/categories` | `admin` |
| Menu | `GET /api/menu-items`, `GET /api/menu-items/{id}` | All authenticated |
| Menu | `POST /api/menu-items`, `PUT` / `POST (_method=PUT) /api/menu-items/{id}`, `DELETE /api/menu-items/{id}` | `admin` (supports `multipart/form-data` image upload ≤ 5 MB) |
| Menu | `PATCH /api/menu-items/{id}/availability` | `admin` (toggles if empty body, or sets `is_available`) |
| Tables | `GET /api/tables`, `PATCH /api/tables/{id}/occupy`, `PATCH /api/tables/{id}/release` | `waiter`, `admin` |
| Orders | `GET /api/orders` (`?status=`, `?payment_status=`), `GET /api/orders/{id}` | `waiter`, `kitchen`, `admin` |
| Orders | `POST /api/orders` (Pay-First unpaid draft; supports `allow_occupied` for Extra Food) | `waiter`, `admin` |
| Orders | `PUT /api/orders/{id}/items`, `POST /api/orders/{id}/add-items` | `waiter`, `admin` |
| Orders | `POST /api/orders/{id}/pay` (Cash / exact GCash & Card; releases ticket to KDS while keeping table occupied) | `waiter`, `admin` |
| Orders | `POST /api/orders/{id}/cancel` (mandatory reason; releases table only if no other active orders remain) | `waiter`, `admin` |
| Orders | `PATCH /api/orders/{id}/status` (`pending → preparing → ready → served → paid`, paid orders only) | `kitchen`/`admin` (`preparing`, `ready`), `waiter`/`admin` (`served`, `paid`) |
| Reports | `GET /api/reports/daily?date=YYYY-MM-DD` (`Asia/Manila` day boundaries) | `admin` |
| Reports | `GET /api/dashboard` | `admin`, `waiter` |

## CORS

Allowed frontend origins are configured via `CORS_ALLOWED_ORIGINS` in `.env` (defaults to `http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173`).

## Running Tests

```powershell
& "C:\xampp\php\php.exe" artisan test
```
