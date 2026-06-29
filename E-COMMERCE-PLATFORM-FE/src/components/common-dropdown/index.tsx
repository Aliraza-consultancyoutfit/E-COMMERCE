"use client";

import { Button, Menu, MenuItem, IconButton, Typography } from "@mui/material";
import { useCommonDropdown } from "./use-common-dropdown";
import {
  ICommonDropdownOption,
  ICommonDropdownProps,
} from "./common-dropdown.interface";
import DropdownIcon from "@/assets/icons/common/dropdown-icon";
import { useTheme } from "@mui/material/styles";

export const CommonDropdown = (props: ICommonDropdownProps) => {
  const theme = useTheme();
  const {
    dropdownOptions,
    disabled,
    dropdownName = "Actions",
    hasEndIcon = true,
    btnVariant = "outlined",
    Variant = hasEndIcon ? Button : IconButton,
    menuSxProps,
    ...buttonProps
  } = props;

  const { anchorEl, open, handleClick, handleClose } = useCommonDropdown();

  const buttonPropsWithIcon =
    Variant === Button
      ? {
          endIcon: hasEndIcon && (
            <DropdownIcon
              stroke={
                btnVariant === "contained"
                  ? theme.palette.primary.main
                  : theme.palette.grey[100]
              }
              sx={{
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
            />
          ),
        }
      : {};

  const buttonStyles =
    btnVariant === "contained"
      ? {
          backgroundColor: theme.palette.primary[100],
          color: theme.palette.primary.main,
          border: "none",
          borderRadius: "12px",
          "&:hover": {
            backgroundColor: theme.palette.primary[100],
            border: "none",
          },
        }
      : {
          borderRadius: "12px",
          "&:hover": {
            backgroundColor: "transparent",
          },
        };

  return (
    <>
      <Variant
        variant={btnVariant}
        id="dropdown-button"
        aria-controls={open ? "dropdown-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        color="secondary"
        className="small"
        disabled={disabled}
        sx={buttonStyles}
        {...buttonPropsWithIcon}
        {...buttonProps}
      >
        {dropdownName}
      </Variant>

      <Menu
        id="dropdown-menu"
        aria-labelledby="dropdown-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              ...menuSxProps,
            },
          },
        }}
        sx={{ padding: 2 }}
      >
        {dropdownOptions?.map(
          ({
            id,
            disabled,
            handleClick,
            title,
            titleSx,
          }: ICommonDropdownOption) => (
            <MenuItem
              key={id}
              disabled={disabled}
              onClick={() => handleClick?.(handleClose)}
              sx={{
                "&.MuiMenuItem-root": {
                  marginBottom: { md: 0.5 },
                  marginX: { md: 0.5 },
                },
              }}
            >
              <Typography
                variant="body2"
                color={theme?.palette?.grey[200]}
                fontWeight={500}
                width={"100%"}
                sx={titleSx}
                component="div"
              >
                {title}
              </Typography>
            </MenuItem>
          )
        )}
      </Menu>
    </>
  );
};
