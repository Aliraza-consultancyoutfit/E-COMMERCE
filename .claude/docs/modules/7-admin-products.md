# Module 7 — Admin Product Management

**Branch:** `feature/07-admin-products`
**Design source:** `Admin.dc.html` (sidebar, products table, product form, delete dialog)
**Status:** built + verified, awaiting ship approval

## What was built

### Backend
- **Admin-only product CRUD** — `POST /products`, `PATCH /products/:id`, `DELETE /products/:id`, each guarded by `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(UserRole.ADMIN)`.
- `CreateProductDto` + `UpdateProductDto` (`PartialType`); service `create`/`update`/`remove` (404 on missing/invalid id). Public `GET` list/detail/categories unchanged.

### Frontend
- **Admin shell** (`layouts/admin`) — 248px sidebar (logo, nav, store-owner footer, sign out) + responsive drawer + top bar with theme switch. The `(admin)` route group is wrapped in **`RoleGuard(ADMIN)`**; `/admin` redirects to `/admin/products`.
- **Products table** (`/admin/products`) — search, server pagination, product cell (gradient tile + name), category, price, stock, status chip, **edit/delete** row actions; **delete confirm dialog**.
- **Product form** (`/admin/products/new`, `/admin/products/:id`) — RHF + yup (name, description, price, compare-at, stock, category, image URL); create + edit, mutations invalidate the `Product` cache so the catalog refreshes.

## Decisions (also in NOTES.md)
- **RBAC is server-enforced** (RolesGuard); the `(admin)` `RoleGuard` is the UX mirror — a customer hitting `/admin` is bounced, and the API returns 403 regardless.
- **Image via URL field** (consistent with Module 2 — no file-storage infra); the design's drag-drop uploader is simplified to a URL input.
- **Sidebar nav = Products + Orders** (Orders route lands in Module 8). The design's Customers/Reports/Users/Settings/Activity tabs are out of assessment scope and omitted (not dead UI). Status/Tags fields from the design form are omitted (no such product fields).
- Row actions use inline **Edit/Delete** icons instead of the design's 3-dot menu (same actions, simpler).

## Verification
- BE `lint`+`build` green. Live RBAC: create/update/delete → **401** (no token), **403** (customer), **200/201** (admin); invalid body → **400**; missing id → **404**.
- FE `lint`+`tsc` clean. (Full `next build` skipped — dev server holds `.next`.)

## Tests
Verified via live API + lint/types; Jest/Vitest runner remains the next testing checkpoint.
