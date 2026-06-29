import type { Product } from "@/store/products/products.types";

/** Every wishlist endpoint returns the full populated product list. */
export type WishlistResponse = Product[];
