import { IDateRange } from "@/interface";

export interface IDateRangePickerPopupProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSelect: (range: IDateRange) => void;
  handleCancelBtn?: () => void;
  handleSubmitBtn?: () => void;
  cancelBtnText?: string;
  submitBtnText?: string;
  showActionButtons?: boolean;
  initialRange?: IDateRange | null;
}
