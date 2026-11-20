# Servio — Backend REST API (Laravel)

REST API backend for **Servio**, a 3-tier Restaurant Order Management System built with Laravel 12, Laravel Sanctum, and MySQL.

## Local Setup (XAMPP + MySQL on port 3308)

1. Start **MySQL** in the XAMPP Control Panel (configured on port `3308` in `C:\xampp\mysql\bin\my.ini`).
2. Create the `servio` database:
   ```powershell
   & "C:\xampp\mysql\bin\mysql.exe" -h 127.0.0.1 -P 3308 -u root -e "CREATE DATABASE IF NOT EXISTS servio;"
   ```
3. Run the migrations and seeders:
   ```powershell
   & "C:\xampp\php\php.exe" artisan migrate --seed
   ```
4. Start the API development server:
   ```powershell
   & "C:\xampp\php\php.exe" artisan serve
   ```
   The API will be available at `http://127.0.0.1:8000/api`.

> **Tip:** Add `C:\xampp\php` to your Windows `PATH` so you can run `php artisan ...` directly.

## Seeded Accounts

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `admin123` |
| Waiter / Cashier | `waiter` | `waiter123` |
| Kitchen | `kitchen` | `kitchen123` |

Tables `T1`–`T10` and 4 sample menu categories (`Mains`, `Appetizers`, `Drinks`, `Desserts`) are also seeded automatically.

## API Endpoints

Send `Authorization: Bearer <token>` and `Accept: application/json` on all endpoints except `POST /api/login`.

| Module | Method & Endpoint | Allowed Roles |
|---|---|---|
| Auth | `POST /api/login` | Public |
| Auth | `POST /api/logout`, `GET /api/me` | All authenticated |
| Users | `GET/POST/PUT/DELETE /api/users` | `admin` |
| Categories | `GET /api/categories`, `GET /api/categories/{id}` | All authenticated |
| Categories | `POST/PUT/DELETE /api/categories` | `admin` |
| Menu | `GET /api/menu-items`, `GET /api/menu-items/{id}` | All authenticated |
| Menu | `POST/PUT/DELETE /api/menu-items` | `admin` |
| Menu | `PATCH /api/menu-items/{id}/availability` | `admin` |
| Tables | `GET /api/tables` | `waiter`, `admin` |
| Orders | `POST /api/orders` | `waiter` |
| Orders | `GET /api/orders?status=pending,preparing` | `waiter`, `kitchen`, `admin` |
| Orders | `GET /api/orders/{id}` | `waiter`, `kitchen`, `admin` |
| Orders | `PATCH /api/orders/{id}/status` | `kitchen` (`preparing`, `ready`), `waiter` (`served`) |
| Orders | `POST /api/orders/{id}/pay` | `waiter` |
| Reports | `GET /api/reports/daily?date=YYYY-MM-DD` | `admin` |
| Reports | `GET /api/dashboard` | `admin`, `waiter` |

## CORS

Allowed frontend origins are restricted via `CORS_ALLOWED_ORIGINS` (defaults to `http://localhost:5173,http://127.0.0.1:5173`) in `.env` and `config/cors.php`.

## Running Tests

```powershell
& "C:\xampp\php\php.exe" artisan test
```
