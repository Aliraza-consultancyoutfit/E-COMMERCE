"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import NextLink from "next/link";
import toast from "react-hot-toast";
import { Box, Button, Link as MuiLink, Stack, Typography } from "@mui/material";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFTextField from "@/components/react-hook-form/rhf-text-field";
import RHFPasswordField from "@/components/react-hook-form/rhf-password-field";
import RHFCheckbox from "@/components/react-hook-form/rhf-checkbox";
import { PATHS } from "@/constants/routes";
import { useLoginMutation } from "@/store/auth/auth.api";
import { getApiErrorMessage } from "@/utils/api-error";
import { usePostAuth } from "@/ui/auth/use-post-auth";

const schema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  remember: yup.boolean().default(true),
});

type SignInValues = yup.InferType<typeof schema>;

export default function SignIn() {
  const [login, { isLoading }] = useLoginMutation();
  const postAuth = usePostAuth();

  const methods = useForm<SignInValues>({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const onSubmit = methods.handleSubmit(async (values) => {
    try {
      const response = await login({
        email: values.email,
        password: values.password,
      }).unwrap();
      postAuth(response, "Signed in successfully");
    } catch (error) {
      const message = getApiErrorMessage(error);
      methods.setError("password", { message });
      toast.error(message);
    }
  });

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: "-0.01em" }}>
        Sign in
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 3.5 }}>
        New here?{" "}
        <MuiLink component={NextLink} href={PATHS.auth.signUp} fontWeight={600}>
          Create an account
        </MuiLink>
      </Typography>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={2}>
          <RHFTextField
            name="email"
            label="Email"
            placeholder="you@company.com"
          />
          <RHFPasswordField
            name="password"
            label="Password"
            placeholder="Enter your password"
          />
          <RHFCheckbox name="remember" label="Remember me for 30 days" />
          <Button
            type="submit"
            size="large"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{ height: 48 }}
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </Button>
        </Stack>
      </FormProvider>
    </Box>
  );
}
