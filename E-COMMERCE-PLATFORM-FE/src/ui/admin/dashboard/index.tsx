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
import { OrderStatusChip, formatOrderDate } from "@/ui/admin/order-status";
import { PATHS } from "@/constants/routes";
import {
  useGetAdminStatsQuery,
  useGetAllOrdersQuery,
} from "@/store/orders/order.api";
import { formatCurrency } from "@/utils/format";

const orderNumber = (id: string) => `#${id.slice(-6).toUpperCase()}`;
const initialsOf = (value?: string) =>
  (value || "—")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "—";

function Card({ children, sx }: { children: ReactNode; sx?: object }) {
  return (
    <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, p: 2.75, ...sx }}>
      {children}
    </Box>
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

function RevenueChart({ data }: { data: { label: string; revenue: number }[] }) {
  const theme = useTheme();
  const W = 600;
  const H = 200;
  if (data.length < 2) {
    return (
      <Box sx={{ height: H, display: "flex", alignItems: "center", justifyContent: "center", color: "text.secondary" }}>
        <Typography variant="body2">Not enough data yet</Typography>
      </Box>
    );
  }
  const values = data.map((d) => d.revenue);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const pad = (max - min) * 0.2 || 1;
  const lo = min - pad;
  const hi = max + pad;
  const stepX = W / (data.length - 1);
  const points = values.map((v, i) => [i * stepX, H - ((v - lo) / (hi - lo)) * H]);
  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;
  return (
    <Box>
      <Box component="svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" sx={{ width: "100%", height: 200, display: "block" }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity={0.22} />
            <stop offset="100%" stopColor={theme.palette.primary.main} stopOpacity={0} />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={0} y1={H * f} x2={W} y2={H * f} stroke={theme.palette.divider} strokeWidth={1} />
        ))}
        <path d={area} fill="url(#revGrad)" />
        <path d={line} fill="none" stroke={theme.palette.primary.main} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      </Box>
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
        {data.map((d, i) => (
          <Typography key={`${d.label}-${i}`} variant="caption" color="text.secondary">
            {d.label}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
}

function Donut({ data }: { data: { category: string; pct: number }[] }) {
  const theme = useTheme();
  const palette = [
    theme.palette.primary.main,
    theme.palette.info.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ];
  const R = 44;
  const circ = 2 * Math.PI * R;
  let acc = 0;
  const segments = data.map((d, i) => {
    const frac = d.pct / 100;
    const seg = {
      color: palette[i % palette.length],
      dash: `${(frac * circ).toFixed(1)} ${(circ - frac * circ).toFixed(1)}`,
      offset: (-acc * circ).toFixed(1),
    };
    acc += frac;
    return seg;
  });
  if (data.length === 0) {
    return (
      <Box sx={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", color: "text.secondary" }}>
        <Typography variant="body2">No sales yet</Typography>
      </Box>
    );
  }
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2.25 }}>
        <svg width="150" height="150" viewBox="0 0 120 120">
          {segments.map((s, i) => (
            <circle
              key={i}
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={16}
              strokeDasharray={s.dash}
              strokeDashoffset={s.offset}
              transform="rotate(-90 60 60)"
            />
          ))}
        </svg>
      </Box>
      <Stack spacing={1.1}>
        {data.map((d, i) => (
          <Stack key={d.category} direction="row" alignItems="center" spacing={1.1}>
            <Box sx={{ width: 10, height: 10, borderRadius: 0.75, bgcolor: palette[i % palette.length] }} />
            <Typography variant="body2" sx={{ flex: 1 }} noWrap>
              {d.category}
            </Typography>
            <Typography variant="body2" fontWeight={600} color="text.secondary">
              {d.pct}%
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
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

  const barMax = Math.max(...stats.monthly.map((m) => m.revenue), 1);
  const topMax = Math.max(...stats.topProducts.map((t) => t.units), 1);
  const records = latest?.records ?? [];

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
          <Box sx={{ mb: 2.25 }}>
            <Typography fontWeight={700}>Revenue</Typography>
            <Typography variant="body2" color="text.secondary">
              By month
            </Typography>
          </Box>
          <RevenueChart data={stats.monthly} />
        </Card>
        <Card>
          <Typography fontWeight={700}>Category mix</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.75 }}>
            Share of sales
          </Typography>
          <Donut data={stats.categoryMix} />
        </Card>
      </Box>

      {/* Sales trend + top products + inventory */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2.25 }}>
        <Card>
          <Typography fontWeight={700} sx={{ mb: 2.25 }}>
            Sales trend
          </Typography>
          {stats.monthly.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No orders yet
            </Typography>
          ) : (
            <Stack direction="row" alignItems="flex-end" justifyContent="space-between" spacing={1} sx={{ height: 130 }}>
              {stats.monthly.slice(-7).map((m, i, arr) => (
                <Stack key={`${m.label}-${i}`} alignItems="center" spacing={1} sx={{ flex: 1, height: "100%", justifyContent: "flex-end" }}>
                  <Box
                    sx={{
                      width: "100%",
                      borderRadius: "6px 6px 0 0",
                      height: `${Math.max((m.revenue / barMax) * 100, 4)}%`,
                      bgcolor: (t) => (i === arr.length - 1 ? t.palette.primary.main : alpha(t.palette.primary.main, 0.4)),
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {m.label}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          )}
        </Card>

        <Card>
          <Typography fontWeight={700} sx={{ mb: 2 }}>
            Top products
          </Typography>
          {stats.topProducts.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No sales yet
            </Typography>
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
            <Typography variant="body2" color="text.secondary">
              All products stocked
            </Typography>
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
          <Typography variant="body2" color="text.secondary" sx={{ p: 2.25 }}>
            No orders yet
          </Typography>
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
