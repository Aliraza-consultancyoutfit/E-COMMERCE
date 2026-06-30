import { Suspense } from "react";
import Catalog from "@/ui/storefront/catalog";

export default function Page() {
  return (
    <Suspense>
      <Catalog />
    </Suspense>
  );
}
