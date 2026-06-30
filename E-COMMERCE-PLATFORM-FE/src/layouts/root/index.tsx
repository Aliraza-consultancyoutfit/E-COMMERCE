import { LayoutProps } from "@/interface";
import React from "react";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "@/providers/theme-provider";
import ReduxProvider from "@/providers/redux-provider";

const RootLayout = (props: LayoutProps) => {
  const { children, settings } = props;

  return (
    <ReduxProvider>
      <ThemeProvider settings={settings}>
        {children}
        <Toaster position="top-right" />
      </ThemeProvider>
    </ReduxProvider>
  );
};

export default RootLayout;
