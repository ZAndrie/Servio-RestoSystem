# Servio Frontend ↔ Laravel Backend API Contract

This document specifies every HTTP endpoint, header, payload, and business-rule invariant expected by the Servio frontend when `VITE_USE_MOCK=false`.

All requests are sent via the shared Axios instance in [src/services/api.ts](file:///c:/Users/BESAÑEZ_IAS2/Desktop/Servio/frontend/src/services/api.ts) (`timeout: 8000ms`, `Accept: application/json`).

---

## 1. Authentication & Headers

- **Base URL**: Configured by `VITE_API_BASE_URL` (default `http://localhost:8000/api`).
- **Bearer Token**: Automatically attached from `localStorage.getItem('servio_token')` as `Authorization: Bearer <token>`.
- **401 Handling**: Any `401 Unauthorized` response clears `servio_token` and `servio_user` and redirects to `/login`.

### Endpoints — Auth (`src/stores/auth.ts`)

| Method | Path | Request Body | Expected Response |
| :--- | :--- | :--- | :--- |
| `POST` | `/login` | `{ "username": "waiter", "password": "..." }` | `{ "token": "<sanctum_token>", "user": User }` |
| `POST` | `/logout` | *(empty)* | `200 OK` / `204 No Content` |
| `POST` | `/change-password` | `{ "password": "<new_password>" }` | `200 OK` (clears `must_change_password`) |

> Reject logins for deactivated accounts (`is_active === false`) with HTTP `403` and `{ "message": "..." }`.

---

## 2. Tables & Floor Management (`src/services/tableService.ts`)

| Method | Path | Request Body | Expected Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/tables` | — | `DiningTable[]` |
| `PATCH` | `/tables/{tableId}/occupy` | `{ "order_id": 204, "order_ref": "ORD-1204" }` | `DiningTable` |
| `PATCH` | `/tables/{tableId}/release` | *(empty)* | `DiningTable` |

### `DiningTable` Shape
```json
{
  "id": 4,
  "table_number": "T-04",
  "capacity": 4,
  "status": "available",
  "active_order_id": null,
  "active_order_ref": null
}
```

---

## 3. Menu Catalog & Dish Photo Upload (`src/services/menuService.ts`)

| Method | Path | Content-Type | Request Payload | Expected Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/categories` | — | — | `Category[]` |
| `GET` | `/menu-items` | — | — | `MenuItem[]` |
| `PATCH` | `/menu-items/{itemId}/availability` | `application/json` | *(empty — toggles availability)* | `{ "is_available": false }` |
| `POST` | `/menu-items` | `application/json` **or** `multipart/form-data` | Dish fields + optional `image` file | `MenuItem` |
| `PUT` / `POST` (`_method=PUT`) | `/menu-items/{itemId}` | `application/json` **or** `multipart/form-data` | Dish fields + optional `image` file | `MenuItem` |

### Multipart Dish Image Upload Details
When an admin attaches a photo (`JPG`, `PNG`, or `WebP`, max `5 MB`) in [MenuManagementView.vue](file:///c:/Users/BESAÑEZ_IAS2/Desktop/Servio/frontend/src/views/MenuManagementView.vue):
- **Create**: Sends `POST /api/menu-items` as `multipart/form-data` with fields `name`, `category_id`, `price`, `description`, `is_popular` (`"1"` / `"0"`), and `image` (`File`).
- **Update**: Uses Laravel's standard method spoofing (`POST /api/menu-items/{id}` with `_method=PUT` in `FormData`) so PHP parses uploaded files cleanly on updates.
- **Returned `image` URL**: Return either a relative path (e.g. `/storage/menu/dish.jpg`) or full LAN URL accessible from all tablets on Wi-Fi.

### `MenuItem` Shape
```json
{
  "id": 1,
  "category_id": 1,
  "name": "Sinigang na Baboy",
  "description": "Tender pork ribs simmered in fresh tamarind broth.",
  "price": 345.00,
  "is_available": true,
  "is_popular": true,
  "image": "/storage/menu/sinigang.jpg"
}
```

---

## 4. Orders, Kitchen & Pay-First Payment (`src/services/orderService.ts`)

| Method | Path | Request Body | Expected Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/orders` | — *(polled every 3.5s)* | `Order[]` |
| `POST` | `/orders` | `{ "table_id": 4, "items": [{ "menu_item_id": 1, "quantity": 1, "notes": "More broth" }] }` | `Order` (`payment_status: "unpaid"`, `status: "pending"`) |
| `POST` | `/orders/{orderId}/pay` | `{ "payment_method": "cash", "amount_paid": 500.00 }` | `Order` (`payment_status: "paid"`, `status: "pending"`, `change_amount: 80.00`) |
| `PATCH` | `/orders/{orderId}/status` | `{ "status": "preparing" \| "ready" \| "served" \| "paid" }` | `Order` |
| `POST` | `/orders/{orderId}/cancel` | `{ "reason": "Guest changed mind", "cancelled_by": 2 }` | `Order` (`status: "cancelled"`) |
| `POST` | `/orders/{orderId}/add-items` | `{ "items": [{ "menu_item_id": 17, "quantity": 1, "notes": "Less ice" }] }` | `Order` *(optional legacy add-on endpoint)* |

### Critical Pay-First, Dine-After Backend Rules
1. **Server-Side Pricing & Snapshotting**: Never trust client-calculated totals. Look up `menu_items.price` on the server, snapshot it into `order_items.unit_price`, and compute `orders.total` on the server.
2. **Optional Service Charge**: The frontend only displays a `"Service charge"` row if `order.service_charge` is returned with a value `> 0`.
3. **Separate `payment_status` vs. Kitchen `status`**:
   - `POST /orders` creates the ticket with `payment_status = "unpaid"` and `status = "pending"`.
   - `POST /orders/{id}/pay` validates `amount_paid >= total` (exact amount for `gcash`/`card`), sets `payment_status = "paid"`, keeps `status = "pending"` so the ticket enters the Kitchen Board, and **leaves the table occupied**.
   - Kitchen advances `status`: `pending` → `preparing` → `ready`. Waiter marks `served`.
   - When guests leave, frontend calls `PATCH /orders/{id}/status` with `{ "status": "paid" }` and `PATCH /tables/{tableId}/release`.
4. **Timezone**: Business-day analytics boundaries should use `Asia/Manila` (`UTC+8`).

### `Order` Shape
```json
{
  "id": 204,
  "order_ref": "ORD-1204",
  "table_id": 4,
  "table_number": "T-04",
  "user_id": 2,
  "server_name": "Ana Reyes",
  "status": "pending",
  "payment_status": "paid",
  "service_charge": null,
  "total": 420.00,
  "payment_method": "cash",
  "amount_paid": 500.00,
  "change_amount": 80.00,
  "paid_at": "2026-11-22T09:26:50.000Z",
  "created_at": "2026-11-22T09:26:50.000Z",
  "items": [
    {
      "menu_item_id": 1,
      "name": "Sinigang na Baboy",
      "unit_price": 345.00,
      "quantity": 1,
      "notes": ""
    }
  ]
}
```

---

## 5. Staff & User Management (`src/services/userService.ts`)

| Method | Path | Request Body | Expected Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/users` | — | `User[]` |
| `POST` | `/users` | `{ "name": "...", "username": "...", "role": "waiter", "password": "..." }` | `User` (`must_change_password: true`) |
| `PATCH` | `/users/{userId}/toggle-active` | *(empty — toggles `is_active`)* | `User` |
| `POST` | `/users/{userId}/reset-password` | `{ "password": "<temp_password>" }` | `200 OK` (sets `must_change_password: true`) |
