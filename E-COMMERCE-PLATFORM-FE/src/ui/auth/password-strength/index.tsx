"use client";

import { Box, Stack, Typography } from "@mui/material";

const RULES = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One number", test: (v: string) => /\d/.test(v) },
  { label: "One symbol", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

const LEVELS = [
  { label: "", color: "divider" },
  { label: "Weak", color: "error.main" },
  { label: "Fair", color: "warning.main" },
  { label: "Good", color: "warning.main" },
  { label: "Strong", color: "success.main" },
];

const SEGMENTS = [0, 1, 2, 3];

export default function PasswordStrength({ password }: { password: string }) {
  const met = RULES.map((rule) => rule.test(password));
  const score = met.filter(Boolean).length;
  const level = LEVELS[score];

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={0.75} sx={{ mb: 1.25 }}>
        {SEGMENTS.map((index) => (
          <Box
            key={index}
            sx={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              bgcolor: index < score ? level.color : "divider",
            }}
          />
        ))}
      </Stack>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Typography variant="subtitle1" color="text.secondary">
          Password strength
        </Typography>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{ color: score ? level.color : "text.secondary" }}
        >
          {level.label}
        </Typography>
      </Stack>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0.75 }}>
        {RULES.map((rule, index) => (
          <Stack key={rule.label} direction="row" spacing={0.75} alignItems="center">
            <Typography
              variant="subtitle1"
              sx={{ color: met[index] ? "success.main" : "text.secondary" }}
            >
              {met[index] ? "✓" : "○"}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: met[index] ? "text.primary" : "text.secondary" }}
            >
              {rule.label}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Box>
  );
}
