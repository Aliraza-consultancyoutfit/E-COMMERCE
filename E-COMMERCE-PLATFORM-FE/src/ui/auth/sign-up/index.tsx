"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import NextLink from "next/link";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  FormHelperText,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFTextField from "@/components/react-hook-form/rhf-text-field";
import RHFPasswordField from "@/components/react-hook-form/rhf-password-field";
import RHFCheckbox from "@/components/react-hook-form/rhf-checkbox";
import { PATHS } from "@/constants/routes";
import { useRegisterMutation } from "@/store/auth/auth.api";
import { getApiErrorMessage } from "@/utils/api-error";
import { usePostAuth } from "@/ui/auth/use-post-auth";

const schema = yup.object({
  name: yup.string().trim().required("Full name is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirm: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
  terms: yup
    .boolean()
    .oneOf([true], "You must accept the terms to continue")
    .required(),
});

type SignUpValues = yup.InferType<typeof schema>;

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One number", test: (v: string) => /\d/.test(v) },
  { label: "One symbol", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

export default function SignUp() {
  const [register, { isLoading }] = useRegisterMutation();
  const postAuth = usePostAuth();

  const methods = useForm<SignUpValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
      terms: false,
    },
  });

  const password = methods.watch("password") ?? "";
  const termsError = methods.formState.errors.terms?.message;

  const onSubmit = methods.handleSubmit(async (values) => {
    try {
      const response = await register({
        name: values.name,
        email: values.email,
        password: values.password,
      }).unwrap();
      postAuth(response, "Account created — welcome to EliteCart");
    } catch (error) {
      const message = getApiErrorMessage(error);
      methods.setError("email", { message });
      toast.error(message);
    }
  });

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: "-0.01em" }}>
        Create account
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 3.5 }}>
        Already have one?{" "}
        <MuiLink component={NextLink} href={PATHS.auth.signIn} fontWeight={600}>
          Sign in
        </MuiLink>
      </Typography>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={2}>
          <RHFTextField name="name" label="Full name" placeholder="Jane Cooper" />
          <RHFTextField
            name="email"
            label="Email"
            placeholder="you@company.com"
          />
          <RHFPasswordField
            name="password"
            label="Password"
            placeholder="Create a password"
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 0.5,
            }}
          >
            {PASSWORD_RULES.map((rule) => {
              const met = rule.test(password);
              return (
                <Typography
                  key={rule.label}
                  variant="caption"
                  color={met ? "success.main" : "text.secondary"}
                >
                  {met ? "✓" : "•"} {rule.label}
                </Typography>
              );
            })}
          </Box>

          <RHFPasswordField
            name="confirm"
            label="Confirm password"
            placeholder="Re-enter your password"
          />

          <Box>
            <RHFCheckbox
              name="terms"
              label="I agree to the Terms of Service and Privacy Policy"
            />
            {termsError && (
              <FormHelperText error sx={{ mx: 0 }}>
                {termsError}
              </FormHelperText>
            )}
          </Box>

          <Button
            type="submit"
            size="large"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{ height: 48 }}
          >
            {isLoading ? "Creating account…" : "Create account"}
          </Button>
        </Stack>
      </FormProvider>
    </Box>
  );
}
