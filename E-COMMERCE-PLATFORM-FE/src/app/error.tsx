"use client";

import { useEffect } from "react";
import ErrorState from "@/ui/storefront/content/error-state";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep technical detail in the console; users only see a friendly message.
    console.error(error);
  }, [error]);

  return <ErrorState reset={reset} />;
}
