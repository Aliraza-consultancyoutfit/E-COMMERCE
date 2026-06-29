import { useFormContext, Controller } from "react-hook-form";
import { Checkbox, FormControlLabel } from "@mui/material";
import CustomLabel from "@/components/custom-label";
import { RHFCheckboxProps } from "./rhf-checkbox.interface";

export default function RHFCheckbox(props: RHFCheckboxProps) {
  const { name, required, ...other } = props;

  const { control } = useFormContext();

  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <>
              <Checkbox
                {...field}
                checked={field?.value}
                disabled={other?.disabled}
                sx={(theme) => ({
                  stroke: theme?.palette?.background?.default,
                  strokeWidth: 1,
                })}
                {...other}
              />
              {other?.label && (
                <CustomLabel label={other?.label} required={required} />
              )}
            </>
          )}
        />
      }
      label=""
    />
  );
}
