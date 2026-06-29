"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { REDIRECTS } from "@/constants/routes";
import { useAppSelector } from "@/store/hooks";
import GuardFallback from "./guard-fallback";

/** Gates the (auth) group to guests; signed-in users go to their role home. */
export default function GuestGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isInitialized && user) {
      router.replace(REDIRECTS.afterLogin[user.role]);
    }
  }, [isInitialized, user, router]);

  if (!isInitialized || user) {
    return <GuardFallback />;
  }

  return <>{children}</>;
}
