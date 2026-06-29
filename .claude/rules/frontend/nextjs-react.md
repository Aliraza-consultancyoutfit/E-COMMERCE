---
paths:
  - "E-COMMERCE-PLATFORM-FE/**"
---

# Next.js / React

App Router, React 19, Next 15 (Turbopack). Match the existing `app/`, `layouts/`, `ui/` split.

## Route groups → layouts → sections (the three layers)
- **Routes** live in `app/(admin|auth|user)/...`. Route groups separate storefront, admin, and guest areas without affecting the URL.
- **Shells** live in `layouts/{root,admin,auth,user}` — nav, chrome, theme/settings providers. The route-group `layout.tsx` renders the matching shell.
- **Feature UI** lives in `ui/<area>/<feature>/index.tsx` (+ `*.data.ts` for table columns / chart config). Mirror `ui/admin/dashboard`.
- **`page.tsx` is a thin `"use client"` wrapper** that renders its section. No data logic, no layout chrome in the page file.

## Components vs sections
- Reusable, generic → `components/<kebab>/` (with `*.interface.ts`, optional `use-*.ts`, `*.style.ts`/`*.data.ts`). See `components.md`.
- Page/feature-specific composition → `ui/<area>/<feature>/`.

## Client/server
- This app renders interactively on the client (MUI + Redux). Sections and pages that use hooks/state are `"use client"`. Keep `app/layout.tsx` server-side as it is (reads headers, sets up `RootLayout`).

## Hooks & state
- Component-local UI state → `useState`. Reusable logic → a `use-*` hook colocated with the feature or in `components/<x>/use-*.ts` (follow `components/table/use-table.ts`).
- Server/shared data → the Redux Toolkit data layer (see `redux-data.md`) — not ad-hoc `fetch` scattered in components.
- `useEffect`: correct deps, cleanup subscriptions/listeners. Avoid effects for derived state.

## Navigation & routes
- Use the central route-constants file for every path (create it in module 0). `next/link` + `useRouter` for navigation. `nprogress` for route transitions is already a dep — wire once.

## Performance
- Memoize expensive children (`React.memo`, `useMemo`, `useCallback`) only where it matters. Lazy-load heavy, below-the-fold pieces. Use `next/image` for product images where practical.
