import { pxToRem } from "@/utils";
import type { Components } from "@mui/material/styles/components";

const createComponents = (): Components => {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          boxShadow: "none",
          fontWeight: 400,
        },
        sizeLarge: {
          padding: "15px 18px",
          fontSize: pxToRem(18),
        },
        sizeMedium: {
          padding: "10px 18px",
          fontSize: pxToRem(16),
        },
        sizeSmall: {
          padding: "9px 18px",
          fontSize: pxToRem(14),
        },
      },
    },
  };
};

export default createComponents;
