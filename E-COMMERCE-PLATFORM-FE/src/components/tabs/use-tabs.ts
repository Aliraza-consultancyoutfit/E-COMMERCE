import { Theme, useMediaQuery, useTheme } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const useTabs = (initialTab: number, totalTabs: number) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam: string | null = searchParams.get("tab");
  const theme = useTheme();

  let initialTabIndex = Number(tabParam) || initialTab;
  initialTabIndex = isNaN(initialTabIndex)
    ? initialTab
    : Math.min(Math.max(0, initialTabIndex), totalTabs - 1);

  const [selectedTab, setSelectedTab] = useState(initialTabIndex);

  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  useEffect(() => {
    if (tabParam !== null && !isNaN(Number(tabParam))) {
      const tabIndex = Math.min(Math.max(0, Number(tabParam)), totalTabs - 1);
      setSelectedTab(tabIndex);
    }
  }, [tabParam, totalTabs]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    router.push(`?tab=${newValue}`);
  };

  return {
    selectedTab,
    handleTabChange,
    isSmallScreen,
    theme,
  };
};
