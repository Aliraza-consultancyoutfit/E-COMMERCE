"use client";

import React from "react";
import { SvgIcon, useTheme } from "@mui/material";
import { IAssetsPropsDimension } from "@/interface";

const EyeHideIcon = (props: IAssetsPropsDimension) => {
  const theme = useTheme();

  const {
    width = "24px",
    height = "24px",
    sx = {},
    stroke = theme.palette.grey[100],
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
          d="M14.5319 9.47188L9.47188 14.5319C8.82188 13.8819 8.42188 12.9919 8.42188 12.0019C8.42188 10.0219 10.0219 8.42188 12.0019 8.42188C12.9919 8.42188 13.8819 8.82188 14.5319 9.47188Z"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.8237 5.76656C16.0737 4.44656 14.0737 3.72656 12.0037 3.72656C8.47375 3.72656 5.18375 5.80656 2.89375 9.40656C1.99375 10.8166 1.99375 13.1866 2.89375 14.5966C3.68375 15.8366 4.60375 16.9066 5.60375 17.7666"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.42188 19.5297C9.56187 20.0097 10.7719 20.2697 12.0019 20.2697C15.5319 20.2697 18.8219 18.1897 21.1119 14.5897C22.0119 13.1797 22.0119 10.8097 21.1119 9.39969C20.7819 8.87969 20.4219 8.38969 20.0519 7.92969"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.5075 12.7031C15.2475 14.1131 14.0975 15.2631 12.6875 15.5231"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.47 14.5312L2 22.0013"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22.0013 2L14.5312 9.47"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgIcon>
  );
};

export default EyeHideIcon;
