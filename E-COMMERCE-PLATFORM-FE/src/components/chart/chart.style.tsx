import React from "react";
import { useTheme } from "@mui/material/styles";
import { GlobalStyles } from "@mui/material";
import { PALETTE_MODE } from "@/constants/strings";

export default function ChartStyle() {
  const theme = useTheme();

  return (
    <GlobalStyles
      styles={{
        "&.apexcharts-canvas": {
          ".apexcharts-xaxistooltip": {
            border: 0,
            borderRadius: 8,
            backgroundColor: theme.palette.background.default,
            color:
              theme.palette.mode === PALETTE_MODE.LIGHT
                ? theme.palette.grey[200]
                : theme.palette.grey[100],
            "&:before": { borderBottomColor: theme.palette.background.default },
            "&:after": {
              borderBottomColor: theme.palette.background.default,
            },
          },

          ".apexcharts-tooltip.apexcharts-theme-light": {
            backgroundColor: theme.palette.background.default,
            border: 0,
            borderRadius: 8,
            "& .apexcharts-tooltip-title": {
              display: "none",
            },
          },
        },
      }}
    />
  );
}
