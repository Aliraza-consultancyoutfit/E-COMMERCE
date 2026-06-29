import { AppAlert } from "@/components";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid2,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { userCards, userOrders } from "./user-dashboard.data";

export default function UserDashboard() {
  return (
    <Box component="main" sx={{ minHeight: "100vh", py: { xs: 3, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
          >
            <Box>
              <Typography variant="overline" color="primary" fontWeight={800}>
                User
              </Typography>
              <Typography variant="h1" sx={{ mt: 1 }}>
                Shopping Dashboard
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 620 }}>
                User-facing ecommerce screens live under the user UI folder.
              </Typography>
            </Box>
            <Button size="large" variant="contained">
              Continue Shopping
            </Button>
          </Stack>

          <AppAlert severity="info">
            User and admin screens can share auth while keeping role UI separate.
          </AppAlert>

          <Grid2 container spacing={2}>
            {userCards.map((item) => (
              <Grid2 key={item.label} size={{ xs: 12, md: 4 }}>
                <Paper elevation={0} sx={{ p: 3, border: "1px solid #e5e7eb" }}>
                  <Typography color="text.secondary" fontWeight={700}>
                    {item.label}
                  </Typography>
                  <Typography variant="h2" sx={{ mt: 1 }}>
                    {item.value}
                  </Typography>
                </Paper>
              </Grid2>
            ))}
          </Grid2>

          <Paper elevation={0} sx={{ p: 3, border: "1px solid #e5e7eb" }}>
            <Stack spacing={2}>
              <Typography variant="h2">My Orders</Typography>
              <Divider />
              {userOrders.map((order) => (
                <Stack
                  key={order.id}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.5}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography fontWeight={800}>{order.title}</Typography>
                    <Typography color="text.secondary">{order.id}</Typography>
                  </Box>
                  <Chip label={order.status} color="primary" size="small" />
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
