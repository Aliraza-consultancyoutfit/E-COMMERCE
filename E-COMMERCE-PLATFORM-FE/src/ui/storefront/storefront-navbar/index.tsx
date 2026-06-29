"use client";

import { KeyboardEvent, MouseEvent, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ShoppingCartIcon } from "@/assets/icons/common";
import ThemeSwitch from "@/components/theme-switch";
import { PATHS } from "@/constants/routes";
import { logout } from "@/store/auth/auth.slice";
import { useGetProfileQuery } from "@/store/auth/auth.api";
import { useGetCartQuery } from "@/store/cart/cart.api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeToken } from "@/utils/auth-token";

const NAV_LINKS = [
  { label: "Shop", href: PATHS.catalog },
  { label: "Categories", href: PATHS.catalog },
  { label: "Deals", href: PATHS.catalog },
];

export default function StorefrontNavbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { data: cart } = useGetCartQuery(undefined, { skip: !user });
  const { data: profile } = useGetProfileQuery(undefined, { skip: !user });
  const cartCount = cart?.summary.itemCount ?? 0;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [search, setSearch] = useState("");

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "";

  const handleSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const trimmed = search.trim();
      router.push(
        trimmed
          ? `${PATHS.catalog}?search=${encodeURIComponent(trimmed)}`
          : PATHS.catalog,
      );
    }
  };

  const handleSignOut = () => {
    removeToken();
    dispatch(logout());
    setAnchorEl(null);
    router.push(PATHS.auth.signIn);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="default"
      sx={{
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2, py: 1 }}>
          <Stack
            direction="row"
            spacing={1.25}
            alignItems="center"
            component={NextLink}
            href={PATHS.home}
            sx={{ textDecoration: "none", color: "text.primary" }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShoppingCartIcon width="18" height="18" stroke="currentColor" />
            </Box>
            <Typography variant="h6" fontWeight={700}>
              EliteCart
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={0.5}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {NAV_LINKS.map((link) => (
              <Button
                key={link.label}
                component={NextLink}
                href={link.href}
                color="inherit"
                sx={{ fontWeight: 500 }}
              >
                {link.label}
              </Button>
            ))}
          </Stack>

          <Box sx={{ flex: 1, maxWidth: 360, display: { xs: "none", sm: "block" } }}>
            <InputBase
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search products"
              inputProps={{ "aria-label": "Search products" }}
              sx={{
                width: "100%",
                height: 42,
                px: 2,
                borderRadius: 999,
                border: 1,
                borderColor: "divider",
                bgcolor: "background.default",
              }}
            />
          </Box>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: "auto" }}>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <ThemeSwitch />
            </Box>
            <IconButton
              component={NextLink}
              href={PATHS.cart}
              aria-label="Cart"
              sx={{ color: "text.primary" }}
            >
              <Badge badgeContent={cartCount} color="primary" overlap="circular">
                <ShoppingCartIcon width="22" height="22" stroke="currentColor" />
              </Badge>
            </IconButton>

            {user ? (
              <>
                <Avatar
                  src={profile?.avatar || undefined}
                  onClick={(event: MouseEvent<HTMLElement>) =>
                    setAnchorEl(event.currentTarget)
                  }
                  sx={{
                    cursor: "pointer",
                    width: 36,
                    height: 36,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "primary.main",
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                  }}
                >
                  {initials}
                </Avatar>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem
                    component={NextLink}
                    href={PATHS.account}
                    onClick={() => setAnchorEl(null)}
                  >
                    My account
                  </MenuItem>
                  <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                component={NextLink}
                href={PATHS.auth.signIn}
              >
                Sign in
              </Button>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
