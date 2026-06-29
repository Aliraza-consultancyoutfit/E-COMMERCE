"use client";

import { Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  ShieldIcon,
  ShoppingCartIcon,
  StarIcon,
} from "@/assets/icons/common";

const STARS = [0, 1, 2, 3, 4];

/** Left marketing panel of the auth split layout. Hidden below `md`. */
export default function AuthBrandPanel() {
  const theme = useTheme();
  const white = theme.palette.common.white;

  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        width: "46%",
        flexShrink: 0,
        p: 6,
        position: "relative",
        overflow: "hidden",
        color: white,
        background: `linear-gradient(150deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main} 45%, ${theme.palette.primary.light})`,
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        onClick={() => window.location.assign("/")}
        sx={{ mb: 1, cursor: "pointer" }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2.5,
            bgcolor: alpha(white, 0.18),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ShoppingCartIcon width="20" height="20" stroke={white} />
        </Box>
        <Typography variant="h6" fontWeight={700} color="inherit">
          EliteCart
        </Typography>
      </Stack>

      <Stack sx={{ flex: 1, justifyContent: "center", py: 4 }}>
        <Typography
          variant="h2"
          fontWeight={700}
          color="inherit"
          sx={{ letterSpacing: "-0.02em", lineHeight: 1.15 }}
        >
          Everything your store needs, in one place.
        </Typography>
        <Typography
          color="inherit"
          sx={{ mt: 2.5, maxWidth: 380, opacity: 0.92, fontSize: 17, lineHeight: 1.5 }}
        >
          Sign in to manage your cart, track orders, and pick up right where you
          left off.
        </Typography>
      </Stack>

      <Stack spacing={3}>
        <Box
          sx={{
            bgcolor: alpha(white, 0.12),
            border: `1px solid ${alpha(white, 0.18)}`,
            borderRadius: 4,
            p: 2.5,
          }}
        >
          <Stack direction="row" spacing={0.5} sx={{ mb: 1.25 }}>
            {STARS.map((i) => (
              <StarIcon key={i} width="16" height="16" />
            ))}
          </Stack>
          <Typography color="inherit" sx={{ fontSize: 14, lineHeight: 1.5, mb: 1.75, opacity: 0.95 }}>
            &ldquo;We migrated our entire storefront and admin onto one system.
            Cleaner, faster, and our team finally agrees on the components.&rdquo;
          </Typography>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: alpha(white, 0.22),
                fontSize: 13,
                fontWeight: 600,
                color: white,
              }}
            >
              MR
            </Avatar>
            <Box>
              <Typography color="inherit" sx={{ fontSize: 14, fontWeight: 600 }}>
                Maya Reyes
              </Typography>
              <Typography color="inherit" sx={{ fontSize: 12, opacity: 0.8 }}>
                Head of Commerce, Vela Retail
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Stack direction="row" spacing={2.5} sx={{ opacity: 0.85 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ShieldIcon width="16" height="16" stroke={white} />
            <Typography color="inherit" sx={{ fontSize: 13 }}>
              SOC 2 Type II
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <ShieldIcon width="16" height="16" stroke={white} />
            <Typography color="inherit" sx={{ fontSize: 13 }}>
              256-bit encryption
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
