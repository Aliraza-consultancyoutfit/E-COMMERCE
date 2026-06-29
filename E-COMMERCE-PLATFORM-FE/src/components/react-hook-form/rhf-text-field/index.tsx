import { useFormContext, Controller } from "react-hook-form";
import { TextField, Typography, useTheme } from "@mui/material";
import CustomLabel from "@/components/custom-label";
import { PALETTE_MODE } from "@/constants/strings";
import { RHFTextFieldProps } from "./rhf-text-field.interface";

export default function RHFTextField(props: RHFTextFieldProps) {
  const { name, required, sxProps, ...other } = props;

  const { control } = useFormContext();

  const theme = useTheme();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          {other.label && (
            <CustomLabel label={other.label} required={required} />
          )}
          <TextField
            {...field}
            value={field?.value || ""}
            onChange={field?.onChange}
            onBlur={() => {
              field?.onBlur();
            }}
            fullWidth
            sx={{
              mt: 0.5,
              ".MuiInputBase-root": {
                borderRadius: 3,
                borderColor:
                  theme.palette.mode === PALETTE_MODE.LIGHT
                    ? theme.palette.common.stroke
                    : theme.palette.darkShades[700],
                color:
                  theme.palette.mode === PALETTE_MODE.LIGHT
                    ? theme.palette.grey[200]
                    : theme.palette.grey[100],
                "& ::placeholder": {
                  color:
                    theme.palette.mode === PALETTE_MODE.LIGHT
                      ? theme.palette.grey[600]
                      : theme.palette.grey[500],
                },
                backgroundColor: other.disabled
                  ? theme.palette.mode === PALETTE_MODE.LIGHT
                    ? theme.palette.grey[900]
                    : theme.palette.darkShades[800]
                  : "transparent",
              },
              ...sxProps,
            }}
            error={Boolean(error)}
            helperText={
              <Typography
                variant={"body2"}
                component={"span"}
                color={"tertiary.main"}
              >
                {error?.message}
              </Typography>
            }
            {...other}
            label={""}
          />
        </>
      )}
    />
  );
}
