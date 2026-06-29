"use client";

import React from "react";
import { SvgIcon, useTheme } from "@mui/material";
import { IAssetsPropsDimension } from "@/interface";
import { PALETTE_MODE } from "@/constants/strings";

const CrossIcon = (props: IAssetsPropsDimension) => {
  const theme = useTheme();

  const {
    width = "24px",
    height = "24px",
    sx = {},
    stroke = theme.palette.mode === PALETTE_MODE.LIGHT
      ? theme.palette.grey[50]
      : theme.palette.grey[100],
  } = props;

  return (
    <SvgIcon sx={{ width, height, ...sx }}>
      <svg
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.17188 14.8319L14.8319 9.17188"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.8319 14.8319L9.17188 9.17188"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgIcon>
  );
};

export default CrossIcon;
