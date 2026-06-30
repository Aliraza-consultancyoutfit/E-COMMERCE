"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { PATHS } from "@/constants/routes";
import { useAppSelector } from "@/store/hooks";
import GuardFallback from "./guard-fallback";

/** Gates a route group to authenticated users; guests go to sign-in. */
export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isInitialized } = useAppSelector((state) => state.auth);

  // The auth slice is seeded from the cookie after mount, so the singleton
  // store can already hold a session on the client's first render while the
  // server rendered logged-out. Gate on `mounted` so the first client render
  // always matches the server HTML (the fallback), then reconcile after
  // hydration — this also keeps guarded content out of the server HTML.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && isInitialized && !user) {
      router.replace(PATHS.auth.signIn);
    }
  }, [mounted, isInitialized, user, router]);

  if (!mounted || !isInitialized || !user) {
    return <GuardFallback />;
  }

  return <>{children}</>;
}
