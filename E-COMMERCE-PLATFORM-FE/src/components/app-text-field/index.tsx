import { TextField, TextFieldProps } from "@mui/material";

export type AppTextFieldProps = TextFieldProps;

export default function AppTextField(props: AppTextFieldProps) {
  return <TextField fullWidth size="medium" {...props} />;
}
