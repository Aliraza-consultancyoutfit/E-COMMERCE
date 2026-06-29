import { baseApi } from "@/store/base-api";
import type { StoreSettings } from "./settings.types";

const SETTINGS_TAG = { type: "User" as const, id: "SETTINGS" };

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<StoreSettings, void>({
      query: () => ({ url: "/settings" }),
      providesTags: [SETTINGS_TAG],
    }),
    updateSettings: builder.mutation<StoreSettings, Partial<StoreSettings>>({
      query: (body) => ({ url: "/settings", method: "PUT", body }),
      invalidatesTags: [SETTINGS_TAG],
    }),
  }),
  overrideExisting: false,
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;
