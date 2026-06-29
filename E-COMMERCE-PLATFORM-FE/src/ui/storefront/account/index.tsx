"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ShoppingCartIcon, TickIcon, UserIcon } from "@/assets/icons/common";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFTextField from "@/components/react-hook-form/rhf-text-field";
import NoData from "@/components/no-data";
import { PATHS } from "@/constants/routes";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/store/auth/auth.api";
import { logout } from "@/store/auth/auth.slice";
import {
  useGetMyOrdersQuery,
  useGetOrderQuery,
} from "@/store/orders/order.api";
import type { OrderStatus } from "@/store/orders/order.types";
import { useAppDispatch } from "@/store/hooks";
import { getApiErrorMessage } from "@/utils/api-error";
import { formatCurrency } from "@/utils/format";
import { fileToAvatarDataUrl } from "@/utils/image";
import { removeToken } from "@/utils/auth-token";

type ChipColor = "default" | "primary" | "info" | "success" | "warning" | "error";
const STATUS_META: Record<OrderStatus, { label: string; color: ChipColor }> = {
  pending: { label: "Pending", color: "warning" },
  processing: { label: "Processing", color: "primary" },
  shipped: { label: "Shipped", color: "info" },
  delivered: { label: "Delivered", color: "success" },
  cancelled: { label: "Cancelled", color: "error" },
};

const TIMELINE = ["Order placed", "Processing", "Shipped", "Delivered"];
const STATUS_STEP: Record<OrderStatus, number> = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: 0,
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const orderNumber = (id: string) => `#${id.slice(-6).toUpperCase()}`;

type View = "profile" | "orders" | "orderDetail";

function StatusChip({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return <Chip size="small" label={meta.label} color={meta.color} sx={{ fontWeight: 600 }} />;
}

function ProfilePanel() {
  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const methods = useForm<{ name: string; email: string }>({
    values: { name: profile?.name ?? "", email: profile?.email ?? "" },
  });

  const initials = (profile?.name || profile?.email || "?").slice(0, 2).toUpperCase();

  const onSubmit = methods.handleSubmit(async (values) => {
    try {
      await updateProfile({ name: values.name }).unwrap();
      toast.success("Profile updated");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  });

  const handlePhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    setPhotoBusy(true);
    try {
      const avatar = await fileToAvatarDataUrl(file);
      await updateProfile({ avatar }).unwrap();
      toast.success("Photo updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : getApiErrorMessage(error),
      );
    } finally {
      setPhotoBusy(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      await updateProfile({ avatar: "" }).unwrap();
      toast.success("Photo removed");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (isLoading) {
    return <Skeleton variant="rounded" height={280} />;
  }

  return (
    <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, p: 3.5 }}>
      <Typography variant="h5" fontWeight={700}>
        Profile
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
        Update your personal details and how we reach you.
      </Typography>

      <Stack direction="row" spacing={2.25} alignItems="center" sx={{ mb: 3 }}>
        <Avatar
          src={profile?.avatar || undefined}
          sx={{ width: 72, height: 72, fontSize: 24, fontWeight: 600, color: "primary.main", bgcolor: (t) => alpha(t.palette.primary.main, 0.12) }}
        >
          {initials}
        </Avatar>
        <Box>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
          <Button variant="outlined" disabled={photoBusy} onClick={() => fileRef.current?.click()} sx={{ mr: 1 }}>
            {photoBusy ? "Uploading…" : "Change photo"}
          </Button>
          {profile?.avatar && (
            <Button color="error" disabled={photoBusy} onClick={handleRemovePhoto}>
              Remove
            </Button>
          )}
        </Box>
      </Stack>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mb: 3 }}>
          <RHFTextField name="name" label="Full name" placeholder="Jane Cooper" />
          <RHFTextField name="email" label="Email" disabled />
        </Box>
        <Button type="submit" variant="contained" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </FormProvider>
    </Box>
  );
}

function OrdersPanel({ onOpen }: { onOpen: (id: string) => void }) {
  const { data: orders, isLoading } = useGetMyOrdersQuery();

  if (isLoading) {
    return <Skeleton variant="rounded" height={280} />;
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
              {formatDate(order.createdAt)} ·{" "}
              {order.items.reduce((sum, i) => sum + i.quantity, 0)} item(s)
            </Typography>
          </Box>
          <StatusChip status={order.status} />
          <Typography fontWeight={700} sx={{ width: 84, textAlign: "right", display: { xs: "none", sm: "block" } }}>
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

function Timeline({ status }: { status: OrderStatus }) {
  const current = STATUS_STEP[status];
  return (
    <Stack spacing={0}>
      {TIMELINE.map((label, index) => {
        const done = index < current || status === "delivered";
        const active = index === current && status !== "delivered";
        const reached = index <= current;
        return (
          <Stack key={label} direction="row" spacing={1.75} sx={{ position: "relative", pb: index < TIMELINE.length - 1 ? 3 : 0 }}>
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
              <Typography variant="body2" fontWeight={600} sx={{ color: reached ? "text.primary" : "text.secondary" }}>
                {label}
              </Typography>
            </Box>
          </Stack>
        );
      })}
    </Stack>
  );
}

function OrderDetailPanel({ orderId, onBack }: { orderId: string; onBack: () => void }) {
  const { data: order, isLoading } = useGetOrderQuery(orderId);

  if (isLoading || !order) {
    return <Skeleton variant="rounded" height={360} />;
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
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" spacing={1.5} sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Order {orderNumber(order._id)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Placed {formatDate(order.createdAt)} ·{" "}
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

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5, mb: 2.5 }}>
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
          <Stack key={item.product} direction="row" justifyContent="space-between" sx={{ py: 0.75 }}>
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

export default function Account() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: profile } = useGetProfileQuery();
  const [view, setView] = useState<View>("profile");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const displayName = profile?.name || profile?.email?.split("@")[0] || "Account";
  const initials = (profile?.name || profile?.email || "?").slice(0, 2).toUpperCase();

  const navItems: { key: View; label: string; icon: React.ReactNode }[] = [
    { key: "profile", label: "Profile", icon: <UserIcon width="18" height="18" /> },
    { key: "orders", label: "Orders", icon: <ShoppingCartIcon width="18" height="18" stroke="currentColor" /> },
  ];

  const handleSignOut = () => {
    removeToken();
    dispatch(logout());
    router.push(PATHS.auth.signIn);
  };

  const openOrder = (id: string) => {
    setSelectedOrder(id);
    setView("orderDetail");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        My account
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "240px 1fr" }, gap: 3, alignItems: "start" }}>
        {/* Sidebar */}
        <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, p: 2 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ p: 0.75, pb: 2, borderBottom: 1, borderColor: "divider", mb: 1.5 }}>
            <Avatar src={profile?.avatar || undefined} sx={{ width: 44, height: 44, fontSize: 15, fontWeight: 600, color: "primary.main", bgcolor: (t) => alpha(t.palette.primary.main, 0.12) }}>
              {initials}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography fontWeight={600} noWrap>
                {displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {profile?.email}
              </Typography>
            </Box>
          </Stack>
          <Stack spacing={0.5}>
            {navItems.map((item) => {
              const selected = view === item.key || (item.key === "orders" && view === "orderDetail");
              return (
                <Button
                  key={item.key}
                  onClick={() => setView(item.key)}
                  startIcon={item.icon}
                  sx={{
                    justifyContent: "flex-start",
                    px: 1.5,
                    py: 1,
                    fontWeight: 600,
                    color: selected ? "primary.main" : "text.primary",
                    bgcolor: selected ? (t) => alpha(t.palette.primary.main, 0.1) : "transparent",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
            <Button
              onClick={handleSignOut}
              sx={{ justifyContent: "flex-start", px: 1.5, py: 1, fontWeight: 600, color: "error.main", "&:hover": { bgcolor: (t) => alpha(t.palette.error.main, 0.08) } }}
            >
              Sign out
            </Button>
          </Stack>
        </Box>

        {/* Content */}
        <Box>
          {view === "profile" && <ProfilePanel />}
          {view === "orders" && <OrdersPanel onOpen={openOrder} />}
          {view === "orderDetail" && selectedOrder && (
            <OrderDetailPanel orderId={selectedOrder} onBack={() => setView("orders")} />
          )}
        </Box>
      </Box>
    </Container>
  );
}
