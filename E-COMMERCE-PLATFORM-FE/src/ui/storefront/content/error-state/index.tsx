"use client";

import { useRouter } from "next/navigation";
import { Box, Button, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { PATHS } from "@/constants/routes";
import { IErrorStateProps } from "./error-state.interface";

function WarningTriangleIcon() {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      fill="none"
      sx={{ width: 36, height: 36, color: "inherit" }}
      aria-hidden="true"
    >
      <path
        d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 9v4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 17h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  );
}

export default function ErrorState({ reset }: IErrorStateProps) {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Stack alignItems="center" textAlign="center" spacing={2.5} sx={{ maxWidth: 440 }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "warning.main",
            bgcolor: (theme) => alpha(theme.palette.warning.main, 0.14),
          }}
        >
          <WarningTriangleIcon />
        </Box>
        <Typography component="h1" variant="h3" fontWeight={700}>
          Something went wrong
        </Typography>
        <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
          An unexpected error stopped this page from loading. It&apos;s not your
          fault — try again, and if it keeps happening, head back home.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button
            variant="contained"
            size="large"
            onClick={reset}
            sx={{ height: 48, px: 3 }}
          >
            Try again
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => router.push(PATHS.home)}
            sx={{ height: 48, px: 3 }}
          >
            Back to home
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
