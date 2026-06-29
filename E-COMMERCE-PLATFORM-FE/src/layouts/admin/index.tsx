"use client";

import { ReactNode, useState } from "react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Drawer,
  IconButton,
  InputBase,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { MenuIcon, NotificationIcon, ShoppingCartIcon } from "@/assets/icons/common";
import ThemeSwitch from "@/components/theme-switch";
import { PATHS } from "@/constants/routes";
import { logout } from "@/store/auth/auth.slice";
import { useGetProfileQuery } from "@/store/auth/auth.api";
import { useGetAllOrdersQuery } from "@/store/orders/order.api";
import { useAppDispatch } from "@/store/hooks";
import { removeToken } from "@/utils/auth-token";

const SIDEBAR_WIDTH = 248;

type NavIcon = (active: boolean) => ReactNode;

const Svg = ({ paths }: { paths: string[] }) => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.85}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {paths.map((d) => (
      <path key={d} d={d} />
    ))}
  </svg>
);

const NAV_ITEMS: {
  label: string;
  href: string;
  icon: NavIcon;
  badge?: boolean;
}[] = [
  {
    label: "Dashboard",
    href: PATHS.admin.root,
    icon: () => (
      <Svg paths={["M3 13h8V3H3zM13 21h8V11h-8zM13 3v6h8V3zM3 21h8v-6H3z"]} />
    ),
  },
  {
    label: "Products",
    href: PATHS.admin.products,
    icon: () => (
      <Svg
        paths={[
          "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
          "m3.3 7 8.7 5 8.7-5",
          "M12 22V12",
        ]}
      />
    ),
  },
  {
    label: "Orders",
    href: PATHS.admin.orders,
    badge: true,
    icon: () => (
      <Svg
        paths={[
          "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z",
          "M3 6h18",
          "M16 10a4 4 0 0 1-8 0",
        ]}
      />
    ),
  },
  {
    label: "Customers",
    href: PATHS.admin.customers,
    icon: () => (
      <Svg
        paths={[
          "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2",
          "M9 7a4 4 0 1 0 0 0",
          "M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
        ]}
      />
    ),
  },
  {
    label: "Reports",
    href: PATHS.admin.reports,
    icon: () => <Svg paths={["M3 3v18h18", "m19 9-5 5-4-4-3 3"]} />,
  },
  {
    label: "Users & admins",
    href: PATHS.admin.users,
    icon: () => (
      <Svg
        paths={[
          "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
          "M9 7a4 4 0 1 0 0 0",
          "M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
        ]}
      />
    ),
  },
  {
    label: "Settings",
    href: PATHS.admin.settings,
    icon: () => (
      <Svg
        paths={[
          "M12.2 2h-.4a2 2 0 0 0-2 2 1.7 1.7 0 0 1-1 1.5 1.7 1.7 0 0 1-1.9-.3l-.3-.3a2 2 0 1 0-2.8 2.8l.3.3a1.7 1.7 0 0 1 .3 1.9 1.7 1.7 0 0 1-1.5 1H2a2 2 0 1 0 0 4 1.7 1.7 0 0 1 1.5 1 1.7 1.7 0 0 1-.3 1.9l-.3.3a2 2 0 1 0 2.8 2.8l.3-.3a1.7 1.7 0 0 1 1.9-.3 1.7 1.7 0 0 1 1 1.5V22a2 2 0 1 0 4 0 1.7 1.7 0 0 1 1-1.5 1.7 1.7 0 0 1 1.9.3l.3.3a2 2 0 1 0 2.8-2.8l-.3-.3a1.7 1.7 0 0 1-.3-1.9 1.7 1.7 0 0 1 1.5-1H22a2 2 0 1 0 0-4 1.7 1.7 0 0 1-1.5-1 1.7 1.7 0 0 1 .3-1.9l.3-.3a2 2 0 1 0-2.8-2.8l-.3.3a1.7 1.7 0 0 1-1.9.3H16a1.7 1.7 0 0 1-1-1.5V4a2 2 0 0 0-2-2z",
          "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
        ]}
      />
    ),
  },
  {
    label: "Activity logs",
    href: PATHS.admin.logs,
    icon: () => (
      <Svg paths={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8M16 17H8M10 9H8"]} />
    ),
  },
];

const initialsOf = (value?: string) =>
  (value || "Admin")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "AD";

const titleFromPath = (pathname: string) => {
  if (pathname.startsWith(PATHS.admin.products)) return "Products";
  if (pathname.startsWith(PATHS.admin.orders)) return "Orders";
  if (pathname.startsWith(PATHS.admin.customers)) return "Customers";
  if (pathname.startsWith(PATHS.admin.reports)) return "Reports";
  if (pathname.startsWith(PATHS.admin.users)) return "Users & admins";
  if (pathname.startsWith(PATHS.admin.settings)) return "Settings";
  if (pathname.startsWith(PATHS.admin.logs)) return "Activity logs";
  return "Dashboard";
};

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: profile } = useGetProfileQuery();
  const { data: pending } = useGetAllOrdersQuery({ page: 1, limit: 1, status: "pending" });
  const pendingCount = pending?.meta?.total ?? 0;

  const handleSignOut = () => {
    removeToken();
    dispatch(logout());
    router.push(PATHS.home);
  };

  const name = profile?.name || profile?.email?.split("@")[0] || "Admin";

  return (
    <Stack sx={{ height: "100%", p: 1.75 }}>
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ px: 1, pb: 2.25 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 2.25,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ShoppingCartIcon width="19" height="19" stroke="currentColor" />
        </Box>
        <Box>
          <Typography fontWeight={700} sx={{ lineHeight: 1.1 }}>
            EliteCart
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Admin
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={0.25} sx={{ flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === PATHS.admin.root
              ? pathname === PATHS.admin.root
              : pathname.startsWith(item.href);
          return (
            <Stack
              key={item.href}
              component={NextLink}
              href={item.href}
              onClick={onNavigate}
              direction="row"
              alignItems="center"
              spacing={1.4}
              sx={{
                px: 1.5,
                py: 1.25,
                borderRadius: 2.5,
                fontWeight: 600,
                fontSize: 13.5,
                textDecoration: "none",
                color: active ? "primary.main" : "text.primary",
                bgcolor: active ? (t) => alpha(t.palette.primary.main, 0.1) : "transparent",
                "&:hover": { bgcolor: active ? undefined : "action.hover" },
              }}
            >
              <Box sx={{ display: "flex" }}>{item.icon(active)}</Box>
              <Box component="span" sx={{ flex: 1 }}>
                {item.label}
              </Box>
              {item.badge && pendingCount > 0 && (
                <Box
                  component="span"
                  sx={{
                    px: 1,
                    py: 0.1,
                    borderRadius: 999,
                    bgcolor: "error.main",
                    color: "common.white",
                    fontSize: 11,
                    fontWeight: 700,
                    lineHeight: 1.6,
                  }}
                >
                  {pendingCount}
                </Box>
              )}
            </Stack>
          );
        })}
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        spacing={1.25}
        sx={{ pt: 1.5, mt: 1, borderTop: 1, borderColor: "divider" }}
      >
        <Avatar
          sx={{
            width: 34,
            height: 34,
            fontSize: 13,
            fontWeight: 600,
            color: "primary.main",
            bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
          }}
        >
          {initialsOf(name)}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="body2" fontWeight={600} noWrap>
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            Store owner
          </Typography>
        </Box>
        <Typography
          component="button"
          onClick={handleSignOut}
          sx={{
            border: "none",
            bgcolor: "transparent",
            cursor: "pointer",
            color: "error.main",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          Sign out
        </Typography>
      </Stack>
    </Stack>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { data: profile } = useGetProfileQuery();
  const pageTitle = titleFromPath(pathname);
  const name = profile?.name || profile?.email?.split("@")[0] || "Admin";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Desktop sidebar */}
      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          borderRight: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          display: { xs: "none", md: "block" },
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <SidebarContent />
      </Box>

      {/* Mobile drawer */}
      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ display: { md: "none" } }}>
        <Box sx={{ width: SIDEBAR_WIDTH, height: "100%", bgcolor: "background.paper" }}>
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </Box>
      </Drawer>

      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <AppBar
          position="sticky"
          elevation={0}
          color="default"
          sx={{ bgcolor: "background.paper", borderBottom: 1, borderColor: "divider" }}
        >
          <Toolbar sx={{ gap: 1.5 }}>
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: "none" }, color: "text.primary" }}
              aria-label="Open navigation"
            >
              <MenuIcon width="22" height="22" />
            </IconButton>

            <Typography variant="h5" fontWeight={700} noWrap>
              {pageTitle}
            </Typography>

            <Box
              sx={{
                ml: "auto",
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                width: 300,
                height: 40,
                px: 1.75,
                borderRadius: 2.5,
                border: 1,
                borderColor: "divider",
                bgcolor: "background.default",
                color: "text.secondary",
              }}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <InputBase
                placeholder="Search orders, products, customers"
                sx={{ ml: 1, flex: 1, fontSize: 14, color: "text.primary" }}
              />
            </Box>

            <IconButton
              aria-label="Notifications"
              sx={{
                ml: { xs: "auto", sm: 0 },
                width: 40,
                height: 40,
                border: 1,
                borderColor: "divider",
                borderRadius: 2.5,
                color: "text.primary",
              }}
            >
              <Badge color="error" variant="dot" overlap="circular">
                <NotificationIcon width="20" height="20" stroke="currentColor" />
              </Badge>
            </IconButton>

            <ThemeSwitch />

            <Avatar
              sx={{
                width: 38,
                height: 38,
                fontSize: 13,
                fontWeight: 600,
                color: "primary.main",
                bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
              }}
            >
              {initialsOf(name)}
            </Avatar>
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3.5 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
