"use client";

import { Box, Chip, Container, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { IArticleTemplateProps } from "./article-template.interface";

export default function ArticleTemplate({
  eyebrow,
  title,
  intro,
  lastUpdated,
  sections,
}: IArticleTemplateProps) {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Box component="article">
        <Chip
          label={eyebrow}
          sx={{
            mb: 2.5,
            fontWeight: 600,
            color: "primary.main",
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
          }}
        />
        <Typography
          component="h1"
          variant="h2"
          fontWeight={700}
          sx={{ letterSpacing: "-0.02em", lineHeight: 1.15 }}
        >
          {title}
        </Typography>
        {lastUpdated && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
            {lastUpdated}
          </Typography>
        )}
        <Typography
          color="text.secondary"
          sx={{ mt: 2.5, fontSize: 17, lineHeight: 1.6 }}
        >
          {intro}
        </Typography>

        <Stack spacing={4} sx={{ mt: 5 }}>
          {sections.map((section) => (
            <Box component="section" key={section.heading}>
              <Typography component="h2" variant="h5" fontWeight={700}>
                {section.heading}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mt: 1.25, lineHeight: 1.65 }}
              >
                {section.paragraph}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Container>
  );
}
