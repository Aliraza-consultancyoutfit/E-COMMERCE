"use client";

import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { IAlertCommonDialogProps } from "./alert-common-dialog.interface";
import { CrossIcon } from "@/assets/icons/common";
import { PALETTE_MODE } from "@/constants/strings";

export const AlertCommonDialog: React.FC<IAlertCommonDialogProps> = (props) => {
  const theme = useTheme();

  const {
    message,
    type,
    open,
    handleClose,
    handleCancelBtn = handleClose,
    handleSubmitBtn,
    cancelBtnText = "No",
    submitBtnText = "Yes",
    typeImage,
    disableCancelBtn,
    loading,
    footer = true,
  } = props;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "24px",
          background:
            theme.palette.mode === PALETTE_MODE.LIGHT
              ? theme.palette.common.white
              : theme.palette.darkShades.main,
          border: 1,
          borderColor:
            theme.palette.mode === PALETTE_MODE.LIGHT
              ? theme.palette.common.stroke
              : theme.palette.darkShades[700],
        },
      }}
    >
      <DialogTitle
        sx={{
          position: "relative",
          padding: "16px",
          borderBottom: 1,
          borderBottomColor:
            theme.palette.mode === PALETTE_MODE.LIGHT
              ? "common.stroke"
              : "darkShades.700",
          mb: 1.5,
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            p: 0,
          }}
        >
          <CrossIcon stroke={theme.palette.grey[100]} />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            flexWrap: "wrap",
            mb: 1.5,
            pt: { xs: 1, md: 0 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            {typeImage}
            <Typography
              variant="h3"
              textTransform="capitalize"
              sx={{ color: "grey.100" }}
            >
              {type}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography
          variant="body1"
          sx={{ marginTop: "1rem", color: "grey.100" }}
        >
          {message}
        </Typography>
      </DialogContent>
      {footer && (
        <DialogActions
          sx={{
            padding: "1.5rem",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleCancelBtn}
            disabled={disableCancelBtn}
          >
            {cancelBtnText}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitBtn}
            loading={loading}
          >
            {submitBtnText}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
