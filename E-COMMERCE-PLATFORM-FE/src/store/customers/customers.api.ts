import { baseApi } from "@/store/base-api";
import type {
  CustomerDetail,
  CustomerQuery,
  CustomersResponse,
} from "./customers.types";

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<CustomersResponse, CustomerQuery>({
      query: (params) => ({ url: "/users/customers", params }),
      providesTags: ["User"],
    }),
    getCustomer: builder.query<CustomerDetail, string>({
      query: (id) => ({ url: `/users/customers/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetCustomersQuery, useGetCustomerQuery } = customerApi;
