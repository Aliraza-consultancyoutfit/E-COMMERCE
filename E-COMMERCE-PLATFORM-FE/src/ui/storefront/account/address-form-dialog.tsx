"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { Box, Button } from "@mui/material";
import { CustomCommonDialog } from "@/components/custom-common-dialog";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFTextField from "@/components/react-hook-form/rhf-text-field";
import RHFCheckbox from "@/components/react-hook-form/rhf-checkbox";
import {
  useCreateAddressMutation,
  useUpdateAddressMutation,
} from "@/store/addresses/addresses.api";
import type {
  Address,
  CreateAddressArgs,
} from "@/store/addresses/addresses.types";
import { getApiErrorMessage } from "@/utils/api-error";

interface AddressFormValues extends CreateAddressArgs {
  isDefault: boolean;
}

const schema = yup.object({
  label: yup.string().trim().required("Label is required"),
  firstName: yup.string().trim().required("First name is required"),
  lastName: yup.string().trim().required("Last name is required"),
  street: yup.string().trim().required("Street is required"),
  city: yup.string().trim().required("City is required"),
  zip: yup.string().trim().required("ZIP is required"),
  phone: yup.string().trim().optional(),
  isDefault: yup.boolean().required(),
});

const EMPTY_VALUES: AddressFormValues = {
  label: "",
  firstName: "",
  lastName: "",
  street: "",
  city: "",
  zip: "",
  phone: "",
  isDefault: false,
};

interface AddressFormDialogProps {
  open: boolean;
  onClose: () => void;
  /** When provided the dialog edits this address; otherwise it creates one. */
  address?: Address | null;
}

export default function AddressFormDialog({
  open,
  onClose,
  address,
}: AddressFormDialogProps) {
  const [createAddress, { isLoading: creating }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: updating }] = useUpdateAddressMutation();
  const isEditing = Boolean(address);

  const methods = useForm<AddressFormValues>({
    resolver: yupResolver(schema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    methods.reset(
      address
        ? {
            label: address.label,
            firstName: address.firstName,
            lastName: address.lastName,
            street: address.street,
            city: address.city,
            zip: address.zip,
            phone: address.phone ?? "",
            isDefault: address.isDefault,
          }
        : EMPTY_VALUES,
    );
  }, [open, address, methods]);

  const onSubmit = methods.handleSubmit(async (values) => {
    const body: AddressFormValues = {
      ...values,
      phone: values.phone?.trim() || undefined,
    };
    try {
      if (address) {
        await updateAddress({ id: address._id, body }).unwrap();
        toast.success("Address updated");
      } else {
        await createAddress(body).unwrap();
        toast.success("Address added");
      }
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  });

  return (
    <CustomCommonDialog
      isPortalOpen={open}
      closePortal={onClose}
      dialogTitle={isEditing ? "Edit address" : "Add address"}
      dialogDescription="Where should we deliver your orders?"
      showActionButtons={false}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
            mb: 2,
          }}
        >
          <Box sx={{ gridColumn: { sm: "1 / -1" } }}>
            <RHFTextField
              name="label"
              label="Label"
              placeholder="Home, Office…"
              required
            />
          </Box>
          <RHFTextField name="firstName" label="First name" required />
          <RHFTextField name="lastName" label="Last name" required />
          <Box sx={{ gridColumn: { sm: "1 / -1" } }}>
            <RHFTextField name="street" label="Street" required />
          </Box>
          <RHFTextField name="city" label="City" required />
          <RHFTextField name="zip" label="ZIP / Postal code" required />
          <Box sx={{ gridColumn: { sm: "1 / -1" } }}>
            <RHFTextField name="phone" label="Phone (optional)" />
          </Box>
        </Box>
        <RHFCheckbox name="isDefault" label="Set as default address" />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 2 }}>
          <Button type="button" variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={creating || updating}>
            {isEditing ? "Save changes" : "Add address"}
          </Button>
        </Box>
      </FormProvider>
    </CustomCommonDialog>
  );
}
