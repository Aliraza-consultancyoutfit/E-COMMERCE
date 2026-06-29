"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { TickIcon } from "@/assets/icons/common";
import ApiErrorState from "@/components/api-error-state";
import {
  NEXT_STATUS,
  OrderStatusChip,
  STATUS_META,
  TIMELINE_STEPS,
  formatOrderDate,
} from "@/ui/admin/order-status";
import { PATHS } from "@/constants/routes";
import {
  useGetAdminOrderQuery,
  useUpdateOrderStatusMutation,
} from "@/store/orders/order.api";
import type { OrderStatus } from "@/store/orders/order.types";
import { getApiErrorMessage } from "@/utils/api-error";
import { formatCurrency } from "@/utils/format";

const orderNumber = (id: string) => `#${id.slice(-6).toUpperCase()}`;

function HorizontalTimeline({ status }: { status: OrderStatus }) {
  const current = TIMELINE_STEPS.indexOf(status);
  return (
    <Stack direction="row" alignItems="center" sx={{ maxWidth: 760, overflowX: "auto", py: 1 }}>
      {TIMELINE_STEPS.map((step, index) => {
        const done = index < current;
        const active = index === current;
        const reached = index <= current;
        return (
          <Stack key={step} direction="row" alignItems="center" sx={{ flex: index < TIMELINE_STEPS.length - 1 ? 1 : "0 0 auto", minWidth: "fit-content" }}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 13,
                  color: reached ? "primary.contrastText" : "text.secondary",
                  bgcolor: done ? "success.main" : active ? "primary.main" : "background.default",
                  border: reached ? "none" : 1,
                  borderColor: "divider",
                }}
              >
                {done ? <TickIcon width="15" height="15" stroke="currentColor" /> : index + 1}
              </Box>
              <Typography variant="body2" fontWeight={600} sx={{ color: reached ? "text.primary" : "text.secondary", whiteSpace: "nowrap" }}>
                {STATUS_META[step].label}
              </Typography>
            </Stack>
            {index < TIMELINE_STEPS.length - 1 && (
              <Box sx={{ flex: 1, height: 2, mx: 1.5, minWidth: 24, bgcolor: index < current ? "success.main" : "divider" }} />
            )}
          </Stack>
        );
      })}
    </Stack>
  );
}

export default function AdminOrderDetail({ orderId }: { orderId: string }) {
  const router = useRouter();
  const { data: order, isLoading, isError, refetch } = useGetAdminOrderQuery(orderId);
  const [updateStatus, { isLoading: updating }] = useUpdateOrderStatusMutation();

  const changeStatus = async (next: OrderStatus) => {
    try {
      await updateStatus({ id: orderId, status: next }).unwrap();
      toast.success(`Order marked ${STATUS_META[next].label}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (isLoading) {
    return <Skeleton variant="rounded" height={480} />;
  }
  if (isError || !order) {
    return <ApiErrorState height="40vh" buttonText="Try again" buttonClick={() => refetch()} />;
  }

  const nextOptions = NEXT_STATUS[order.status];
  const customerName = order.user?.name || order.user?.email?.split("@")[0] || "Customer";

  return (
    <Box>
      <Typography
        component="span"
        variant="body2"
        color="primary.main"
        fontWeight={600}
        sx={{ cursor: "pointer", display: "inline-block", mb: 2 }}
        onClick={() => router.push(PATHS.admin.orders)}
      >
        ← Back to orders
      </Typography>

      <Stack direction="row" alignItems="center" flexWrap="wrap" spacing={1.5} sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Order {orderNumber(order._id)}
        </Typography>
        <OrderStatusChip status={order.status} />
        <Typography variant="body2" color="text.secondary">
          {formatOrderDate(order.createdAt)}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ ml: "auto" }}>
          {nextOptions.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ alignSelf: "center" }}>
              No further actions
            </Typography>
          ) : (
            nextOptions.map((next) => (
              <Button
                key={next}
                variant={next === "cancelled" ? "outlined" : "contained"}
                color={next === "cancelled" ? "error" : "primary"}
                disabled={updating}
                onClick={() => changeStatus(next)}
              >
                {next === "cancelled" ? "Cancel order" : `Mark as ${STATUS_META[next].label}`}
              </Button>
            ))
          )}
        </Stack>
      </Stack>

      <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, p: 3, mb: 2.5 }}>
        {order.status === "cancelled" ? (
          <Typography color="error.main" fontWeight={600}>
            This order was cancelled.
          </Typography>
        ) : (
          <HorizontalTimeline status={order.status} />
        )}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.5fr 1fr" }, gap: 2.5 }}>
        {/* Items */}
        <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, overflow: "hidden" }}>
          <Typography fontWeight={700} sx={{ p: 2.25, borderBottom: 1, borderColor: "divider" }}>
            Items
          </Typography>
          {order.items.map((item) => (
            <Stack key={item.product} direction="row" justifyContent="space-between" sx={{ p: 2.25, borderBottom: 1, borderColor: "divider" }}>
              <Box>
                <Typography variant="body2" fontWeight={600}>{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Qty {item.quantity} · {formatCurrency(item.price)}
                </Typography>
              </Box>
              <Typography fontWeight={700}>{formatCurrency(item.lineTotal)}</Typography>
            </Stack>
          ))}
          <Box sx={{ p: 2.25, bgcolor: "background.default" }}>
            <Stack direction="row" justifyContent="space-between" sx={{ py: 0.4 }}>
              <Typography variant="body2" color="text.secondary">Subtotal</Typography>
              <Typography variant="body2" fontWeight={600}>{formatCurrency(order.subtotal)}</Typography>
            </Stack>
            {order.discount > 0 && (
              <Stack direction="row" justifyContent="space-between" sx={{ py: 0.4 }}>
                <Typography variant="body2" color="success.main">Discount</Typography>
                <Typography variant="body2" fontWeight={600} color="success.main">-{formatCurrency(order.discount)}</Typography>
              </Stack>
            )}
            <Stack direction="row" justifyContent="space-between" sx={{ py: 0.4 }}>
              <Typography variant="body2" color="text.secondary">Shipping</Typography>
              <Typography variant="body2" fontWeight={600}>{order.shipping === 0 ? "Free" : formatCurrency(order.shipping)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" sx={{ py: 0.4 }}>
              <Typography variant="body2" color="text.secondary">Tax</Typography>
              <Typography variant="body2" fontWeight={600}>{formatCurrency(order.tax)}</Typography>
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={700}>Total</Typography>
              <Typography fontWeight={700}>{formatCurrency(order.total)}</Typography>
            </Stack>
          </Box>
        </Box>

        {/* Sidebar */}
        <Stack spacing={2.5}>
          <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, p: 2.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: ".05em", mb: 1.5 }}>
              Customer
            </Typography>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Avatar sx={{ width: 38, height: 38, fontSize: 13, fontWeight: 600, color: "primary.main", bgcolor: (t) => alpha(t.palette.primary.main, 0.12) }}>
                {customerName.slice(0, 2).toUpperCase()}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>{customerName}</Typography>
                <Typography variant="body2" color="text.secondary" noWrap>{order.user?.email}</Typography>
              </Box>
            </Stack>
          </Box>
          <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, p: 2.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: ".05em", mb: 1 }}>
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
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: ".05em", mb: 1 }}>
              Payment
            </Typography>
            <Typography variant="body2">Card ending {order.paymentLast4 || "••••"}</Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
