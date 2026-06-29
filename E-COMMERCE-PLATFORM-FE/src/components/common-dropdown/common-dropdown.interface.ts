import React, { JSX } from "react";
import { SxProps, Theme } from "@mui/material/styles";

export interface ICommonDropdownProps {
  dropdownOptions: ICommonDropdownOption[];
  disabled?: boolean;
  dropdownName?: string | JSX.Element;
  hasEndIcon?: boolean;
  btnVariant?: "text" | "outlined" | "contained";
  Variant?: React.ElementType | any;
  menuSxProps?: SxProps<Theme>;
  [key: string]: any;
}

export type ICommonDropdownButtonCloseMenu = () => void;

export interface ICommonDropdownOption {
  id: string | number;
  title: string;
  handleClick: (closeMenu: ICommonDropdownButtonCloseMenu) => void;
  disabled?: boolean;
  titleSx?: SxProps<Theme>;
}
