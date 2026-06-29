export interface CustomOtpInputProps {
  label: string;
  required: boolean;
  numInputs: number;
  otp: string;
  setOtp: (otp: string) => void;
  error: boolean;
  errorMessage?: string;
}
