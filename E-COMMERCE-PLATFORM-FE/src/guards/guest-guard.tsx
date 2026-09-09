"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { REDIRECTS } from "@/constants/routes";
import { useAppSelector } from "@/store/hooks";
import GuardFallback from "./guard-fallback";

/** Gates the (auth) group to guests; signed-in users go to their role home. */
export default function GuestGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isInitialized } = useAppSelector((state) => state.auth);

  // The auth slice is seeded from the cookie on the client, so the singleton
  // store can already hold a session on the first client render while the
  // server rendered the guest fallback. Gate on `mounted` so the first client
  // render matches the server HTML, then reconcile after hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && isInitialized && user) {
      router.replace(REDIRECTS.afterLogin[user.role]);
    }
  }, [mounted, isInitialized, user, router]);

  if (!mounted || !isInitialized || user) {
    return <GuardFallback />;
  }

  return <>{children}</>;
}
