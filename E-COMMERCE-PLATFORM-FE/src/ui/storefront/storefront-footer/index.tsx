"use client";

import { Box, Container, Divider, Stack, Typography } from "@mui/material";
import { ShoppingCartIcon } from "@/assets/icons/common";

const COLUMNS = [
  { title: "Shop", links: ["New arrivals", "Best sellers", "Deals", "Gift cards"] },
  { title: "Company", links: ["About", "Careers", "Press", "Sustainability"] },
  { title: "Support", links: ["Help center", "Shipping", "Returns", "Contact"] },
];

const LEGAL = ["Privacy", "Terms", "Cookies"];

export default function StorefrontFooter() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        borderTop: 1,
        borderColor: "divider",
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box
          sx={{
            display: "grid",
            gap: 4,
            gridTemplateColumns: {
              xs: "1fr 1fr",
              md: "2fr 1fr 1fr 1fr",
            },
          }}
        >
          <Box>
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.5, cursor: "pointer" }} onClick={() => window.location.assign("/")}>
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShoppingCartIcon width="17" height="17" stroke="currentColor" />
              </Box>
              <Typography variant="body1" fontWeight={700}>
                EliteCart
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 260 }}>
              Premium electronics and smart home, curated and fairly priced.
            </Typography>
          </Box>

          {COLUMNS.map((column) => (
            <Box key={column.title}>
              <Typography variant="body1" fontWeight={700} sx={{ mb: 1.5 }}>
                {column.title}
              </Typography>
              <Stack spacing={1}>
                {column.links.map((link) => (
                  <Typography
                    key={link}
                    variant="body2"
                    color="text.secondary"
                    sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
                  >
                    {link}
                  </Typography>
                ))}
              </Stack>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2026 EliteCart. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={2.5}>
            {LEGAL.map((item) => (
              <Typography
                key={item}
                variant="body2"
                color="text.secondary"
                sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
              >
                {item}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
