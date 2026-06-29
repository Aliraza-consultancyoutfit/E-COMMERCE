import { baseApi } from "@/store/base-api";
import type {
  AuthResponse,
  JwtPayload,
  LoginPayload,
  Profile,
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
    getProfile: builder.query<Profile, void>({
      query: () => ({ url: "/auth/profile" }),
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<Profile, { name?: string; avatar?: string }>({
      query: (body) => ({ url: "/auth/profile", method: "PATCH", body }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = authApi;
