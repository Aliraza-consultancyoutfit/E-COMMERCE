import { useFormContext, useWatch } from "react-hook-form";
import { IRHFCitySelectProps } from "./rhf-city-select.interface";
import { City } from "country-state-city";
import RHFAutocomplete from "../rhf-autocomplete";

const RHFCitySelect = (props: IRHFCitySelectProps) => {
  const {
    name = "city",
    countryFieldName = "country",
    stateFieldName = "state",
    ...other
  } = props;

  const { control } = useFormContext();
  const selectedCountry = useWatch({ control, name: countryFieldName });
  const selectedState = useWatch({ control, name: stateFieldName });
  const cities =
    selectedCountry && selectedState
      ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
      : [];

  return (
    <RHFAutocomplete
      name={name}
      options={cities}
      placeholder={"Select City"}
      label={"City"}
      getOptionLabel={(c) => {
        if (!c || typeof c === "string") return c || "";
        return c.name || c.city || "";
      }}
      isOptionEqualToValue={(o, v) => o.name === v?.name}
      {...other}
    />
  );
};

export default RHFCitySelect;
