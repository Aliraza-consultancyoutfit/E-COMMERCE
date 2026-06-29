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
      default: "#1F1D2B",
      paper: "#1F2937",
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
      50: "#111827",
      900: "#1F2937",
      800: "#374151",
      700: "#4B5563",
      600: "#6B7280",
      500: "#9CA3AF",
      400: "#D1D5DB",
      300: "#E5E7EB",
      200: "#F3F4F6",
      100: "#F9FAFB",
    },
    divider: "#5F606F",
    mode: "dark",
  };
};
