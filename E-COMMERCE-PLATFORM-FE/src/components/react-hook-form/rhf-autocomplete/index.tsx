import { Controller } from "react-hook-form";
import { TextField, Autocomplete, Typography, Paper, Box } from "@mui/material";
import { useTheme } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import CustomLabel from "@/components/custom-label";
import { PALETTE_MODE } from "@/constants/strings";
import { ExpandMoreIcon, TickIcon } from "@/assets/icons/common";
import { RHFAutocompleteFullProps } from "./rhf-autocomplete.interface";

export default function RHFAutocomplete(props: RHFAutocompleteFullProps) {
  const {
    name,
    options,
    required,
    noOptionsText = "Nothing in the List",
    placeholder,
    getOptionLabel = (option: any) => option.replaceAll("_", " "),
    isOptionEqualToValue = (option: any, newValue: any) => option === newValue,
    sxProps,
    style,
    ...other
  } = props;

  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  const theme = useTheme();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <Autocomplete
            id={name}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            options={options}
            onChange={(e: any, newValue: any) => onChange(newValue)}
            autoComplete
            noOptionsText={noOptionsText}
            value={value}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={isOptionEqualToValue}
            popupIcon={<ExpandMoreIcon />}
            slots={{
              paper: (props) => (
                <Paper
                  {...props}
                  sx={{
                    border: 1,
                    borderColor:
                      theme.palette.mode === PALETTE_MODE.LIGHT
                        ? "common.stroke"
                        : "darkShades.700",
                    backgroundColor:
                      theme.palette.mode === PALETTE_MODE.LIGHT
                        ? "common.white"
                        : "darkShades.main",
                    color:
                      theme.palette.mode === PALETTE_MODE.LIGHT
                        ? "grey.200"
                        : "grey.100",
                    borderRadius: 3,
                    "& .MuiAutocomplete-option": {
                      mb: 1,
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "grey.900",
                      },
                      "&[aria-selected='true']": {
                        backgroundColor:
                          theme.palette.mode === PALETTE_MODE.LIGHT
                            ? "primary.100"
                            : "darkShades.900",
                      },
                    },
                    "& .MuiAutocomplete-noOptions": {
                      color:
                        theme.palette.mode === PALETTE_MODE.LIGHT
                          ? "grey.200"
                          : "grey.100",
                    },
                  }}
                >
                  {props.children}
                </Paper>
              ),
            }}
            renderOption={(props, option, { selected }) => {
              const { key, ...restProps } = props;
              return (
                <li key={key} {...restProps}>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography>{getOptionLabel(option)}</Typography>
                    {selected && (
                      <Box sx={{ ml: 2, flexShrink: 0 }}>
                        <TickIcon sx={{ color: "primary.main" }} />
                      </Box>
                    )}
                  </Box>
                </li>
              );
            }}
            {...other}
            renderInput={(params) => (
              <>
                {other.label && (
                  <CustomLabel label={other.label} required={required} />
                )}
                <TextField
                  {...params}
                  label={""}
                  error={Boolean(error)}
                  placeholder={placeholder}
                  sx={{
                    mt: 0.5,
                    ".MuiInputBase-root": {
                      borderRadius: 3,
                      borderColor:
                        theme.palette.mode === PALETTE_MODE.LIGHT
                          ? theme.palette.common.stroke
                          : theme.palette.darkShades[700],
                      "& ::placeholder": {
                        color:
                          theme.palette.mode === PALETTE_MODE.LIGHT
                            ? theme.palette.grey[600]
                            : theme.palette.grey[700],
                      },
                      backgroundColor: other.disabled
                        ? theme.palette.mode === PALETTE_MODE.LIGHT
                          ? theme.palette.grey[900]
                          : theme.palette.darkShades[800]
                        : "transparent",
                    },
                    ...sxProps,
                  }}
                  helperText={
                    <Typography
                      variant={"body2"}
                      component={"span"}
                      color={"tertiary.main"}
                      sx={{ ml: -1.5 }}
                    >
                      {error?.message}
                    </Typography>
                  }
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: <>{params.InputProps.endAdornment}</>,
                      style: {
                        color:
                          theme.palette.mode === PALETTE_MODE.LIGHT
                            ? theme.palette.grey[200]
                            : theme.palette.grey[100],
                        ...style,
                      },
                    },
                  }}
                />
              </>
            )}
          />
        );
      }}
    />
  );
}
