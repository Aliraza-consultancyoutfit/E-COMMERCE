import { AuthGuard } from "@/guards";
import Cart from "@/ui/storefront/cart";

export default function Page() {
  return (
    <AuthGuard>
      <Cart />
    </AuthGuard>
  );
}
