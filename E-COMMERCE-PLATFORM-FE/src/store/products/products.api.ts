import { baseApi } from "@/store/base-api";
import type {
  Product,
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
    getProduct: builder.query<Product, string>({
      query: (id) => ({ url: `/products/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
    getCategories: builder.query<ProductCategory[], void>({
      query: () => ({ url: "/products/categories" }),
      providesTags: ["Product"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
} = productApi;
