import { ReactNode } from "react";

export interface ICustomCommonDialogProps {
  isPortalOpen: boolean;
  closePortal: () => void;
  dialogTitle?: string;
  dialogDescription?: string;
  children?: ReactNode;
  disabledCancelButton?: boolean;
  showSubmitLoader?: boolean;
  handleSubmitButton?: () => void;
  handleCancelButton?: () => void;
  cancelButtonText?: string;
  submitButtonText?: string;
  showActionButtons?: boolean;
  dialogMaxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  typeImage?: ReactNode;
  disabledSubmitButton?: boolean;
  loadingSubmitButton?: boolean;
  submitButtonStyles?: object;
}
