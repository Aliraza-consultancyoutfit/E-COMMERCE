"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { PATHS } from "@/constants/routes";
import { useAppSelector } from "@/store/hooks";
import type { UserRole } from "@/store/auth/auth.types";
import GuardFallback from "./guard-fallback";

interface RoleGuardProps {
  role: UserRole;
  children: ReactNode;
}

/**
 * Gates a route group to a specific role (UX mirror of the backend RolesGuard).
 * Guests go to sign-in; authenticated users without the role go home.
 */
export default function RoleGuard({ role, children }: RoleGuardProps) {
  const router = useRouter();
  const { user, isInitialized } = useAppSelector((state) => state.auth);
  const isAllowed = user?.role === role;

  // The auth slice is seeded from the cookie on the client, so the first client
  // render can already know the role while the server rendered the fallback.
  // Gate on `mounted` so the first client render matches the server HTML.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !isInitialized) {
      return;
    }
    if (!user) {
      router.replace(PATHS.auth.signIn);
    } else if (!isAllowed) {
      router.replace(PATHS.home);
    }
  }, [mounted, isInitialized, user, isAllowed, router]);

  if (!mounted || !isInitialized || !isAllowed) {
    return <GuardFallback />;
  }

  return <>{children}</>;
}
