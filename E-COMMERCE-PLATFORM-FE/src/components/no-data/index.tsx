"use client";

import { Box, Button, Typography, useTheme } from "@mui/material";
import { INoData } from "./no-data.interface";
import Image from "next/image";
import { NoDataImg } from "@/assets/images/common";

export default function NoData(props: INoData) {
  const theme = useTheme();

  const {
    height = "60vh",
    message = "Currently you don’t have any history",
    description = `Currently, you don't have any history. Please order now.`,
    descriptionColor = theme.palette.grey[300],
    children,
    src = NoDataImg,
    textColor = theme.palette.grey[100],
    sx,
    imgStyle,
    buttonVisibility = true,
    buttonText = "Buy Metals",
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
      {src && (
        <Image
          src={src}
          alt="No Data Found"
          style={{
            width: "100%",
            height: "auto",
            maxWidth: "376px",
            ...imgStyle,
          }}
        />
      )}
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
}
