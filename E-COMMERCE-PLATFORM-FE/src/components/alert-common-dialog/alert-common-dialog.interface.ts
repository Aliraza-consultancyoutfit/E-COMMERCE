export interface IAlertCommonDialogProps {
  message: string;
  type: string;
  open: boolean;
  handleClose: () => void;
  handleCancelBtn?: () => void;
  handleSubmitBtn?: () => void;
  cancelBtnText?: string;
  submitBtnText?: string;
  typeImage?: React.ReactNode;
  disableCancelBtn?: boolean;
  loading?: boolean;
  footer?: boolean;
}
