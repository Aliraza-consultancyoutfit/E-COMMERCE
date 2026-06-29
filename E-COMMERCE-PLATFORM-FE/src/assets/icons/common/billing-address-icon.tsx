"use client";

import React from "react";
import { SvgIcon, useTheme } from "@mui/material";
import { IAssetsPropsDimension } from "@/interface";
import { PALETTE_MODE } from "@/constants/strings";

const BillingAddressIcon = (props: IAssetsPropsDimension) => {
  const theme = useTheme();

  const {
    width = "32px",
    height = "32px",
    sx = {},
    stroke = theme.palette.mode === PALETTE_MODE.LIGHT
      ? theme.palette.grey[50]
      : theme.palette.grey[100],
  } = props;

  return (
    <SvgIcon sx={{ width, height, ...sx }}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.66406 11.3438H29.3307"
          stroke={stroke}
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 22.0078H10.6667"
          stroke={stroke}
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 22.0078H19.3333"
          stroke={stroke}
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.58406 4.67969H23.3974C28.1441 4.67969 29.3307 5.85302 29.3307 10.533V21.4797C29.3307 26.1597 28.1441 27.333 23.4107 27.333H8.58406C3.85073 27.3464 2.66406 26.173 2.66406 21.493V10.533C2.66406 5.85302 3.85073 4.67969 8.58406 4.67969Z"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgIcon>
  );
};

export default BillingAddressIcon;
