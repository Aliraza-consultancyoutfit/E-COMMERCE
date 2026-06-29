"use client";

import type { JSX, ReactNode } from "react";
import { useCallback, useState } from "react";
import { defaultSettings, SettingsContext } from "@/context/settings-context";
import { Settings } from "@/interface";

interface SettingsProviderProps {
  children?: ReactNode;
  onUpdate?: (settings: Settings) => void;
  settings?: Settings;
}

export function SettingsProvider(props: SettingsProviderProps): JSX.Element {
  const { children, onUpdate = () => {}, settings: initialSettings } = props;

  const [settings, setSettings] = useState<Settings>(() => {
    return {
      ...defaultSettings,
      ...initialSettings,
    } as Settings;
  });

  const handleUpdate = useCallback(
    (newSettings: Settings): void => {
      onUpdate({
        paletteMode: settings.paletteMode,
        ...newSettings,
      });

      setSettings((prevState) => ({
        ...prevState,
        ...newSettings,
      }));
    },
    [onUpdate, settings]
  );

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        handleUpdate,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
