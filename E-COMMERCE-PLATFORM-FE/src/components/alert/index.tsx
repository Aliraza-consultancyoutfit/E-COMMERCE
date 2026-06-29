import React from "react";
import { AlertInfoIcon, CrossIcon } from "@/assets/icons/common";
import { Box, IconButton, Typography } from "@mui/material";
import { IAlertProps } from "./alert.interface";

const Alert: React.FC<IAlertProps> = (props) => {
  const { text, icon = <AlertInfoIcon />, onClose, sx } = props;

  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        color: "common.white",
        width: "100%",
        borderRadius: "12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 1.6,
        ...sx,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {icon}
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {text}
        </Typography>
      </Box>
      <IconButton onClick={onClose}>
        <CrossIcon />
      </IconButton>
    </Box>
  );
};

export default Alert;
