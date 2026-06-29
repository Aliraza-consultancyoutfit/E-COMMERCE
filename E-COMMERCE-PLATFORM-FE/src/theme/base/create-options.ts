import type { ThemeOptions } from "@mui/material/styles/createTheme";
import { createTypography } from "./create-typography";
import createComponents from "./create-components";

export const createOptions = (): ThemeOptions => {
  const typography = createTypography();
  const components = createComponents();

  return {
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
    direction: "ltr",
    typography,
    components,
  };
};
