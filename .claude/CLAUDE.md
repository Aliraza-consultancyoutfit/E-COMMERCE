# E-Commerce Platform — Agent Operating Manual

A customer **storefront** + **admin panel** sharing one **NestJS/MongoDB** API, with a **Next.js/MUI** frontend.
This is a supervised, timed build. **Guiding principle: working over polished, coherent over complete.** Breadth that connects end-to-end beats depth in one corner.

> **Do not re-scan the repo.** The full, accurate file map is in [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md). Read it once; trust it. Regenerate with `/refresh-structure` only after structural changes.

---

## How we work: module by module

We build the app **one module at a time, end to end**, never half-wiring many things at once. Each module runs the same pipeline, orchestrated by **`@orchestrator`** (see `agents/orchestrator.md`):

```
1. DESIGN     →  @design-figma pulls/derives the Figma design → writes design spec
2. BACKEND    →  @be-developer builds schema + DTOs + service + controller (Swagger)
3. FRONTEND   →  @fe-developer builds the section/page using SHARED components + theme
4. INTEGRATE  →  wire FE ↔ BE, verify the flow runs against a live API
5. REVIEW     →  @code-reviewer (+ @security-reviewer / @api-reviewer / @accessibility-reviewer)
6. TEST       →  @qa-tester writes + runs meaningful test cases for the module
7. DOCUMENT   →  write .claude/docs/modules/<module>.md (what was built, decisions, tests)
8. SHIP       →  ask the user for permission, then commit + push this module, then start the next
```

**Hard rule:** finish and ship one module before starting the next. The module roadmap, scope, and live status live in [MODULES.md](MODULES.md) — update it as you go.

The full step-by-step contract is the `/module-build` skill. Run it with `/module-build <module-name>`.

---

## Commands

**Backend** (`cd E-COMMERCE-PLATFORM-BE` first):
```bash
npm install
npm run start:dev        # watch mode, http://localhost:5000, Swagger at /api/docs
npm run build
npm run lint
npm run format
# (test runner is added in the first module that needs it — see /module-test)
```

**Frontend** (`cd E-COMMERCE-PLATFORM-FE` first):
```bash
npm install
npm run dev              # http://localhost:3000 (turbopack)
npm run build
npm run lint
```

**Before shipping a module:** BE → `npm run lint && npm run build`; FE → `npm run lint && npm run build`. Both must be green.

---

## Non-negotiables (assessment cross-cutting requirements)

These are graded as heavily as features. Every module must respect them:

- **Theme — strict.** Light *and* dark are both implemented. **Never hardcode a color, spacing, or font size.** Pull everything from the theme (`theme/`, `theme.palette.*`, `PALETTE_MODE`). New colors go into `theme/dark/create-palette.ts` *and* `theme/light/create-palette.ts`. See `rules/frontend/mui-theming.md`.
- **Reuse common components.** Before building UI, check `components/` (forms, table, chart, pagination, skeletons, dialogs, chip-status, etc.). Build new shared pieces only when nothing fits — and put them in `components/`, not inline. See `rules/frontend/components.md`.
- **Layouts.** Each route group has a deliberate shell (`layouts/{admin,auth,user,root}`). Pages render a `ui/<area>/<feature>` section — keep `page.tsx` thin.
- **Validation on both sides.** Server: DTOs with class-validator (already enforced by global `ValidationPipe`). Client: yup schema + RHF. Never trust the client.
- **Error handling.** Proper HTTP status codes, typed Nest exceptions, no raw stack traces to users. FE shows `api-error-state`/toasts, never a blank screen.
- **Data integrity.** Money, stock, and status must stay correct. Guard the edge cases: ordering more than stock, price tampering, concurrent stock decrement, status transitions that skip steps.
- **Security.** Passwords hashed (bcrypt), JWT enforced where required, admin endpoints behind a role guard, secrets only in `.env` (never committed). See `rules/security.md`.
- **Auth & authorization.** A customer only ever sees/acts on their own cart and orders. Admin panel + admin endpoints are admin-only.

---

## Architecture in one screen

- **Backend:** NestJS feature modules under `src/app/modules/`. Mongoose schemas + DI model tokens in `libs/shared/src`. JWT via passport, Swagger at `/api/docs`, global `api` prefix. Single Mongo database. **Decisions live in `rules/backend/*`.**
- **Frontend:** App Router with `(admin)`, `(auth)`, `(user)` route groups → shell `layouts/` → feature `ui/` sections → shared `components/` → MUI `theme/`. State via Redux Toolkit; build the `store/` + API layer in the first product module and keep it consistent. **Decisions live in `rules/frontend/*`.**

Full map + "where new code goes" table: [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md).

---

## Agents (`.claude/agents/`)

| Agent | Role |
|---|---|
| `@orchestrator` | **The leader.** Drives the module-by-module pipeline, delegates, gates on review, asks before shipping. |
| `@design-figma` | Pulls/derives the Figma design for a module, produces a build-ready design spec mapped to theme tokens + shared components. |
| `@be-developer` | Implements NestJS + Mongoose features (schema, DTO, service, controller, Swagger). |
| `@fe-developer` | Implements Next.js/MUI sections + pages using shared components and the theme. |
| `@qa-tester` | Writes and runs meaningful test cases per module (Jest for BE, Vitest/Playwright for FE). |
| `@code-reviewer` | Quality, correctness, maintainability — the main review gate. |
| `@security-reviewer` | Authn/authz, secrets, injection, data exposure, money/stock integrity. |
| `@api-reviewer` | REST conventions, status codes, Swagger accuracy, DTO validation. |
| `@accessibility-reviewer` | WCAG 2.1 AA, keyboard, contrast in **both** themes. |
| `@responsiveness-reviewer` | Responsive layout across breakpoints — no overflow, fluid sizing, mobile-adapted tables/charts/modals, touch targets. |

## Skills / slash commands (`.claude/skills/`)

| Command | Does |
|---|---|
| `/module-build <name>` | Run the full 8-step module pipeline (the headline workflow). |
| `/design-sync <name>` | Step 1 only: produce the design spec for a module. |
| `/be-endpoint <name>` | Scaffold a Nest module/endpoint (schema → DTO → service → controller → Swagger). |
| `/fe-page <name>` | Scaffold a themed page + section reusing shared components. |
| `/module-test <name>` | Write + run the module's test cases (sets up the test runner first time). |
| `/module-ship <name>` | Lint+build gate → write the module doc → **ask permission** → commit + push. |
| `/refresh-structure` | Regenerate `PROJECT-STRUCTURE.md` from the current tree. |

## Rules (`.claude/rules/`) — auto-loaded, do not duplicate here

Cross-cutting: `code-style.md` · `security.md` · `error-handling.md` · `git-workflow.md`
Backend: `backend/nestjs-patterns.md` · `backend/mongoose-patterns.md` · `backend/dto-validation.md` · `backend/auth-authorization.md`
Frontend: `frontend/nextjs-react.md` · `frontend/mui-theming.md` · `frontend/redux-data.md` · `frontend/forms.md` · `frontend/tables.md` · `frontend/components.md`

---

## Supervision & verification (this is graded)

The assessment scores **how well the agent is driven and verified**, not just the output. So:
- After each agent finishes, **the orchestrator (and you) verify** — read the diff, run lint/build, hit the endpoint, click the flow. Don't accept output blind.
- Record caught mistakes and corrections in the module doc (`docs/modules/<module>.md`). These are explicitly valued.
- When a requirement is genuinely ambiguous (e.g. the open-ended "relevant product suggestions"), make a reasoned decision and **document it in the module doc + NOTES.md**, don't let the agent silently guess.

## Don'ts

- Don't push to `main` directly, don't force-push, don't `git push` without explicit user permission (enforced by hooks).
- Don't commit secrets or `.env`. Don't edit generated/lock files or `.next`/`dist`.
- Don't start a new module while the current one is unshipped.
- Don't hardcode colors/spacing or bypass the shared component library.
- Don't integrate real payments — Stripe **test mode** or a clearly-mocked step only.
