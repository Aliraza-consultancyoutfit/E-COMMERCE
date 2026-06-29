"use client";

import React from "react";
import { alpha, SvgIcon, useTheme } from "@mui/material";
import { IAssetsPropsDimension } from "@/interface";
import { PALETTE_MODE } from "@/constants/strings";

const ClockIcon = (props: IAssetsPropsDimension) => {
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
        width="40px"
        height="40px"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" rx="20" fill={fill} />
        <path
          d="M28.3307 20.0013C28.3307 24.6013 24.5974 28.3346 19.9974 28.3346C15.3974 28.3346 11.6641 24.6013 11.6641 20.0013C11.6641 15.4013 15.3974 11.668 19.9974 11.668C24.5974 11.668 28.3307 15.4013 28.3307 20.0013Z"
          stroke={stroke}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23.0953 22.6495L20.512 21.1078C20.062 20.8411 19.6953 20.1995 19.6953 19.6745V16.2578"
          stroke={stroke}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgIcon>
  );
};

export default ClockIcon;
