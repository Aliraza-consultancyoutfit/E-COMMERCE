import { pxToRem, responsiveFontSizes } from "@/utils";
import type { TypographyOptions } from "@mui/material/styles/createTypography";

const FONT_FAMILY = "inherit";

export const createTypography = (): TypographyOptions => {
  return {
    fontFamily: FONT_FAMILY,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    h1: {
      fontWeight: 700,
      lineHeight: 1.25,
      ...responsiveFontSizes({ xs: 40, md: 48, lg: 48 }),
    },
    h2: {
      fontWeight: 700,
      lineHeight: 1.5,
      ...responsiveFontSizes({ xs: 36, md: 36, lg: 36 }),
    },
    h3: {
      fontWeight: 700,
      lineHeight: 1.5,
      ...responsiveFontSizes({ xs: 32, md: 32, lg: 32 }),
    },
    h4: {
      fontWeight: 600,
      lineHeight: 1.25,
      ...responsiveFontSizes({ xs: 24, md: 24, lg: 24 }),
    },
    h5: {
      fontWeight: 600,
      lineHeight: 1.5,
      ...responsiveFontSizes({ xs: 20, md: 20, lg: 20 }),
    },
    h6: {
      fontWeight: 600,
      lineHeight: 1.5,
      ...responsiveFontSizes({ xs: 18, md: 18, lg: 18 }),
    },
    body1: {
      fontWeight: 400,
      lineHeight: 1.5,
      fontSize: pxToRem(16),
    },
    body2: {
      fontWeight: 400,
      lineHeight: 1.42,
      fontSize: pxToRem(14),
    },
    subtitle1: {
      fontWeight: 400,
      lineHeight: 1.5,
      fontSize: pxToRem(12),
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: pxToRem(10),
    },
    caption: {
      fontSize: pxToRem(8),
    },
  };
};
