"use client";

import { useRouter } from "next/navigation";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ShieldIcon } from "@/assets/icons/common";
import { PATHS } from "@/constants/routes";

export default function AccessDenied() {
  const router = useRouter();

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
      <Stack alignItems="center" textAlign="center" spacing={2.5}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "tertiary.main",
            bgcolor: (theme) => alpha(theme.palette.tertiary.main, 0.12),
          }}
        >
          <ShieldIcon width="34" height="34" stroke="currentColor" />
        </Box>
        <Typography component="h1" variant="h3" fontWeight={700}>
          Access denied
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 420, lineHeight: 1.6 }}>
          You don&apos;t have permission to view this page. If you think this is
          a mistake, please contact our support team and we&apos;ll help sort it
          out.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push(PATHS.home)}
            sx={{ height: 48, px: 3 }}
          >
            Back to home
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => router.push(PATHS.content.contact)}
            sx={{ height: 48, px: 3 }}
          >
            Contact support
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
