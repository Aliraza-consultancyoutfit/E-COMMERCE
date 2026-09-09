"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Box, CircularProgress, Typography } from "@mui/material";
import { REDIRECTS } from "@/constants/routes";
import { baseApi } from "@/store/base-api";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/auth/auth.slice";
import { UserRole } from "@/store/auth/auth.types";
import { setToken } from "@/utils/auth-token";

export default function SocialAuthCallback() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get("status");
    if (status !== "success") {
      toast.error(searchParams.get("message") ?? "Social sign-in failed");
      router.replace(REDIRECTS.signIn);
      return;
    }

    const accessToken = searchParams.get("accessToken");
    const id = searchParams.get("id");
    const email = searchParams.get("email");
    const role = searchParams.get("role") as UserRole | null;

    if (!accessToken || !id || !email || !role) {
      toast.error("Social sign-in response was incomplete");
      router.replace(REDIRECTS.signIn);
      return;
    }

    setToken(accessToken);
    dispatch(baseApi.util.resetApiState());
    dispatch(setCredentials({ user: { id, email, role }, token: accessToken }));
    toast.success("Welcome back");
    router.replace(REDIRECTS.afterLogin[role]);
  }, [dispatch, router, searchParams]);

  return (
    <Box
      sx={{
        minHeight: 280,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <CircularProgress size={28} />
      <Typography color="text.secondary">Completing sign-in...</Typography>
    </Box>
  );
}
