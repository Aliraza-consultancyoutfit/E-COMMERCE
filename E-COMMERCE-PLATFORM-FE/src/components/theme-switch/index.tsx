"use client";

import React from "react";
import { SettingsConsumer } from "@/consumers/settings-consumer";
import { styled, useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import { MoonIcon, SunIcon } from "@/assets/icons/common";
import { PALETTE_MODE } from "@/constants/strings";

interface ToggleThumbProps {
  isDarkMode: boolean;
}

const ToggleWrapper = styled(Box)(({ theme }) => ({
  width: 100,
  height: 50,
  borderRadius: 15,
  backgroundColor:
    theme.palette.mode === PALETTE_MODE.LIGHT
      ? theme.palette.common.white
      : theme.palette.darkShades.main,
  border: "1px solid",
  borderColor:
    theme.palette.mode === PALETTE_MODE.LIGHT
      ? theme.palette.common.stroke
      : theme.palette.darkShades[700],
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  position: "relative",
  cursor: "pointer",
  transition: "background-color 0.3s",
}));

const ToggleThumb = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isDarkMode",
})<ToggleThumbProps>(({ isDarkMode, theme }) => ({
  width: 43,
  height: 40,
  borderRadius: 12,
  backgroundColor: isDarkMode
    ? theme.palette.darkShades[900]
    : theme.palette.primary[100],
  position: "absolute",
  left: isDarkMode ? 50 : 5,
  transition: "left 0.3s, background-color 0.3s",
}));

const IconWrapper = styled(Box)({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1,
});

const ThemeSwitch: React.FC = () => {
  const theme = useTheme();

  return (
    <SettingsConsumer>
      {(themeSettings) => {
        if (!themeSettings || !themeSettings.handleUpdate) {
          console.error(
            "themeSettings or handleUpdate function not available."
          );
          return null;
        }

        const isDarkMode = themeSettings.paletteMode === "dark";

        const handleThemeChange = () => {
          const newTheme = isDarkMode ? "light" : "dark";
          themeSettings.handleUpdate({ paletteMode: newTheme });
        };

        return (
          <ToggleWrapper onClick={handleThemeChange}>
            <IconWrapper>
              <SunIcon
                fill={isDarkMode ? "transparent" : theme.palette.warning[800]}
                stroke={isDarkMode ? theme.palette.grey[500] : "transparent"}
              />
            </IconWrapper>

            <ToggleThumb isDarkMode={isDarkMode} />

            <IconWrapper>
              <MoonIcon
                fill={isDarkMode ? theme.palette.warning[800] : "transparent"}
                stroke={isDarkMode ? "transparent" : theme.palette.grey[500]}
              />
            </IconWrapper>
          </ToggleWrapper>
        );
      }}
    </SettingsConsumer>
  );
};

export default ThemeSwitch;
