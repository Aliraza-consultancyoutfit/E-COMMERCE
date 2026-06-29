import { SxProps } from "@mui/material";
import { DatePickerProps } from "@mui/x-date-pickers";

export interface IRHFDatePickerProps
  extends Omit<DatePickerProps<any>, "value" | "onChange" | "renderInput"> {
  name: string;
  label?: string;
  format?: string;
  sx?: SxProps;
  textFieldProps?: any;
  [key: string]: any;
}
