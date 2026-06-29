import { useFormContext, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import { Typography, Theme, useTheme } from "@mui/material";
import { IRHFDatePickerProps } from "./rhf-date-picker.interface";
import CustomLabel from "@/components/custom-label";
import { PALETTE_MODE } from "@/constants/strings";
import { CalendarIcon } from "@/assets/icons/common";
import dayjs from "dayjs";
import { pxToRem } from "@/utils";

const RHFDatePicker = (props: IRHFDatePickerProps) => {
  const { name, label, format = "DD/MM/YYYY", sx, ...other } = props;

  const { control } = useFormContext();

  const theme = useTheme<Theme>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          {label && <CustomLabel label={label} required={other.required} />}

          <DatePicker
            {...field}
            {...other}
            value={field?.value ? dayjs(field?.value) : null}
            onChange={(newValue) => field?.onChange(newValue)}
            format={format}
            slots={{
              openPickerIcon: CalendarIcon,
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!error,
                size: other.size || "small",
                popper: { sx: { display: "none" } },
                sx: {
                  mt: 0.5,
                  ".MuiPickersOutlinedInput-root": {
                    borderRadius: "12px !important",
                    borderColor:
                      theme.palette.mode === PALETTE_MODE.LIGHT
                        ? theme.palette.common.stroke
                        : theme.palette.darkShades[700],
                    color:
                      theme.palette.mode === PALETTE_MODE.LIGHT
                        ? theme.palette.grey[200]
                        : theme.palette.grey[100],
                    backgroundColor: other.disabled
                      ? theme.palette.mode === PALETTE_MODE.LIGHT
                        ? theme.palette.grey[900]
                        : theme.palette.darkShades[800]
                      : "transparent",
                    "& ::placeholder": {
                      color:
                        theme.palette.mode === PALETTE_MODE.LIGHT
                          ? theme.palette.grey[600]
                          : theme.palette.grey[500],
                    },
                  },
                  ...sx,
                },
                helperText: (
                  <Typography
                    variant={"body2"}
                    component={"span"}
                    sx={{ display: "block" }}
                    color={"error.main"}
                  >
                    {error?.message}
                  </Typography>
                ),
                ...other?.textFieldProps,
              },
              popper: {
                sx: {
                  "& .MuiPickersDay-root": {
                    fontSize: pxToRem(12),
                    fontWeight: 500,
                  },
                  "& .MuiPickersCalendarHeader-label": {
                    fontSize: pxToRem(18),
                    fontWeight: 600,
                  },
                  "& .MuiDayCalendar-weekDayLabel": {
                    fontSize: pxToRem(14),
                    fontWeight: 600,
                  },
                },
              },
            }}
          />
        </>
      )}
    />
  );
};

export default RHFDatePicker;
