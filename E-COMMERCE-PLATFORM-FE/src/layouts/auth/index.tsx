"use client";

import { Box } from "@mui/material";
import { ReactNode } from "react";
import AuthBrandPanel from "@/ui/auth/auth-brand-panel";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "background.default",
        p: { xs: 0, md: 4 },
      }}
    >
      <Box
        sx={(theme) => ({
          display: "flex",
          width: "100%",
          maxWidth: 1280,
          mx: "auto",
          minHeight: { md: 720 },
          borderRadius: { md: 6 },
          overflow: "hidden",
          bgcolor: "background.paper",
          border: { md: `1px solid ${theme.palette.divider}` },
          boxShadow: { md: theme.shadows[2] },
        })}
      >
        <AuthBrandPanel />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 3, sm: 6 },
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 400 }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
