"use client";

import { Tabs, Tab, Box, Typography, Grid2 } from "@mui/material";
import { IVerticalTabsProps } from "./tabs.interface";
import { useTabs } from "./use-tabs";
import React from "react";
import { PALETTE_MODE } from "@/constants/strings";

const VerticalTabs: React.FC<IVerticalTabsProps> = (props) => {
  const { tabData, initialTab = 0, children } = props;
  const { selectedTab, handleTabChange, isSmallScreen, theme } = useTabs(
    initialTab,
    tabData.length
  );

  return (
    <Grid2
      container
      sx={{
        display: "flex",
        flexDirection: isSmallScreen ? "column" : "row",
        padding: { md: "20px", xs: "0" },
        overflow: "auto",
      }}
    >
      <Grid2 size={isSmallScreen ? 12 : 3}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          TabIndicatorProps={{ style: { display: "none" } }}
          variant="scrollable"
          orientation={isSmallScreen ? "horizontal" : "vertical"}
          sx={{
            borderRight: isSmallScreen
              ? "none"
              : `1px solid ${
                  theme.palette.mode === PALETTE_MODE.LIGHT
                    ? theme.palette.common.stroke
                    : theme.palette.darkShades[700]
                }`,
            paddingRight: isSmallScreen ? "0" : "8px",
            borderBottom: isSmallScreen
              ? `1px solid ${
                  theme.palette.mode === PALETTE_MODE.LIGHT
                    ? theme.palette.common.stroke
                    : theme.palette.darkShades[700]
                }`
              : "none",
            py: 1,
            overflowX: isSmallScreen ? "auto" : "visible",
            height: isSmallScreen ? "auto" : "100%",
          }}
        >
          {tabData.map((tab, index) => (
            <Tab
              key={index}
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  {tab.icon &&
                    React.cloneElement(tab.icon, {
                      stroke:
                        selectedTab === index
                          ? theme.palette.primary.main
                          : theme.palette.grey[200],
                    })}
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{ whiteSpace: "nowrap", textTransform: "none" }}
                  >
                    {tab.label.charAt(0).toUpperCase() +
                      tab.label.slice(1).toLowerCase()}
                  </Typography>
                </Box>
              }
              sx={{
                textTransform: "none",
                backgroundColor:
                  selectedTab === index ? "primary.200" : "transparent",
                color: selectedTab === index ? "primary.main" : "grey.200",
                borderRadius: "8px",
                margin: isSmallScreen ? "0 8px" : "4px 0",
                textAlign: "left",
                padding: "12px",
                minWidth: "150px",
                "& .MuiTabs-indicator": { display: "none" },
                alignItems: "start",
                boxAlign: "start",
                borderRight:
                  selectedTab === index ? "none" : "1px solid transparent",
              }}
            />
          ))}
        </Tabs>
      </Grid2>
      <Grid2
        sx={{ p: { md: 3, xs: 1 }, flexGrow: 1 }}
        size={isSmallScreen ? 12 : 9}
      >
        {children[selectedTab]}
      </Grid2>
    </Grid2>
  );
};

export default VerticalTabs;
