import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  IconButton,
  useTheme,
} from "@mui/material";
import { CrossIcon } from "@/assets/icons/common";
import { ICustomCommonDialogProps } from "./custom-common-dialog.interface";
import { PALETTE_MODE } from "@/constants/strings";

export const CustomCommonDialog = (props: ICustomCommonDialogProps) => {
  const theme = useTheme();
  const {
    isPortalOpen = false,
    closePortal,
    dialogTitle = "",
    dialogDescription = "",
    children,
    disabledCancelButton = false,
    showSubmitLoader = false,
    handleSubmitButton,
    handleCancelButton = closePortal,
    cancelButtonText = "Cancel",
    submitButtonText = "Submit",
    showActionButtons = true,
    dialogMaxWidth = "sm",
    typeImage,
    disabledSubmitButton = showSubmitLoader,
    loadingSubmitButton = false,
    submitButtonStyles,
  } = props;

  return (
    <Dialog
      open={isPortalOpen}
      onClose={closePortal}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "12px",
          boxShadow: theme.palette.mode === PALETTE_MODE.LIGHT ? 1 : 3,
          background:
            theme.palette.mode === PALETTE_MODE.LIGHT
              ? theme.palette.common.white
              : theme.palette.darkShades.main,
          border: 1,
          borderColor:
            theme.palette.mode === PALETTE_MODE.LIGHT
              ? theme.palette.common.stroke
              : theme.palette.darkShades[700],
          maxWidth: dialogMaxWidth,
          p: 2,
        },
      }}
      fullWidth
    >
      <DialogTitle
        sx={{
          position: "relative",
          p: 0,
          borderBottom: 1,
          borderBottomColor:
            theme.palette.mode === PALETTE_MODE.LIGHT
              ? "common.stroke"
              : "darkShades.700",
          mb: 1.5,
        }}
      >
        <IconButton
          onClick={closePortal}
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
              flex: 1,
              gap: 1,
            }}
          >
            {!!typeImage && (
              <Box
                sx={{
                  backgroundImage: theme.palette.gradients.a,
                  width: 60,
                  height: 60,
                  borderRadius: "16px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                {typeImage}
              </Box>
            )}
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: "grey.100",
                }}
              >
                {dialogTitle}
              </Typography>
              {dialogDescription && (
                <Typography variant="body2" sx={{ color: "grey.200" }}>
                  {dialogDescription}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          py: 2,
          px: 0,
          borderBottom: 1,
          borderBottomColor:
            theme.palette.mode === PALETTE_MODE.LIGHT
              ? "common.stroke"
              : "darkShades.700",
        }}
      >
        {children}
      </DialogContent>

      {showActionButtons && (
        <DialogActions sx={{ pt: 2, px: 0 }}>
          <Button
            className="small"
            type="button"
            variant="outlined"
            color="secondary"
            onClick={handleCancelButton}
            disabled={disabledCancelButton}
          >
            {cancelButtonText}
          </Button>
          <Button
            className="small"
            type="submit"
            variant="contained"
            onClick={handleSubmitButton}
            disabled={disabledSubmitButton}
            loading={loadingSubmitButton}
            sx={{
              ...submitButtonStyles,
            }}
          >
            {submitButtonText}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
