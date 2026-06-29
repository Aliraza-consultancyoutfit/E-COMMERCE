import OTPInput from "react-otp-input";
import CustomLabel from "../custom-label";
import { pxToRem } from "@/utils";
import { Box, Typography, useTheme } from "@mui/material";
import { PALETTE_MODE } from "@/constants/strings";
import { CustomOtpInputProps } from "./custom-otp-input.interface";

const CustomOtpInput = (props: CustomOtpInputProps) => {
  const {
    label,
    required,
    numInputs,
    otp,
    setOtp,
    error,
    errorMessage = "Please Enter Full OTP",
  } = props;
  const theme = useTheme();

  return (
    <Box>
      <CustomLabel label={label} required={required} />
      <OTPInput
        value={otp}
        onChange={(otp: any) => {
          setOtp(otp);
        }}
        numInputs={numInputs}
        shouldAutoFocus
        renderInput={(styledProps) => (
          <input
            {...styledProps}
            style={{
              width: "100%",
              height: pxToRem(40),
              borderRadius: pxToRem(12),
              border: "1.5px solid",
              borderColor:
                theme.palette.mode === PALETTE_MODE.LIGHT
                  ? theme.palette.common.stroke
                  : theme.palette.darkShades[700],
              color:
                theme.palette.mode === PALETTE_MODE.LIGHT
                  ? theme.palette.grey[200]
                  : theme.palette.grey[100],
              backgroundColor:
                theme.palette.mode === PALETTE_MODE.LIGHT
                  ? theme.palette.common.white
                  : theme.palette.darkShades[900],
              textAlign: "center",
              fontSize: pxToRem(14),
              marginRight: "8px",
            }}
            placeholder="-"
          />
        )}
      />
      {error && (
        <Typography
          variant={"body2"}
          component={"span"}
          color={"tertiary.main"}
          sx={{ ml: 1.5 }}
        >
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
};

export default CustomOtpInput;
