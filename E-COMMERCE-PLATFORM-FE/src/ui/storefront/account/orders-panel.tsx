"use client";

import { Box, Button, Chip, Skeleton, Stack, Typography } from "@mui/material";
import ApiErrorState from "@/components/api-error-state";
import NoData from "@/components/no-data";
import { useGetMyOrdersQuery } from "@/store/orders/order.api";
import type { OrderStatus } from "@/store/orders/order.types";
import { formatCurrency } from "@/utils/format";

type ChipColor = "default" | "primary" | "info" | "success" | "warning" | "error";

const STATUS_META: Record<OrderStatus, { label: string; color: ChipColor }> = {
  pending: { label: "Pending", color: "warning" },
  processing: { label: "Processing", color: "primary" },
  shipped: { label: "Shipped", color: "info" },
  delivered: { label: "Delivered", color: "success" },
  cancelled: { label: "Cancelled", color: "error" },
};

export const StatusChip = ({ status }: { status: OrderStatus }) => {
  const meta = STATUS_META[status];
  return <Chip size="small" label={meta.label} color={meta.color} sx={{ fontWeight: 600 }} />;
};

export const formatOrderDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const orderNumber = (id: string) => `#${id.slice(-6).toUpperCase()}`;

export default function OrdersPanel({ onOpen }: { onOpen: (id: string) => void }) {
  const { data: orders, isLoading, isError, refetch } = useGetMyOrdersQuery();

  if (isLoading) {
    return <Skeleton variant="rounded" height={280} />;
  }

  if (isError) {
    return (
      <ApiErrorState
        height="40vh"
        buttonText="Try again"
        buttonClick={() => refetch()}
      />
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <NoData
        height="40vh"
        message="No orders yet"
        description="When you place an order it will appear here."
        buttonVisibility={false}
      />
    );
  }

  return (
    <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, overflow: "hidden" }}>
      <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h5" fontWeight={700}>
          Order history
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Track, return, or buy things again.
        </Typography>
      </Box>
      {orders.map((order) => (
        <Stack
          key={order._id}
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ p: 2.5, borderBottom: 1, borderColor: "divider" }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography fontWeight={600}>{orderNumber(order._id)}</Typography>
            <Typography variant="body2" color="text.secondary">
              {formatOrderDate(order.createdAt)} ·{" "}
              {order.items.reduce((sum, i) => sum + i.quantity, 0)} item(s)
            </Typography>
          </Box>
          <StatusChip status={order.status} />
          <Typography
            fontWeight={700}
            sx={{ width: 84, textAlign: "right", display: { xs: "none", sm: "block" } }}
          >
            {formatCurrency(order.total)}
          </Typography>
          <Button variant="outlined" size="small" onClick={() => onOpen(order._id)}>
            View
          </Button>
        </Stack>
      ))}
    </Box>
  );
}
