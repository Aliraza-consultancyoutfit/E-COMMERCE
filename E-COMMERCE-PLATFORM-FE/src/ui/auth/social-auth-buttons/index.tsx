"use client";

import toast from "react-hot-toast";
import { Button, Divider, Stack } from "@mui/material";
import { AppleIcon, GoogleIcon } from "@/assets/icons/common";

const notifyUnavailable = () =>
  toast("Social sign-in isn't available in this demo", { icon: "ℹ️" });

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
          onClick={notifyUnavailable}
          startIcon={<GoogleIcon width="18" height="18" />}
          sx={buttonSx}
        >
          Google
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={notifyUnavailable}
          startIcon={<AppleIcon width="17" height="17" />}
          sx={buttonSx}
        >
          Apple
        </Button>
      </Stack>
    </>
  );
}
