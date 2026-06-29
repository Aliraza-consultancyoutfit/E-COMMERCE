import { baseApi } from "@/store/base-api";

export type ActivityType = "order" | "product" | "customer" | "admin";

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  actor: string | null;
  action: string;
  target: string;
  createdAt: string;
}

export const activityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivity: builder.query<ActivityEvent[], void>({
      query: () => ({ url: "/activity" }),
      providesTags: ["Order", "Product", "User"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetActivityQuery } = activityApi;
