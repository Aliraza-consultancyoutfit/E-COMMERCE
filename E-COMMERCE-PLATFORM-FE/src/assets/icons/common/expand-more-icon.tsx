"use client";

import React from "react";
import { SvgIcon, useTheme } from "@mui/material";
import { IAssetsPropsDimension } from "@/interface";

const ExpandMoreIcon = (props: IAssetsPropsDimension) => {
  const theme = useTheme();

  const {
    width = "18px",
    height = "18px",
    sx = {},
    stroke = theme.palette.grey[300],
  } = props;

  return (
    <SvgIcon sx={{ width, height, ...sx }}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.9401 6.71252L10.0501 11.6025C9.47256 12.18 8.52756 12.18 7.95006 11.6025L3.06006 6.71252"
          stroke={stroke}
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgIcon>
  );
};

export default ExpandMoreIcon;
