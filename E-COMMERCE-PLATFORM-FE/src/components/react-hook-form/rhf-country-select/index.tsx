import { Country } from "country-state-city";
import { IRHFCountrySelectProps } from "./rhf-country-select.interface";
import RHFAutocomplete from "../rhf-autocomplete";

const RHFCountrySelect = (props: IRHFCountrySelectProps) => {
  const { name = "country", ...other } = props;

  return (
    <RHFAutocomplete
      name={name}
      options={Country.getAllCountries()}
      placeholder={"Select Country"}
      label={"Country"}
      getOptionLabel={(c) => c?.name || c?.country}
      isOptionEqualToValue={(o, v) => o?.isoCode === v?.isoCode}
      {...other}
    />
  );
};

export default RHFCountrySelect;
