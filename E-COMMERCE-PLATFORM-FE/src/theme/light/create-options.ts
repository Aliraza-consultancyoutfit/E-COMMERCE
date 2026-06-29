import type { ThemeOptions } from "@mui/material/styles/createTheme";
import { createPalette } from "./create-palette";
import { createShadows } from "./create-shadows";
import createComponents from "./create-components";

export const createOptions = (): ThemeOptions => {
  const palette = createPalette();
  const shadows = createShadows();
  const components = createComponents({ palette });

  return {
    palette,
    shadows,
    components,
  };
};
