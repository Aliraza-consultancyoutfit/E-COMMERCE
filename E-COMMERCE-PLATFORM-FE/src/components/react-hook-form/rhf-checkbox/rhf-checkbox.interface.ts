import { CheckboxProps } from "@mui/material";

export interface RHFCheckboxProps extends Omit<CheckboxProps, "name"> {
  name: string;
  required?: boolean;
  label?: string;
}
