"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFTextField from "@/components/react-hook-form/rhf-text-field";
import { EmailIcon, PhoneIcon, ClockIcon } from "@/assets/icons/common";

interface IContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const DEFAULT_VALUES: IContactForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const schema = yup.object({
  name: yup.string().trim().required("Name is required"),
  email: yup
    .string()
    .trim()
    .email("Enter a valid email")
    .required("Email is required"),
  subject: yup.string().trim().required("Subject is required"),
  message: yup
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .required("Message is required"),
});

const INFO_CARDS = [
  { Icon: EmailIcon, label: "Email", value: "support@elitecart.com", iconFill: undefined },
  { Icon: PhoneIcon, label: "Call", value: "+1 (315) 555-0100", iconFill: undefined },
  {
    Icon: ClockIcon,
    label: "Hours",
    value: "Mon–Sun 8am–8pm ET",
    iconFill: "transparent",
  },
];

export default function ContactTemplate() {
  const methods = useForm<IContactForm>({
    resolver: yupResolver(schema),
    defaultValues: DEFAULT_VALUES,
  });

  // NOTE: Front-end only — there is no backend contact endpoint. We simulate a
  // successful submission with a toast and reset the form.
  const onSubmit = methods.handleSubmit(() => {
    toast.success("Thanks for reaching out — we'll reply within one business day.");
    methods.reset(DEFAULT_VALUES);
  });

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ textAlign: "center", maxWidth: 560, mx: "auto" }}>
        <Typography
          component="h1"
          variant="h2"
          fontWeight={700}
          sx={{ letterSpacing: "-0.02em", lineHeight: 1.15 }}
        >
          Get in touch
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 2, fontSize: 17, lineHeight: 1.6 }}>
          Questions about an order, a product, or returns? Send us a note and
          our team will get back to you.
        </Typography>
      </Box>

      <Box
        sx={{
          mt: 5,
          p: { xs: 3, md: 4 },
          border: 1,
          borderColor: "divider",
          borderRadius: 4.5,
          bgcolor: "background.paper",
        }}
      >
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack spacing={2.5}>
            <Box
              sx={{
                display: "grid",
                gap: 2.5,
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              }}
            >
              <RHFTextField name="name" label="Name" required placeholder="Your name" />
              <RHFTextField
                name="email"
                label="Email"
                required
                placeholder="you@company.com"
              />
            </Box>
            <RHFTextField
              name="subject"
              label="Subject"
              required
              placeholder="How can we help?"
            />
            <RHFTextField
              name="message"
              label="Message"
              required
              placeholder="Tell us a bit more…"
              multiline
              minRows={5}
            />
            <Box>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={methods.formState.isSubmitting}
                sx={{ height: 48, px: 4 }}
              >
                Send message
              </Button>
            </Box>
          </Stack>
        </FormProvider>
      </Box>

      <Box
        sx={{
          mt: 3,
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
        }}
      >
        {INFO_CARDS.map(({ Icon, label, value, iconFill }) => (
          <Stack
            key={label}
            spacing={1.25}
            sx={{ p: 2.5, border: 1, borderColor: "divider", borderRadius: 3.5 }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "primary.main",
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <Icon width="20" height="20" stroke="currentColor" fill={iconFill} />
            </Box>
            <Typography variant="body2" fontWeight={600}>
              {label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {value}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Container>
  );
}
