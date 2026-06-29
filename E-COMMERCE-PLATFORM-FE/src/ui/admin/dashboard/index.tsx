import { AppAlert } from "@/components";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid2,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { adminOrders, adminStats } from "./admin-dashboard.data";

export default function AdminDashboard() {
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
                Admin
              </Typography>
              <Typography variant="h1" sx={{ mt: 1 }}>
                Operations Dashboard
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 620 }}>
                Admin-facing ecommerce controls live under the admin UI folder.
              </Typography>
            </Box>
            <Button size="large" variant="contained">
              Create Product
            </Button>
          </Stack>

          <AppAlert severity="success">
            App routes are thin wrappers; this dashboard code is in src/ui/admin.
          </AppAlert>

          <Grid2 container spacing={2}>
            {adminStats.map((item) => (
              <Grid2 key={item.label} size={{ xs: 12, md: 4 }}>
                <Paper elevation={0} sx={{ p: 3, border: "1px solid #e5e7eb" }}>
                  <Typography color="text.secondary" fontWeight={700}>
                    {item.label}
                  </Typography>
                  <Typography variant="h2" sx={{ mt: 1 }}>
                    {item.value}
                  </Typography>
                  <Typography color="secondary" fontWeight={700} sx={{ mt: 1 }}>
                    {item.helper}
                  </Typography>
                </Paper>
              </Grid2>
            ))}
          </Grid2>

          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 7 }}>
              <Paper elevation={0} sx={{ p: 3, border: "1px solid #e5e7eb" }}>
                <Stack spacing={2}>
                  <Typography variant="h2">Recent Orders</Typography>
                  <Divider />
                  {adminOrders.map((order) => (
                    <Stack
                      key={order.id}
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1.5}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      justifyContent="space-between"
                    >
                      <Box>
                        <Typography fontWeight={800}>{order.id}</Typography>
                        <Typography color="text.secondary">
                          {order.customer}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Chip label={order.status} color="primary" size="small" />
                        <Typography fontWeight={800}>{order.total}</Typography>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 5 }}>
              <Paper elevation={0} sx={{ p: 3, border: "1px solid #e5e7eb" }}>
                <Stack spacing={2}>
                  <Typography variant="h2">Fulfillment</Typography>
                  <Typography color="text.secondary">
                    Warehouse capacity used across today&apos;s pick, pack, and
                    dispatch queue.
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={68}
                    sx={{ height: 10, borderRadius: 8 }}
                  />
                  <Typography fontWeight={800}>68% capacity used</Typography>
                </Stack>
              </Paper>
            </Grid2>
          </Grid2>
        </Stack>
      </Container>
    </Box>
  );
}
