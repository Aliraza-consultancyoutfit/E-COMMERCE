import { baseApi } from "@/store/base-api";
import type { WishlistResponse } from "./wishlist.types";

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<WishlistResponse, void>({
      query: () => ({ url: "/wishlist" }),
      providesTags: ["Wishlist"],
    }),
    addToWishlist: builder.mutation<WishlistResponse, string>({
      query: (productId) => ({ url: `/wishlist/${productId}`, method: "POST" }),
      invalidatesTags: ["Wishlist"],
    }),
    removeFromWishlist: builder.mutation<WishlistResponse, string>({
      query: (productId) => ({
        url: `/wishlist/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi;
