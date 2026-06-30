"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { IAboutTemplateProps } from "./about-template.interface";

export default function AboutTemplate({
  title,
  intro,
  stats,
  values,
}: IAboutTemplateProps) {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Gradient hero */}
      <Box
        component="header"
        sx={{
          borderRadius: 5,
          p: { xs: 4, md: 7 },
          color: "common.white",
          textAlign: "center",
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main} 50%, ${theme.palette.primary.light})`,
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          fontWeight={700}
          sx={{ letterSpacing: "-0.02em", lineHeight: 1.15 }}
        >
          {title}
        </Typography>
        <Typography
          sx={{ mt: 2, opacity: 0.92, fontSize: 17, maxWidth: 560, mx: "auto" }}
        >
          {intro}
        </Typography>
      </Box>

      {/* Stats row */}
      <Box
        sx={{
          mt: 3,
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
        }}
      >
        {stats.map((stat) => (
          <Stack
            key={stat.label}
            alignItems="center"
            spacing={0.5}
            sx={{
              p: 3,
              textAlign: "center",
              border: 1,
              borderColor: "divider",
              borderRadius: 3.5,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="h4" fontWeight={700} color="primary.main">
              {stat.number}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {stat.label}
            </Typography>
          </Stack>
        ))}
      </Box>

      {/* Values */}
      <Box component="section" sx={{ mt: 6 }}>
        <Typography
          component="h2"
          variant="h4"
          fontWeight={700}
          sx={{ mb: 3 }}
        >
          What we stand for
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 2.5,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
          }}
        >
          {values.map(({ Icon, heading, paragraph }) => (
            <Stack
              key={heading}
              spacing={1.5}
              sx={{
                p: 3,
                border: 1,
                borderColor: "divider",
                borderRadius: 3.5,
                height: "100%",
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "primary.main",
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                }}
              >
                <Icon width="22" height="22" stroke="currentColor" fill="currentColor" />
              </Box>
              <Typography variant="h6" fontWeight={700}>
                {heading}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {paragraph}
              </Typography>
            </Stack>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
