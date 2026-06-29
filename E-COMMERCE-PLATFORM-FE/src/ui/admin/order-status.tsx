"use client";

import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { OrderStatus } from "@/store/orders/order.types";

type StatusColor = "primary" | "info" | "success" | "warning" | "error";

export const STATUS_META: Record<OrderStatus, { label: string; color: StatusColor }> = {
  pending: { label: "Pending", color: "warning" },
  processing: { label: "Processing", color: "primary" },
  shipped: { label: "Shipped", color: "info" },
  delivered: { label: "Delivered", color: "success" },
  cancelled: { label: "Cancelled", color: "error" },
};

/** Allowed forward transitions — mirrors the backend guard. */
export const NEXT_STATUS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export const TIMELINE_STEPS: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
];

export function OrderStatusChip({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        px: 1.4,
        py: 0.45,
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.4,
        color: `${meta.color}.main`,
        bgcolor: (t) => alpha(t.palette[meta.color].main, 0.14),
      }}
    >
      {meta.label}
    </Box>
  );
}

export const formatOrderDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
