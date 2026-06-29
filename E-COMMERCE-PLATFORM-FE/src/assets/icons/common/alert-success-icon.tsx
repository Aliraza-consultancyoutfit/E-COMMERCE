"use client";

import React from "react";
import { SvgIcon, useTheme } from "@mui/material";
import { IAssetsPropsDimension } from "@/interface";
import { PALETTE_MODE } from "@/constants/strings";

const AlertSuccessIcon = (props: IAssetsPropsDimension) => {
  const theme = useTheme();

  const {
    width = "24px",
    height = "24px",
    sx = {},
    fill = theme.palette.mode === PALETTE_MODE.LIGHT
      ? theme.palette.grey[50]
      : theme.palette.grey[100],
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
          d="M12.0001 2.66666C6.85741 2.66666 2.66675 6.85733 2.66675 12C2.66675 17.1427 6.85741 21.3333 12.0001 21.3333C17.1427 21.3333 21.3334 17.1427 21.3334 12C21.3334 6.85733 17.1427 2.66666 12.0001 2.66666ZM16.4614 9.85333L11.1694 15.1453C11.0387 15.276 10.8614 15.3507 10.6747 15.3507C10.4881 15.3507 10.3107 15.276 10.1801 15.1453L7.53875 12.504C7.26808 12.2333 7.26808 11.7853 7.53875 11.5147C7.80941 11.244 8.25741 11.244 8.52808 11.5147L10.6747 13.6613L15.4721 8.864C15.7427 8.59333 16.1907 8.59333 16.4614 8.864C16.7321 9.13466 16.7321 9.57333 16.4614 9.85333Z"
          fill={fill}
        />
      </svg>
    </SvgIcon>
  );
};

export default AlertSuccessIcon;
