import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { COOKIES_KEYS } from "@/constants/strings";
import type { AuthUser, JwtPayload } from "@/store/auth/auth.types";

const TOKEN_KEY = COOKIES_KEYS.AUTH_TOKEN;
const TOKEN_TTL_DAYS = 1;

export const getToken = (): string | undefined => Cookies.get(TOKEN_KEY);

export const setToken = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, { expires: TOKEN_TTL_DAYS, sameSite: "lax" });
};

export const removeToken = (): void => {
  Cookies.remove(TOKEN_KEY);
};

/** Decodes the JWT to the current user, returning null if missing or expired. */
export const decodeUser = (token?: string): AuthUser | null => {
  if (!token) {
    return null;
  }

  try {
    const payload = jwtDecode<JwtPayload>(token);
    const isExpired = payload.exp ? payload.exp * 1000 < Date.now() : false;
    if (isExpired) {
      return null;
    }
    return { id: payload.sub, email: payload.email, role: payload.role };
  } catch {
    return null;
  }
};
