"use client";

import { Settings, SettingsContextType } from "@/interface";
import { createContext } from "react";

export const defaultSettings: Settings = {
  paletteMode: "light",
};

export const SettingsContext = createContext<SettingsContextType>({
  ...defaultSettings,
  handleUpdate: () => {},
});
