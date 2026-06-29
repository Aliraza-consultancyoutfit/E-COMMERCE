# Module 2 — Product Catalog (storefront read)

**Branch:** `feature/02-product-catalog` (stacked on auth/foundation)
**Design source:** `Storefront.dc.html` (Landing + Catalog screens)
**Status:** built + verified, awaiting ship approval

## What was built

### Backend
- **Product schema** (`name`, `description`, `price`, `oldPrice`, `image`, `category`, `stock`, `rating`, `reviews`) with text/price/createdAt indexes + `PRODUCT_MODEL` token.
- **`ProductQueryDto`** — `page`/`limit` (capped 100), `search`, `category`, `minPrice`/`maxPrice`, `sort` (allow-list: `price_asc|price_desc|newest|top_rated`), all with class-validator + Swagger.
- **`ProductsService.findAll`** — escaped-regex search (no operator injection), category/price filters, allow-listed sort, `skip/limit`, `.lean()`, returns `{ records, meta: { total, page, limit, pages } }`. **`getCategories`** aggregate → `[{ category, count }]`.
- **Public `ProductsController`** — `GET /products`, `GET /products/categories`.
- **Seed** extended with 14 products across 6 categories (idempotent).

### Frontend
- **`productApi`** RTK Query slice (`useGetProductsQuery`, `useGetCategoriesQuery`) + product types; `formatCurrency` util.
- **Storefront shell** — `StorefrontNavbar` (logo, links, search→catalog, theme switch, cart, account menu / Sign-in) + `StorefrontFooter`, composed in `StorefrontLayout`. New `(storefront)` route group (replaced the placeholder root `page.tsx`).
- **`ProductCard`** — reusable, theme-strict (placeholder when no image), category chip, optional stock badge, optional quick-add.
- **Landing** (`/`) — hero, trust strip, live categories, featured products (top-rated 4), promo/newsletter.
- **Catalog** (`/catalog`) — `CatalogFilters` (category single-select + price range) + sort select + server pagination; renders **all four states**: loading skeletons, empty (`no-data`), error (`api-error-state` + retry), data grid. Search read from `?search=` (navbar).

## Decisions (also in NOTES.md)
- **Images:** products carry an `image` URL (empty for seed) → the card shows a themed placeholder, matching the design's gradient-tile look. Admin (module 7) will set URLs.
- **Category filter is single-select** (backend filters by one `category`); the design's multi-checkbox look is simplified to one active category. Rating / in-stock-only filters and the grid/list toggle from the design are **deferred** (not in the list endpoint) — documented, not silently dropped.
- **Pagination:** storefront uses MUI `Pagination` (numbered, matches the design's pager); the table-oriented `custom-pagination` is reserved for admin tables.
- **Quick-add on cards** is wired in Module 4 (cart); cards currently open the product page.

## Verification
- BE `lint` + `build` ✓. Seed created 14 products.
- Live API (local Mongo): pagination + `price_asc` sort ✓; `category=Audio` → 3 ✓; `search=keyboard` ✓; `categories` → 6 ✓; price range ✓; invalid `sort` → **400** ✓.
- FE `lint` ✓, `tsc --noEmit` ✓, `next build` ✓ (`/`, `/catalog`, `/auth/*` compiled).
- **Env note:** `next build` initially OOM'd due to ~17 stray local node processes (a 1.2 GB dev server + orphaned watchers); after reclaiming orphaned/duplicate processes (keeping the user's `:3000`/`:5000`) the build passed.

## Tests
Test runner still pending (Module 2 focused on breadth); endpoints verified via live API. The Jest/Vitest runner setup is the next testing checkpoint.
