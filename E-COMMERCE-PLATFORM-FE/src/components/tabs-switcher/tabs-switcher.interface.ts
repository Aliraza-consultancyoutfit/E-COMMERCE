interface ITabOption {
  label: string;
  value: string;
}

export interface ITabsProps {
  tabs: ITabOption[];
  currentTab: string;
  onChange: (value: string) => void;
}
