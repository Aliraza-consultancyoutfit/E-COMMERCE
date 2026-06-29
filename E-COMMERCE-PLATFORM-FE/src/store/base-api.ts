import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { PATHS } from "@/constants/routes";
import { getToken, removeToken } from "@/utils/auth-token";
import { logout } from "@/store/auth/auth.slice";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api";

const UNAUTHORIZED = 401;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

/** Wraps the base query so a 401 clears the session and bounces to sign-in. */
const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === UNAUTHORIZED) {
    removeToken();
    api.dispatch(logout());
    if (
      typeof window !== "undefined" &&
      window.location.pathname !== PATHS.auth.signIn
    ) {
      window.location.href = PATHS.auth.signIn;
    }
  }

  return result;
};

export const TAG_TYPES = [
  "Product",
  "Cart",
  "Order",
  "User",
  "Recommendation",
  "Wishlist",
  "Address",
  "Notification",
] as const;

/** The single RTK Query API. Feature slices extend it via injectEndpoints. */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: TAG_TYPES,
  endpoints: () => ({}),
});
