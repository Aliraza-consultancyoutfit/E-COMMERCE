import { baseApi } from "@/store/base-api";
import type {
  CreateAdminArgs,
  TeamMember,
  TeamQuery,
  TeamResponse,
} from "./team.types";

export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdmins: builder.query<TeamResponse, TeamQuery>({
      query: (params) => ({ url: "/users/admins", params }),
      providesTags: ["User"],
    }),
    createAdmin: builder.mutation<TeamMember, CreateAdminArgs>({
      query: (body) => ({ url: "/users/admins", method: "POST", body }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAdminsQuery, useCreateAdminMutation } = teamApi;
