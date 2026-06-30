import { baseApi } from "@/store/base-api";
import type {
  Address,
  CreateAddressArgs,
  DeleteAddressResponse,
  UpdateAddressArgs,
} from "./addresses.types";

export const addressesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query<Address[], void>({
      query: () => ({ url: "/addresses" }),
      providesTags: ["Address"],
    }),
    createAddress: builder.mutation<Address, CreateAddressArgs>({
      query: (body) => ({ url: "/addresses", method: "POST", body }),
      invalidatesTags: ["Address"],
    }),
    updateAddress: builder.mutation<Address, UpdateAddressArgs>({
      query: ({ id, body }) => ({
        url: `/addresses/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Address"],
    }),
    deleteAddress: builder.mutation<DeleteAddressResponse, string>({
      query: (id) => ({ url: `/addresses/${id}`, method: "DELETE" }),
      invalidatesTags: ["Address"],
    }),
    setDefaultAddress: builder.mutation<Address, string>({
      query: (id) => ({ url: `/addresses/${id}/default`, method: "PATCH" }),
      invalidatesTags: ["Address"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} = addressesApi;
