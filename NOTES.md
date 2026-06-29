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

_Seeded credentials (local/dev): `admin@elitecart.com` / `Admin123!`, `customer@elitecart.com` / `Customer123!`._
