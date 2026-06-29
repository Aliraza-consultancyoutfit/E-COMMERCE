"use client";

import React from "react";
import { SvgIcon, useTheme } from "@mui/material";
import { IAssetsPropsDimension } from "@/interface";

const NotificationIcon = (props: IAssetsPropsDimension) => {
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
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.01885 2.17969C6.53635 2.17969 4.51885 4.19719 4.51885 6.67969V8.84719C4.51885 9.30469 4.32385 10.0022 4.09135 10.3922L3.22885 11.8247C2.69635 12.7097 3.06385 13.6922 4.03885 14.0222C7.27135 15.1022 10.7588 15.1022 13.9913 14.0222C14.8988 13.7222 15.2963 12.6497 14.8013 11.8247L13.9388 10.3922C13.7138 10.0022 13.5189 9.30469 13.5189 8.84719V6.67969C13.5189 4.20469 11.4939 2.17969 9.01885 2.17969Z"
          stroke={stroke}
          strokeWidth="1.125"
          strokeMiterlimit="10"
          strokeLinecap="round"
        />
        <path
          d="M10.4 2.39812C10.1675 2.33062 9.9275 2.27812 9.68 2.24812C8.96 2.15812 8.27 2.21062 7.625 2.39812C7.8425 1.84312 8.3825 1.45312 9.0125 1.45312C9.6425 1.45312 10.1825 1.84312 10.4 2.39812Z"
          stroke={stroke}
          strokeWidth="1.125"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.2656 14.2969C11.2656 15.5344 10.2531 16.5469 9.01562 16.5469C8.40063 16.5469 7.83062 16.2919 7.42562 15.8869C7.02062 15.4819 6.76562 14.9119 6.76562 14.2969"
          stroke={stroke}
          strokeWidth="1.125"
          strokeMiterlimit="10"
        />
      </svg>
    </SvgIcon>
  );
};

export default NotificationIcon;
