"use client";

import React from "react";
import { SvgIcon, useTheme } from "@mui/material";
import { IAssetsPropsDimension } from "@/interface";

const TrendIcon = (props: IAssetsPropsDimension) => {
  const theme = useTheme();

  const {
    width = "20px",
    height = "20px",
    sx = {},
    stroke = theme.palette.success.main,
  } = props;

  return (
    <SvgIcon sx={{ width, height, ...sx }}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.9969 8L10.6369 11.36L9.35688 9.44L6.79688 12"
          stroke={stroke}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.3984 8H13.9984V9.6"
          stroke={stroke}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.99844 18H12.7984C16.7984 18 18.3984 16.4 18.3984 12.4V7.6C18.3984 3.6 16.7984 2 12.7984 2H7.99844C3.99844 2 2.39844 3.6 2.39844 7.6V12.4C2.39844 16.4 3.99844 18 7.99844 18Z"
          stroke={stroke}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgIcon>
  );
};

export default TrendIcon;
