import { PaletteColor, PaletteOptions } from "@mui/material";
import type { Components } from "@mui/material/styles/components";

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    dashed: true;
  }
}

interface Config {
  palette: PaletteOptions;
}

const createComponents = ({ palette }: Config): Components => {
  return {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: (palette.primary as PaletteColor).main,
          color: (palette.grey as PaletteColor)[50],
          border: "1px solid",
          borderColor: (palette.primary as PaletteColor).main,
          "&:hover": {
            backgroundColor: (palette.primary as PaletteColor)[800],
          },
          "&.Mui-disabled": {
            backgroundColor: (palette.primary as PaletteColor)[300],
            color: (palette.grey as PaletteColor)[50],
          },
        },
        outlined: {
          borderColor: (palette.grey as PaletteColor)[100],
          color: (palette.grey as PaletteColor)[100],
          "&:hover": {
            backgroundColor: (palette.grey as PaletteColor)[900],
          },
          "&.Mui-disabled": {
            color: (palette.grey as PaletteColor)[800],
            borderColor: (palette.grey as PaletteColor)[800],
          },
        },
        text: {
          backgroundColor: (palette.primary as PaletteColor)[100],
          color: (palette.primary as PaletteColor).main,
          "&:hover": {
            backgroundColor: (palette.primary as PaletteColor)[100],
          },
          "&.Mui-disabled": {
            backgroundColor: (palette.primary as PaletteColor)[100],
            color: (palette.primary as PaletteColor)[500],
          },
        },
      },
      variants: [
        {
          props: { variant: "dashed" },
          style: {
            border: "1px dashed",
            borderColor: (palette.primary as PaletteColor).main,
            color: (palette.primary as PaletteColor).main,
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: (palette.primary as PaletteColor)[100],
            },
            "&.Mui-disabled": {
              borderColor: (palette.primary as PaletteColor)[500],
              color: (palette.primary as PaletteColor)[500],
            },
          },
        },
      ],
    },
  };
};

export default createComponents;
