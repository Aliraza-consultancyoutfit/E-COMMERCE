import { baseApi } from "@/store/base-api";
import type {
  ProductCategory,
  ProductListResponse,
  ProductQueryParams,
} from "./products.types";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductListResponse, ProductQueryParams>({
      query: (params) => ({ url: "/products", params }),
      providesTags: ["Product"],
    }),
    getCategories: builder.query<ProductCategory[], void>({
      query: () => ({ url: "/products/categories" }),
      providesTags: ["Product"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetProductsQuery, useGetCategoriesQuery } = productApi;
