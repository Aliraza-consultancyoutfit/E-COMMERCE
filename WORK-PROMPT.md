# WORK PROMPT — E-Commerce Platform Build

> Paste this whole file as your instruction to Claude Code. The Figma design is **ready**. Build the full platform module by module, end to end, following every agent, rule, and convention already configured in `.claude/`. **Commit after every meaningful task — minimum 15 commits across the build — and ship (commit) each major module on completion.**

---

## 0. Operating contract (read first, do not skip)

You are the **`@orchestrator`**. Drive the build exactly as `.claude/CLAUDE.md` defines it. Before writing any code:

1. Read `.claude/CLAUDE.md`, `.claude/PROJECT-STRUCTURE.md`, and `.claude/MODULES.md`. **Trust the cached structure — do not re-scan the repo.**
2. Read the agent definitions in `.claude/agents/` and the rules in `.claude/rules/` (cross-cutting + backend + frontend). Follow them strictly; never duplicate or contradict them.
3. Work **one module at a time, fully shipped before the next.** Never start a new module while the current one is unshipped.

**Hard rules (non-negotiable):**
- **Theme strict** — light *and* dark both work. **Never hardcode a color, spacing, or font size.** Pull from `theme/`, `theme.palette.*`, `PALETTE_MODE`. New colors go into **both** `theme/dark/create-palette.ts` and `theme/light/create-palette.ts`.
- **Reuse shared components first** — check `components/` (forms, table, chart, pagination, skeletons, dialogs, chip-status, etc.) before building anything new. New shared pieces go in `components/`, not inline.
- **Thin pages** — `page.tsx` delegates to a `ui/<area>/<feature>` section; route groups use their `layouts/` shell.
- **Validate both sides** — server: class-validator DTOs (global `ValidationPipe` is on); client: yup + react-hook-form. Server is the source of truth.
- **Security & integrity** — bcrypt passwords, JWT on protected routes, admin endpoints behind `RolesGuard` + `@Roles(UserRole.ADMIN)`, ownership-scoped queries (no IDOR), atomic stock decrement, server-recomputed totals, valid status transitions only. Secrets only in `.env`.
- **Error handling** — typed Nest exceptions + correct HTTP codes, global exception filter, no stack traces to clients. FE renders all four states (loading / empty / error / data), toasts on mutations.
- **No pushing to `main`, no force-push, no `git push` without explicit user permission** (hooks enforce this).

---

## 1. Per-module pipeline (run this for every module)

For each module follow the 8 steps from `.claude/CLAUDE.md` (`/module-build <name>`):

```
1. DESIGN     → @design-figma: pull the READY Figma design for this module → write the design spec
                 mapped to theme tokens + shared components (.claude/docs/...).
2. BACKEND    → @be-developer: schema + DTOs + service + controller + guards + Swagger.
3. FRONTEND   → @fe-developer: themed page + ui/ section using SHARED components + theme.
4. INTEGRATE  → wire FE ↔ BE with RTK Query; verify the flow against a live API.
5. REVIEW     → @code-reviewer (+ @security-reviewer / @api-reviewer / @accessibility-reviewer
                 / @responsiveness-reviewer as relevant). Address findings.
6. TEST       → @qa-tester: meaningful test cases (Jest BE, Vitest/Playwright FE) — written AND passing.
7. DOCUMENT   → .claude/docs/modules/<n>-<module>.md (what built, decisions, caught mistakes, tests).
8. SHIP       → lint + build green both apps → ASK USER permission → commit + push → update MODULES.md.
```

**Verify, don't trust.** After each agent finishes, read the diff, run `npm run lint && npm run build`, hit the endpoint via Swagger (`/api/docs`), and click the flow. Record caught mistakes in the module doc.

---

## 2. Follow the Figma strictly — pixel-faithful, every single step, no detail missed

The Figma is **ready and is the source of truth**. Build **exactly** what it shows — do not invent, simplify, skip, or "improve" anything. Work professionally: no guessing, no placeholders left behind, no mistakes.

**For every module's UI, before coding:**
- Use the Figma MCP (`get_design_context`, `get_screenshot`, `get_variable_defs`, `get_metadata`, `download_assets`) to read the **actual** design for that screen.
- Enumerate **every frame and every state** the designer drew for that screen and build **all of them** — do not stop at the happy path.

**You MUST implement every UI state shown (or implied) in the design — none is optional:**
- **Loading** — skeletons (`components/skeletons`: table/form/chart) and spinners (`components/loader`), matching the Figma loading frame. Use `loading.tsx` at route level where appropriate.
- **Empty / no-data** — the "no data found" screen (`components/no-data`) with the exact illustration, copy, and CTA from Figma. Never a blank area.
- **Error** — `components/api-error-state` + `react-hot-toast`, matching the design's error treatment. Use `not-found.tsx` / error boundary for route-level failures.
- **Success / data** — the populated state, pixel-faithful.
- **Validation / inline field errors** — exactly as designed (error text, helper text, field states).
- **Interactive states** — hover, focus, active, disabled, selected, pressed, filled vs outlined, checked/unchecked — for every button, input, chip, row, and link.
- **Edge content** — long text truncation/wrap, large numbers, many list items, pagination boundaries, badge counts, currency/decimal formatting — handled as the design intends.
- **Dialogs / modals / drawers / toasts / tooltips / menus** — every overlay variant in the file.

**Fidelity rules:**
- **Map every Figma value to a theme token** — do not introduce raw hex/px. If the design needs a token that doesn't exist, add it to **both** light and dark `create-palette.ts` (and typography/spacing in `base/`), then reference it. Match exact spacing, radius, font size/weight/line-height, shadows, and gaps from the design.
- Reproduce **icons** (into `assets/icons/common/*.tsx`) and **images** (into `assets/images/common/*`) by downloading them from Figma via the MCP — reuse `assets/brand.ts`; do not hand-approximate.
- Match **micro-interactions/animations/transitions** shown in the design (use `framer-motion` / `nprogress` where the design calls for it).
- Match responsive behaviour across **every breakpoint** in Figma (mobile, tablet, desktop) — no horizontal overflow, fluid sizing, mobile-adapted tables/charts/modals, adequate touch targets.
- Verify **every screen and every state in BOTH light and dark themes** against the Figma frames before considering it done.

**Self-check before moving on:** open each Figma frame for the module side-by-side with the running app and confirm each state matches. If anything differs, fix it before review — do not defer.

---

## 3. Folder structure & file separation (always)

Keep code separated by responsibility — match the existing tree (`.claude/PROJECT-STRUCTURE.md`). Per feature, create distinct files:

**Backend** (`E-COMMERCE-PLATFORM-BE/`, kebab-case files, relative imports — no path aliases):
- Schema → `libs/shared/src/schemas/<name>.schema.ts` (+ DI token in `constants/models.constants.ts`).
- DTOs → `libs/shared/src/dto/<name>.dto.ts` (class-validator **and** `@ApiProperty`/`@ApiPropertyOptional` with examples; create/update/query DTOs separately).
- Feature module → `src/app/modules/<name>/` with `<name>.controller.ts`, `<name>.service.ts`, `<name>.module.ts`, and `guards/` where needed. Thin controllers, logic in services.

**Frontend** (`E-COMMERCE-PLATFORM-FE/`, `@/` alias, kebab-case files):
- Page → `app/(<group>)/.../page.tsx` (thin) → renders section in `ui/<area>/<feature>/index.tsx`.
- Feature interfaces → sibling `*.interface.ts`; table column / chart config → `*.data.ts` / `*.data.tsx`.
- Forms → `components/react-hook-form/*` wrappers inside `<FormProvider>`, with a co-located yup schema.
- Tables → `components/table` + `components/custom-pagination`; charts → `components/chart`.

---

## 4. API integration — RTK Query (build the data layer in the first product module)

In the first module that needs data (Foundation/Product catalog), establish and then **reuse consistently**:
- A Redux Toolkit `store/` with a single **RTK Query** base API (`createApi` + `fetchBaseQuery`) pointing at the `/api` prefix.
- A `baseQuery` that attaches the JWT from secure storage (`js-cookie` / `jwt-decode`), handles 401, and tags caches for invalidation.
- **One RTK Query API slice per module/resource** (e.g. `authApi`, `productApi`, `cartApi`, `orderApi`, `adminApi`), each with typed request/response interfaces. Define endpoints **module-wise and component-wise** so each section consumes its own hooks (`useGetProductsQuery`, `useAddToCartMutation`, …).
- Route-constants file + auth guards for `(admin)` / `(user)` / `(auth)` route groups. Surface server field errors back onto RHF fields; toast on success/failure.

Backend endpoints are created **module by module** to match these slices — only the endpoints each module needs, validated and documented in Swagger.

---

## 5. RBAC — Role-Based Access Control (backend-enforced, frontend-mirrored)

There are two roles: **`ADMIN`** and **`USER`** (customer) — `UserRole` enum already in `libs/shared/src/schemas/user.schema.ts`. RBAC is **graded heavily** (auth, authorization, IDOR). Follow `.claude/rules/security.md` and `.claude/rules/backend/auth-authorization.md`.

**The server is the only real authority. The frontend only mirrors it for UX — hiding a button is never authorization.**

### 5a. Backend — enforce server-side (Foundation module 0)
- **Role in the JWT.** Sign `role` (+ `sub`) into the JWT payload; `JwtStrategy.validate` returns `{ sub, role, ... }`, exposed via `@CurrentUser()`.
- **`RolesGuard` + `@Roles()` decorator.** Build in module 0: a `@Roles(UserRole.ADMIN)` metadata decorator and a `RolesGuard` that reads it via `Reflector` and checks `request.user.role`. Apply `JwtAuthGuard` **then** `RolesGuard` (e.g. `@UseGuards(JwtAuthGuard, RolesGuard)`).
- **Admin-only endpoints** — all admin product CRUD, all-orders list, and order-status updates carry `@Roles(UserRole.ADMIN)`. A `USER` hitting them gets **403 Forbidden**.
- **Ownership scoping (IDOR — the core risk).** Cart and order reads/writes are scoped by `@CurrentUser().sub` **server-side** — never by an id from the body/params alone. User B must never reach User A's cart or orders by changing an id (→ 404/403). Treat this as the default thing to prevent **and test**.
- **Public vs protected** — catalog browse/detail are public; everything user-specific requires `JwtAuthGuard`; everything admin requires both guards.
- **Swagger** — mark protected endpoints with `@ApiBearerAuth()` and document `401`/`403` responses.

### 5b. Frontend — mirror it for UX (Foundation + Auth)
- **Decode role from the JWT** (`jwt-decode`) and keep it in the Redux auth slice; persist the token in a cookie (`js-cookie`).
- **Route-group guards.** `(auth)` = guest-only (redirect logged-in users away); `(user)` = authenticated customers; `(admin)` = authenticated **and** `role === ADMIN` (redirect/deny others). A customer who types the admin URL is bounced.
- **Conditional UI** — show admin nav/actions only to admins, customer actions only to customers, auth-gated CTAs (add-to-cart/checkout) prompt sign-in for guests. This is UX only; the server still enforces.
- **401/403 handling** in the RTK Query `baseQuery` — 401 clears the session and redirects to sign-in; 403 shows a "not authorized" state/toast (never a blank screen).
- **A central role/route-permission constants file** (route constants + which role each route group needs) so guards and nav read from one source.

### 5c. RBAC verification (must test)
- `USER` token → admin endpoint = **403**; no token → protected endpoint = **401**.
- User B cannot read/modify User A's cart/orders by id = **404/403**.
- Customer cannot reach `(admin)` routes in the browser; admin links hidden for customers.
Record these checks in the module docs and `NOTES.md`.

---

## 6. Module order (from `.claude/MODULES.md`)

Build top to bottom; ship each before the next:

`0 Foundation` → `1 Auth` → `2 Product catalog` → `3 Product detail` → `4 Cart` → `5 Checkout & Orders` → `6 Order history` → `7 Admin product management` → `8 Admin order management` → `9 Admin dashboard (chart)` → `10 Product recommendations` → `11 Polish & submission`.

For the open-ended bits (e.g. recommendations, payment mock vs Stripe test, image upload vs URL, pagination defaults), make a **reasoned decision and document it** in the module doc + `NOTES.md`. Update `MODULES.md` status + shipped commit as you go.

---

## 7. Commits — MINIMUM 15, commit after every task

Git history is graded. Follow `.claude/rules/git-workflow.md`:
- **One feature branch per module:** `feature/<nn>-<module>` (e.g. `feature/02-product-catalog`), branched off `main`.
- **Conventional commits**, scoped to the module: `type(scope): summary` — `feat`, `fix`, `refactor`, `test`, `docs`, `chore`.
- **Commit as you go, in logical increments — at least 15 commits across the whole build.** Never end with one big "final commit" dump. A typical module yields several commits:
  ```
  feat(<scope>): schema + DTOs + model token
  feat(<scope>): service + controller + Swagger
  feat(<scope>): FE section/page with shared components + theme
  feat(<scope>): RTK Query slice + FE↔BE integration
  test(<scope>): module test cases
  docs(<scope>): module doc + decisions
  ```
- Each commit must leave the app **lint-clean and build-green** for the app(s) it touches. Don't stage `.env`, `node_modules`, `.next`, `dist`, or lockfile churn.
- Append to every commit message:
  ```
  Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
  ```
- **After completing each major module, commit it** — then **ask the user before `git push`** (push only on approval, at the ship step).

---

## 8. Definition of done (every module)

A module ships only when **all** are true (mirror `.claude/MODULES.md`):
- [ ] Design spec produced and reflected in the UI (matches Figma).
- [ ] BE: endpoints + DTO validation + Swagger; `lint` + `build` green.
- [ ] FE: themed (light **and** dark), reuses shared components; `lint` + `build` green.
- [ ] FE ↔ BE wired via RTK Query and verified running against a live API.
- [ ] Reviewed (code + security; api/a11y/responsiveness where relevant) and findings addressed.
- [ ] Meaningful tests written **and passing**.
- [ ] `docs/modules/<n>-<module>.md` written.
- [ ] Multiple incremental commits made; user gave permission; committed + pushed; `MODULES.md` updated.

---

## 9. Start now

1. Confirm you've read `.claude/CLAUDE.md`, `PROJECT-STRUCTURE.md`, `MODULES.md`, agents, and rules.
2. Begin **Module 0 — Foundation** via `/module-build foundation`: shared response/error filter, `RolesGuard` + `@Roles()`, FE Redux `store/` + RTK Query base API + token layer + route guards + route constants, and the seed script (admin + customer + sample products).
3. Commit incrementally throughout. After Foundation is green and reviewed, write its module doc, **ask permission**, commit + push, update `MODULES.md`, and move to Module 1 — Auth.

**Let's go — module by module, Figma-faithful, theme-strict, RTK Query, ≥15 commits, ship each major module.**
