import { AuthLayout } from "@/layouts";
import { GuestGuard } from "@/guards";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <GuestGuard>
      <AuthLayout>{children}</AuthLayout>
    </GuestGuard>
  );
}
