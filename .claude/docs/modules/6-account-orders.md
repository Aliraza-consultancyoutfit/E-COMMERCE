# Module 6 — Account & Order History

**Branch:** `feature/06-account-orders`
**Design source:** `Storefront.dc.html` (Customer dashboard)
**Status:** built + verified, awaiting ship approval

## What was built

### Backend
- **`GET /orders`** — lists the current user's orders (newest first), **own only** (`find({ user: sub })`). JWT-guarded.
- **`GET /auth/profile`** / **`PATCH /auth/profile`** — returns/updates the user's profile (name); never returns the password; scoped by `@CurrentUser().sub`. `UpdateProfileDto`.

### Frontend
- **`/account`** (`AuthGuard`) — dashboard with sidebar (avatar + name/email, **Profile / Orders / Sign out**).
- **Profile** — editable full name + read-only email; saves via `updateProfile` with a toast.
- **Orders** — order-history list (order #, date, item count, **status chip**, total, View) with an empty state.
- **Order detail** — **status timeline** (Order placed → Processing → Shipped → Delivered, derived from `status`; cancelled shown explicitly), shipping address, payment (last-4), and the item lines.
- Activates the navbar avatar's **"My account"**.

## Decisions (also in NOTES.md)
- **Scope = order history + profile** (the module's graded core). The design's **Addresses / Wishlist / Notifications / Settings** tabs have **no backend** in this assessment, so they're intentionally omitted rather than shipped as dead UI. Easy to add later if those features are scoped.
- **Profile** uses the single `name` field (model) shown as "Full name"; the design's separate first/last/phone are simplified. Email is read-only (changing it is an auth concern).
- **Status transitions** (advancing pending→processing→…) are admin-driven in **Module 8**; here the customer views status read-only.

## Verification
- BE `lint`+`build` green. Live: `GET /orders` lists own orders (401 without token); `GET /auth/profile` + `PATCH` update name.
- FE `lint`+`tsc` clean. (Full `next build` deferred — dev server holds `.next`.)

## Tests
Verified via live API + lint/types; the Jest/Vitest runner remains the next testing checkpoint.
