import { baseApi } from "@/store/base-api";
import type { AppDispatch } from "@/store";
import { removeToken } from "@/utils/auth-token";
import { logout } from "./auth.slice";

/**
 * Single sign-out path: drop the cookie, clear the auth slice, and purge the
 * RTK Query cache. Without the cache reset, a previous user's cached profile,
 * cart, and orders leak into the next session (or persist after sign-out).
 */
export const signOut = () => (dispatch: AppDispatch) => {
  removeToken();
  dispatch(logout());
  dispatch(baseApi.util.resetApiState());
};
