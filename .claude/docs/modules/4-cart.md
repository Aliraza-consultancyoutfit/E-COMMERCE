# Module 4 — Cart

**Branch:** `feature/04-cart`
**Design source:** `Storefront.dc.html` (Cart screen)
**Status:** built + verified, awaiting ship approval

## What was built

### Backend
- **Cart schema** — one document per user (`user` unique-indexed), embedded `items` (`product` ref + `quantity`), and a `coupon` field.
- **`CartService`** — `getOrCreate` (upsert), `addItem` (validates product + stock, clamps qty to stock, merges existing line), `updateItem`, `removeItem`, `clearCart`, `applyCoupon`. **Totals are computed server-side** from current product prices: `subtotal`, `discount` (coupon), `shipping` (free ≥ $100 else $8), `tax` (8% of discounted), `total` — the client total is never trusted.
- **`CartController`** — JWT-guarded, every action **ownership-scoped by `@CurrentUser().sub`** (no body/param `userId`; IDOR-safe). `GET /cart`, `POST /cart/items`, `PATCH /cart/items/:productId`, `DELETE /cart/items/:productId`, `POST /cart/coupon`, `DELETE /cart`.
- DTOs: `AddToCartDto` (`@IsMongoId`, qty `@Min(1)`), `UpdateCartItemDto`, `ApplyCouponDto`.

### Frontend
- **`cartApi`** slice (get/add/update/remove/coupon/clear) with `Cart` tag invalidation.
- **`useAddToCart`** hook — auth-gates guests (toast + redirect to sign-in), otherwise calls the server cart and toasts. Wired into **product detail** (Add to cart / Buy now), **catalog**, **landing**, and **related** cards (quick-add `+`).
- **Cart page** (`/cart`, `AuthGuard`) — empty state + populated: line items with `QuantityStepper` + remove, coupon input, server-computed summary (subtotal / discount / shipping / tax / total), proceed-to-checkout.
- **Navbar cart badge** — live item count (logged-in only; query skipped for guests).
- **Persistence:** the cart is the server document keyed by user, so it survives sessions and logins (requirement met).

## Decisions (also in NOTES.md)
- **Coupon `WELCOME10` (10% off)** is server-validated and stored on the cart; invalid codes → 400. Discount is applied before shipping/tax, all recomputed server-side.
- **Quantity is clamped to stock** server-side on add/update (the hard oversell guard is the atomic decrement at checkout — Module 5).
- **"Proceed to checkout"** routes to `/checkout`, which is built in **Module 5** (next); until then that route 404s.

## Verification
- BE `lint` + `build` green. Live cart flow (temp port, local DB): 401 without token; add (qty 2) → subtotal/shipping/tax/total correct; update qty; `WELCOME10` → discount + recomputed total; invalid coupon → 400; remove → empty.
- FE `lint` + `tsc --noEmit` clean. (Full `next build` deferred to avoid corrupting the running dev server's `.next`; patterns match the already-built catalog/auth slices.)

## Tests
Still verified via live API + lint/types; Jest/Vitest runner remains the next testing checkpoint.
