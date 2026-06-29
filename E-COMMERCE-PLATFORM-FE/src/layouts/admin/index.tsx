"use client";

import { ReactNode, useState } from "react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { MenuIcon, ShoppingCartIcon } from "@/assets/icons/common";
import ThemeSwitch from "@/components/theme-switch";
import { PATHS } from "@/constants/routes";
import { logout } from "@/store/auth/auth.slice";
import { useGetProfileQuery } from "@/store/auth/auth.api";
import { useAppDispatch } from "@/store/hooks";
import { removeToken } from "@/utils/auth-token";

const SIDEBAR_WIDTH = 248;

const NAV_ITEMS = [
  { label: "Products", href: PATHS.admin.products },
  { label: "Orders", href: PATHS.admin.orders },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: profile } = useGetProfileQuery();

  const handleSignOut = () => {
    removeToken();
    dispatch(logout());
    router.push(PATHS.home);
  };

  return (
    <Stack sx={{ height: "100%", p: 1.75 }}>
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ px: 1, pb: 2.25 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 2.5,
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

      <Stack spacing={0.5} sx={{ flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Box
              key={item.href}
              component={NextLink}
              href={item.href}
              onClick={onNavigate}
              sx={{
                px: 1.5,
                py: 1.15,
                borderRadius: 2.5,
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                color: active ? "primary.main" : "text.primary",
                bgcolor: active ? (t) => alpha(t.palette.primary.main, 0.1) : "transparent",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              {item.label}
            </Box>
          );
        })}
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        spacing={1.25}
        sx={{ pt: 1.5, borderTop: 1, borderColor: "divider" }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="body2" fontWeight={600} noWrap>
            {profile?.name || profile?.email?.split("@")[0] || "Admin"}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            Store owner
          </Typography>
        </Box>
        <Typography
          component="button"
          onClick={handleSignOut}
          sx={{ border: "none", bgcolor: "transparent", cursor: "pointer", color: "error.main", fontWeight: 600, fontSize: 13 }}
        >
          Sign out
        </Typography>
      </Stack>
    </Stack>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

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
          <Toolbar sx={{ gap: 1 }}>
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: "none" }, color: "text.primary" }}
              aria-label="Open navigation"
            >
              <MenuIcon width="22" height="22" />
            </IconButton>
            <Typography fontWeight={700} sx={{ display: { xs: "none", sm: "block" } }}>
              Admin Console
            </Typography>
            <Box sx={{ ml: "auto" }}>
              <ThemeSwitch />
            </Box>
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3.5 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
