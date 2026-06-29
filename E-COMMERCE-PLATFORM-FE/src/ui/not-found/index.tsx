"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { PATHS } from "@/constants/routes";

export default function NotFound() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: 72, md: 96 },
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          color: "primary.main",
          mb: 1,
        }}
      >
        404
      </Typography>
      <Typography variant="h4" fontWeight={700}>
        Page not found
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ mt: 1.5, mb: 3.5, maxWidth: 380, lineHeight: 1.5 }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back on track.
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        justifyContent="center"
      >
        <Button
          variant="contained"
          size="large"
          onClick={() => router.push(PATHS.home)}
          sx={{ height: 48 }}
        >
          Back to home
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => router.push(PATHS.catalog)}
          sx={{ height: 48 }}
        >
          Browse products
        </Button>
      </Stack>
    </Box>
  );
}
