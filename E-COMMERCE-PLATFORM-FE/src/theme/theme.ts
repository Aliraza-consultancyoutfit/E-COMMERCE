import "@mui/material/styles";
import type { Theme } from "@mui/material/styles/createTheme";
import { createTheme as createMuiTheme } from "@mui/material/styles";
import { createOptions as createBaseOptions } from "./base/create-options";
import { createOptions as createDarkOptions } from "./dark/create-options";
import { createOptions as createLightOptions } from "./light/create-options";
import { ThemeConfig } from "@/interface";
import { PALETTE_MODE } from "@/constants/strings";

declare module "@mui/material/styles" {
  interface Gradients {
    a: string;
    b: string;
    c: string;
    d: string;
    e: string;
    f: string;
    g: string;
    h: string;
    i: string;
    j: string;
    k: string;
    l: string;
    m: string;
    n: string;
    o: string;
    p: string;
    q: string;
  }
  interface PaletteOptions {
    tertiary: {
      [key: string]: string;
    };
    darkShades: {
      [key: string]: string;
    };
    extraColorsA: {
      [key: string]: string;
    };
    extraColorsB: {
      [key: string]: string;
    };
    extraColorsC: {
      [key: string]: string;
    };
    nonPaletteColors: {
      [key: string]: string;
    };
    gradients: Gradients;
  }

  interface CommonColors {
    stroke: string;
  }

  interface Palette {
    common: CommonColors;
    tertiary: {
      [key: string]: string;
    };
    darkShades: {
      [key: string]: string;
    };
    extraColorsA: {
      [key: string]: string;
    };
    extraColorsB: {
      [key: string]: string;
    };
    extraColorsC: {
      [key: string]: string;
    };
    nonPaletteColors: {
      [key: string]: string;
    };
    gradients: Gradients;
  }

  interface PaletteColor {
    900: string;
    800: string;
    700: string;
    600: string;
    500: string;
    400: string;
    300: string;
    200: string;
    100: string;
    50: string;
  }
}

export const createTheme = (config: ThemeConfig): Theme => {
  const theme = createMuiTheme(
    createBaseOptions(),
    config.paletteMode === PALETTE_MODE.LIGHT
      ? createLightOptions()
      : createDarkOptions()
  );

  return theme;
};
