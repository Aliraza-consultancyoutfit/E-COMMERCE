"use client";

import React from "react";
import { SvgIcon, useTheme } from "@mui/material";
import { IAssetsPropsDimension } from "@/interface";

const ExportIcon = (props: IAssetsPropsDimension) => {
  const theme = useTheme();

  const {
    width = "23px",
    height = "22px",
    sx = {},
    stroke = theme.palette.primary.main,
  } = props;

  return (
    <SvgIcon sx={{ width, height, ...sx }}>
      <svg
        width="23"
        height="22"
        viewBox="0 0 23 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.862 1.83594C6.80198 1.83594 2.69531 5.9426 2.69531 11.0026C2.69531 16.0626 6.80198 20.1693 11.862 20.1693C16.922 20.1693 21.0286 16.0626 21.0286 11.0026"
          stroke={stroke}
          strokeWidth="1.375"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.7734 10.0792L20.2901 2.5625"
          stroke={stroke}
          strokeWidth="1.375"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21.0291 6.26344V1.83594H16.6016"
          stroke={stroke}
          strokeWidth="1.375"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgIcon>
  );
};

export default ExportIcon;
