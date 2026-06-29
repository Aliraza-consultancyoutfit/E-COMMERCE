import { AppAlert, AppTextField } from "@/components";
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export default function SignIn() {
  return (
    <Box component="main" sx={{ minHeight: "100vh", py: { xs: 3, md: 8 } }}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: 3, border: "1px solid #e5e7eb" }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="overline" color="primary" fontWeight={800}>
                Auth
              </Typography>
              <Typography variant="h1" sx={{ mt: 1 }}>
                Sign in
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Shared authentication entry for admin and user roles.
              </Typography>
            </Box>

            <AppAlert severity="info">
              Connect this screen to role-based auth when the backend contract is
              ready.
            </AppAlert>

            <Divider />

            <Stack spacing={2}>
              <AppTextField label="Email address" type="email" />
              <AppTextField label="Password" type="password" />
              <Button size="large" variant="contained">
                Sign In
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
