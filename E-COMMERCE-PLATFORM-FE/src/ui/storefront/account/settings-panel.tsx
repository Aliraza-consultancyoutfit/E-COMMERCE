"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Skeleton,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import ApiErrorState from "@/components/api-error-state";
import { AlertCommonDialog } from "@/components/alert-common-dialog";
import ChangePasswordDialog from "@/ui/storefront/account/change-password-dialog";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/store/auth/auth.api";
import type { UpdateProfilePayload } from "@/store/auth/auth.types";
import { getApiErrorMessage } from "@/utils/api-error";

const SectionCard = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, p: 3, mb: 2.5 }}>
    <Typography variant="h6" fontWeight={700}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2.5 }}>
      {description}
    </Typography>
    {children}
  </Box>
);

const ToggleRow = ({
  label,
  description,
  checked,
  disabled,
  onToggle,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  onToggle: (value: boolean) => void;
}) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    spacing={2}
    sx={{ py: 1.25 }}
  >
    <Box sx={{ minWidth: 0 }}>
      <Typography fontWeight={600}>{label}</Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
    <Switch
      checked={checked}
      disabled={disabled}
      onChange={(event) => onToggle(event.target.checked)}
      inputProps={{ "aria-label": label }}
    />
  </Stack>
);

export default function SettingsPanel() {
  const { data: profile, isLoading, isError, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleToggle = async (patch: UpdateProfilePayload) => {
    try {
      await updateProfile(patch).unwrap();
      toast.success("Preferences updated");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  // NOTE: There is intentionally no delete-account endpoint in this demo, so the
  // confirm action is inert — it only informs the user and closes the dialog.
  const handleConfirmDelete = () => {
    toast("Account deletion is not available in this demo", { icon: "ℹ️" });
    setDeleteOpen(false);
  };

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          Settings
        </Typography>
        <Stack spacing={2.5}>
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} variant="rounded" height={160} />
          ))}
        </Stack>
      </Box>
    );
  }

  if (isError || !profile) {
    return (
      <Box>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          Settings
        </Typography>
        <ApiErrorState
          height="40vh"
          buttonText="Try again"
          buttonClick={() => refetch()}
        />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        Settings
      </Typography>

      <SectionCard
        title="Security"
        description="Keep your account protected."
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{ py: 1.25 }}
        >
          <Box>
            <Typography fontWeight={600}>Password</Typography>
            <Typography variant="body2" color="text.secondary">
              Change the password used to sign in.
            </Typography>
          </Box>
          <Button variant="outlined" onClick={() => setPasswordOpen(true)}>
            Change password
          </Button>
        </Stack>
        <ToggleRow
          label="Two-factor authentication"
          description="Stored preference for an extra sign-in step."
          checked={Boolean(profile.twoFactorEnabled)}
          disabled={saving}
          onToggle={(value) => handleToggle({ twoFactorEnabled: value })}
        />
      </SectionCard>

      <SectionCard
        title="Email preferences"
        description="Choose which emails you'd like to receive."
      >
        <ToggleRow
          label="Order updates"
          description="Shipping, delivery, and order status emails."
          checked={Boolean(profile.notifyOrders)}
          disabled={saving}
          onToggle={(value) => handleToggle({ notifyOrders: value })}
        />
        <ToggleRow
          label="Promotions"
          description="Deals, discounts, and seasonal offers."
          checked={Boolean(profile.notifyPromotions)}
          disabled={saving}
          onToggle={(value) => handleToggle({ notifyPromotions: value })}
        />
        <ToggleRow
          label="Recommendations"
          description="Picks based on what you've browsed and bought."
          checked={Boolean(profile.notifyRecommendations)}
          disabled={saving}
          onToggle={(value) => handleToggle({ notifyRecommendations: value })}
        />
      </SectionCard>

      <Box
        sx={{
          border: 1,
          borderColor: "error.main",
          borderRadius: 4,
          p: 3,
        }}
      >
        <Typography variant="h6" fontWeight={700} color="error.main">
          Danger zone
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          spacing={2}
          sx={{ mt: 1.5 }}
        >
          <Typography variant="body2" color="text.secondary">
            Permanently delete your account and all associated data.
          </Typography>
          <Button color="error" variant="outlined" onClick={() => setDeleteOpen(true)}>
            Delete account
          </Button>
        </Stack>
      </Box>

      <ChangePasswordDialog open={passwordOpen} onClose={() => setPasswordOpen(false)} />

      <AlertCommonDialog
        open={deleteOpen}
        type="Delete account"
        message="This will permanently remove your account. Are you sure you want to continue?"
        handleClose={() => setDeleteOpen(false)}
        handleSubmitBtn={handleConfirmDelete}
        submitBtnText="Delete account"
        cancelBtnText="Cancel"
      />
    </Box>
  );
}
