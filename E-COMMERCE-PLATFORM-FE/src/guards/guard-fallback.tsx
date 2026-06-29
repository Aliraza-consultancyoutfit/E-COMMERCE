"use client";

import { Box, CircularProgress } from "@mui/material";

/** Full-screen themed spinner shown while a guard resolves the session. */
export default function GuardFallback() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
}
