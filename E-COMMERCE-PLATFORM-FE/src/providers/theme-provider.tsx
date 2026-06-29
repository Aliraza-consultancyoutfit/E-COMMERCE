"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { SettingsConsumer } from "@/consumers/settings-consumer";
import { SettingsProvider } from "@/providers/settings-provider";
import { createTheme } from "@/theme";
import { LayoutProps } from "@/interface";
import { updateSettings } from "@/utils";
import { CssBaseline, GlobalStyles } from "@mui/material";
import {
  ThemeProvider as MUIThemeProvider,
  type Theme,
} from "@mui/material/styles";

const ThemeProvider = (props: LayoutProps) => {
  const { children, settings } = props;

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <SettingsProvider onUpdate={updateSettings} settings={settings}>
        <SettingsConsumer>
          {(themeSettings) => {
            const theme: Theme = createTheme({
              paletteMode: themeSettings.paletteMode,
            });
            return (
              <MUIThemeProvider theme={theme}>
                <GlobalStyles
                  styles={{
                    "&::-webkit-scrollbar": {
                      width: 0,
                      height: 6,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: 2,
                    },
                  }}
                />
                <CssBaseline />
                {children}
              </MUIThemeProvider>
            );
          }}
        </SettingsConsumer>
      </SettingsProvider>
    </AppRouterCacheProvider>
  );
};

export default ThemeProvider;
