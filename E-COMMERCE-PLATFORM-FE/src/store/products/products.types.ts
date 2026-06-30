export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  oldPrice: number;
  image: string;
  images?: string[];
  category: string;
  stock: number;
  rating: number;
  reviews: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ProductListResponse {
  records: Product[];
  meta: PaginationMeta;
}

export interface ProductCategory {
  category: string;
  count: number;
}

export type ProductSort = "price_asc" | "price_desc" | "newest" | "top_rated";

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSort;
}
