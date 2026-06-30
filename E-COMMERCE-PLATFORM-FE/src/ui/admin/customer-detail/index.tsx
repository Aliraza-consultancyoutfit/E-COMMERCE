"use client";

import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ApiErrorState from "@/components/api-error-state";
import { OrderStatusChip, formatOrderDate } from "@/ui/admin/order-status";
import { PATHS } from "@/constants/routes";
import { useGetCustomerQuery } from "@/store/customers/customers.api";
import { formatCurrency } from "@/utils/format";

const orderNumber = (id: string) => `#${id.slice(-6).toUpperCase()}`;
const initialsOf = (value?: string) =>
  (value || "—")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "—";

const monthYear = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });

function Card({ children, sx }: { children: React.ReactNode; sx?: object }) {
  return <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, ...sx }}>{children}</Box>;
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" justifyContent="space-between" sx={{ py: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={700}>
        {value}
      </Typography>
    </Stack>
  );
}

export default function AdminCustomerDetail({ customerId }: { customerId: string }) {
  const router = useRouter();
  const { data: customer, isLoading, isError, refetch } = useGetCustomerQuery(customerId);

  if (isLoading) {
    return <Skeleton variant="rounded" height={480} />;
  }
  if (isError || !customer) {
    return <ApiErrorState height="40vh" buttonText="Try again" buttonClick={() => refetch()} />;
  }

  const name = customer.name || customer.email.split("@")[0];
  const segment =
    customer.spent >= 1000
      ? { label: "VIP customer", color: "primary" as const }
      : customer.orderCount <= 1
        ? { label: "New customer", color: "warning" as const }
        : { label: "Active customer", color: "success" as const };

  return (
    <Box>
      <Typography
        component="span"
        variant="body2"
        color="primary.main"
        fontWeight={600}
        sx={{ cursor: "pointer", display: "inline-block", mb: 2 }}
        onClick={() => router.push(PATHS.admin.customers)}
      >
        ← Back to customers
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1.6fr" }, gap: 2.5, alignItems: "start" }}>
        {/* Left column */}
        <Stack spacing={2.5}>
          <Card sx={{ p: 3, textAlign: "center" }}>
            <Avatar
              src={customer.avatar || undefined}
              sx={{ width: 72, height: 72, fontSize: 24, fontWeight: 600, color: "primary.main", bgcolor: (t) => alpha(t.palette.primary.main, 0.12), mx: "auto", mb: 1.75 }}
            >
              {initialsOf(name)}
            </Avatar>
            <Typography variant="h6" fontWeight={700}>
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.25 }}>
              {customer.email}
            </Typography>
            <Box
              component="span"
              sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: 999, fontSize: 12, fontWeight: 600, color: `${segment.color}.main`, bgcolor: (t) => alpha(t.palette[segment.color].main, 0.14) }}
            >
              {segment.label}
            </Box>
            <Box sx={{ mt: 2.25 }}>
              <Button fullWidth variant="contained" href={`mailto:${customer.email}`}>
                Email
              </Button>
            </Box>
          </Card>

          <Card sx={{ p: 2.5 }}>
            <StatRow label="Total orders" value={String(customer.orderCount)} />
            <StatRow label="Lifetime spend" value={formatCurrency(customer.spent)} />
            <StatRow label="Avg. order" value={formatCurrency(customer.avgOrder)} />
            <StatRow label="Customer since" value={monthYear(customer.createdAt)} />
          </Card>

          {customer.defaultAddress && (
            <Card sx={{ p: 2.5 }}>
              <Typography variant="body2" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: ".05em", mb: 1 }}>
                Default address
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                {customer.defaultAddress.firstName} {customer.defaultAddress.lastName}
                <br />
                {customer.defaultAddress.street}
                <br />
                {customer.defaultAddress.city} {customer.defaultAddress.zip}
              </Typography>
            </Card>
          )}
        </Stack>

        {/* Right column */}
        <Stack spacing={2.5}>
          <Card sx={{ overflow: "hidden" }}>
            <Typography fontWeight={700} sx={{ p: 2.25, borderBottom: 1, borderColor: "divider" }}>
              Recent orders
            </Typography>
            {customer.recentOrders.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2.25 }}>
                No orders yet.
              </Typography>
            ) : (
              customer.recentOrders.map((order) => (
                <Stack
                  key={order._id}
                  direction="row"
                  alignItems="center"
                  spacing={1.75}
                  sx={{ px: 2.5, py: 1.75, borderBottom: 1, borderColor: "divider", cursor: "pointer", "&:hover": { bgcolor: "action.hover" } }}
                  onClick={() => router.push(`${PATHS.admin.orders}/${order._id}`)}
                >
                  <Typography variant="body2" fontWeight={600} sx={{ width: 90 }}>
                    {orderNumber(order._id)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                    {formatOrderDate(order.createdAt)}
                  </Typography>
                  <OrderStatusChip status={order.status} />
                  <Typography variant="body2" fontWeight={600} sx={{ width: 90, textAlign: "right" }}>
                    {formatCurrency(order.total)}
                  </Typography>
                </Stack>
              ))
            )}
          </Card>

          <Card sx={{ p: 3 }}>
            <Typography fontWeight={700} sx={{ mb: 2.25 }}>
              Activity
            </Typography>
            <Stack>
              {customer.recentOrders.map((order, index) => (
                <Stack key={order._id} direction="row" spacing={1.75} sx={{ position: "relative", pb: index < customer.recentOrders.length - 1 ? 2.25 : 0 }}>
                  {index < customer.recentOrders.length - 1 && (
                    <Box sx={{ position: "absolute", left: 13, top: 28, bottom: 0, width: 2, bgcolor: "divider" }} />
                  )}
                  <Box sx={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "primary.main", bgcolor: (t) => alpha(t.palette.primary.main, 0.14) }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "primary.main" }} />
                  </Box>
                  <Box>
                    <Typography variant="body2">
                      Placed order <Box component="span" sx={{ fontWeight: 600 }}>{orderNumber(order._id)}</Box>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatOrderDate(order.createdAt)}
                    </Typography>
                  </Box>
                </Stack>
              ))}
              <Stack direction="row" spacing={1.75} sx={{ pt: customer.recentOrders.length ? 2.25 : 0 }}>
                <Box sx={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "text.secondary", bgcolor: "background.default" }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "text.disabled" }} />
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Joined EliteCart
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {monthYear(customer.createdAt)}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
}
