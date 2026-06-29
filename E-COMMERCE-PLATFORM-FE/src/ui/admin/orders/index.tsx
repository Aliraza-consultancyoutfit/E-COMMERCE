"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  Pagination,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ExportIcon } from "@/assets/icons/common";
import ApiErrorState from "@/components/api-error-state";
import NoData from "@/components/no-data";
import { OrderStatusChip, formatOrderDate } from "@/ui/admin/order-status";
import { PATHS } from "@/constants/routes";
import { useGetAllOrdersQuery } from "@/store/orders/order.api";
import type { OrderStatus } from "@/store/orders/order.types";
import { formatCurrency } from "@/utils/format";

const PAGE_LIMIT = 10;
const FILTERS: { label: string; value?: OrderStatus }[] = [
  { label: "All", value: undefined },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const orderNumber = (id: string) => `#${id.slice(-6).toUpperCase()}`;
const initialsOf = (value?: string) =>
  (value || "—")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "—";

export default function AdminOrders() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | undefined>(undefined);

  const { data, isLoading, isError, refetch, isFetching } = useGetAllOrdersQuery({
    page,
    limit: PAGE_LIMIT,
    status,
  });
  const records = data?.records ?? [];
  const meta = data?.meta;

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ mb: 2.5, flexWrap: "wrap", gap: 1 }}
      >
        {/* Segmented status filter */}
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            p: 0.5,
            borderRadius: 2.5,
            border: 1,
            borderColor: "divider",
            bgcolor: "background.default",
            overflowX: "auto",
          }}
        >
          {FILTERS.map((f) => {
            const active = status === f.value;
            return (
              <Box
                key={f.label}
                component="button"
                onClick={() => {
                  setStatus(f.value);
                  setPage(1);
                }}
                sx={{
                  px: 1.75,
                  py: 0.85,
                  border: "none",
                  borderRadius: 1.75,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  color: active ? "primary.main" : "text.secondary",
                  bgcolor: active ? "background.paper" : "transparent",
                  boxShadow: active ? 1 : "none",
                }}
              >
                {f.label}
              </Box>
            );
          })}
        </Stack>

        <Button
          variant="outlined"
          color="inherit"
          startIcon={<ExportIcon width="16" height="16" stroke="currentColor" />}
          sx={{ ml: "auto", borderColor: "divider", color: "text.primary" }}
        >
          Export
        </Button>
      </Stack>

      {isLoading ? (
        <Skeleton variant="rounded" height={400} />
      ) : isError ? (
        <ApiErrorState height="40vh" buttonText="Try again" buttonClick={() => refetch()} />
      ) : records.length === 0 ? (
        <NoData height="40vh" message="No orders" description="No orders match this filter yet." buttonVisibility={false} />
      ) : (
        <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, overflow: "hidden", opacity: isFetching ? 0.6 : 1 }}>
          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "background.default" }}>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Order</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: "text.secondary" }}>Total</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((order) => {
                  const name = order.user?.name || order.user?.email?.split("@")[0] || "—";
                  return (
                    <TableRow
                      key={order._id}
                      hover
                      sx={{ "&:nth-of-type(even)": { bgcolor: (t) => alpha(t.palette.text.primary, 0.015) } }}
                    >
                      <TableCell sx={{ fontWeight: 600 }}>{orderNumber(order._id)}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.25}>
                          <Avatar sx={{ width: 28, height: 28, fontSize: 11, fontWeight: 600, color: "primary.main", bgcolor: (t) => alpha(t.palette.primary.main, 0.12) }}>
                            {initialsOf(name)}
                          </Avatar>
                          <Typography variant="body2" fontWeight={600} noWrap>
                            {name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>{formatOrderDate(order.createdAt)}</TableCell>
                      <TableCell><OrderStatusChip status={order.status} /></TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(order.total)}</TableCell>
                      <TableCell align="right">
                        <Button variant="outlined" color="inherit" size="small" sx={{ borderColor: "divider" }} onClick={() => router.push(`${PATHS.admin.orders}/${order._id}`)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
          {meta && meta.pages > 1 && (
            <Stack alignItems="center" sx={{ py: 2, borderTop: 1, borderColor: "divider" }}>
              <Pagination count={meta.pages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
            </Stack>
          )}
        </Box>
      )}
    </Box>
  );
}
