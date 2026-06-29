import React from "react";
import { alpha, Chip, Theme, useTheme } from "@mui/material";
import { IChipStatus } from "./chip-status.interface";
import { PALETTE_MODE } from "@/constants/strings";

const colorMap = (theme: Theme) => ({
  success: {
    background:
      theme.palette.mode === PALETTE_MODE.LIGHT
        ? "success.300"
        : alpha(theme.palette.success.main, 0.15),
    text: "success.main",
  },
  error: {
    background:
      theme.palette.mode === PALETTE_MODE.LIGHT
        ? "tertiary.100"
        : alpha(theme.palette.tertiary.main, 0.15),
    text: "tertiary.main",
  },
  grey: {
    background:
      theme.palette.mode === PALETTE_MODE.LIGHT
        ? "grey.900"
        : alpha(theme.palette.darkShades[900], 0.15),
    text: "grey.100",
  },
  info: {
    background:
      theme.palette.mode === PALETTE_MODE.LIGHT
        ? "primary.200"
        : alpha(theme.palette.primary.main, 0.15),
    text: "primary.main",
  },
  warning: {
    background:
      theme.palette.mode === PALETTE_MODE.LIGHT
        ? "warning.200"
        : alpha(theme.palette.warning.main, 0.15),
    text: "warning.main",
  },
});

const ChipStatus: React.FC<IChipStatus> = (Props) => {
  const {
    label,
    variant = "filled",
    type = "success",
    size = "medium",
    disabled = false,
    sx,
  } = Props;
  const theme = useTheme();

  const resolvedColors = colorMap(theme)[type];

  return (
    <Chip
      label={label}
      variant={variant}
      size={size}
      disabled={disabled}
      sx={{
        backgroundColor: resolvedColors.background,
        color: resolvedColors.text,
        ...sx,
      }}
    />
  );
};
export default ChipStatus;
