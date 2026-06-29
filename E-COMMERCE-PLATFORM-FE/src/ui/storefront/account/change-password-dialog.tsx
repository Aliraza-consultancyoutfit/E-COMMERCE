"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { Box, Button, Stack } from "@mui/material";
import { CustomCommonDialog } from "@/components/custom-common-dialog";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFTextField from "@/components/react-hook-form/rhf-text-field";
import { useChangePasswordMutation } from "@/store/auth/auth.api";
import { getApiErrorMessage } from "@/utils/api-error";

const MIN_PASSWORD = 8;

interface ChangePasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const schema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(MIN_PASSWORD, `Must be at least ${MIN_PASSWORD} characters`)
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords do not match")
    .required("Please confirm your new password"),
});

const EMPTY_VALUES: ChangePasswordValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ChangePasswordDialog({
  open,
  onClose,
}: ChangePasswordDialogProps) {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const methods = useForm<ChangePasswordValues>({
    resolver: yupResolver(schema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (open) {
      methods.reset(EMPTY_VALUES);
    }
  }, [open, methods]);

  const onSubmit = methods.handleSubmit(async (values) => {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();
      toast.success("Password changed");
      onClose();
    } catch (error) {
      const message = getApiErrorMessage(error);
      // The backend returns "Current password is incorrect" — surface it on the field.
      if (/current password/i.test(message)) {
        methods.setError("currentPassword", { type: "server", message });
      } else {
        toast.error(message);
      }
    }
  });

  return (
    <CustomCommonDialog
      isPortalOpen={open}
      closePortal={onClose}
      dialogTitle="Change password"
      dialogDescription="Use at least 8 characters."
      showActionButtons={false}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={2} sx={{ mb: 2 }}>
          <RHFTextField
            name="currentPassword"
            type="password"
            label="Current password"
            required
          />
          <RHFTextField
            name="newPassword"
            type="password"
            label="New password"
            required
          />
          <RHFTextField
            name="confirmPassword"
            type="password"
            label="Confirm new password"
            required
          />
        </Stack>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
          <Button type="button" variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            Update password
          </Button>
        </Box>
      </FormProvider>
    </CustomCommonDialog>
  );
}
