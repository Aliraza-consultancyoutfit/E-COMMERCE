import { SxProps } from "@mui/material";
import { ReactNode } from "react";

export interface IChipStatus {
  label: string | ReactNode;
  variant?: "filled" | "outlined";
  type?: "success" | "error" | "grey" | "warning" | "info";
  size?: "small" | "medium";
  disabled?: boolean;
  sx?: SxProps;
}
