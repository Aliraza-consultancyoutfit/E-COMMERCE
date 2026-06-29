import { LayoutProps } from "@/interface";
import React from "react";
import ThemeProvider from "@/providers/theme-provider";

const RootLayout = (props: LayoutProps) => {
  const { children, settings } = props;

  return <ThemeProvider settings={settings}>{children}</ThemeProvider>;
};

export default RootLayout;
