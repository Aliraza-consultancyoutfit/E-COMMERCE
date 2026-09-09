import { baseApi } from "@/store/base-api";
import type {
  Product,
  ProductCategory,
  ProductListResponse,
  ProductQueryParams,
  ProductReview,
  CreateReviewArgs,
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
    getProductReviews: builder.query<ProductReview[], string>({
      query: (productId) => ({ url: `/products/${productId}/reviews` }),
      providesTags: (_result, _error, productId) => [
        { type: "Review", id: productId },
      ],
    }),
    createProductReview: builder.mutation<ProductReview, CreateReviewArgs>({
      query: ({ productId, ...body }) => ({
        url: `/products/${productId}/reviews`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Review", id: productId },
        { type: "Product", id: productId },
        "Product",
      ],
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
  useGetProductReviewsQuery,
  useCreateProductReviewMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
