"use client";

import { Button, Divider, Stack } from "@mui/material";
import { AppleIcon, GoogleIcon } from "@/assets/icons/common";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api";

const startSocialAuth = (provider: "google" | "apple") => {
  window.location.href = `${API_BASE_URL}/auth/social/${provider}`;
};

const buttonSx = {
  height: 48,
  color: "text.primary",
  borderColor: "divider",
  "&:hover": { bgcolor: "action.hover", borderColor: "divider" },
} as const;

export default function SocialAuthButtons() {
  return (
    <>
      <Divider sx={{ my: 3, color: "text.secondary", fontSize: 13 }}>
        or continue with
      </Divider>
      <Stack direction="row" spacing={1.5}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => startSocialAuth("google")}
          startIcon={<GoogleIcon width="18" height="18" />}
          sx={buttonSx}
        >
          Google
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => startSocialAuth("apple")}
          startIcon={<AppleIcon width="17" height="17" />}
          sx={buttonSx}
        >
          Apple
        </Button>
      </Stack>
    </>
  );
}
