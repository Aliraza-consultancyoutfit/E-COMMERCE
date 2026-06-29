"use client";

import React from "react";
import { SvgIcon, useTheme } from "@mui/material";
import { IAssetsPropsDimension } from "@/interface";

const EditIcon = (props: IAssetsPropsDimension) => {
  const theme = useTheme();

  const {
    width = "36px",
    height = "36px",
    sx = {},
    fill = theme.palette.grey[900],
    stroke = theme.palette.grey[300],
  } = props;

  return (
    <SvgIcon sx={{ width, height, ...sx }}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="36" height="36" rx="18" fill={fill} />
        <path
          d="M19.1554 10.2996L11.6296 18.2655C11.3454 18.568 11.0704 19.1638 11.0154 19.5763L10.6762 22.5463C10.5571 23.6188 11.3271 24.3521 12.3904 24.1688L15.3421 23.6646C15.7546 23.5913 16.3321 23.2888 16.6162 22.9771L24.1421 15.0113C25.4437 13.6363 26.0304 12.0688 24.0046 10.153C21.9879 8.25546 20.4571 8.92463 19.1554 10.2996Z"
          stroke={stroke}
          strokeWidth="1.3"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.8984 11.6289C18.2926 14.1589 20.3459 16.0931 22.8943 16.3497"
          stroke={stroke}
          strokeWidth="1.3"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.75 27.168H26.25"
          stroke={stroke}
          strokeWidth="1.3"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgIcon>
  );
};

export default EditIcon;
