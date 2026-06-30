"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { PATHS } from "@/constants/routes";
import { useAppSelector } from "@/store/hooks";
import GuardFallback from "./guard-fallback";

/** Gates a route group to authenticated users; guests go to sign-in. */
export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace(PATHS.auth.signIn);
    }
  }, [isInitialized, user, router]);

  if (!isInitialized || !user) {
    return <GuardFallback />;
  }

  return <>{children}</>;
}
