"use client";

import { Box, Container } from "@mui/material";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Container maxWidth="sm">{children}</Container>
    </Box>
  );
}
