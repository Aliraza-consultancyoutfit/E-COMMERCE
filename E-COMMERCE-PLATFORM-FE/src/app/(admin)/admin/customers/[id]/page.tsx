import AdminCustomerDetail from "@/ui/admin/customer-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminCustomerDetail customerId={id} />;
}
