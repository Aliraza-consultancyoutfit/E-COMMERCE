"use client";

import { SvgIcon, useTheme } from "@mui/material";
import { IAssetsPropsDimension } from "@/interface";

const CalendarIcon = (props: IAssetsPropsDimension) => {
  const theme = useTheme();

  const {
    width = "24px",
    height = "24px",
    sx = {},
    fill = theme.palette.grey[100],
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
          d="M8 2V5"
          stroke={fill}
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 2V5"
          stroke={fill}
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.5 9.09375H20.5"
          stroke={fill}
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.211 15.7683L15.671 19.3083C15.531 19.4483 15.401 19.7083 15.371 19.8983L15.181 21.2483C15.111 21.7383 15.451 22.0783 15.941 22.0083L17.291 21.8183C17.481 21.7883 17.751 21.6583 17.881 21.5183L21.421 17.9783C22.031 17.3683 22.321 16.6583 21.421 15.7583C20.531 14.8683 19.821 15.1583 19.211 15.7683Z"
          stroke={fill}
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.7031 16.2812C19.0031 17.3613 19.8431 18.2013 20.9231 18.5013"
          stroke={fill}
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5V12"
          stroke={fill}
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.9945 13.7031H12.0035"
          stroke={fill}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.29138 13.7031H8.30036"
          stroke={fill}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.29138 16.7031H8.30036"
          stroke={fill}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgIcon>
  );
};

export default CalendarIcon;
