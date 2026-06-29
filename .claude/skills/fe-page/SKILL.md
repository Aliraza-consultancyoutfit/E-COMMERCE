---
name: fe-page
description: Scaffold a themed Next.js page + feature section reusing the shared component library and the data layer. Use when the user says "build the <X> page/screen" or "/fe-page <X>".
---

# /fe-page <feature>

Delegate to **`@fe-developer`** (or do directly for a small change). Working dir: `E-COMMERCE-PLATFORM-FE/`.

## Order of operations
1. **Read the design spec** `../../context/<feature>-design.md` (it names the components + tokens) and a similar existing `ui/<area>/...` section.
2. **Data layer** — consume the API via the project's single data layer (RTK Query base / typed client). If it doesn't exist yet, build it once per `rules/frontend/redux-data.md`.
3. **Route constant** — add the path to the central route-constants file (create in module 0 if missing).
4. **Section** — `ui/<area>/<feature>/index.tsx` (+ `*.data.ts` for table columns / chart config). All UI here.
5. **Page** — `app/(<group>)/.../page.tsx`: thin `"use client"` wrapper rendering the section; shell from `layouts/`.
6. **Forms/tables/charts** — reuse `components/react-hook-form/*`, `components/table` + `custom-pagination`, `components/chart`. Loading→`skeletons`, empty→`no-data`, error→`api-error-state`+toast.
7. **Guards** — protect `(user)`/`(admin)` routes; admin UI admin-only.
8. **Verify** — `npm run lint && npm run build`; **toggle light/dark** and confirm; grep new files for `#hex` / `style={{` and fix.

## Non-negotiables
- Theme tokens only, both modes (`rules/frontend/mui-theming.md`).
- Reuse shared components (`rules/frontend/components.md`); new shared pieces go in `components/`, not inline.
- `@/` imports, thin pages, sections do the work. Don't commit/push.
