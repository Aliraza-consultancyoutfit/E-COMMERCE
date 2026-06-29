"use client";

import React from "react";
import { alpha, SvgIcon, useTheme } from "@mui/material";
import { IAssetsPropsDimension } from "@/interface";
import { PALETTE_MODE } from "@/constants/strings";

const PortfolioIcon = (props: IAssetsPropsDimension) => {
  const theme = useTheme();

  const {
    width = "40px",
    height = "40px",
    sx = {},
    stroke = theme.palette.primary.main,
    fill = theme.palette.mode === PALETTE_MODE.LIGHT
      ? theme.palette.primary[100]
      : alpha(theme.palette.primary.main, 0.15),
  } = props;

  return (
    <SvgIcon sx={{ width, height, ...sx }}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" rx="20" fill={fill} />
        <path
          d="M12.6484 16.2031L20.0068 20.4614L27.3151 16.2281"
          stroke={stroke}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.0078 28.0115V20.4531"
          stroke={stroke}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.2755 12.0719L13.8255 14.5469C12.8172 15.1052 11.9922 16.5052 11.9922 17.6552V22.3636C11.9922 23.5136 12.8172 24.9136 13.8255 25.4719L18.2755 27.9469C19.2255 28.4719 20.7838 28.4719 21.7338 27.9469L26.1839 25.4719C27.1922 24.9136 28.0172 23.5136 28.0172 22.3636V17.6552C28.0172 16.5052 27.1922 15.1052 26.1839 14.5469L21.7338 12.0719C20.7755 11.5385 19.2255 11.5385 18.2755 12.0719Z"
          stroke={stroke}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24.1661 21.0386V17.9886L16.2578 13.4219"
          stroke={stroke}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgIcon>
  );
};

export default PortfolioIcon;
