"use client";

import { ReactNode } from "react";
import toast from "react-hot-toast";
import { Box, Button, Skeleton, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { ExportIcon } from "@/assets/icons/common";
import ApiErrorState from "@/components/api-error-state";
import Chart from "@/components/chart";
import NoData from "@/components/no-data";
import { STATUS_META } from "@/ui/admin/order-status";
import { categoryDonutOptions } from "@/ui/admin/dashboard/dashboard.data";
import { useGetAdminStatsQuery } from "@/store/orders/order.api";
import type { OrderStatus } from "@/store/orders/order.types";
import { downloadCsv } from "@/utils/csv";
import { formatCurrency } from "@/utils/format";

const CARD_SX = { border: 1, borderColor: "divider", borderRadius: 4, p: 2.75 } as const;

function Card({ children }: { children: ReactNode }) {
  return <Box sx={CARD_SX}>{children}</Box>;
}

const STATUS_TONE: Record<OrderStatus, "warning" | "primary" | "info" | "success" | "error"> = {
  pending: "warning",
  processing: "primary",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
};

export default function AdminReports() {
  const theme = useTheme();
  const { data: stats, isLoading, isError, refetch } = useGetAdminStatsQuery();

  if (isLoading) {
    return (
      <Stack spacing={2.5}>
        <Skeleton variant="rounded" height={260} />
        <Skeleton variant="rounded" height={320} />
      </Stack>
    );
  }
  if (isError || !stats) {
    return <ApiErrorState height="50vh" buttonText="Try again" buttonClick={() => refetch()} />;
  }

  const statusEntries = (Object.keys(stats.statusCounts) as OrderStatus[]).map((status) => ({
    status,
    count: stats.statusCounts[status],
  }));
  const statusMax = Math.max(...statusEntries.map((s) => s.count), 1);

  const handleExport = () => {
    if (stats.categoryMix.length === 0) {
      toast.error("No sales to export");
      return;
    }
    const rows = [
      ["Category", "Units", "Revenue", "Share %"],
      ...stats.categoryMix.map((c) => [c.category, c.units, c.revenue, c.pct]),
    ];
    downloadCsv("category-performance.csv", rows);
    toast.success("Report exported");
  };

  return (
    <Stack spacing={2.5}>
      <Stack direction="row" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          All-time performance across orders and categories.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ExportIcon width="16" height="16" stroke="currentColor" />}
          sx={{ ml: "auto" }}
          onClick={handleExport}
        >
          Export report
        </Button>
      </Stack>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2.5 }}>
        {/* Orders by status */}
        <Card>
          <Typography fontWeight={700} sx={{ mb: 2.25 }}>
            Orders by status
          </Typography>
          <Stack spacing={2}>
            {statusEntries.map(({ status, count }) => (
              <Box key={status}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {STATUS_META[status].label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {count}
                  </Typography>
                </Stack>
                <Box sx={{ height: 8, borderRadius: 999, bgcolor: "divider", overflow: "hidden" }}>
                  <Box
                    sx={{
                      height: "100%",
                      width: `${(count / statusMax) * 100}%`,
                      borderRadius: 999,
                      bgcolor: `${STATUS_TONE[status]}.main`,
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Stack>
        </Card>

        {/* Sales by category */}
        <Card>
          <Typography fontWeight={700} sx={{ mb: 1 }}>
            Sales by category
          </Typography>
          {stats.categoryMix.length === 0 ? (
            <NoData height="220px" message="No sales yet" description="" buttonVisibility={false} imgStyle={{ maxWidth: "150px" }} />
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

      {/* Performance by category */}
      <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, overflow: "hidden" }}>
        <Typography fontWeight={700} sx={{ p: 2.25, borderBottom: 1, borderColor: "divider" }}>
          Performance by category
        </Typography>
        {stats.categoryMix.length === 0 ? (
          <NoData height="220px" message="No sales yet" description="" buttonVisibility={false} imgStyle={{ maxWidth: "150px" }} />
        ) : (
          stats.categoryMix.map((c, index) => (
            <Stack
              key={c.category}
              direction="row"
              alignItems="center"
              sx={{ px: 2.75, py: 1.75, borderTop: index === 0 ? 0 : 1, borderColor: "divider", bgcolor: index % 2 === 1 ? (t) => alpha(t.palette.text.primary, 0.015) : "transparent" }}
            >
              <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }}>
                {c.category}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ width: 100, textAlign: "right" }}>
                {c.units.toLocaleString()} units
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ width: 120, textAlign: "right" }}>
                {formatCurrency(c.revenue)}
              </Typography>
              <Typography variant="body2" fontWeight={600} color="primary.main" sx={{ width: 70, textAlign: "right" }}>
                {c.pct}%
              </Typography>
            </Stack>
          ))
        )}
      </Box>
    </Stack>
  );
}
