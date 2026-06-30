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
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({ url: "/products", method: "POST", body }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation<Product, { id: string; body: Partial<Product> }>({
      query: ({ id, body }) => ({ url: `/products/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation<{ id: string; deleted: boolean }, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: ["Product"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
