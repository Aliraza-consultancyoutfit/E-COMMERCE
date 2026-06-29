"use client";

import React from "react";
import { SvgIcon, useTheme } from "@mui/material";
import { IAssetsPropsDimension } from "@/interface";

const InfoIcon = (props: IAssetsPropsDimension) => {
  const theme = useTheme();

  const {
    width = "46px",
    height = "46px",
    sx = {},
    stroke = theme.palette.primary[100],
    fill = theme.palette.primary[200],
  } = props;

  return (
    <SvgIcon sx={{ width, height, ...sx }} viewBox="0 0 46 46">
      <svg
        width="46"
        height="46"
        viewBox="0 0 46 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="3" y="3" width="40" height="40" rx="20" fill={fill} />
        <rect
          x="3"
          y="3"
          width="40"
          height="40"
          rx="20"
          stroke={stroke}
          strokeWidth="6"
        />
        <path
          d="M23 33C17.49 33 13 28.51 13 23C13 17.49 17.49 13 23 13C28.51 13 33 17.49 33 23C33 28.51 28.51 33 23 33ZM22.25 27C22.25 27.41 22.59 27.75 23 27.75C23.41 27.75 23.75 27.41 23.75 27V22C23.75 21.59 23.41 21.25 23 21.25C22.59 21.25 22.25 21.59 22.25 22V27ZM23.92 18.62C23.87 18.49 23.8 18.39 23.71 18.29C23.61 18.2 23.5 18.13 23.38 18.08C23.26 18.03 23.13 18 23 18C22.87 18 22.74 18.03 22.62 18.08C22.5 18.13 22.39 18.2 22.29 18.29C22.2 18.39 22.13 18.49 22.08 18.62C22.03 18.74 22 18.87 22 19C22 19.13 22.03 19.26 22.08 19.38C22.13 19.5 22.2 19.61 22.29 19.71C22.39 19.8 22.5 19.87 22.62 19.92C22.86 20.02 23.14 20.02 23.38 19.92C23.5 19.87 23.61 19.8 23.71 19.71C23.8 19.61 23.87 19.5 23.92 19.38C23.97 19.26 24 19.13 24 19C24 18.87 23.97 18.74 23.92 18.62Z"
          fill="#4162FF"
        />
      </svg>
    </SvgIcon>
  );
};

export default InfoIcon;
