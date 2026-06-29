import { RoleGuard } from "@/guards";
import { AdminLayout } from "@/layouts";
import { UserRole } from "@/store/auth/auth.types";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role={UserRole.ADMIN}>
      <AdminLayout>{children}</AdminLayout>
    </RoleGuard>
  );
}
