"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Box, Button, Skeleton, Stack, Typography } from "@mui/material";
import ApiErrorState from "@/components/api-error-state";
import ChipStatus from "@/components/chip-status";
import NoData from "@/components/no-data";
import { AlertCommonDialog } from "@/components/alert-common-dialog";
import { PlusIcon } from "@/assets/icons/common";
import AddressFormDialog from "@/ui/storefront/account/address-form-dialog";
import {
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useSetDefaultAddressMutation,
} from "@/store/addresses/addresses.api";
import type { Address } from "@/store/addresses/addresses.types";
import { getApiErrorMessage } from "@/utils/api-error";

export default function AddressesPanel() {
  const { data: addresses, isLoading, isError, refetch } =
    useGetAddressesQuery();
  const [setDefault, { isLoading: settingDefault }] =
    useSetDefaultAddressMutation();
  const [deleteAddress, { isLoading: deleting }] = useDeleteAddressMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [toDelete, setToDelete] = useState<Address | null>(null);

  const handleAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (address: Address) => {
    setEditing(address);
    setFormOpen(true);
  };

  const handleSetDefault = async (address: Address) => {
    try {
      await setDefault(address._id).unwrap();
      toast.success("Default address updated");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) {
      return;
    }
    try {
      await deleteAddress(toDelete._id).unwrap();
      toast.success("Address deleted");
      setToDelete(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const Header = (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      spacing={1.5}
      sx={{ mb: 3 }}
    >
      <Box>
        <Typography variant="h5" fontWeight={700}>
          Addresses
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Manage where your orders are delivered.
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<PlusIcon width="18" height="18" />}
        onClick={handleAdd}
      >
        Add address
      </Button>
    </Stack>
  );

  if (isLoading) {
    return (
      <Box>
        {Header}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          {[0, 1].map((index) => (
            <Skeleton key={index} variant="rounded" height={180} />
          ))}
        </Box>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box>
        {Header}
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
      {Header}

      {!addresses || addresses.length === 0 ? (
        <NoData
          height="40vh"
          message="No addresses yet"
          description="Add a delivery address to speed up checkout."
          buttonText="Add address"
          buttonClick={handleAdd}
        />
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          {addresses.map((address) => (
            <Box
              key={address._id}
              sx={{
                border: 1,
                borderColor: address.isDefault ? "primary.main" : "divider",
                borderRadius: 4,
                p: 2.5,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 1 }}
              >
                <Typography fontWeight={700}>{address.label}</Typography>
                {address.isDefault && (
                  <ChipStatus label="Default" type="info" size="small" />
                )}
              </Stack>
              <Typography variant="body2" sx={{ lineHeight: 1.7, flex: 1 }}>
                {address.firstName} {address.lastName}
                <br />
                {address.street}
                <br />
                {address.city} {address.zip}
                {address.phone && (
                  <>
                    <br />
                    {address.phone}
                  </>
                )}
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}
              >
                <Button size="small" onClick={() => handleEdit(address)}>
                  Edit
                </Button>
                {!address.isDefault && (
                  <Button
                    size="small"
                    disabled={settingDefault}
                    onClick={() => handleSetDefault(address)}
                  >
                    Set as default
                  </Button>
                )}
                <Button
                  size="small"
                  color="error"
                  onClick={() => setToDelete(address)}
                >
                  Delete
                </Button>
              </Stack>
            </Box>
          ))}
        </Box>
      )}

      <AddressFormDialog
        open={formOpen}
        address={editing}
        onClose={() => setFormOpen(false)}
      />

      <AlertCommonDialog
        open={Boolean(toDelete)}
        type="Delete address"
        message={`Remove "${toDelete?.label ?? ""}" from your saved addresses? This can't be undone.`}
        handleClose={() => setToDelete(null)}
        handleSubmitBtn={handleConfirmDelete}
        submitBtnText="Delete"
        cancelBtnText="Cancel"
        loading={deleting}
      />
    </Box>
  );
}
