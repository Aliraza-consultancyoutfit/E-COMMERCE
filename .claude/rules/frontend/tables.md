---
paths:
  - "E-COMMERCE-PLATFORM-FE/**"
---

# Tables (lists)

Use the existing `components/table` (TanStack Table wrapper + `use-table.ts`) and `components/custom-pagination`. Don't hand-roll tables.

## Structure per feature
Colocate in `ui/<area>/<feature>/`:
- `<feature>.data.tsx` — column definitions (use TanStack `createColumnHelper`); render status with `components/chip-status`, actions with shared buttons/dialogs.
- `index.tsx` — the section: fetches via the data layer, wires search/filter/sort/pagination, renders the table with all states.

## Server-side everything
- Pagination, filtering, sorting happen on the **server** (the spec requires not loading everything at once). Send `page`/`limit`/`search`/filters/`sort` to the API; render only the current page.
- Pagination math matches the backend: `skip = (page - 1) * limit`. Use the API's `meta.pages`/`meta.total` to drive `components/custom-pagination`.

## States (always render all four)
- Loading → `components/skeletons` (`skeleton-table`).
- Empty → `components/no-data`.
- Error → `components/api-error-state` (+ toast).
- Data → the table.

## Admin vs storefront
- Admin lists (products, orders) use the full table with row actions (edit/delete/status).
- Storefront catalog may use a card grid instead of a table, but still drives off the **same** server query params (search/filter/sort/pagination). Keep the query logic shared.
