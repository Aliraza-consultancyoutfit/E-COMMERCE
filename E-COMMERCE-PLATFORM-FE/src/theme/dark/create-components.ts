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
          color: (palette.grey as PaletteColor)[100],
          border: "1px solid",
          borderColor: (palette.primary as PaletteColor).main,
          "&:hover": {
            backgroundColor: (palette.primary as PaletteColor)[800],
          },
          "&.Mui-disabled": {
            backgroundColor: palette.darkShades[900],
            color: (palette.grey as PaletteColor)[100],
          },
        },
        outlined: {
          borderColor: palette.darkShades[700],
          color: (palette.grey as PaletteColor)[100],
          "&:hover": {
            backgroundColor: palette.darkShades[900],
          },
          "&.Mui-disabled": {
            color: palette.darkShades[700],
            borderColor: palette.darkShades[700],
          },
        },
        text: {
          backgroundColor: palette.darkShades[900],
          color: (palette.primary as PaletteColor).main,
          "&:hover": {
            backgroundColor: palette.darkShades[900],
          },
          "&.Mui-disabled": {
            backgroundColor: palette.darkShades[900],
            color: palette.darkShades[700],
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
              backgroundColor: palette.darkShades[900],
            },
            "&.Mui-disabled": {
              borderColor: palette.darkShades[700],
              color: palette.darkShades[700],
            },
          },
        },
      ],
    },
  };
};

export default createComponents;
