import { baseApi } from "@/store/base-api";
import type { CheckoutArgs, Order } from "./order.types";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkout: builder.mutation<Order, CheckoutArgs>({
      query: (body) => ({ url: "/orders/checkout", method: "POST", body }),
      // Product/category stock changes after a purchase, so refresh those too.
      invalidatesTags: ["Cart", "Order", "Product"],
    }),
    getMyOrders: builder.query<Order[], void>({
      query: () => ({ url: "/orders" }),
      providesTags: ["Order"],
    }),
    getOrder: builder.query<Order, string>({
      query: (id) => ({ url: `/orders/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCheckoutMutation,
  useGetMyOrdersQuery,
  useGetOrderQuery,
} = orderApi;
