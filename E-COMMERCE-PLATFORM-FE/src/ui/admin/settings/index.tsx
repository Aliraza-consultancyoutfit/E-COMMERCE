"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { Box, Button, MenuItem, Skeleton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ApiErrorState from "@/components/api-error-state";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFSwitch from "@/components/react-hook-form/rhf-switch";
import RHFTextField from "@/components/react-hook-form/rhf-text-field";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "@/store/settings/settings.api";
import { getApiErrorMessage } from "@/utils/api-error";

const TABS = ["General", "Payments", "Shipping", "Notifications"] as const;
type Tab = (typeof TABS)[number];

const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
];
const TIMEZONES = ["America/New_York", "America/Los_Angeles", "Europe/London"];

const schema = yup.object({
  storeName: yup.string().trim().required("Store name is required"),
  supportEmail: yup.string().trim().email("Enter a valid email").required("Support email is required"),
  currency: yup.string().required(),
  timezone: yup.string().required(),
  showOutOfStock: yup.boolean().required(),
  enableReviews: yup.boolean().required(),
  requireAccountToCheckout: yup.boolean().required(),
});

type SettingsValues = yup.InferType<typeof schema>;

function Card({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, p: 3 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: description ? 0.5 : 2.25 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      )}
      {children}
    </Box>
  );
}

function ToggleRow({ name, label, divider }: { name: string; label: string; divider?: boolean }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 1.25, borderTop: divider ? 1 : 0, borderColor: "divider" }}
    >
      <Typography variant="body2">{label}</Typography>
      <RHFSwitch name={name} />
    </Stack>
  );
}

function GeneralTab() {
  const { data, isLoading, isError, refetch } = useGetSettingsQuery();
  const [updateSettings, { isLoading: saving }] = useUpdateSettingsMutation();

  const methods = useForm<SettingsValues>({
    resolver: yupResolver(schema),
    values: data,
    defaultValues: {
      storeName: "",
      supportEmail: "",
      currency: "USD",
      timezone: "America/New_York",
      showOutOfStock: true,
      enableReviews: true,
      requireAccountToCheckout: false,
    },
  });

  const onSubmit = methods.handleSubmit(async (values) => {
    try {
      await updateSettings(values).unwrap();
      toast.success("Settings saved");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  });

  if (isLoading) {
    return <Skeleton variant="rounded" height={420} />;
  }
  if (isError) {
    return <ApiErrorState height="40vh" buttonText="Try again" buttonClick={() => refetch()} />;
  }

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2.5}>
        <Card title="Store details">
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <RHFTextField name="storeName" label="Store name" />
            <RHFTextField name="supportEmail" label="Support email" />
            <RHFTextField name="currency" label="Currency" select>
              {CURRENCIES.map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </RHFTextField>
            <RHFTextField name="timezone" label="Timezone" select>
              {TIMEZONES.map((tz) => (
                <MenuItem key={tz} value={tz}>
                  {tz}
                </MenuItem>
              ))}
            </RHFTextField>
          </Box>
        </Card>

        <Card title="Storefront" description="Control what shoppers see.">
          <ToggleRow name="showOutOfStock" label="Show out-of-stock products" />
          <ToggleRow name="enableReviews" label="Enable customer reviews" divider />
          <ToggleRow name="requireAccountToCheckout" label="Require account to checkout" divider />
        </Card>

        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
          <Button variant="outlined" color="inherit" sx={{ borderColor: "divider" }} onClick={() => methods.reset(data)} disabled={saving}>
            Discard
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
}

export default function AdminSettings() {
  const [tab, setTab] = useState<Tab>("General");

  return (
    <Box sx={{ maxWidth: 820 }}>
      <Stack
        direction="row"
        spacing={0.5}
        sx={{ p: 0.5, mb: 2.5, borderRadius: 2.5, border: 1, borderColor: "divider", bgcolor: "background.default", width: "fit-content", overflowX: "auto" }}
      >
        {TABS.map((t) => {
          const active = tab === t;
          return (
            <Box
              key={t}
              component="button"
              onClick={() => setTab(t)}
              sx={{
                px: 2,
                py: 1,
                border: "none",
                borderRadius: 1.75,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                color: active ? "primary.main" : "text.secondary",
                bgcolor: active ? "background.paper" : "transparent",
                boxShadow: active ? 1 : "none",
              }}
            >
              {t}
            </Box>
          );
        })}
      </Stack>

      {tab === "General" ? (
        <GeneralTab />
      ) : (
        <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, p: 6, textAlign: "center", bgcolor: (t) => alpha(t.palette.text.primary, 0.015) }}>
          <Typography variant="body2" color="text.secondary">
            {tab} configuration isn&apos;t available yet.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
