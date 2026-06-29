"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Avatar, Box, Button, Skeleton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFTextField from "@/components/react-hook-form/rhf-text-field";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/store/auth/auth.api";
import { getApiErrorMessage } from "@/utils/api-error";
import { fileToAvatarDataUrl } from "@/utils/image";

export default function ProfilePanel() {
  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const methods = useForm<{ name: string; email: string }>({
    values: { name: profile?.name ?? "", email: profile?.email ?? "" },
  });

  const initials = (profile?.name || profile?.email || "?").slice(0, 2).toUpperCase();

  const onSubmit = methods.handleSubmit(async (values) => {
    try {
      await updateProfile({ name: values.name }).unwrap();
      toast.success("Profile updated");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  });

  const handlePhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    setPhotoBusy(true);
    try {
      const avatar = await fileToAvatarDataUrl(file);
      await updateProfile({ avatar }).unwrap();
      toast.success("Photo updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : getApiErrorMessage(error),
      );
    } finally {
      setPhotoBusy(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      await updateProfile({ avatar: "" }).unwrap();
      toast.success("Photo removed");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (isLoading) {
    return <Skeleton variant="rounded" height={280} />;
  }

  return (
    <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, p: 3.5 }}>
      <Typography variant="h5" fontWeight={700}>
        Profile
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
        Update your personal details and how we reach you.
      </Typography>

      <Stack direction="row" spacing={2.25} alignItems="center" sx={{ mb: 3 }}>
        <Avatar
          src={profile?.avatar || undefined}
          sx={{
            width: 72,
            height: 72,
            fontSize: 24,
            fontWeight: 600,
            color: "primary.main",
            bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
          }}
        >
          {initials}
        </Avatar>
        <Box>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
          <Button
            variant="outlined"
            disabled={photoBusy}
            onClick={() => fileRef.current?.click()}
            sx={{ mr: 1 }}
          >
            {photoBusy ? "Uploading…" : "Change photo"}
          </Button>
          {profile?.avatar && (
            <Button color="error" disabled={photoBusy} onClick={handleRemovePhoto}>
              Remove
            </Button>
          )}
        </Box>
      </Stack>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
            mb: 3,
          }}
        >
          <RHFTextField name="name" label="Full name" placeholder="Jane Cooper" />
          <RHFTextField name="email" label="Email" disabled />
        </Box>
        <Button type="submit" variant="contained" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </FormProvider>
    </Box>
  );
}
