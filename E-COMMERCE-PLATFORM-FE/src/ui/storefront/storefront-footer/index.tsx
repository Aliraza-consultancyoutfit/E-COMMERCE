"use client";

import Link from "next/link";
import { Box, Container, Divider, Link as MuiLink, Stack, Typography } from "@mui/material";
import { ShoppingCartIcon } from "@/assets/icons/common";
import { PATHS } from "@/constants/routes";

interface IFooterLink {
  label: string;
  href: string;
}

const COLUMNS: { title: string; links: IFooterLink[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "New arrivals", href: PATHS.catalog },
      { label: "Best sellers", href: PATHS.catalog },
      { label: "Deals", href: PATHS.catalog },
      { label: "All products", href: PATHS.catalog },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: PATHS.content.about },
      { label: "Careers", href: PATHS.content.careers },
      { label: "Press", href: PATHS.content.press },
      { label: "Sustainability", href: PATHS.content.sustainability },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help center", href: PATHS.content.help },
      { label: "Shipping", href: PATHS.content.shipping },
      { label: "Returns", href: PATHS.content.returns },
      { label: "Contact", href: PATHS.content.contact },
    ],
  },
];

const LEGAL: IFooterLink[] = [
  { label: "Privacy", href: PATHS.content.privacy },
  { label: "Terms", href: PATHS.content.terms },
  { label: "Cookies", href: PATHS.content.cookies },
];

function FooterLink({ label, href }: IFooterLink) {
  return (
    <MuiLink
      component={Link}
      href={href}
      variant="body2"
      underline="none"
      color="text.secondary"
      sx={{ "&:hover": { color: "primary.main" } }}
    >
      {label}
    </MuiLink>
  );
}

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
            <MuiLink
              component={Link}
              href={PATHS.home}
              underline="none"
              color="inherit"
              sx={{ display: "inline-flex" }}
            >
              <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.5 }}>
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
            </MuiLink>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 260 }}>
              Premium electronics and smart home, curated and fairly priced.
            </Typography>
          </Box>

          {COLUMNS.map((column) => (
            <Box key={column.title}>
              <Typography variant="body1" fontWeight={700} sx={{ mb: 1.5 }}>
                {column.title}
              </Typography>
              <Stack spacing={1} component="nav" aria-label={column.title}>
                {column.links.map((link) => (
                  <FooterLink key={link.label} {...link} />
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
          <Stack direction="row" spacing={2.5} component="nav" aria-label="Legal">
            {LEGAL.map((link) => (
              <FooterLink key={link.label} {...link} />
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
