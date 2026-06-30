"use client";

import React from "react";
import { SvgIcon } from "@mui/material";
import { IAssetsPropsDimension } from "@/interface";

const ShieldIcon = (props: IAssetsPropsDimension) => {
  const { width = "16px", height = "16px", sx = {}, stroke = "currentColor" } =
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
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
          stroke={stroke}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgIcon>
  );
};

export default ShieldIcon;
