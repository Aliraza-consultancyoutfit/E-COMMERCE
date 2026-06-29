import { AuthGuard } from "@/guards";
import Checkout from "@/ui/storefront/checkout";

export default function Page() {
  return (
    <AuthGuard>
      <Checkout />
    </AuthGuard>
  );
}
