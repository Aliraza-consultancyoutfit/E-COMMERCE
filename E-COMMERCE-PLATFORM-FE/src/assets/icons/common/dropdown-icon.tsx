"use client";

import React from "react";
import { SvgIcon, useTheme } from "@mui/material";
import { IAssetsPropsDimension } from "@/interface";

const DropdownIcon = (props: IAssetsPropsDimension) => {
  const theme = useTheme();

  const {
    width = "14px",
    height = "8px",
    sx = {},
    stroke = theme.palette.grey[50],
  } = props;

  return (
    <SvgIcon sx={{ width, height, ...sx }}>
      <svg
        width="14"
        height="8"
        viewBox="0 0 14 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.9425 1.71094L8.0525 6.60094C7.475 7.17844 6.53 7.17844 5.9525 6.60094L1.0625 1.71094"
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

export default DropdownIcon;
