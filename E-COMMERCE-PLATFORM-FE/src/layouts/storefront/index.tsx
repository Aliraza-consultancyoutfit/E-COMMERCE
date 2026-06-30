"use client";

import { Box } from "@mui/material";
import { ReactNode } from "react";
import StorefrontNavbar from "@/ui/storefront/storefront-navbar";
import StorefrontFooter from "@/ui/storefront/storefront-footer";

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <StorefrontNavbar />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <StorefrontFooter />
    </Box>
  );
}
