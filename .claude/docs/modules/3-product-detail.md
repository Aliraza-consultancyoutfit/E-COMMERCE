# Module 3 — Product Detail

**Branch:** `feature/03-product-detail` (stacked on catalog/auth/foundation)
**Design source:** `Storefront.dc.html` (Product detail screen)
**Status:** built + verified, awaiting ship approval

## What was built

### Backend
- **`GET /products/:id`** (public) → `ProductsService.findById`. Invalid `ObjectId` or missing document → **404** `Product not found`. Declared after `/products/categories` so the literal route isn't shadowed by `:id`.

### Frontend
- **`getProduct(id)`** RTK Query endpoint (tagged `{ type: 'Product', id }`); `useGetProductQuery`.
- **`/product/[id]`** route — server page resolves the param and renders `ProductDetail` (client).
- **`ProductDetail`** section, faithful to the Figma:
  - Breadcrumb (Home / Category / name).
  - Gallery: square tile with the category gradient + faded category glyph (or the product image), plus 4 thumbnails (first active).
  - Info: category chip, name, 5-star rating + count, price + struck old price + **Save %** badge, stock status dot, description, **QuantityStepper** (clamped 1..stock), Add to cart / Buy now, and a free-shipping / returns / warranty row.
  - Tabs: **Description** (real), **Specifications** (table from real fields), **Reviews** (aggregate rating + count).
  - **You might also like** — same-category products via `ProductCard`.
  - All four states: loading skeleton, error (`api-error-state` + retry), not-found (`no-data` → catalog), data.
- New reusable **`QuantityStepper`** + **MinusIcon** (also used by the cart in Module 4).

## Decisions (also in NOTES.md)
- **Add to cart / Buy now auth-gate now** (guests → toast + sign-in); the actual server-cart mutation lands in **Module 4** (cart). Documented, not silently dead.
- **Specs/Reviews** are derived from real product fields + the aggregate rating — the schema has no per-spec/per-review data, and I won't fabricate sample reviews. Honest over fake.
- **Wishlist heart** from the design is deferred to Module 6 (wishlist); no wishlist backend yet.
- Gallery thumbnails are decorative (single image/none in the seed); they reuse the category gradient.

## Verification
- BE `lint` + `build` green. Live API (`:5000`, local Mongo): `GET /products/:id` → real product; `/categories` still works (not shadowed); invalid id and valid-but-missing id → **404**.
- FE `lint` ✓, `tsc --noEmit` ✓, `next build` ✓ — `/product/[id]` route present (3.2 kB).
- Integration: refreshed the `:5000` build so the detail page's `getProduct` call returns live data.

## Caught / fixed during the build
- Memory pressure (orphaned dev servers, incl. a ~900 MB one) was OOM-ing lint/tsc/build — reclaimed orphans (kept `:5000`) and builds passed.
- Fixed a syntax error in an in-flight `auth-brand-panel` edit (`course="pointer"` → `cursor: "pointer"`) that would have broken the build.

## Tests
Still verified via live API + build; the Jest/Vitest runner is the next testing checkpoint.
