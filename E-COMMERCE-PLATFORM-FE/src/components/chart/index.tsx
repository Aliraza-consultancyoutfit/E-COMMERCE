"use client";

import { useTheme } from "@mui/material";
import dynamic from "next/dynamic";
import { barOptions } from "./chart.data";
import ChartStyle from "./chart.style";
import { IChartProps } from "./chart.interface";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const Chart = (props: IChartProps) => {
  const theme = useTheme();

  const { options, series, type, height = "100%", width = "100%" } = props;

  return (
    <>
      <ChartStyle />
      <ReactApexChart
        options={barOptions(theme, type, options)}
        series={series}
        type={type}
        width={width}
        height={height}
      />
    </>
  );
};

export { default as ChartStyle } from "./chart.style";

export default Chart;
