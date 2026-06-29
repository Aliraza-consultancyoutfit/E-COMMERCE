import { baseApi } from "@/store/base-api";
import type {
  AuthResponse,
  JwtPayload,
  LoginPayload,
  RegisterPayload,
} from "./auth.types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    register: builder.mutation<AuthResponse, RegisterPayload>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    getMe: builder.query<JwtPayload, void>({
      query: () => ({ url: "/auth/me" }),
      providesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi;
