import { brand } from "@/assets";
import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";

const roles = [
  {
    title: "Admin",
    description: "Manage catalog, orders, customers, and platform operations.",
    href: "/admin",
  },
  {
    title: "User",
    description: "Shop products, track orders, and manage account activity.",
    href: "/user",
  },
];

export default function Home() {
  return (
    <Box component="main" sx={{ minHeight: "100vh", py: { xs: 3, md: 8 } }}>
      <Container maxWidth="md">
        <Stack spacing={4}>
          <Box>
            <Typography variant="overline" color="primary" fontWeight={800}>
              Next.js App Router + MUI
            </Typography>
            <Typography variant="h1" sx={{ mt: 1 }}>
              {brand.name}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 620 }}>
              {brand.tagline}
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            {roles.map((role) => (
              <Paper
                key={role.title}
                elevation={0}
                sx={{ flex: 1, p: 3, border: "1px solid #e5e7eb" }}
              >
                <Stack spacing={2}>
                  <Typography variant="h2">{role.title}</Typography>
                  <Typography color="text.secondary">{role.description}</Typography>
                  <Button component={Link} href={role.href} variant="contained">
                    Open {role.title}
                  </Button>
                </Stack>
              </Paper>
            ))}
          </Stack>

          <Button component={Link} href="/auth/sign-in" variant="outlined">
            Go to auth
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
