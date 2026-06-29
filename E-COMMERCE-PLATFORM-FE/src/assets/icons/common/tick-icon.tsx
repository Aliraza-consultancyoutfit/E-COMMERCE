"use client";

import React from "react";
import { SvgIcon, useTheme } from "@mui/material";
import { IAssetsPropsDimension } from "@/interface";

const TickIcon = (props: IAssetsPropsDimension) => {
  const theme = useTheme();

  const {
    width = "20px",
    height = "20px",
    sx = {},
    stroke = theme.palette.extraColorsB.main,
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
          d="M16.6666 5L7.49992 14.1667L3.33325 10"
          stroke={stroke}
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgIcon>
  );
};

export default TickIcon;
