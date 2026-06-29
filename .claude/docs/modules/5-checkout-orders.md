# Module 5 — Checkout & Orders

**Branch:** `feature/05-checkout-orders`
**Design source:** `Storefront.dc.html` (Checkout: stepper, success, failure)
**Status:** built + verified, awaiting ship approval

## What was built

### Backend
- **Order schema** — `user`, `items` (snapshot: product ref + name/price/quantity/lineTotal), `shippingAddress` (sub-schema), server totals (`subtotal/discount/shipping/tax/total`), `coupon`, `paymentLast4` (never the full card), `status` (`OrderStatus` enum, default `pending`).
- **`OrdersService.checkout`**:
  1. Reads the **server cart**; rejects empty (400).
  2. **Mock payment** — cards starting `4000` decline → **402** *before any stock change* (true no-op); anything else succeeds.
  3. **Atomic, guarded stock decrement** per item (`findOneAndUpdate({ _id, stock: { $gte: qty } }, { $inc: -qty })`) with **rollback** if any item is short → 400. No overselling, no read-then-write race.
  4. Creates the order from **server-recomputed totals** (client totals never trusted), stores card last-4, clears the cart.
- **`getMyOrder`** — ownership-scoped (404 on other users / invalid id).
- JWT-guarded `OrdersController`: `POST /orders/checkout`, `GET /orders/:id`. `CheckoutDto` with nested-validated `shippingAddress` + `payment`.

### Frontend
- **`orderApi`** (checkout mutation invalidates `Cart`+`Order`; getOrder query).
- **Checkout page** (`/checkout`, `AuthGuard`) — 4-step **stepper** (Shipping → Billing → Payment → Review) with per-step RHF validation, live **order summary** from the cart, Back/Continue/**Place order**.
- **Mock payment** step with a clear helper (`4242…` succeeds, `4000…` declines) — no real gateway.
- **Order confirmed** state (order #, total paid, ETA) on success; **Payment failed** state (retry / back to cart) on 402; empty-cart guard.

## Decisions (also in NOTES.md)
- **Clearly-mocked payment** (per the assessment, which permits a mocked step) — decline simulated by a `4000…` card; no Stripe SDK. Last-4 stored, full card never persisted.
- New orders start **`pending`**; status transitions (processing→shipped→delivered/cancelled) are the admin order-management module (8).
- Order **history list + tracking** UI is Module 6; the confirmation links to home/catalog for now (no `/account` yet).

## Verification (live, temp port + local DB)
- Declined card → **402**, cart intact, stock unchanged (no-op).
- Success → **201** order (`status pending`, last4 stored), **stock 200→198**, **cart cleared**.
- `GET /orders/:id` returns own order; empty-cart checkout → **400**.
- BE `lint`+`build` green; FE `lint`+`tsc` clean (full `next build` deferred — dev server holds `.next`).

## Tests
Verified via live API + lint/types; Jest/Vitest runner remains the next testing checkpoint.
