import { Box, Button } from "@mui/material";
import { ITabsProps } from "./tabs-switcher.interface";

const TabsSwitcher = (props: ITabsProps) => {
  const { tabs, currentTab, onChange } = props;

  return (
    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          variant={currentTab === tab.value ? "contained" : "outlined"}
          onClick={() => onChange(tab.value)}
          sx={{ flexGrow: 1, borderRadius: 30 }}
        >
          {tab.label}
        </Button>
      ))}
    </Box>
  );
};

export default TabsSwitcher;
