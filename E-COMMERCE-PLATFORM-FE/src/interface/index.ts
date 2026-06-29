import { SxProps } from "@mui/material";
import { ReactNode } from "react";

export interface IAssetsProps {
  fill?: string;
  stroke?: string;
}

export interface IAssetsPropsDimension extends IAssetsProps {
  width?: string;
  height?: string;
  sx?: SxProps;
}

export type PaletteMode = "dark" | "light";

export interface ThemeConfig {
  paletteMode?: PaletteMode;
}

export interface Settings {
  paletteMode?: PaletteMode;
}

export interface SettingsContextType extends Settings {
  handleUpdate: (settings: Settings) => void;
}

export interface LayoutProps {
  children: ReactNode;
  settings?: Settings;
}

export interface IDateRange {
  startDate: Date;
  endDate: Date;
  key: string;
}
