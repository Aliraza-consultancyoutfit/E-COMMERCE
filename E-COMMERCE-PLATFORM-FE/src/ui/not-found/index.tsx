import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        bgcolor: "background.default",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={2} alignItems="flex-start">
          <Typography variant="overline" color="primary" fontWeight={800}>
            404
          </Typography>
          <Typography variant="h1">Page not found</Typography>
          <Typography color="text.secondary">
            The page you are looking for does not exist.
          </Typography>
          <Button component={Link} href="/" variant="contained">
            Back Home
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
