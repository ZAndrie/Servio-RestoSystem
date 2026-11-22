# Servio — Staff Operations Guide

A plain-English guide for waiters, cashiers, kitchen cooks, and restaurant managers using Servio during daily service.

---

## 1. Signing In

1. Open Servio in your browser (e.g., `http://localhost:3000` or your restaurant's local Wi-Fi address).
2. Enter your **Username** and **Password**, or tap one of the quick shift buttons in demo mode:
   - **Ana (Waiter)** → Opens **Tables**
   - **Ramon (Kitchen)** → Opens the **Kitchen Board**
   - **Maria (Admin)** → Opens the **Overview** dashboard
3. If your account is brand new or had its password reset, Servio will ask you to choose a new password before starting your shift.

---

## 2. Waiter & Cashier Guide (**Pay First, Dine After**)

Servio follows a simple **3-step flow** so every order is paid before the kitchen starts cooking:

### Step 1: Choose a Table (`Tables`)
- Open the **Tables** page to see the whole dining room at a glance:
  - **Green (`Available`)** — Table is open and ready for guests.
  - **Yellow (`Unpaid`)** — An order was entered, waiting for payment.
  - **Amber (`Occupied`)** — Guests have paid and are waiting for food or dining.
  - **Green highlight (`Food Ready`)** — Their dishes are ready at the kitchen counter!
- **Tap any Available table** to seat the guests and jump straight into taking their order.

### Step 2: Take Order (`Take Order`)
- **Tap any dish, dessert, or drink** to add `1` straight to **Your Order** on the right (no popups!).
- Use the **Search bar** or category pills (**All Menu**, **Dishes**, **Desserts**, **Drinks**) to find items quickly.
- Inside **Your Order**:
  - Tap **`+`** or **`−`** to adjust quantities, or **`×`** to remove an item (an **Undo** banner appears if removed by mistake).
  - Tap **Add kitchen note** under a dish for special requests (e.g., *"No garlic"*, *"Less ice"*, *"Extra rice"*).
  - Tap **Clear list** to start fresh (with an **Undo** option).
- When finished, tap **Proceed to Payment →**.

### Step 3: Collect Payment & Send to Kitchen (`Pay Bill`)
- Confirm the itemized bill with the guest.
- Choose **Cash**, **GCash**, or **Card**:
  - **Cash**: Tap a quick bill button (**Exact**, **₱500**, **₱1,000**, **₱2,000**) or type the cash received. Servio automatically shows the exact **Change to give back**.
  - **GCash / Card**: Check the guest's confirmation screen or slip for the exact amount.
- Tap **Confirm & Send to Kitchen**.
- The **80 mm receipt** opens right away — tap **Print 80mm receipt** and hand it to the guest. The order is now live on the **Kitchen Board**!
- Tap **Done** to return straight to **Tables** for the next guests.
- *Changed mind before paying?* Tap **Cancel unpaid order** at the bottom to free the table immediately.

### Serving Food, Extra Orders & Clearing Tables (`Orders` & `Tables`)
- **When food is ready**: A green banner (*"Table 7 food is ready!"*) appears on **Tables** and **Orders**. Bring the dishes out and tap **Served to Table**.
- **If seated guests want extra food**: Tap their **Occupied** table on **Tables** → tap **Order Extra Food (Pay First)** → pick the extra dishes → collect payment for the extra items → the kitchen receives just the new items.
- **When guests finish eating and leave**: Tap their **Occupied** table on **Tables** (or on **Orders**) and tap **Clear Table (Guests Left)**. The table immediately turns green **Available** for the next guests.

---

## 3. Kitchen Staff Guide (`Kitchen Board`)

- The **Kitchen Board** runs full-screen in high-contrast dark mode so cooks can read it from across the kitchen.
- **Only paid orders** appear here automatically every few seconds:
  1. **New Orders** (left column): Tap **Start cooking** when you begin preparing a ticket.
  2. **Cooking Now** (right column): Tap **Mark ready for pickup** once plated at the counter.
  3. **Ready at the counter** (bottom strip): Shows tables waiting for waiters to carry out.
- Any ticket waiting or cooking longer than **10 minutes** highlights with a **Running late** timer alert.

---

## 4. Manager / Admin Guide

### Overview & Sales (`Overview` / `Sales`)
- Check **Today's sales**, **Paid orders**, **Occupied tables**, and **Average bill** at a glance.
- Pick a date range to review **How guests paid** (Cash, GCash, Card) and **Most ordered dishes**. Tap **Show orders** or **Show all** to expand full breakdowns.

### Managing the Menu (`Menu`)
- **Mark Sold Out instantly**: Flip the **Available / Sold out** switch on any dish — waiter screens disable that dish right away.
- **Add a New Dish (with Photo Upload)**:
  1. Tap **+ Add New Dish**.
  2. Click **Click to upload a photo** (or drag and drop a JPG, PNG, or WebP image up to 5 MB) to preview how it will look on waiter screens.
  3. Enter the dish name, category, price, optional note, and Popular toggle, then tap **Add to menu**.
- **Edit a Dish**: Tap **Edit** on any row to change its photo, name, or price. Price changes apply only to future orders — past receipts never change.

### Managing Staff (`Staff`)
- Tap **+ Add Staff** to create an account with a role (**Waiter / Cashier**, **Kitchen**, or **Admin**) and temporary password.
- Flip the **Active / Inactive** switch to turn off access for former staff without deleting any historical sales or order records.
- Tap **Reset password** to issue a fresh temporary password.

---

## 5. Quick Troubleshooting

| Issue | Fix |
| :--- | :--- |
| Windows PowerShell says `npm.ps1 cannot be loaded` | Run `npm.cmd run dev` inside the `frontend` folder, or run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` once. |
| `npm error Could not read package.json` | Make sure your terminal is inside `Servio/frontend` (`cd frontend`) before running `npm run dev`. |
| Thermal receipt prints too small or clipped | In the browser Print dialog, select your 80 mm thermal printer, set **Margins: None**, and keep **Scale: 100%**. |
| Connecting tablets on restaurant Wi-Fi | Start the server on the host PC (`npm run dev -- --host` or Nginx serving `dist/`) and open `http://<host-local-ip>:3000` on each tablet. |
