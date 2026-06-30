import { AuthGuard } from "@/guards";
import Account from "@/ui/storefront/account";

export default function Page() {
  return (
    <AuthGuard>
      <Account />
    </AuthGuard>
  );
}
