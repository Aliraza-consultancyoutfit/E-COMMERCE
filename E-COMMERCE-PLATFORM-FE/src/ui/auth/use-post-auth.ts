import { useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { REDIRECTS } from "@/constants/routes";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/auth/auth.slice";
import type { AuthResponse } from "@/store/auth/auth.types";
import { setToken } from "@/utils/auth-token";

/**
 * Shared success path for sign-in and sign-up: persist the token, seed the
 * auth slice, greet the user, and route to their role's home.
 */
export function usePostAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useCallback(
    (response: AuthResponse, welcome: string) => {
      setToken(response.accessToken);
      dispatch(
        setCredentials({ user: response.user, token: response.accessToken }),
      );
      toast.success(welcome);
      router.replace(REDIRECTS.afterLogin[response.user.role]);
    },
    [dispatch, router],
  );
}
