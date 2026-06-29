import { ReactNode } from "react";

export interface ITabData {
  label: string;
  icon: React.JSX.Element;
}

export interface IVerticalTabsProps {
  tabData: ITabData[];
  initialTab?: number;
  children: ReactNode[];
}
