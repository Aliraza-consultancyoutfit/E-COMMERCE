"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import ApiErrorState from "@/components/api-error-state";
import Chart from "@/components/chart";
import NoData from "@/components/no-data";
import { OrderStatusChip, formatOrderDate } from "@/ui/admin/order-status";
import { PATHS } from "@/constants/routes";
import {
  useGetAdminStatsQuery,
  useGetAllOrdersQuery,
} from "@/store/orders/order.api";
import { formatCurrency } from "@/utils/format";
import {
  categoryDonutOptions,
  revenueAreaOptions,
  salesBarOptions,
} from "./dashboard.data";

const orderNumber = (id: string) => `#${id.slice(-6).toUpperCase()}`;
const initialsOf = (value?: string) =>
  (value || "—")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "—";

const CARD_SX = { border: 1, borderColor: "divider", borderRadius: 4, p: 2.75 } as const;

function Card({ children, sx }: { children: ReactNode; sx?: object }) {
  return <Box sx={{ ...CARD_SX, ...sx }}>{children}</Box>;
}

/** Compact empty state for a dashboard card. */
function EmptyCard({ message, height = 200 }: { message: string; height?: number }) {
  return (
    <NoData
      height={`${height}px`}
      message={message}
      description=""
      buttonVisibility={false}
      imgStyle={{ maxWidth: "150px" }}
    />
  );
}

function KpiCard({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: string;
  tone: "primary" | "success" | "warning";
  icon: ReactNode;
}) {
  return (
    <Card>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {label}
        </Typography>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: `${tone}.main`,
            bgcolor: (t) => alpha(t.palette[tone].main, 0.14),
          }}
        >
          {icon}
        </Box>
      </Stack>
      <Typography variant="h4" fontWeight={700} sx={{ mt: 1.25 }}>
        {value}
      </Typography>
    </Card>
  );
}

const ICONS: Record<string, ReactNode> = {
  revenue: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  orders: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  pending: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  aov: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m23 6-9.5 9.5-5-5L1 18" />
      <path d="M17 6h6v6" />
    </svg>
  ),
};

export default function AdminDashboard() {
  const router = useRouter();
  const theme = useTheme();
  const { data: stats, isLoading, isError, refetch } = useGetAdminStatsQuery();
  const { data: latest } = useGetAllOrdersQuery({ page: 1, limit: 5 });

  if (isLoading) {
    return (
      <Stack spacing={2.5}>
        <Skeleton variant="rounded" height={120} />
        <Skeleton variant="rounded" height={260} />
        <Skeleton variant="rounded" height={320} />
      </Stack>
    );
  }
  if (isError || !stats) {
    return <ApiErrorState height="50vh" buttonText="Try again" buttonClick={() => refetch()} />;
  }

  const topMax = Math.max(...stats.topProducts.map((t) => t.units), 1);
  const records = latest?.records ?? [];

  const monthLabels = stats.monthly.map((m) => m.label);
  const monthValues = stats.monthly.map((m) => m.revenue);

  return (
    <Stack spacing={2.5}>
      {/* KPIs */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" }, gap: 2.25 }}>
        <KpiCard label="Total revenue" value={formatCurrency(stats.totalRevenue)} tone="primary" icon={ICONS.revenue} />
        <KpiCard label="Orders" value={stats.totalOrders.toLocaleString()} tone="success" icon={ICONS.orders} />
        <KpiCard label="Pending" value={stats.pendingCount.toLocaleString()} tone="warning" icon={ICONS.pending} />
        <KpiCard label="Avg. order value" value={formatCurrency(stats.avgOrderValue)} tone="primary" icon={ICONS.aov} />
      </Box>

      {/* Revenue + category mix */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.7fr 1fr" }, gap: 2.25 }}>
        <Card>
          <Box sx={{ mb: 1 }}>
            <Typography fontWeight={700}>Revenue</Typography>
            <Typography variant="body2" color="text.secondary">
              By month
            </Typography>
          </Box>
          {monthValues.length < 2 ? (
            <EmptyCard message="Not enough data yet" height={220} />
          ) : (
            <Chart
              type="area"
              height={220}
              series={[{ name: "Revenue", data: monthValues }]}
              options={revenueAreaOptions(theme, monthLabels)}
            />
          )}
        </Card>
        <Card>
          <Typography fontWeight={700}>Category mix</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Share of sales
          </Typography>
          {stats.categoryMix.length === 0 ? (
            <EmptyCard message="No sales yet" height={240} />
          ) : (
            <Chart
              type="donut"
              height={260}
              series={stats.categoryMix.map((c) => c.pct)}
              options={categoryDonutOptions(theme, stats.categoryMix.map((c) => c.category))}
            />
          )}
        </Card>
      </Box>

      {/* Sales trend + top products + inventory */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2.25 }}>
        <Card>
          <Typography fontWeight={700} sx={{ mb: 1 }}>
            Sales trend
          </Typography>
          {stats.monthly.length === 0 ? (
            <EmptyCard message="No orders yet" height={180} />
          ) : (
            <Chart
              type="bar"
              height={190}
              series={[{ name: "Revenue", data: monthValues }]}
              options={salesBarOptions(theme, monthLabels)}
            />
          )}
        </Card>

        <Card>
          <Typography fontWeight={700} sx={{ mb: 2 }}>
            Top products
          </Typography>
          {stats.topProducts.length === 0 ? (
            <EmptyCard message="No sales yet" height={180} />
          ) : (
            <Stack spacing={1.75}>
              {stats.topProducts.map((t) => (
                <Box key={t.name}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                    <Typography variant="body2" fontWeight={600} noWrap sx={{ pr: 1 }}>
                      {t.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t.units.toLocaleString()}
                    </Typography>
                  </Stack>
                  <Box sx={{ height: 6, borderRadius: 999, bgcolor: "divider", overflow: "hidden" }}>
                    <Box sx={{ height: "100%", width: `${(t.units / topMax) * 100}%`, bgcolor: "primary.main", borderRadius: 999 }} />
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </Card>

        <Card>
          <Typography fontWeight={700} sx={{ mb: 2 }}>
            Inventory alerts
          </Typography>
          {stats.lowStock.length === 0 ? (
            <EmptyCard message="All products stocked" height={180} />
          ) : (
            <Stack spacing={1.75}>
              {stats.lowStock.map((p) => {
                const isOut = p.stock === 0;
                const isLow = p.stock > 0 && p.stock <= 10;
                const text = isOut ? "Out of stock" : isLow ? `${p.stock} left — reorder soon` : `${p.stock} in stock`;
                const color = isOut ? "error.main" : isLow ? "warning.main" : "text.secondary";
                return (
                  <Stack key={p._id} direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{ width: 36, height: 36, borderRadius: 2.25, flexShrink: 0, bgcolor: (t) => alpha(t.palette.primary.main, 0.12) }} />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {p.name}
                      </Typography>
                      <Typography variant="body2" fontWeight={600} sx={{ color }}>
                        {text}
                      </Typography>
                    </Box>
                  </Stack>
                );
              })}
            </Stack>
          )}
        </Card>
      </Box>

      {/* Latest orders */}
      <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, overflow: "hidden" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.25, borderBottom: 1, borderColor: "divider" }}>
          <Typography fontWeight={700}>Latest orders</Typography>
          <Typography
            variant="body2"
            color="primary.main"
            fontWeight={600}
            sx={{ cursor: "pointer" }}
            onClick={() => router.push(PATHS.admin.orders)}
          >
            View all
          </Typography>
        </Stack>
        {records.length === 0 ? (
          <EmptyCard message="No orders yet" height={220} />
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "background.default" }}>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Order</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: "text.secondary" }}>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((order) => {
                  const name = order.user?.name || order.user?.email?.split("@")[0] || "—";
                  return (
                    <TableRow
                      key={order._id}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => router.push(`${PATHS.admin.orders}/${order._id}`)}
                    >
                      <TableCell sx={{ fontWeight: 600 }}>{orderNumber(order._id)}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.25}>
                          <Avatar sx={{ width: 28, height: 28, fontSize: 11, fontWeight: 600, color: "primary.main", bgcolor: (t) => alpha(t.palette.primary.main, 0.12) }}>
                            {initialsOf(name)}
                          </Avatar>
                          <Typography variant="body2">{name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>{formatOrderDate(order.createdAt)}</TableCell>
                      <TableCell><OrderStatusChip status={order.status} /></TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(order.total)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        )}
      </Box>
    </Stack>
  );
}
