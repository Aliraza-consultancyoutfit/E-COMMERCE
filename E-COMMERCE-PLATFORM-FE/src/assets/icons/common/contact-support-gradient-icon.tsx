"use client";

import React from "react";
import { SvgIcon } from "@mui/material";
import { IAssetsPropsDimension } from "@/interface";

const ContactSupportGradientIcon = (props: IAssetsPropsDimension) => {
  const { width = "24px", height = "24px", sx = {} } = props;

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
          d="M17 18.4297H13L8.54999 21.3897C7.88999 21.8297 7 21.3598 7 20.5598V18.4297C4 18.4297 2 16.4297 2 13.4297V7.42969C2 4.42969 4 2.42969 7 2.42969H17C20 2.42969 22 4.42969 22 7.42969V13.4297C22 16.4297 20 18.4297 17 18.4297Z"
          stroke="url(#paint0_linear_708_318)"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.9959 11.3594V11.1494C11.9959 10.4694 12.4159 10.1094 12.8359 9.8194C13.2459 9.5394 13.6559 9.17941 13.6559 8.51941C13.6559 7.59941 12.9159 6.85938 11.9959 6.85938C11.0759 6.85938 10.3359 7.59941 10.3359 8.51941"
          stroke="url(#paint1_linear_708_318)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.9955 13.75H12.0045"
          stroke="url(#paint2_linear_708_318)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient
            id="paint0_linear_708_318"
            x1="2"
            y1="2"
            x2="22"
            y2="22"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F86594" />
            <stop offset="1" stopColor="#4162FF" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_708_318"
            x1="10"
            y1="7"
            x2="14"
            y2="14.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F86594" />
            <stop offset="1" stopColor="#4162FF" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_708_318"
            x1="12"
            y1="13.25"
            x2="12"
            y2="14.25"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F86594" />
            <stop offset="1" stopColor="#4162FF" />
          </linearGradient>
        </defs>
      </svg>
    </SvgIcon>
  );
};

export default ContactSupportGradientIcon;
