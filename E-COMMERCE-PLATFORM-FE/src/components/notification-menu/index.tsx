"use client";

import { NotificationIcon } from "@/assets/icons/common";
import { PALETTE_MODE } from "@/constants/strings";
import { Badge, useTheme } from "@mui/material";

const NotificationMenu = () => {
  const theme = useTheme();

  return (
    <Badge
      color={"primary"}
      overlap={"circular"}
      badgeContent={" "}
      variant={"dot"}
      sx={{
        border: 1,
        borderRadius: "50%",
        width: 48,
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderColor:
          theme.palette.mode === PALETTE_MODE.LIGHT
            ? theme.palette.common.stroke
            : theme.palette.darkShades[700],
        cursor: "pointer",
        "& .MuiBadge-dot": {
          backgroundColor: "tertiary.main",
          border: 1.5,
          borderColor: "common.white",
          width: 10,
          height: 10,
          borderRadius: "50%",
        },
      }}
    >
      <NotificationIcon />
    </Badge>
  );
};

export default NotificationMenu;
