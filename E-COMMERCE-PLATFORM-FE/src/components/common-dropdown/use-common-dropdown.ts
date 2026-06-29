import { Theme, useTheme } from "@mui/material";
import { useState } from "react";
import { ICommonDropdownButtonCloseMenu } from "./common-dropdown.interface";

export const useCommonDropdown = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open: boolean = Boolean(anchorEl);
  const theme: Theme = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose: ICommonDropdownButtonCloseMenu = () => {
    setAnchorEl(null);
  };

  return {
    anchorEl,
    open,
    theme,
    handleClick,
    handleClose,
  };
};
