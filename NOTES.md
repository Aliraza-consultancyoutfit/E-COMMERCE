# Build Notes — Agent Workflow, Design Workflow, Decisions & Trade-offs

## Agent / build workflow
- Built **module by module**, end to end, one shipped before the next (per `.claude/CLAUDE.md`).
- Each module: design spec → backend → frontend → integrate → review → test → document → ship.
- Verified every step (read diffs, `lint`+`build`, hit live endpoints, clicked flows) rather than trusting agent output.
- Commits are small and conventional, scoped per module; push only with explicit user permission.

## Design workflow
- Design source of truth: the Claude Design project **"Enterprise E-Commerce Design System"** (`claude.ai/design`), imported via the design MCP.
- The customer storefront is driven by **`Storefront.dc.html`** (Landing, Catalog, Product, Cart, Checkout, Account, system states, navbar/footer, light+dark tokens, responsive breakpoints). Admin (modules 7–9) will come from `Admin.dc.html`.
- Design tokens are mapped onto the existing MUI theme (light + dark) — never hardcoded.

## Environment note
- The configured MongoDB Atlas URI (`cluster0.fi3dv.mongodb.net`) is **unreachable from the build environment** (SRV DNS refused). For verification we run a local Docker `mongo:7` and pass `MONGODB_URI=mongodb://127.0.0.1:27017/elitecart` inline. **The committed `.env` is left as-is** — in an environment that can reach Atlas, the app runs unchanged.

## Decisions & trade-offs (by module)

### Module 0 — Foundation
- **API response shape:** raw results, no envelope wrapper (matches existing controllers). Errors normalized by the global filter to `{ statusCode, message, error }`.
- **Auth data layer:** RTK Query (one `baseApi`, feature slices via `injectEndpoints`) over a hand-rolled fetch client — matches `rules/frontend/redux-data.md`.
- **JWT storage:** httpOnly cookies aren't available (the API returns the token in the body), so the token is kept in a `js-cookie` cookie (`sameSite=lax`, 1-day TTL) and decoded client-side for role-aware UI. Server remains the only real authority.
- **Cookie side effects** live in the token util / provider / 401 handler, not in reducers (keeps reducers pure + SSR-safe).
- **Routing:** public storefront browse vs. auth-gated cart/checkout/account vs. guest-only auth vs. admin-only — enforced by route-group guards (UX) on top of server guards (authority).
- **Seed:** users (admin + customer) now; sample products join the same script in Module 2.
- **Tests:** no runner yet; introduced in the first feature module per the project's own convention. Foundation verified via live integration checks.

### Module 1 — Auth
- **Design:** `Authentication.dc.html` (split brand + form layout).
- **Scope:** built functional **Sign In + Sign Up** (email/password). **Social login + Forgot/Reset/Verify/OTP** screens from the design are out of scope (need OAuth + email backends not in the assessment).
- Added optional **`name`** to the user model for sign-up; account module can split into first/last later.
- **Remember-me** kept visually; cookie TTL is the real control.
- Noted: `POST /auth/login` returns `201` (Nest default) — semantically `200`, left for polish.

### Module 2 — Product catalog
- **Design:** `Storefront.dc.html` (Landing + Catalog).
- **Product images:** `image` URL field; empty → themed placeholder tile (admin sets URLs in module 7). Chose URL over upload for breadth.
- **Catalog filters:** category is **single-select** (backend filters one category); rating/in-stock filters + grid/list toggle from the design are deferred (not in the list endpoint).
- **Pagination:** storefront uses numbered MUI `Pagination`; `components/custom-pagination` (table-oriented) is reserved for admin tables.
- **Routing:** public storefront lives in a `(storefront)` route group with navbar+footer shell; replaced the placeholder root `page.tsx`.
- **Env:** `next build` needs free RAM — local dev servers (a 1.2 GB FE dev) can starve it; reclaim orphaned node processes first.

### Module 3 — Product detail
- **Design:** `Storefront.dc.html` (Product detail).
- `GET /products/:id` (public); invalid/missing → 404. `/product/[id]` page with gallery, qty stepper, Description/Specs/Reviews tabs, related products.
- **Add to cart / Buy now auth-gate now**; real server-cart mutation lands in Module 4.
- **Specs/Reviews** derived from real fields + aggregate rating (no fabricated reviews); **wishlist heart** deferred to Module 6.

### Module 4 — Cart
- **Design:** `Storefront.dc.html` (Cart).
- Per-user server cart (persists across sessions); JWT-guarded, **ownership-scoped by token** (no IDOR). Totals (subtotal/discount/shipping/tax/total) **computed server-side** from current prices — client total never trusted.
- **Coupon WELCOME10 = 10% off** (server-validated, stored on cart; invalid → 400). Shipping free ≥ $100 else $8; tax 8%.
- Quantity **clamped to stock** on add/update; the hard oversell guard is the atomic decrement at checkout (Module 5).
- `useAddToCart` auth-gates guests → sign-in. **Proceed-to-checkout** routes to `/checkout` (built in Module 5).

### Module 5 — Checkout & Orders
- **Design:** `Storefront.dc.html` (Checkout stepper + success/failure).
- **Mock payment** (assessment allows a clearly-mocked step): card `4242…` succeeds, `4000…` declines → 402 (evaluated before any stock change, so a decline is a no-op). Full card never stored — only last-4.
- **Atomic guarded stock decrement** with rollback on shortfall (no overselling); order totals **recomputed server-side** from the cart; cart cleared on success.
- Orders start `pending`; status transitions are Module 8 (admin). Order history/tracking UI is Module 6 — confirmation currently links to home/catalog.

### Module 6 — Account & Order history
- **Design:** `Storefront.dc.html` (customer dashboard).
- `GET /orders` (own only) + `GET/PATCH /auth/profile`. `/account` dashboard: Profile (editable name), Orders list (status chip), Order detail with status timeline.
- **Scope:** order history + profile (the graded core). Design's **Addresses/Wishlist/Notifications/Settings** omitted — no backend in the assessment (not dead UI). Profile uses single `name`; email read-only.
- Order status is read-only here; transitions are admin (Module 8).

_Seeded credentials (local/dev): `admin@elitecart.com` / `Admin123!`, `customer@elitecart.com` / `Customer123!`._
