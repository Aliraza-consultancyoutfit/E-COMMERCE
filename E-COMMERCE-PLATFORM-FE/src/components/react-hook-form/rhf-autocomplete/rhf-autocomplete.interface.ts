import { SxProps, Theme } from "@mui/material";
import { AutocompleteProps } from "@mui/material/Autocomplete";
import { CSSProperties } from "react";

export interface RHFAutocompleteProps<T = any> {
  name: string;
  options: T[];
  required?: boolean;
  noOptionsText?: string;
  placeholder?: string;
  getOptionLabel?: (option: T) => string;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  sxProps?: SxProps<Theme>;
  style?: CSSProperties;
  label?: string;
  disabled?: boolean;
  [key: string]: any;
}

type OmittedAutocompleteProps = Omit<
  AutocompleteProps<any, false, false, false>,
  keyof RHFAutocompleteProps
>;

export type RHFAutocompleteFullProps = RHFAutocompleteProps &
  OmittedAutocompleteProps;
