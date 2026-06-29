import { useFormContext, Controller } from "react-hook-form";
import { FormControlLabel } from "@mui/material";
import { AntSwitch } from "./rhf-switch.style";
import { RHFSwitchProps } from "./rhf-switch.interface";

export default function RHFSwitch(props: RHFSwitchProps) {
  const { name, disabled, label, ...other } = props;

  const { control } = useFormContext();

  return (
    <FormControlLabel
      sx={{
        ml: "5px",
      }}
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <>
              <AntSwitch
                disabled={disabled}
                {...field}
                checked={field?.value}
              />
            </>
          )}
        />
      }
      label={label || ""}
      {...other}
    />
  );
}
