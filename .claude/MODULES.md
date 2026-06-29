# Module Roadmap & Status

Build **top to bottom**, one module fully shipped before the next. Update **Status** and **Shipped commit** as you go.
Status values: `⬜ todo` · `🟡 in-progress` · `✅ shipped`.

The order follows the spec's suggested checklist: foundation → auth → storefront reads → cart → checkout/orders → admin → dashboard → recommendations.

| # | Module | Scope (BE + FE) | Depends on | Status | Shipped commit |
|---|--------|-----------------|------------|--------|----------------|
| 0 | **Foundation** | DB connection (done), shared response/error filter, `RolesGuard` + `@Roles()`, FE Redux `store/` + API/token layer + route guards + route constants, **seed script** (admin + customer + sample products) | — | ✅ shipped | `feature/00-foundation` |
| 1 | **Auth** | register/login/me (done) → harden: roles in JWT, GuestGuard/(auth) + AuthGuard, sign-in/sign-up UI, session persistence | 0 | ✅ shipped | `feature/01-auth` |
| 2 | **Product catalog (storefront read)** | Product schema (name, description, price, image, category, stock); list endpoint with **search + category filter + price range + sort (price/newest) + pagination**; storefront catalog page with filters/sort/pagination using shared table/cards | 0,1 | ✅ shipped | `feature/02-product-catalog` |
| 3 | **Product detail** | get-one endpoint; detail page with full info + quantity selector + add-to-cart | 2 | ✅ shipped | `feature/03-product-detail` |
| 4 | **Cart** | Cart schema (per user); add/remove/update qty; **persists across sessions for logged-in user**; line totals + order total computed server-side | 1,3 | ⬜ todo | |
| 5 | **Checkout & Orders** | Order schema; checkout flow with **mock / Stripe test-mode** payment; create order on success; **decrement stock atomically**; reject ordering > stock; recompute price server-side (no client-trusted totals); order confirmation page | 4 | ⬜ todo | |
| 6 | **Order history (customer)** | list-my-orders endpoint (own orders only) + status; customer order history page | 5 | ⬜ todo | |
| 7 | **Admin — product management** | admin-only CRUD for products; image upload **or** URL (document choice); admin product table + create/edit modal + delete confirm | 2 (admin guard from 0) | ⬜ todo | |
| 8 | **Admin — order management** | admin list-all-orders; update status `pending → processing → shipped → delivered` (+ `cancelled`) with **valid-transition enforcement**; admin orders table + status control | 5,6 | ⬜ todo | |
| 9 | **Admin — dashboard** | analytics: total sales, order count by status, top-selling products; **at least one chart** (ApexCharts via `components/chart`) | 8 | ⬜ todo | |
| 10 | **Product recommendations** (open-ended) | "suggestions relevant to them" — pick & document an interpretation (e.g. same-category + co-purchased + recently-viewed fallback to top-sellers); endpoint + storefront "Recommended for you" strip | 2,5 | ⬜ todo | |
| 11 | **Polish & submission** | seed verified, README (setup, env, seeded creds), NOTES.md (agent workflow, design workflow, assumptions, trade-offs), clean-clone dry run | all | ⬜ todo | |

## Notes on ambiguous decisions (mirror into NOTES.md)

Record every reasoned decision here as you make it — payment approach (mock vs Stripe test), image upload vs URL, recommendation interpretation, pagination defaults, etc. Each module doc (`docs/modules/<n>-<module>.md`) should also capture its own decisions.

## Per-module definition of done

A module is **shipped** only when all are true:
- [ ] Design spec produced (`@design-figma`) and reflected in the UI
- [ ] BE: endpoints + DTO validation + Swagger; `lint` + `build` green
- [ ] FE: themed (light **and** dark), reuses shared components; `lint` + `build` green
- [ ] FE ↔ BE wired and the flow verified running against a live API
- [ ] Reviewed (code + security; api/a11y where relevant) and findings addressed
- [ ] Meaningful tests written **and passing**
- [ ] `docs/modules/<n>-<module>.md` written (what, decisions, caught mistakes, tests)
- [ ] User gave permission, then committed + pushed; this table + roadmap updated
