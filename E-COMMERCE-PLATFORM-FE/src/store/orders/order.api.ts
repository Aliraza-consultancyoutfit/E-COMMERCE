import { baseApi } from "@/store/base-api";
import type {
  AdminOrder,
  AdminOrderQuery,
  AdminOrdersResponse,
  AdminStats,
  CheckoutArgs,
  Order,
  OrderStatus,
} from "./order.types";

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
    getAllOrders: builder.query<AdminOrdersResponse, AdminOrderQuery>({
      query: (params) => ({ url: "/orders/all", params }),
      providesTags: ["Order"],
    }),
    getAdminOrder: builder.query<AdminOrder, string>({
      query: (id) => ({ url: `/orders/admin/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),
    getAdminStats: builder.query<AdminStats, void>({
      query: () => ({ url: "/orders/stats" }),
      providesTags: ["Order", "Product"],
    }),
    updateOrderStatus: builder.mutation<Order, { id: string; status: OrderStatus }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Order"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCheckoutMutation,
  useGetMyOrdersQuery,
  useGetOrderQuery,
  useGetAllOrdersQuery,
  useGetAdminOrderQuery,
  useGetAdminStatsQuery,
  useUpdateOrderStatusMutation,
} = orderApi;
