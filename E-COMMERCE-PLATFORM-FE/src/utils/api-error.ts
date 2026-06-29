import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const DEFAULT_MESSAGE = "Something went wrong. Please try again.";

/**
 * Turns an RTK Query error (or any thrown value) into a user-friendly string.
 * Reads the backend's `{ message }` shape; falls back to a generic message so
 * raw error objects never reach the UI.
 */
export const getApiErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as FetchBaseQueryError).data as
      | { message?: string | string[] }
      | undefined;
    if (data?.message) {
      return Array.isArray(data.message) ? data.message[0] : data.message;
    }
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as SerializedError).message;
    if (message) {
      return message;
    }
  }

  return DEFAULT_MESSAGE;
};
