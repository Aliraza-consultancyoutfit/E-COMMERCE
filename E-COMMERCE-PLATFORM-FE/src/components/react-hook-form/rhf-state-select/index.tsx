import { useFormContext, useWatch } from "react-hook-form";
import { IRHFStateSelectProps } from "./rhf-state-select.interface";
import { State } from "country-state-city";
import RHFAutocomplete from "../rhf-autocomplete";

const RHFStateSelect = (props: IRHFStateSelectProps) => {
  const { name = "state", countryFieldName = "country", ...other } = props;

  const { control } = useFormContext();
  const selectedCountry = useWatch({ control, name: countryFieldName });
  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.isoCode)
    : [];

  return (
    <RHFAutocomplete
      name={name}
      options={states}
      placeholder={"Select State"}
      label={"State"}
      getOptionLabel={(s) => {
        if (!s || typeof s === "string") return s || "";
        return s.name || s.state || "";
      }}
      isOptionEqualToValue={(o, v) => o.isoCode === v?.isoCode}
      {...other}
    />
  );
};

export default RHFStateSelect;
