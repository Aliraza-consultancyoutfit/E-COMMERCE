"use client";

import React from "react";
import { SvgIcon, useTheme } from "@mui/material";
import { IAssetsPropsDimension } from "@/interface";

const MenuIcon = (props: IAssetsPropsDimension) => {
  const theme = useTheme();

  const {
    width = "32px",
    height = "32px",
    sx = {},
    stroke = theme.palette.grey[100],
  } = props;

  return (
    <SvgIcon sx={{ width, height, ...sx }}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.33594 10.668H16.0026M9.33594 16.0013H22.6693M16.0026 21.3346H22.6693"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </SvgIcon>
  );
};

export default MenuIcon;
