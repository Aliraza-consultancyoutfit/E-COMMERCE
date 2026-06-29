import { PaletteOptions } from "@mui/material";
import {
  primary,
  secondary,
  tertiary,
  darkShades,
  warning,
  success,
  extraColorsA,
  extraColorsB,
  extraColorsC,
  nonPaletteColors,
  gradients,
} from "..";

export const createPalette = (): PaletteOptions => {
  return {
    common: {
      white: "#ffffff",
      black: "#000000",
      stroke: "#EAECF0",
    },
    background: {
      default: "#F8FCFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1F1D2B",
      secondary: "#6B7280",
      disabled: "#9CA3AF",
    },
    primary,
    secondary,
    tertiary,
    darkShades,
    warning,
    success,
    extraColorsA,
    extraColorsB,
    extraColorsC,
    nonPaletteColors,
    gradients,
    grey: {
      50: "#F9FAFB",
      900: "#F3F4F6",
      800: "#E5E7EB",
      700: "#D1D5DB",
      600: "#9CA3AF",
      500: "#6B7280",
      400: "#4B5563",
      300: "#374151",
      200: "#1F2937",
      100: "#111827",
    },
    divider: "#EAECF0",
    mode: "light",
  };
};
