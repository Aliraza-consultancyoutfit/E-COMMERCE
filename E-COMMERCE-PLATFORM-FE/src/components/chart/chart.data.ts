import { pxToRem } from "@/utils";
import { Theme } from "@mui/material";
import { ApexOptions } from "apexcharts";
import { ChartType } from "./chart.interface";
import { PALETTE_MODE } from "@/constants/strings";

export const labelXYStyles = (theme: Theme) => ({
  style: {
    fontSize: pxToRem(14),
    fontFamily: "inherit",
    fontWeight: 500,
    colors:
      theme.palette.mode === PALETTE_MODE.LIGHT
        ? theme.palette.grey[200]
        : theme.palette.grey[100],
  },
});

export const barOptions = (
  theme: Theme,
  type: ChartType,
  options: Partial<ApexOptions>
): ApexOptions => {
  const {
    chart,
    grid,
    xaxis,
    yaxis,
    fill,
    dataLabels,
    legend,
    ...restOptions
  } = options;

  return {
    chart: {
      type,
      toolbar: { show: false },
      zoom: {
        enabled: false,
      },
      ...chart,
    },
    markers: {
      size: 0,
    },
    fill: {
      ...fill,
    },
    grid: {
      show: false,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      ...grid,
    },
    xaxis: {
      labels: {
        ...labelXYStyles(theme),
        ...xaxis?.labels,
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      ...xaxis,
    },
    yaxis: {
      labels: {
        ...labelXYStyles(theme),
      },
      ...yaxis,
    },
    dataLabels: {
      enabled: false,
      ...dataLabels,
    },
    legend: {
      show: false,
      markers: {
        ...legend?.markers,
      },
      ...legend,
    },
    ...restOptions,
  };
};
