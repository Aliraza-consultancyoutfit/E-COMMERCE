import { Box, CircularProgress, Stack, Typography } from "@mui/material";

export default function Loading() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        bgcolor: "background.default",
      }}
    >
      <Stack spacing={2} alignItems="center">
        <CircularProgress />
        <Typography color="text.secondary" fontWeight={700}>
          Loading
        </Typography>
      </Stack>
    </Box>
  );
}
