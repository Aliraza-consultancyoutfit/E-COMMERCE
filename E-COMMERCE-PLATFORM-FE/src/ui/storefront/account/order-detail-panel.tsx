"use client";

import { Box, Skeleton, Stack, Typography } from "@mui/material";
import ApiErrorState from "@/components/api-error-state";
import { TickIcon } from "@/assets/icons/common";
import {
  StatusChip,
  formatOrderDate,
  orderNumber,
} from "@/ui/storefront/account/orders-panel";
import { useGetOrderQuery } from "@/store/orders/order.api";
import type { OrderStatus } from "@/store/orders/order.types";
import { formatCurrency } from "@/utils/format";

const TIMELINE = ["Order placed", "Processing", "Shipped", "Delivered"];
const STATUS_STEP: Record<OrderStatus, number> = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: 0,
};

function Timeline({ status }: { status: OrderStatus }) {
  const current = STATUS_STEP[status];
  return (
    <Stack spacing={0}>
      {TIMELINE.map((label, index) => {
        const done = index < current || status === "delivered";
        const active = index === current && status !== "delivered";
        const reached = index <= current;
        return (
          <Stack
            key={label}
            direction="row"
            spacing={1.75}
            sx={{ position: "relative", pb: index < TIMELINE.length - 1 ? 3 : 0 }}
          >
            {index < TIMELINE.length - 1 && (
              <Box
                sx={{
                  position: "absolute",
                  left: 14,
                  top: 30,
                  width: 2,
                  height: "calc(100% - 30px)",
                  bgcolor: index < current ? "success.main" : "divider",
                }}
              />
            )}
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
                color: reached ? "primary.contrastText" : "text.secondary",
                bgcolor: done ? "success.main" : active ? "primary.main" : "background.default",
                border: reached ? "none" : 1,
                borderColor: "divider",
              }}
            >
              {done && <TickIcon width="15" height="15" stroke="currentColor" />}
            </Box>
            <Box sx={{ pt: 0.5 }}>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ color: reached ? "text.primary" : "text.secondary" }}
              >
                {label}
              </Typography>
            </Box>
          </Stack>
        );
      })}
    </Stack>
  );
}

export default function OrderDetailPanel({
  orderId,
  onBack,
}: {
  orderId: string;
  onBack: () => void;
}) {
  const { data: order, isLoading, isError, refetch } = useGetOrderQuery(orderId);

  if (isLoading) {
    return <Skeleton variant="rounded" height={360} />;
  }

  if (isError || !order) {
    return (
      <ApiErrorState
        height="40vh"
        buttonText="Try again"
        buttonClick={() => refetch()}
      />
    );
  }

  return (
    <Box>
      <Typography
        component="span"
        variant="body2"
        color="primary.main"
        fontWeight={600}
        sx={{ cursor: "pointer", display: "inline-block", mb: 2 }}
        onClick={onBack}
      >
        ← Back to orders
      </Typography>

      <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, p: 3, mb: 2.5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          flexWrap="wrap"
          spacing={1.5}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Order {orderNumber(order._id)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Placed {formatOrderDate(order.createdAt)} ·{" "}
              {order.items.reduce((s, i) => s + i.quantity, 0)} item(s)
            </Typography>
          </Box>
          <StatusChip status={order.status} />
        </Stack>
        {order.status === "cancelled" ? (
          <Typography color="error.main" fontWeight={600}>
            This order was cancelled.
          </Typography>
        ) : (
          <Timeline status={order.status} />
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2.5,
          mb: 2.5,
        }}
      >
        <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, p: 2.5 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textTransform: "uppercase", letterSpacing: ".05em", mb: 1 }}
          >
            Shipping address
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            <br />
            {order.shippingAddress.street}
            <br />
            {order.shippingAddress.city} {order.shippingAddress.zip}
          </Typography>
        </Box>
        <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, p: 2.5 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textTransform: "uppercase", letterSpacing: ".05em", mb: 1 }}
          >
            Payment
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
            Card ending {order.paymentLast4 || "••••"}
            <br />
            Total: <b>{formatCurrency(order.total)}</b>
          </Typography>
        </Box>
      </Box>

      <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, p: 2.5 }}>
        <Typography fontWeight={700} sx={{ mb: 1.5 }}>
          Items
        </Typography>
        {order.items.map((item) => (
          <Stack
            key={item.product}
            direction="row"
            justifyContent="space-between"
            sx={{ py: 0.75 }}
          >
            <Typography variant="body2">
              {item.name}{" "}
              <Box component="span" color="text.secondary">
                × {item.quantity}
              </Box>
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {formatCurrency(item.lineTotal)}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Box>
  );
}
