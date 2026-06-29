"use client";

import React from "react";
import { SvgIcon, useTheme } from "@mui/material";
import { IAssetsPropsDimension } from "@/interface";

const StarIcon = (props: IAssetsPropsDimension) => {
  const theme = useTheme();

  const {
    width = "16px",
    height = "16px",
    sx = {},
    fill = theme.palette.secondary.main,
  } = props;

  return (
    <SvgIcon sx={{ width, height, ...sx }}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"
          fill={fill}
        />
      </svg>
    </SvgIcon>
  );
};

export default StarIcon;
