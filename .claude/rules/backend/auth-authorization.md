---
paths:
  - "E-COMMERCE-PLATFORM-BE/**"
---

# Auth & Authorization

Builds on the existing `auth` module (register/login/me, `JwtAuthGuard`, `jwt.strategy.ts`, `@CurrentUser()`).

## JWT
- Payload carries `{ sub: userId, email, role }`. The role MUST be in the token so `RolesGuard` can read it without a DB hit.
- Sign with `JWT_SECRET` + `JWT_EXPIRES_IN` from `ConfigService`. `me` returns the current user (never the password).

## Role guard (add in module 0)
- `@Roles(...roles: UserRole[])` decorator sets metadata; `RolesGuard` reads it + the JWT `role` and allows/denies.
- Admin endpoints: `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(UserRole.ADMIN)`.
- Order of guards matters: `JwtAuthGuard` first (populates the user), then `RolesGuard`.

## Ownership scoping (enforce on every customer resource)
- Cart/order endpoints derive the owner from `@CurrentUser().sub` — **never** from a body/param `userId`.
- Reads: `find({ user: currentUserId, ... })`. Single-doc reads: fetch by id **and** assert `doc.user.equals(currentUserId)`, else `ForbiddenException` (or 404 to avoid leaking existence).
- Admin override is explicit (admin order management lists all) — and only reachable through the role guard.

## Customers vs admins
- Public: register, login, browse catalog, product detail.
- Authenticated customer: cart, checkout, own orders/history, recommendations.
- Admin only: product CRUD, all-orders view, status updates, dashboard analytics.

Confirm with a quick test: a customer token hitting an admin route returns **403**, and hitting another user's order returns **403/404**.
