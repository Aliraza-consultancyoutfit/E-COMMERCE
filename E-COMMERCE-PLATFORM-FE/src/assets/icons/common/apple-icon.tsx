"use client";

import React from "react";
import { SvgIcon } from "@mui/material";
import { IAssetsPropsDimension } from "@/interface";

const AppleIcon = (props: IAssetsPropsDimension) => {
  const { width = "17px", height = "17px", sx = {}, fill = "currentColor" } =
    props;

  return (
    <SvgIcon sx={{ width, height, ...sx }}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={fill}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.49-.12-1.03.42-2.18 1.07-2.93.74-.85 2.03-1.47 3.094-1.64zM20.5 17.4c-.55 1.27-.82 1.84-1.53 2.97-.99 1.57-2.39 3.53-4.12 3.55-1.54.01-1.93-1-4.01-.99-2.08.01-2.51 1.01-4.05.98-1.73-.03-3.05-1.8-4.04-3.37-2.77-4.39-3.06-9.54-1.35-12.28 1.21-1.95 3.13-3.09 4.93-3.09 1.84 0 2.99 1.01 4.51 1.01 1.47 0 2.37-1.01 4.5-1.01 1.61 0 3.31.88 4.52 2.39-3.97 2.18-3.33 7.85.64 9.83z" />
      </svg>
    </SvgIcon>
  );
};

export default AppleIcon;
