"use client";

import React from "react";
import { SvgIcon, useTheme } from "@mui/material";
import { IAssetsPropsDimension } from "@/interface";

const ArrowIcon = (props: IAssetsPropsDimension) => {
  const theme = useTheme();

  const {
    width = "14px",
    height = "14px",
    sx = {},
    stroke = theme.palette.grey[200],
  } = props;

  return (
    <SvgIcon sx={{ width, height, ...sx }}>
      <svg
        width="14px"
        height="14px"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.8359 6.9974H1.16927M1.16927 6.9974L7.0026 1.16406M1.16927 6.9974L7.0026 12.8307"
          stroke={stroke}
          strokeWidth="1.67"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgIcon>
  );
};

export default ArrowIcon;
