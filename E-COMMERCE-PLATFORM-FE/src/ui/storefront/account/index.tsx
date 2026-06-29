"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  BillingAddressIcon,
  NotificationIcon,
  ShieldIcon,
  ShoppingCartIcon,
  UserIcon,
} from "@/assets/icons/common";
import HeartIcon from "@/ui/storefront/product-card/heart-icon";
import ProfilePanel from "@/ui/storefront/account/profile-panel";
import OrdersPanel from "@/ui/storefront/account/orders-panel";
import OrderDetailPanel from "@/ui/storefront/account/order-detail-panel";
import AddressesPanel from "@/ui/storefront/account/addresses-panel";
import WishlistPanel from "@/ui/storefront/account/wishlist-panel";
import NotificationsPanel from "@/ui/storefront/account/notifications-panel";
import SettingsPanel from "@/ui/storefront/account/settings-panel";
import { PATHS } from "@/constants/routes";
import { useGetProfileQuery } from "@/store/auth/auth.api";
import { logout } from "@/store/auth/auth.slice";
import { useAppDispatch } from "@/store/hooks";
import { removeToken } from "@/utils/auth-token";

type Section =
  | "profile"
  | "orders"
  | "addresses"
  | "wishlist"
  | "notifications"
  | "settings";

const SECTIONS: { key: Section; label: string; icon: React.ReactNode }[] = [
  { key: "profile", label: "Profile", icon: <UserIcon width="18" height="18" stroke="currentColor" /> },
  {
    key: "orders",
    label: "Orders",
    icon: <ShoppingCartIcon width="18" height="18" stroke="currentColor" />,
  },
  {
    key: "addresses",
    label: "Addresses",
    icon: <BillingAddressIcon width="18" height="18" stroke="currentColor" />,
  },
  { key: "wishlist", label: "Wishlist", icon: <HeartIcon width="18" height="18" /> },
  {
    key: "notifications",
    label: "Notifications",
    icon: <NotificationIcon width="18" height="18" stroke="currentColor" />,
  },
  {
    key: "settings",
    label: "Settings",
    icon: <ShieldIcon width="18" height="18" stroke="currentColor" />,
  },
];

const isSection = (value: string | null): value is Section =>
  Boolean(value) && SECTIONS.some((section) => section.key === value);

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { data: profile } = useGetProfileQuery();

  const [section, setSection] = useState<Section>("profile");
  const [viewingOrder, setViewingOrder] = useState<string | null>(null);

  // Deep-link support: the navbar heart links to ?tab=wishlist.
  const tabParam = searchParams.get("tab");
  useEffect(() => {
    if (isSection(tabParam)) {
      setSection(tabParam);
      setViewingOrder(null);
    }
  }, [tabParam]);

  const displayName = profile?.name || profile?.email?.split("@")[0] || "Account";
  const initials = (profile?.name || profile?.email || "?").slice(0, 2).toUpperCase();

  const handleSignOut = () => {
    removeToken();
    dispatch(logout());
    router.push(PATHS.auth.signIn);
  };

  const handleSelect = (key: Section) => {
    setSection(key);
    setViewingOrder(null);
  };

  const openOrder = (id: string) => setViewingOrder(id);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        My account
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "260px 1fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 4,
            p: 2,
            position: { md: "sticky" },
            top: { md: 88 },
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ p: 0.75, pb: 2, borderBottom: 1, borderColor: "divider", mb: 1.5 }}
          >
            <Avatar
              src={profile?.avatar || undefined}
              sx={{
                width: 44,
                height: 44,
                fontSize: 15,
                fontWeight: 600,
                color: "primary.main",
                bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
              }}
            >
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
            {SECTIONS.map((item) => {
              const selected = section === item.key;
              return (
                <Button
                  key={item.key}
                  onClick={() => handleSelect(item.key)}
                  startIcon={item.icon}
                  sx={{
                    justifyContent: "flex-start",
                    px: 1.5,
                    py: 1,
                    fontWeight: 600,
                    color: selected ? "primary.main" : "text.primary",
                    bgcolor: selected
                      ? (t) => alpha(t.palette.primary.main, 0.1)
                      : "transparent",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
            <Button
              onClick={handleSignOut}
              sx={{
                justifyContent: "flex-start",
                px: 1.5,
                py: 1,
                mt: 0.5,
                fontWeight: 600,
                color: "error.main",
                "&:hover": { bgcolor: (t) => alpha(t.palette.error.main, 0.08) },
              }}
            >
              Sign out
            </Button>
          </Stack>
        </Box>

        {/* Content */}
        <Box>
          {section === "profile" && <ProfilePanel />}
          {section === "orders" &&
            (viewingOrder ? (
              <OrderDetailPanel
                orderId={viewingOrder}
                onBack={() => setViewingOrder(null)}
              />
            ) : (
              <OrdersPanel onOpen={openOrder} />
            ))}
          {section === "addresses" && <AddressesPanel />}
          {section === "wishlist" && <WishlistPanel />}
          {section === "notifications" && <NotificationsPanel />}
          {section === "settings" && <SettingsPanel />}
        </Box>
      </Box>
    </Container>
  );
}

export default function Account() {
  return (
    <Suspense fallback={null}>
      <AccountContent />
    </Suspense>
  );
}
