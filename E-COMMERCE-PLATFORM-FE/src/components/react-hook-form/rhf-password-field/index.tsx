"use client";

import { useState } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import RHFTextField from "../rhf-text-field";
import { RHFTextFieldProps } from "../rhf-text-field/rhf-text-field.interface";
import { EyeHideIcon, EyeIcon } from "@/assets/icons/common";

/** Password input with a show/hide toggle, built on the themed RHFTextField. */
export default function RHFPasswordField(props: RHFTextFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <RHFTextField
      {...props}
      type={isVisible ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setIsVisible((prev) => !prev)}
              edge="end"
              aria-label={isVisible ? "Hide password" : "Show password"}
            >
              {isVisible ? (
                <EyeHideIcon width="20" height="20" />
              ) : (
                <EyeIcon width="20" height="20" />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
