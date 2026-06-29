import type { Theme } from "@mui/material";
import type { ApexOptions } from "apexcharts";
import { formatCurrency } from "@/utils/format";

/** Ordered colour ramp for the category-mix donut, all from the theme. */
export const donutColors = (theme: Theme) => [
  theme.palette.primary.main,
  theme.palette.info.main,
  theme.palette.success.main,
  theme.palette.warning.main,
  theme.palette.error.main,
];

const moneyTooltip = { y: { formatter: (value: number) => formatCurrency(value) } };

export const revenueAreaOptions = (theme: Theme, categories: string[]): ApexOptions => ({
  colors: [theme.palette.primary.main],
  stroke: { curve: "smooth", width: 2.5 },
  fill: {
    type: "gradient",
    gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0, stops: [0, 100] },
  },
  grid: { show: true, borderColor: theme.palette.divider, strokeDashArray: 0 },
  xaxis: { categories },
  yaxis: { show: false },
  tooltip: moneyTooltip,
});

export const salesBarOptions = (theme: Theme, categories: string[]): ApexOptions => ({
  colors: [theme.palette.primary.main],
  plotOptions: { bar: { borderRadius: 6, columnWidth: "45%" } },
  xaxis: { categories },
  yaxis: { show: false },
  tooltip: moneyTooltip,
});

export const categoryDonutOptions = (theme: Theme, labels: string[]): ApexOptions => ({
  labels,
  colors: donutColors(theme),
  stroke: { width: 0 },
  legend: {
    show: true,
    position: "bottom",
    labels: { colors: theme.palette.text.secondary },
  },
  plotOptions: { pie: { donut: { size: "72%" } } },
  tooltip: { y: { formatter: (value: number) => `${value}%` } },
});
