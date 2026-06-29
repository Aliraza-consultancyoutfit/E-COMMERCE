import React from "react";
import { FormLabel, Typography } from "@mui/material";
import { pxToRem } from "@/utils";

interface ICustomLabel {
  label?: string;
  required?: boolean;
}

const CustomLabel = (props: ICustomLabel) => {
  const { label, required } = props;

  return (
    <FormLabel
      sx={{
        fontSize: pxToRem(14),
        color: "grey.100",
      }}
    >
      {label}
      {required && (
        <Typography color={"tertiary.main"} component={"span"}>
          *
        </Typography>
      )}
    </FormLabel>
  );
};

export default CustomLabel;
