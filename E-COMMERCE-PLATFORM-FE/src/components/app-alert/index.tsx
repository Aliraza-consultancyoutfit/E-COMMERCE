import { Alert, AlertProps } from "@mui/material";

export type AppAlertProps = AlertProps;

export default function AppAlert(props: AppAlertProps) {
  return <Alert variant="outlined" {...props} />;
}
