import { SxProps } from "@mui/material";

export interface IAlertProps {
  text: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  sx?: SxProps;
}
