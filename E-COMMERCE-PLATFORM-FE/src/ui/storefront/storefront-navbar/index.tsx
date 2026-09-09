"use client";

import { KeyboardEvent, MouseEvent, useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { CrossIcon, MenuIcon, ShoppingCartIcon } from "@/assets/icons/common";
import ThemeSwitch from "@/components/theme-switch";
import HeartIcon from "@/ui/storefront/product-card/heart-icon";
import { PATHS } from "@/constants/routes";
import { signOut } from "@/store/auth/auth.actions";
import { useGetProfileQuery } from "@/store/auth/auth.api";
import { useGetCartQuery } from "@/store/cart/cart.api";
import { useGetWishlistQuery } from "@/store/wishlist/wishlist.api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

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
  const { data: wishlist } = useGetWishlistQuery(undefined, { skip: !user });
  const cartCount = cart?.summary.itemCount ?? 0;
  const wishlistCount = wishlist?.length ?? 0;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Auth state hydrates from the cookie on the client, so the server renders
  // logged-out. Gate auth-dependent UI on `mounted` so the first client render
  // matches the server HTML and reconciles after hydration (no mismatch).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const showAccount = mounted && Boolean(user);

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "";

  const handleSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const trimmed = search.trim();
      router.push(
        trimmed
          ? `${PATHS.catalog}?search=${encodeURIComponent(trimmed)}`
          : PATHS.catalog,
      );
      setMobileOpen(false);
    }
  };

  const handleSignOut = () => {
    dispatch(signOut());
    setAnchorEl(null);
    setMobileOpen(false);
    router.push(PATHS.auth.signIn);
  };

  const closeMobileMenu = () => setMobileOpen(false);

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
            {showAccount && (
              <IconButton
                component={NextLink}
                href={`${PATHS.account}?tab=wishlist`}
                aria-label="Wishlist"
                sx={{ color: "text.primary", display: { xs: "none", sm: "inline-flex" } }}
              >
                <Badge
                  badgeContent={wishlistCount}
                  color="primary"
                  overlap="circular"
                >
                  <HeartIcon width="22" height="22" />
                </Badge>
              </IconButton>
            )}
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

            {showAccount ? (
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
                    display: { xs: "none", sm: "flex" },
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
                sx={{ display: { xs: "none", sm: "inline-flex" } }}
              >
                Sign in
              </Button>
            )}

            <IconButton
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
              sx={{
                color: "text.primary",
                display: { xs: "inline-flex", md: "none" },
              }}
            >
              <MenuIcon width="26" height="26" stroke="currentColor" />
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={closeMobileMenu}
        PaperProps={{
          sx: {
            width: { xs: "86vw", sm: 360 },
            maxWidth: 380,
            p: 2.5,
          },
        }}
      >
        <Stack spacing={2.5} sx={{ height: "100%" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={700}>
              Menu
            </Typography>
            <IconButton aria-label="Close navigation" onClick={closeMobileMenu}>
              <CrossIcon width="22" height="22" stroke="currentColor" />
            </IconButton>
          </Stack>

          <InputBase
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search products"
            inputProps={{ "aria-label": "Search products" }}
            sx={{
              width: "100%",
              height: 44,
              px: 2,
              borderRadius: 1.5,
              border: 1,
              borderColor: "divider",
              bgcolor: "background.default",
            }}
          />

          <Stack component="nav" aria-label="Mobile navigation" spacing={0.75}>
            {NAV_LINKS.map((link) => (
              <Button
                key={link.label}
                component={NextLink}
                href={link.href}
                onClick={closeMobileMenu}
                color="inherit"
                fullWidth
                sx={{ justifyContent: "flex-start", py: 1.25, fontWeight: 600 }}
              >
                {link.label}
              </Button>
            ))}
          </Stack>

          <Divider />

          <Stack spacing={1}>
            <Button
              component={NextLink}
              href={PATHS.cart}
              onClick={closeMobileMenu}
              color="inherit"
              fullWidth
              sx={{ justifyContent: "space-between", py: 1.25, fontWeight: 600 }}
            >
              Cart
              <Badge badgeContent={cartCount} color="primary" />
            </Button>
            {showAccount ? (
              <>
                <Button
                  component={NextLink}
                  href={PATHS.account}
                  onClick={closeMobileMenu}
                  color="inherit"
                  fullWidth
                  sx={{ justifyContent: "flex-start", py: 1.25, fontWeight: 600 }}
                >
                  My account
                </Button>
                <Button
                  component={NextLink}
                  href={`${PATHS.account}?tab=wishlist`}
                  onClick={closeMobileMenu}
                  color="inherit"
                  fullWidth
                  sx={{ justifyContent: "space-between", py: 1.25, fontWeight: 600 }}
                >
                  Wishlist
                  <Badge badgeContent={wishlistCount} color="primary" />
                </Button>
                <Button
                  onClick={handleSignOut}
                  color="inherit"
                  fullWidth
                  sx={{ justifyContent: "flex-start", py: 1.25, fontWeight: 600 }}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                component={NextLink}
                href={PATHS.auth.signIn}
                onClick={closeMobileMenu}
                fullWidth
              >
                Sign in
              </Button>
            )}
          </Stack>

          <Box sx={{ mt: "auto" }}>
            <ThemeSwitch />
          </Box>
        </Stack>
      </Drawer>
    </AppBar>
  );
}
