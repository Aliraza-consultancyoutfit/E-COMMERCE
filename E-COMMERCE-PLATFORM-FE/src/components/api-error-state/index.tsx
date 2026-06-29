"use client";

import { Box, Button, Typography, useTheme } from "@mui/material";
import { IApiErrorState } from "./api-error-state.interface";
import Image from "next/image";
import { PALETTE_MODE } from "@/constants/strings";
import { ApiErrorDarkImg, ApiErrorLightImg } from "@/assets/images/common";

const ApiErrorState = (props: IApiErrorState) => {
  const theme = useTheme();

  const {
    height = "60vh",
    message = "Something Went Wrong!",
    description = "Please try again!",
    descriptionColor = theme.palette.grey[300],
    children,
    src = theme.palette.mode === PALETTE_MODE.LIGHT
      ? ApiErrorLightImg
      : ApiErrorDarkImg,
    textColor = theme.palette.grey[100],
    sx,
    imgStyle,
    buttonVisibility = true,
    buttonText = "Refresh",
    buttonClick = () => {},
  } = props;

  return (
    <Box
      height={height}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      gap={0.6}
      sx={sx}
    >
      <Image
        src={src}
        alt="Something Went Wrong!"
        style={{
          width: "100%",
          height: "auto",
          maxWidth: "376px",
          ...imgStyle,
        }}
      />
      <Typography
        variant="h4"
        sx={{ color: textColor, fontWeight: 700, textAlign: "center" }}
      >
        {message}
      </Typography>
      {description && (
        <Typography
          variant="body2"
          sx={{
            color: descriptionColor,
            fontWeight: 400,
            textAlign: "center",
            width: { xs: "100%", md: "45%" },
          }}
        >
          {description}
        </Typography>
      )}
      {buttonVisibility && (
        <Button variant="contained" sx={{ mt: 2 }} onClick={buttonClick}>
          {buttonText}
        </Button>
      )}
      {children}
    </Box>
  );
};

export default ApiErrorState;
