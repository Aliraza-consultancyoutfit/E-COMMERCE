import { SxProps, TextFieldProps, Theme } from "@mui/material";

export interface RHFTextFieldProps extends Omit<TextFieldProps, "name"> {
  name: string;
  label?: string;
  required?: boolean;
  sxProps?: SxProps<Theme>;
  [key: string]: any;
}
