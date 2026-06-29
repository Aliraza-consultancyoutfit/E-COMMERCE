import { baseApi } from "@/store/base-api";
import type {
  AddToCartArgs,
  CartResponse,
  UpdateCartItemArgs,
} from "./cart.types";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<CartResponse, void>({
      query: () => ({ url: "/cart" }),
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation<CartResponse, AddToCartArgs>({
      query: (body) => ({ url: "/cart/items", method: "POST", body }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation<CartResponse, UpdateCartItemArgs>({
      query: ({ productId, quantity }) => ({
        url: `/cart/items/${productId}`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeCartItem: builder.mutation<CartResponse, string>({
      query: (productId) => ({
        url: `/cart/items/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    applyCoupon: builder.mutation<CartResponse, string>({
      query: (code) => ({ url: "/cart/coupon", method: "POST", body: { code } }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation<CartResponse, void>({
      query: () => ({ url: "/cart", method: "DELETE" }),
      invalidatesTags: ["Cart"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useApplyCouponMutation,
  useClearCartMutation,
} = cartApi;
