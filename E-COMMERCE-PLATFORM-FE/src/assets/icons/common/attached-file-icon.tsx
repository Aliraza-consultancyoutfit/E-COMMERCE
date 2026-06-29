"use client";

import React from "react";
import { SvgIcon, useTheme } from "@mui/material";
import { IAssetsPropsDimension } from "@/interface";

const AttachedFileIcon = (props: IAssetsPropsDimension) => {
  const theme = useTheme();

  const {
    width = "48px",
    height = "48px",
    sx = {},
    stroke = theme.palette.grey[50],
  } = props;

  return (
    <SvgIcon sx={{ width, height, ...sx }}>
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="48"
          height="48"
          rx="24"
          fill="url(#paint0_linear_497_80128)"
        />
        <path
          d="M18 24H30"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 30V18"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgIcon>
  );
};

export default AttachedFileIcon;
