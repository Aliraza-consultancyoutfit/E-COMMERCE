# Module 0 — Foundation

**Branch:** `feature/00-foundation`
**Status:** built + verified, awaiting ship approval

## What was built

### Backend (`E-COMMERCE-PLATFORM-BE`)
- **`@Roles(...roles)` decorator** (`libs/shared/src/decorators/roles.decorator.ts`) — sets `roles` metadata.
- **`RolesGuard`** (`libs/shared/src/guards/roles.guard.ts`) — reads required roles via `Reflector` and `request.user.role` (from the JWT). Returns `403` on mismatch. Use as `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(UserRole.ADMIN)`.
- **`AllExceptionsFilter`** (`libs/shared/src/filters/all-exceptions.filter.ts`) — global filter returning the consistent shape `{ statusCode, message, error }`. Logs stack traces server-side only (≥500); never leaks them to clients. Registered in `main.ts`.
- **Seed script** (`src/seed.ts`, `npm run seed`) — idempotently creates an ADMIN and a USER (bcrypt-hashed via the shared util). Skips existing users. Sample products will be added to this same script in Module 2.
- Role is already signed into the JWT (`{ sub, email, role }`) and returned by `JwtStrategy.validate` → exposed via `@CurrentUser()`. No change needed.

### Frontend (`E-COMMERCE-PLATFORM-FE`)
- **Redux store** (`store/index.ts`) — single store, typed `RootState`/`AppDispatch`, typed hooks (`store/hooks.ts`).
- **RTK Query base API** (`store/base-api.ts`) — one `createApi` + `fetchBaseQuery`; attaches the JWT from the cookie in `prepareHeaders`; a 401 wrapper clears the session and redirects to sign-in; central `tagTypes` (`Product`, `Cart`, `Order`, `User`, `Recommendation`).
- **Auth data layer** — pure `auth.slice` (`user`, `token`, `isInitialized`), `authApi` (`login`/`register`/`me`), `auth.types`.
- **Token layer** (`utils/auth-token.ts`) — `js-cookie` get/set/remove + `jwt-decode` role decode with expiry check.
- **API error normalizer** (`utils/api-error.ts`) — RTK Query error → user-friendly string for toasts/error states.
- **Route constants** (`constants/routes.ts`) — `PATHS`, `ROUTE_ACCESS`, `REDIRECTS` (single source of truth + role-per-group).
- **Route guards** (`guards/`) — `AuthGuard` (customer), `GuestGuard` (auth group), `RoleGuard` (admin), with a themed full-screen fallback.
- **Providers** — `ReduxProvider` hydrates the session from the cookie on first mount; wired with `react-hot-toast` `Toaster` into the root layout shell.

## Decisions (also in NOTES.md)
- **Response shape:** raw service results, **no envelope** — matches the existing auth/users controllers. Errors use the filter's `{ statusCode, message, error }`.
- **Cookie I/O stays at the boundary** (token util + provider + 401 handler), not inside reducers — reducers remain pure and SSR-safe.
- **Routing structure:** storefront browse (`/`, `/catalog`, `/product/:id`) is **public**; `/cart`, `/checkout`, `/account` require auth; `(auth)` is guest-only; `(admin)` is admin-only. Account sub-views (profile/orders/addresses/…) are client tab state on one page, mirroring the design.
- **Seed scope:** users now; products added to the same script in Module 2 (the Product schema lands there).
- **Local DB for verification:** the configured Atlas URI (`cluster0.fi3dv…`) is unreachable from this environment (SRV DNS refused), so verification used a local Docker `mongo:7` via an inline `MONGODB_URI` override. **The committed `.env` was left untouched.**

## Verification (verify, don't trust)
- BE `npm run lint` ✓, `npm run build` ✓.
- `npm run seed` ✓ — created `admin@elitecart.com` / `customer@elitecart.com`.
- Live API checks (`MONGODB_URI` → local Mongo):
  - `POST /api/auth/login` (seeded admin) → JWT with `role:"admin"` + user object ✓
  - `GET /api/auth/me` without token → **401** clean JSON ✓
  - unknown route → **404** clean JSON via the filter ✓
- FE `npm run lint` ✓, `npm run build` ✓ (7 routes compiled).

## Caught / fixed during the build
- `.env.example` was swallowed by the FE `.env*` ignore rule → added a `!.env.example` exception so the placeholder is tracked.
- Atlas cluster unreachable → stood up Docker Mongo for verification instead of editing the user's `.env`.

## Tests
No unit-test runner yet — per the project's own note, the runner is set up in the first feature module that needs it (Module 2). Foundation was verified by the live integration checks above. `RolesGuard` + exception-filter unit tests will be added when the Jest runner is introduced.
