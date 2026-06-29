export interface IFileUploadProps {
  name: string;
  required?: boolean;
  fileName?: string;
  fileType?: string;
  accept?: Record<string, string[]>;
  maxSize?: number;
  disabled?: boolean;
  dragMessage?: string;
  [key: string]: any;
}
