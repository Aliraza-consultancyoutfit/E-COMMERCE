---
paths:
  - "E-COMMERCE-PLATFORM-FE/**"
---

# Redux Toolkit & Data Layer

`@reduxjs/toolkit` + `react-redux` are installed but the `store/` and API layer are **not built yet**. Build them **once, in module 0 (or the first product module)**, then reuse everywhere. Do not create a second pattern later.

## Decide the data approach once
Two acceptable options — pick one, document it in the module doc, and stay consistent:
- **RTK Query** (recommended): one `baseApi = createApi({ baseQuery: fetchBaseQuery({ baseUrl, prepareHeaders }) })`, then `injectEndpoints` per feature. Token attached in `prepareHeaders` from `js-cookie`. Cache tags for invalidation.
- **Typed fetch client + RTK slices**: a single `apiClient` that injects the JWT and normalizes errors, with slices for auth/cart.

Either way:
- **One** store (`store/index.ts`) with a typed `RootState`/`AppDispatch`; provide it via a `<ReduxProvider>` wired into the root layout (alongside the existing theme/settings providers).
- **One** place that attaches the JWT (from `js-cookie`) and **one** place that normalizes API errors → message for toasts/`api-error-state`.

## Conventions
- Base URL from an env var (`NEXT_PUBLIC_API_BASE_URL`, default `http://localhost:5000/api`). Never hardcode in components.
- Auth state (current user, token) in a dedicated slice; decode role with `jwt-decode` for guard checks.
- Mutations: `.unwrap()` + try/catch → success/error toast (`react-hot-toast`); surface field errors to RHF.
- Queries: expose loading/error/data; the consuming section renders skeleton/empty/error/data.
- RTK Query: every query `providesTags`, every mutation `invalidatesTags`; register tag types centrally. Never a second `createApi`.

## Cart persistence requirement
A logged-in user's cart must survive sessions. Source of truth is the **server** cart (per-user, by `@CurrentUser().sub`); the client reads/writes via the API and may keep a lightweight cached slice for UI snappiness. Don't rely on `localStorage` alone for a logged-in user.
