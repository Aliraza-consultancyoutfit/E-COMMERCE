"use client";

import React from "react";
import { SvgIcon } from "@mui/material";
import { IAssetsPropsDimension } from "@/interface";

const MinusIcon = (props: IAssetsPropsDimension) => {
  const { width = "20px", height = "20px", sx = {}, stroke = "currentColor" } =
    props;

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
          d="M5 12h14"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgIcon>
  );
};

export default MinusIcon;
