"use client";

import React from "react";
import { SvgIcon, useTheme } from "@mui/material";
import { IAssetsPropsDimension } from "@/interface";

const GoogleIcon = (props: IAssetsPropsDimension) => {
  const theme = useTheme();

  const {
    width = "24px",
    height = "24px",
    sx = {},
    stroke = theme.palette.grey[100],
  } = props;

  return (
    <SvgIcon sx={{ width, height, ...sx }} viewBox="0 0 46 46">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.6031 10.2H12.2031V13.9H17.7031C17.6031 14.8 17.0031 16.2 15.7031 17.1C14.9031 17.7 13.7031 18.1 12.2031 18.1C9.60313 18.1 7.30313 16.4 6.50313 13.9C6.30313 13.3 6.20312 12.6 6.20312 11.9C6.20312 11.2 6.30313 10.5 6.50313 9.9C6.60313 9.7 6.60312 9.5 6.70312 9.4C7.60312 7.3 9.70312 5.8 12.2031 5.8C14.1031 5.8 15.3031 6.6 16.1031 7.3L18.9031 4.5C17.2031 3 14.9031 2 12.2031 2C8.30312 2 4.90312 4.2 3.30312 7.5C2.60312 8.9 2.20312 10.4 2.20312 12C2.20312 13.6 2.60312 15.1 3.30312 16.5C4.90312 19.8 8.30312 22 12.2031 22C14.9031 22 17.2031 21.1 18.8031 19.6C20.7031 17.9 21.8031 15.3 21.8031 12.2C21.8031 11.4 21.7031 10.8 21.6031 10.2Z"
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

export default GoogleIcon;
